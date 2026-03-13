import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as prismaClientPkg from "@prisma/client";

type PrismaClientLike = {
  user: {
    upsert: (args: unknown) => Promise<unknown>;
  };
};

declare global {
  var prisma: PrismaClientLike | undefined;
  var prismaPool: Pool | undefined;
}

export function getPrisma(): PrismaClientLike {
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
  const PrismaClientCtor =
    (
      prismaClientPkg as unknown as {
        PrismaClient?: new (args: unknown) => PrismaClientLike;
      }
    ).PrismaClient ??
    (
      prismaClientPkg as unknown as {
        default?: { PrismaClient?: new (args: unknown) => PrismaClientLike };
      }
    ).default?.PrismaClient;
  if (!PrismaClientCtor) {
    throw new Error("PrismaClient is not available. Run prisma generate.");
  }
  const client = new PrismaClientCtor({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = client;
    globalThis.prismaPool = pool;
  }

  return client;
}

export const prisma = getPrisma();
