import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { addDays, startOfDay, endOfDay } from "date-fns";

/**
 * Automated Cron Job for Sending WhatsApp Reminders (T-24h)
 * Configured in vercel.json to run every morning at 08:00 AM.
 * 
 * Verifies CRON_SECRET for security against unauthorized execution.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Secure the cron endpoint in production
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Target appointments scheduled for tomorrow
    const tomorrow = addDays(new Date(), 1);
    const dayStart = startOfDay(tomorrow);
    const dayEnd = endOfDay(tomorrow);

    // Find all upcoming appointments for tomorrow that haven't received a 24h reminder yet
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: { in: ["PENDING", "CONFIRMED"] },
        whatsappLogs: {
          none: {
            messageType: "REMINDER_24H",
          },
        },
      },
      include: {
        patient: true,
        service: true,
        clinic: true,
      },
    });

    console.log(`[Cron Reminder] Found ${upcomingAppointments.length} appointments to remind for tomorrow.`);

    const results = [];

    for (const appt of upcomingAppointments) {
      try {
        const result = await sendWhatsAppNotification({
          appointmentId: appt.id,
          recipientPhone: appt.patient.phoneNumber,
          patientName: appt.patient.fullName,
          doctorName: appt.clinic.doctorName,
          clinicName: appt.clinic.name,
          serviceName: appt.service.name,
          appointmentTime: appt.startTime,
          address: appt.clinic.address,
          googleMapsUrl: appt.clinic.googleMapsUrl,
          type: "REMINDER_24H",
        });

        results.push({
          appointmentId: appt.id,
          patientName: appt.patient.fullName,
          phone: appt.patient.phoneNumber,
          success: result.success,
        });
      } catch (err: any) {
        console.error(`Failed to send reminder for appointment ${appt.id}:`, err);
        results.push({
          appointmentId: appt.id,
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: upcomingAppointments.length,
      results,
      executedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error executing cron reminders:", error);
    return NextResponse.json(
      { error: "Cron execution failed", details: error.message },
      { status: 500 }
    );
  }
}
