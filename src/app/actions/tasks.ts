"use server";

import { prisma } from "../lib/prisma";
import { format } from "date-fns";

export async function getTasksAction() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: 'asc'
      }
    });

    return { success: true, tasks };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }
}

export async function createTaskAction(taskData: any) {
  try {
    const newTask = await prisma.task.create({
      data: {
        task: taskData.task,
        dueDate: new Date(taskData.dueDate),
        pic: taskData.pic,
        status: taskData.status, // We assume status is already mapped to Prisma Enum by the caller
        remarks: taskData.remarks,
        inputDate: new Date(),
      }
    });
    return { success: true, task: newTask };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskAction(id: number, updates: any) {
  try {
    const payload: any = {};
    if (updates.task !== undefined) payload.task = updates.task;
    if (updates.dueDate !== undefined) payload.dueDate = new Date(updates.dueDate);
    if (updates.pic !== undefined) payload.pic = updates.pic;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.remarks !== undefined) payload.remarks = updates.remarks;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: payload
    });
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTaskAction(id: number) {
  try {
    await prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}
