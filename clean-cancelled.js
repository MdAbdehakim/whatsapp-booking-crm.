const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  const deleted = await prisma.appointment.deleteMany({
    where: { status: 'CANCELLED' }
  });
  console.log('✅ Deleted cancelled appointments count:', deleted.count);
}

clean().catch(console.error).finally(() => prisma.$disconnect());
