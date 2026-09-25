import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePhoneNumber } from "@/lib/utils";
import axios from "axios";

// 1. Meta Webhook Verification (GET)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.META_WA_VERIFY_TOKEN || "smart_booking_verify_token";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ WhatsApp Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// 2. Incoming WhatsApp Message Handler (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a direct simulation call from our test interface
    if (body.simulate && body.phoneNumber && body.messageText) {
      const result = await handleInboundMessage(body.phoneNumber, body.messageText);
      return NextResponse.json({ simulated: true, ...result });
    }

    // Process Meta Cloud API Standard Payload
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      // Event might be a delivery/read receipt
      return NextResponse.json({ status: "acknowledged" });
    }

    const fromPhone = message.from; // e.g. "212661234567"
    let messageText = "";

    if (message.type === "text") {
      messageText = message.text?.body?.trim() || "";
    } else if (message.type === "button") {
      messageText = message.button?.text?.trim() || message.button?.payload?.trim() || "";
    } else if (message.type === "interactive") {
      messageText =
        message.interactive?.button_reply?.title?.trim() ||
        message.interactive?.button_reply?.id?.trim() ||
        "";
    }

    const result = await handleInboundMessage(fromPhone, messageText);
    return NextResponse.json({ status: "processed", ...result });
  } catch (error: any) {
    console.error("Error processing WhatsApp Webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function handleInboundMessage(fromPhoneRaw: string, text: string) {
  const sanitizedPhone = sanitizePhoneNumber(fromPhoneRaw);
  const normalizedText = text.toUpperCase().trim();

  // Find the latest active appointment for this patient phone
  const appointment = await prisma.appointment.findFirst({
    where: {
      patient: {
        phoneNumber: sanitizedPhone,
      },
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: { gte: new Date() }, // Future appointment
    },
    include: {
      patient: true,
      clinic: true,
      service: true,
    },
    orderBy: { startTime: "asc" },
  });

  if (!appointment) {
    return {
      action: "NO_ACTION",
      reason: "No upcoming pending appointment found for this number",
    };
  }

  let newStatus: string | null = null;
  let responseReply = "";

  // Check intent: Confirmation vs Cancellation
  const isConfirm =
    normalizedText === "1" ||
    normalizedText === "OUI" ||
    normalizedText === "YES" ||
    normalizedText.includes("CONFIRMER") ||
    normalizedText.includes("CONFIRM");

  const isCancel =
    normalizedText === "2" ||
    normalizedText === "NON" ||
    normalizedText === "NO" ||
    normalizedText.includes("ANNULER") ||
    normalizedText.includes("CANCEL");

  if (isConfirm) {
    newStatus = "CONFIRMED";
    responseReply = `✅ Merci *${appointment.patient.fullName}* ! Votre présence a été confirmée auprès de *${appointment.clinic.doctorName}*. À très bientôt !`;
  } else if (isCancel) {
    newStatus = "CANCELLED";
    responseReply = `❌ Votre rendez-vous a bien été annulé. Le créneau a été libéré. Pour reprendre rendez-vous : ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${appointment.clinic.slug}`;
  }

  if (newStatus) {
    // Update appointment
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: newStatus,
        notes: appointment.notes
          ? `${appointment.notes} | Réponse WhatsApp: ${text}`
          : `Réponse WhatsApp: ${text}`,
      },
    });

    // Log the inbound reaction
    await prisma.whatsAppLog.create({
      data: {
        messageType: isConfirm ? "CONFIRMATION" : "CANCELLATION",
        recipientPhone: sanitizedPhone,
        content: responseReply,
        status: "DELIVERED",
        responseReceived: text,
        appointmentId: appointment.id,
      },
    });

    // Send reply if live credentials available
    const token = process.env.META_WA_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID;

    if (token && phoneNumberId && token.length > 10) {
      try {
        await axios.post(
          `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
          {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: sanitizedPhone.replace("+", ""),
            type: "text",
            text: { body: responseReply },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("Error sending WhatsApp auto-reply:", err);
      }
    }

    return {
      action: newStatus,
      appointmentId: appointment.id,
      responseReply,
    };
  }

  return { action: "UNKNOWN_INTENT", rawText: text };
}
