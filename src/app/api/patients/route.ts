import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const patients = await prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search } },
              { phoneNumber: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : undefined,
      include: {
        appointments: {
          include: {
            service: true,
            clinic: true,
          },
          orderBy: { startTime: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute patient statistics
    const enhancedPatients = patients.map((p) => {
      const totalAppointments = p.appointments.length;
      const completedCount = p.appointments.filter((a) => a.status === "COMPLETED").length;
      const noShowCount = p.appointments.filter((a) => a.status === "NO_SHOW").length;
      const cancelledCount = p.appointments.filter((a) => a.status === "CANCELLED").length;
      const totalRevenue = p.appointments
        .filter((a) => a.status === "COMPLETED")
        .reduce((sum, a) => sum + (a.service.price || 0), 0);

      const reliabilityScore =
        totalAppointments > 0
          ? Math.round(((totalAppointments - noShowCount) / totalAppointments) * 100)
          : 100;

      return {
        ...p,
        stats: {
          totalAppointments,
          completedCount,
          noShowCount,
          cancelledCount,
          totalRevenue,
          reliabilityScore,
        },
      };
    });

    return NextResponse.json(enhancedPatients);
  } catch (error: any) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des patients." },
      { status: 500 }
    );
  }
}
