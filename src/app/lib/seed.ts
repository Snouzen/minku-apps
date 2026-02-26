import "dotenv/config";
import { prisma } from "./prisma";
import { createClient } from "@supabase/supabase-js";

type SeedUser = {
  id: number;
  name: string;
  role: "SUPER_ADMIN" | "PIC";
  picName?: string;
  password: string;
};

export const users: SeedUser[] = [
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
    name: "Vivi",
    role: "PIC",
    picName: "Vivi",
    password: "vivi123",
  },
  {
    id: 7,
    name: "Rama",
    role: "PIC",
    picName: "Rama",
    password: "rama123",
  },
  {
    id: 8,
    name: "Raysha",
    role: "PIC",
    picName: "Raysha",
    password: "raysha123",
  },
  {
    id: 9,
    name: "Ajo",
    role: "PIC",
    picName: "Ajo",
    password: "ajo123",
  },
];

export async function seedDatabase() {
  try {
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          name: user.name,
          role: user.role as any,
          picName: user.picName ?? null,
          password: user.password,
        },
        create: {
          id: user.id,
          name: user.name,
          role: user.role as any,
          picName: user.picName ?? null,
          password: user.password,
        },
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
