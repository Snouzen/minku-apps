"use server";

import { prisma } from "../lib/prisma";

export async function getDeletedTasksAction() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        deletedAt: {
          not: null
        }
      },
      orderBy: {
        deletedAt: 'desc'
      }
    });

    return { success: true, tasks };
  } catch (error) {
    console.error("Failed to fetch deleted tasks:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
