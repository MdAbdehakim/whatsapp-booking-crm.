import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDailySlots } from "@/lib/utils";
import { parseISO, startOfDay, endOfDay } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date"); // YYYY-MM-DD
    const serviceId = searchParams.get("serviceId");

    if (!dateParam || !serviceId) {
      return NextResponse.json(
        { error: "Date et serviceId obligatoires" },
        { status: 400 }
      );
    }

    const clinic = await prisma.clinic.findUnique({
      where: { slug },
      include: {
        availabilities: true,
        services: true,
      },
    });

    if (!clinic) {
      return NextResponse.json({ error: "Cabinet introuvable" }, { status: 404 });
    }

    const service = clinic.services.find((s) => s.id === serviceId);
    if (!service) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const targetDate = parseISO(dateParam);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday...

    const availability = clinic.availabilities.find(
      (a) => a.dayOfWeek === dayOfWeek && a.isActive
    );

    // If clinic is closed on that day
    if (!availability) {
      return NextResponse.json({
        available: false,
        message: "Cabinet fermé ce jour-là",
        slots: [],
      });
    }

    // Fetch existing active bookings for that day
    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        clinicId: clinic.id,
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          notIn: ["CANCELLED"],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Generate slots
    const slots = generateDailySlots({
      targetDate,
      startTimeStr: availability.startTime,
      endTimeStr: availability.endTime,
      serviceDurationMin: service.durationMin,
      existingBookings: existingAppointments,
      bufferMin: 5,
    });

    return NextResponse.json({
      available: true,
      dayOfWeek,
      workingHours: `${availability.startTime} - ${availability.endTime}`,
      slots,
    });
  } catch (error: any) {
    console.error("Error computing slots:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du calcul des créneaux" },
      { status: 500 }
    );
  }
}
