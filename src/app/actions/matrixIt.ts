"use server";

import { prisma } from "../lib/prisma";

// ==========================================
// KEGIATAN ACTIONS
// ==========================================
export async function getMatrixDataAction() {
  try {
    const data = await prisma.matrixKegiatan.findMany({
      include: {
        tasks: {
          include: {
            subTasks: true,
          },
          orderBy: {
            id: 'asc',
          }
        },
      },
      orderBy: {
        id: 'asc',
      }
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("Error getMatrixDataAction:", error);
    return { success: false, error: error.message };
  }
}

export async function createKegiatanAction(namaKegiatan: string) {
  try {
    const res = await prisma.matrixKegiatan.create({
      data: { namaKegiatan },
    });
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateKegiatanAction(id: number, namaKegiatan: string) {
  try {
    const res = await prisma.matrixKegiatan.update({
      where: { id },
      data: { namaKegiatan },
    });
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteKegiatanAction(id: number) {
  try {
    await prisma.matrixKegiatan.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==========================================
// TASK ACTIONS
// ==========================================
export async function getTaskByIdAction(id: number) {
  try {
    const data = await prisma.matrixTask.findUnique({
      where: { id },
      include: {
        kegiatan: true,
        subTasks: {
          orderBy: {
            id: 'asc'
          }
        }
      }
    });
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTaskAction(kegiatanId: number, namaTask: string) {
  try {
    const res = await prisma.matrixTask.create({
      data: { kegiatanId, namaTask },
    });
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTaskAction(id: number, namaTask: string) {
  try {
    const res = await prisma.matrixTask.update({
      where: { id },
      data: { namaTask },
    });
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTaskAction(id: number) {
  try {
    await prisma.matrixTask.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==========================================
// SUB-TASK ACTIONS
// ==========================================
export async function createSubTaskAction(taskId: number, payload: any) {
  try {
    const res = await prisma.matrixSubTask.create({
      data: {
        taskId,
        namaSubTask: payload.namaSubTask,
        goals: payload.goals || null,
        actionPlan: payload.actionPlan || null,
        status: payload.status || "OPEN",
        sdiPengajuanRm: payload.sdiPengajuanRm || null,
        ndIzinPrinsipGm: payload.ndIzinPrinsipGm || null,
        ndIzinPrinsipDirsar: payload.ndIzinPrinsipDirsar || null,
        ndIzinPenggunaanRka: payload.ndIzinPenggunaanRka || null,
        ndBalasanDivisiUmum: payload.ndBalasanDivisiUmum || null,
        sdiPemberitahuanRm: payload.sdiPemberitahuanRm || null,
        ndPermohonanPembayaran: payload.ndPermohonanPembayaran || null,
        batasPenerbitanKontrak: payload.batasPenerbitanKontrak ? new Date(payload.batasPenerbitanKontrak) : null,
      },
    });
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSubTaskAction(id: number, payload: any) {
  try {
    const res = await prisma.matrixSubTask.update({
      where: { id },
      data: {
        namaSubTask: payload.namaSubTask,
        goals: payload.goals || null,
        actionPlan: payload.actionPlan || null,
        status: payload.status || "OPEN",
        sdiPengajuanRm: payload.sdiPengajuanRm || null,
        ndIzinPrinsipGm: payload.ndIzinPrinsipGm || null,
        ndIzinPrinsipDirsar: payload.ndIzinPrinsipDirsar || null,
        ndIzinPenggunaanRka: payload.ndIzinPenggunaanRka || null,
        ndBalasanDivisiUmum: payload.ndBalasanDivisiUmum || null,
        sdiPemberitahuanRm: payload.sdiPemberitahuanRm || null,
        ndPermohonanPembayaran: payload.ndPermohonanPembayaran || null,
        batasPenerbitanKontrak: payload.batasPenerbitanKontrak ? new Date(payload.batasPenerbitanKontrak) : null,
      },
    });
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSubTaskAction(id: number) {
  try {
    await prisma.matrixSubTask.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
