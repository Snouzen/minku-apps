import { prisma } from './prisma';

const users = [
  {
    id: 1,
    name: "Super Admin",
    role: "SUPER_ADMIN",
    password: "admin123",
  },
  {
    id: 2,
    name: "Agung",
    role: "PIC",
    picName: "Agung",
    password: "agung123",
  },
  {
    id: 3,
    name: "Latifah",
    role: "PIC",
    picName: "Latifah",
    password: "latifah123",
  },
  {
    id: 4,
    name: "Pepy",
    role: "PIC",
    picName: "Pepy",
    password: "pepy123",
  },
  {
    id: 5,
    name: "Pandu",
    role: "PIC",
    picName: "Pandu",
    password: "pandu123",
  },
  {
    id: 6,
    name: "Fifi",
    role: "PIC",
    picName: "Fifi",
    password: "fifi123",
  },
  {
    id: 7,
    name: "Rama",
    role: "PIC",
    picName: "Rama",
    password: "rama123",
  },
];

export async function seedDatabase() {
  try {
    // Seed users
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }

    console.log('✅ Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
