const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.lrvrtkszzcoyrbbowtnh:Antigravity2024!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function main() {
  const notifs = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(notifs.map(n => n.linkUrl));
}

main().finally(() => prisma.$disconnect());
