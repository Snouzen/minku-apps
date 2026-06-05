import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: any | undefined;
  var prismaPool: Pool | undefined;
}

export function getPrisma(): any {
  if (globalThis.prisma) return globalThis.prisma;

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL for Prisma connection");
  }

  const pool =
    globalThis.prismaPool ??
    new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  const adapter = new PrismaPg(pool);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = client;
    globalThis.prismaPool = pool;
  }

  return client;
}

export const prisma = getPrisma();
