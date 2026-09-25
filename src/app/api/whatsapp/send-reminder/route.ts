import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const { appointmentId, type = "REMINDER_24H" } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "appointmentId est requis" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        service: true,
        clinic: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Rendez-vous introuvable" },
        { status: 404 }
      );
    }

    const result = await sendWhatsAppNotification({
      appointmentId: appointment.id,
      recipientPhone: appointment.patient.phoneNumber,
      patientName: appointment.patient.fullName,
      doctorName: appointment.clinic.doctorName,
      clinicName: appointment.clinic.name,
      serviceName: appointment.service.name,
      appointmentTime: appointment.startTime,
      address: appointment.clinic.address,
      googleMapsUrl: appointment.clinic.googleMapsUrl,
      type: type as any,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Error triggering reminder:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du rappel WhatsApp" },
      { status: 500 }
    );
  }
}
