"use server";

import { prisma } from "../lib/prisma";

export async function getNotificationsAction(userId: number) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        sender: { select: { id: true, name: true, picName: true, role: true } },
      },
    });
    return { success: true, data: notifications };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUnreadNotificationCountAction(userId: number) {
  try {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { success: true, count };
  } catch (error: any) {
    return { success: false, error: error.message, count: 0 };
  }
}

export async function markNotificationReadAction(id: number) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAllNotificationsReadAction(userId: number) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
