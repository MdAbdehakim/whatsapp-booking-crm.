import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes, cancellationReason } = body;

    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        service: true,
        clinic: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Rendez-vous introuvable" },
        { status: 404 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: status || existing.status,
        notes: notes !== undefined ? notes : existing.notes,
        cancellationReason: cancellationReason || existing.cancellationReason,
      },
      include: {
        patient: true,
        service: true,
        clinic: true,
        whatsappLogs: true,
      },
    });

    // If marked as CANCELLED by secretary/doctor, send WhatsApp cancellation notice
    if (status === "CANCELLED" && existing.status !== "CANCELLED") {
      await sendWhatsAppNotification({
        appointmentId: updated.id,
        recipientPhone: updated.patient.phoneNumber,
        patientName: updated.patient.fullName,
        doctorName: updated.clinic.doctorName,
        clinicName: updated.clinic.name,
        serviceName: updated.service.name,
        appointmentTime: updated.startTime,
        address: updated.clinic.address,
        googleMapsUrl: updated.clinic.googleMapsUrl,
        type: "CANCELLATION",
      });
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du rendez-vous" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.appointment.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Rendez-vous supprimé" });
  } catch (error: any) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
