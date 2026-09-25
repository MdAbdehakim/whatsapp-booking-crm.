import axios from "axios";
import { prisma } from "./prisma";
import { formatFrenchDate, formatFrenchTime } from "./utils";

interface SendWhatsAppParams {
  appointmentId: string;
  recipientPhone: string;
  patientName: string;
  doctorName: string;
  clinicName: string;
  serviceName: string;
  appointmentTime: Date;
  address: string;
  googleMapsUrl?: string | null;
  type: "CONFIRMATION" | "REMINDER_24H" | "REMINDER_2H" | "CANCELLATION";
}

export async function sendWhatsAppNotification({
  appointmentId,
  recipientPhone,
  patientName,
  doctorName,
  clinicName,
  serviceName,
  appointmentTime,
  address,
  googleMapsUrl,
  type,
}: SendWhatsAppParams) {
  const dateStr = formatFrenchDate(appointmentTime);
  const timeStr = formatFrenchTime(appointmentTime);

  let messageText = "";

  if (type === "CONFIRMATION") {
    messageText = `👋 Bonjour *${patientName}*,\n\nVotre rendez-vous chez *${doctorName}* (*${clinicName}*) a bien été enregistré !\n\n📋 *Détails du Rendez-vous :*\n- *Service :* ${serviceName}\n- *Date :* ${dateStr}\n- *Heure :* ${timeStr}\n- *Adresse :* ${address}${googleMapsUrl ? `\n- *Google Maps :* ${googleMapsUrl}` : ""}\n\n⚠️ *Important :* En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance en répondant à ce message ou en cliquant ci-dessous.\n\nÀ très bientôt !`;
  } else if (type === "REMINDER_24H") {
    messageText = `🔔 *Rappel de Rendez-vous (Demain)*\n\nBonjour *${patientName}*,\nNous vous rappelons votre rendez-vous demain *${dateStr}* à *${timeStr}* chez *${doctorName}* pour *${serviceName}*.\n\nMerci de confirmer votre présence en répondant :\n👉 Tapez *1* ou *OUI* pour confirmer\n👉 Tapez *2* ou *ANNULER* pour libérer le créneau.`;
  } else if (type === "REMINDER_2H") {
    messageText = `⏰ *Rappel : Votre RDV est dans 2 heures*\n\nBonjour *${patientName}*, ${doctorName} vous attend à *${timeStr}* au cabinet situé à :\n📍 ${address}`;
  } else if (type === "CANCELLATION") {
    messageText = `❌ *Annulation de Rendez-vous*\n\nBonjour *${patientName}*, votre rendez-vous du *${dateStr}* à *${timeStr}* a bien été annulé. Vous pouvez reprendre un nouveau rendez-vous à tout moment.`;
  }

  const token = process.env.META_WA_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID;

  let metaMessageId: string | null = null;
  let status = "SENT";

  // Check if live WhatsApp Cloud API credentials are configured
  if (token && phoneNumberId && token.length > 10 && phoneNumberId.length > 5) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: recipientPhone.replace("+", ""),
          type: "text",
          text: {
            preview_url: true,
            body: messageText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.messages?.[0]?.id) {
        metaMessageId = response.data.messages[0].id;
      }
    } catch (err: any) {
      console.error("Meta WhatsApp Cloud API error:", err.response?.data || err.message);
      status = "FAILED";
    }
  } else {
    // In local dev/simulator mode: Generate realistic simulated message ID
    metaMessageId = `sim_wamid_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log(`[WhatsApp Simulator - ${type}] To: ${recipientPhone}`);
    console.log(`Content:\n${messageText}`);
  }

  // Record log into database
  const log = await prisma.whatsAppLog.create({
    data: {
      messageType: type,
      recipientPhone,
      content: messageText,
      metaMessageId,
      status,
      appointmentId,
    },
  });

  return { success: status !== "FAILED", log, messageText };
}
