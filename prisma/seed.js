const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with realistic clinic data...");

  // Clean existing data
  await prisma.whatsAppLog.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.availability.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.clinic.deleteMany({});

  // 1. Create Clinic
  const clinic = await prisma.clinic.create({
    data: {
      name: "Cabinet Dentaire Dr. Amine Bennani",
      slug: "dr-amine-bennani",
      doctorName: "Dr. Amine Bennani",
      specialty: "Chirurgien-Dentiste & Esthétique du Sourire",
      phone: "+212661234567",
      email: "contact@drbennani-dentiste.ma",
      address: "Angle Bd Zerktouni et Bd Bourgogne, Résidence Al Manar, 3ème étage, N°12",
      city: "Casablanca",
      googleMapsUrl: "https://maps.google.com/?q=Casablanca+Zerktouni",
      welcomeMessage: "Bienvenue au cabinet du Dr. Amine Bennani. Prenez rendez-vous en ligne en moins de 2 minutes et recevez votre confirmation instantanée sur WhatsApp.",
    },
  });

  console.log(`✅ Created Clinic: ${clinic.name} (${clinic.slug})`);

  // 2. Create Users (Doctor & Secretary)
  await prisma.user.createMany({
    data: [
      {
        name: "Dr. Amine Bennani",
        email: "doctor@drbennani.ma",
        password: "password123", // In production hash with bcrypt
        role: "ADMIN_DOCTOR",
        clinicId: clinic.id,
      },
      {
        name: "Fatima Zahra (Assistante)",
        email: "secretaire@drbennani.ma",
        password: "password123",
        role: "SECRETARY",
        clinicId: clinic.id,
      },
    ],
  });

  // 3. Create Services
  const serviceConsultation = await prisma.service.create({
    data: {
      name: "Consultation & Bilan Dentaire",
      description: "Diagnostic complet, examen clinique et radiographie de contrôle.",
      durationMin: 30,
      price: 300,
      color: "#128C7E",
      clinicId: clinic.id,
    },
  });

  const serviceDetartrage = await prisma.service.create({
    data: {
      name: "Détartrage & Polissage Ultrasonique",
      description: "Nettoyage en profondeur des gencives et élimination du tartre.",
      durationMin: 45,
      price: 450,
      color: "#0284c7",
      clinicId: clinic.id,
    },
  });

  const serviceBlanchiment = await prisma.service.create({
    data: {
      name: "Blanchiment Dentaire au Laser",
      description: "Séance d'éclaircissement dentaire professionnelle en cabinet.",
      durationMin: 60,
      price: 1800,
      color: "#7c3aed",
      clinicId: clinic.id,
    },
  });

  const serviceUrgence = await prisma.service.create({
    data: {
      name: "Urgence Dentaire / Rage de dents",
      description: "Prise en charge immédiate de la douleur ou fracture dentaire.",
      durationMin: 30,
      price: 400,
      color: "#dc2626",
      clinicId: clinic.id,
    },
  });

  // 4. Create Working Hours / Availabilities (Monday - Saturday)
  const days = [
    { day: 1, start: "09:00", end: "18:00" }, // Monday
    { day: 2, start: "09:00", end: "18:00" }, // Tuesday
    { day: 3, start: "09:00", end: "18:00" }, // Wednesday
    { day: 4, start: "09:00", end: "18:00" }, // Thursday
    { day: 5, start: "09:00", end: "18:00" }, // Friday
    { day: 6, start: "09:00", end: "13:30" }, // Saturday
  ];

  for (const d of days) {
    await prisma.availability.create({
      data: {
        dayOfWeek: d.day,
        startTime: d.start,
        endTime: d.end,
        isActive: true,
        clinicId: clinic.id,
      },
    });
  }

  // 5. Create Sample Patients
  const patient1 = await prisma.patient.create({
    data: {
      fullName: "Youssef El Mansouri",
      phoneNumber: "+212661889900",
      email: "youssef.mansouri@gmail.com",
      notes: "Sensibilité dentaire au froid.",
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      fullName: "Sara Tazi",
      phoneNumber: "+212662112233",
      email: "sara.tazi@hotmail.com",
      notes: "Traitement orthodontique en cours.",
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      fullName: "Karim Berrada",
      phoneNumber: "+212663445566",
      email: "karim.berrada@yahoo.fr",
      notes: "Patient régulier pour détartrage.",
    },
  });

  // 6. Create Realistic Sample Appointments (Today, Tomorrow, Past)
  const now = new Date();
  
  // Today 10:00 AM
  const today10am = new Date(now);
  today10am.setHours(10, 0, 0, 0);
  const today1030am = new Date(now);
  today1030am.setHours(10, 30, 0, 0);

  const appt1 = await prisma.appointment.create({
    data: {
      startTime: today10am,
      endTime: today1030am,
      status: "CONFIRMED",
      notes: "Première visite de contrôle",
      clinicId: clinic.id,
      serviceId: serviceConsultation.id,
      patientId: patient1.id,
    },
  });

  await prisma.whatsAppLog.create({
    data: {
      messageType: "CONFIRMATION",
      recipientPhone: patient1.phoneNumber,
      content: `Bonjour Youssef, votre RDV chez Dr. Amine Bennani est confirmé pour aujourd'hui à 10:00.`,
      status: "DELIVERED",
      responseReceived: "CONFIRMED_BY_USER",
      appointmentId: appt1.id,
    },
  });

  // Today 11:30 AM
  const today1130am = new Date(now);
  today1130am.setHours(11, 30, 0, 0);
  const today1215pm = new Date(now);
  today1215pm.setHours(12, 15, 0, 0);

  const appt2 = await prisma.appointment.create({
    data: {
      startTime: today1130am,
      endTime: today1215pm,
      status: "PENDING",
      notes: "Détartrage annuel",
      clinicId: clinic.id,
      serviceId: serviceDetartrage.id,
      patientId: patient2.id,
    },
  });

  await prisma.whatsAppLog.create({
    data: {
      messageType: "REMINDER_24H",
      recipientPhone: patient2.phoneNumber,
      content: `Rappel de votre RDV demain à 11:30 chez Dr. Amine Bennani. Répondez OUI pour confirmer ou NON pour annuler.`,
      status: "SENT",
      appointmentId: appt2.id,
    },
  });

  // Tomorrow 15:00 PM
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(15, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(16, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      startTime: tomorrow,
      endTime: tomorrowEnd,
      status: "CONFIRMED",
      notes: "Blanchiment complet",
      clinicId: clinic.id,
      serviceId: serviceBlanchiment.id,
      patientId: patient3.id,
    },
  });

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
