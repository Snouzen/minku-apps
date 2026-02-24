import "dotenv/config";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

export const users = [
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
    name: "Vivi",
    role: Role.PIC,
    picName: "Vivi",
    password: "vivi123",
  },
  {
    id: 7,
    name: "Rama",
    role: Role.PIC,
    picName: "Rama",
    password: "rama123",
  },
  {
    id: 8,
    name: "Raysha",
    role: Role.PIC,
    picName: "Raysha",
    password: "raysha123",
  },
];

export async function seedDatabase() {
  try {
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (supabaseUrl && serviceRole) {
      const admin = createClient(supabaseUrl, serviceRole, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      for (const u of users) {
        const base = (u.picName || u.name).toLowerCase().replace(/\s+/g, ".");
        const email = `${base}@example.com`;
        const password = u.password;
        try {
          await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
              name: u.name,
              role: u.role,
              picName: u.picName || null,
            },
          });
        } catch {}
      }
    }

    console.log("✅ Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return false;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
