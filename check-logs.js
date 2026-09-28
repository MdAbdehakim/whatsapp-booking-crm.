const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const logs = await prisma.whatsAppLog.findMany({
    orderBy: { sentAt: 'desc' },
    take: 5
  });
  console.log('Recent WhatsApp Logs:');
  console.log(JSON.stringify(logs, null, 2));

  const appts = await prisma.appointment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { patient: true }
  });
  console.log('\nRecent Appointments:');
  console.log(JSON.stringify(appts, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
