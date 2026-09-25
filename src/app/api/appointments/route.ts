import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePhoneNumber } from "@/lib/utils";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { addMinutes, parseISO } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    const where: any = {};
    if (clinicId) where.clinicId = clinicId;
    if (status && status !== "ALL") where.status = status;
    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);
      where.startTime = { gte: start, lte: end };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        service: true,
        clinic: true,
        whatsappLogs: {
          orderBy: { sentAt: "desc" },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des rendez-vous" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clinicId,
      serviceId,
      startTime: startTimeStr,
      fullName,
      phoneNumber,
      email,
      notes,
    } = body;

    if (!clinicId || !serviceId || !startTimeStr || !fullName || !phoneNumber) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) {
      return NextResponse.json({ error: "Cabinet introuvable" }, { status: 404 });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const startTime = parseISO(startTimeStr);
    const endTime = addMinutes(startTime, service.durationMin);
    const sanitizedPhone = sanitizePhoneNumber(phoneNumber);

    // Concurrency / Overlap check to prevent double booking
    const overlappingAppointment = await prisma.appointment.findFirst({
      where: {
        clinicId,
        status: { notIn: ["CANCELLED"] },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
    });

    if (overlappingAppointment) {
      return NextResponse.json(
        { error: "Ce créneau vient d'être réservé par un autre patient. Veuillez choisir une autre heure." },
        { status: 409 }
      );
    }

    // Upsert or create Patient
    let patient = await prisma.patient.findFirst({
      where: { phoneNumber: sanitizedPhone },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          fullName,
          phoneNumber: sanitizedPhone,
          email: email || null,
          notes: notes || null,
        },
      });
    } else {
      // Update patient name if changed
      patient = await prisma.patient.update({
        where: { id: patient.id },
        data: {
          fullName,
          email: email || patient.email,
        },
      });
    }

    // Create Appointment
    const appointment = await prisma.appointment.create({
      data: {
        startTime,
        endTime,
        status: "CONFIRMED", // Auto-confirm on public booking
        notes: notes || null,
        clinicId: clinic.id,
        serviceId: service.id,
        patientId: patient.id,
      },
      include: {
        patient: true,
        service: true,
        clinic: true,
      },
    });

    // Send WhatsApp Instant Confirmation
    const whatsappResult = await sendWhatsAppNotification({
      appointmentId: appointment.id,
      recipientPhone: sanitizedPhone,
      patientName: fullName,
      doctorName: clinic.doctorName,
      clinicName: clinic.name,
      serviceName: service.name,
      appointmentTime: startTime,
      address: clinic.address,
      googleMapsUrl: clinic.googleMapsUrl,
      type: "CONFIRMATION",
    });

    return NextResponse.json(
      {
        success: true,
        appointment,
        whatsapp: whatsappResult,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du rendez-vous." },
      { status: 500 }
    );
  }
}
