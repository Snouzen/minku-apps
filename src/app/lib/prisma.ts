import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaPool: Pool | undefined;
}

export function getPrisma(): PrismaClient {
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
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = client;
    globalThis.prismaPool = pool;
  }

  return client;
}

export const prisma = getPrisma();
