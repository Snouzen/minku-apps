const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting to DB...");
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Connected successfully! Users:", users.length);
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
