import { prisma } from './prisma';
import { Status, Role } from '@prisma/client';

const users = [
  {
    id: 1,
    name: "Super Admin",
    role: Role.SUPER_ADMIN,
    password: "admin123",
  },
  {
    id: 2,
    name: "Agung",
    role: Role.PIC,
    picName: "Agung",
    password: "agung123",
  },
  {
    id: 3,
    name: "Latifah",
    role: Role.PIC,
    picName: "Latifah",
    password: "latifah123",
  },
  {
    id: 4,
    name: "Pepy",
    role: Role.PIC,
    picName: "Pepy",
    password: "pepy123",
  },
  {
    id: 5,
    name: "Pandu",
    role: Role.PIC,
    picName: "Pandu",
    password: "pandu123",
  },
  {
    id: 6,
    name: "Fifi",
    role: Role.PIC,
    picName: "Fifi",
    password: "fifi123",
  },
  {
    id: 7,
    name: "Rama",
    role: Role.PIC,
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
