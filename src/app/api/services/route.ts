import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/services?clinicId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");

    const where = clinicId ? { clinicId } : {};
    const services = await prisma.service.findMany({
      where,
      orderBy: { price: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services." },
      { status: 500 }
    );
  }
}

// POST /api/services
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, durationMin, price, description, color, clinicId } = body;

    if (!name || !clinicId) {
      return NextResponse.json(
        { error: "Le nom et l'identifiant du cabinet sont obligatoires." },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        durationMin: Number(durationMin) || 30,
        price: price ? Number(price) : null,
        description: description || null,
        color: color || "#128C7E",
        clinicId,
      },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du service." },
      { status: 500 }
    );
  }
}

// PATCH /api/services (Update service)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, durationMin, price, description, color } = body;

    if (!id) {
      return NextResponse.json({ error: "id du service requis" }, { status: 400 });
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        durationMin: durationMin ? Number(durationMin) : undefined,
        price: price !== undefined ? (price ? Number(price) : null) : undefined,
        description,
        color,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du service." },
      { status: 500 }
    );
  }
}

// DELETE /api/services?id=...
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id requis" }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Service supprimé." });
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de supprimer ce service (des rendez-vous y sont associés)." },
      { status: 500 }
    );
  }
}
