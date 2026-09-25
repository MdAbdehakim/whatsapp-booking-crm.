import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const clinic = await prisma.clinic.findUnique({
      where: { slug },
      include: {
        services: {
          orderBy: { price: "asc" },
        },
        availabilities: {
          where: { isActive: true },
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });

    if (!clinic) {
      return NextResponse.json(
        { error: "Cabinet introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(clinic);
  } catch (error: any) {
    console.error("Error fetching clinic:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération du cabinet" },
      { status: 500 }
    );
  }
}
