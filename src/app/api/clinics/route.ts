import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        services: true,
        _count: {
          select: {
            appointments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(clinics);
  } catch (error: any) {
    console.error("Error fetching clinics:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des cabinets.", details: error.message, code: error.code },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      doctorName,
      specialty,
      phone,
      email,
      address,
      city = "Casablanca",
      googleMapsUrl,
      welcomeMessage,
      services = [], // [{ name, durationMin, price, description }]
      workingDays = [1, 2, 3, 4, 5, 6], // Monday to Saturday
      startTime = "09:00",
      endTime = "18:00",
    } = body;

    if (!name || !doctorName || !specialty || !phone || !address) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires (Nom, Médecin, Spécialité, Téléphone, Adresse)." },
        { status: 400 }
      );
    }

    // Generate unique URL slug (e.g. "Dr. Sarah Alami" -> "dr-sarah-alami")
    let baseSlug = doctorName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!baseSlug.startsWith("dr-")) {
      baseSlug = `dr-${baseSlug}`;
    }

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.clinic.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create Clinic + Services + Working Hours in a single transaction
    const clinic = await prisma.clinic.create({
      data: {
        name,
        slug,
        doctorName,
        specialty,
        phone,
        email: email || null,
        address,
        city,
        googleMapsUrl: googleMapsUrl || null,
        welcomeMessage:
          welcomeMessage ||
          `Bienvenue au cabinet du ${doctorName}. Prenez rendez-vous en ligne en 2 minutes avec confirmation WhatsApp immédiate.`,
        // Create initial services or defaults
        services: {
          create:
            services.length > 0
              ? services.map((s: any) => ({
                  name: s.name,
                  durationMin: Number(s.durationMin) || 30,
                  price: s.price ? Number(s.price) : null,
                  description: s.description || null,
                  color: s.color || "#128C7E",
                }))
              : [
                  {
                    name: "Consultation & Bilan Général",
                    durationMin: 30,
                    price: 300,
                    description: "Diagnostic clinique et examen complet.",
                    color: "#128C7E",
                  },
                  {
                    name: "Visite de Contrôle / Suivi",
                    durationMin: 20,
                    price: 200,
                    description: "Contrôle post-traitement et vérification.",
                    color: "#0284c7",
                  },
                ],
        },
        // Create standard working hours
        availabilities: {
          create: workingDays.map((day: number) => ({
            dayOfWeek: day,
            startTime,
            endTime: day === 6 ? "13:30" : endTime, // Saturday half day
            isActive: true,
          })),
        },
        // Create default users (Doctor and Secretary accounts)
        users: {
          create: [
            {
              name: doctorName,
              email: email || `${slug}@cabinet.ma`,
              password: "password123",
              role: "ADMIN_DOCTOR",
            },
          ],
        },
      },
      include: {
        services: true,
        availabilities: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        clinic,
        bookingUrl: `/${clinic.slug}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering clinic:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du cabinet." },
      { status: 500 }
    );
  }
}
