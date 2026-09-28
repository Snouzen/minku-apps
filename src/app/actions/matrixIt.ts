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
        createdBy: { select: { id: true, name: true, picName: true, role: true } },
        subTasks: {
          orderBy: {
            id: 'asc'
          },
          include: {
            unitProduksi: true,
            createdBy: { select: { id: true, name: true, picName: true, role: true } }
          }
        }
      }
    });
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTaskAction(kegiatanId: number, namaTask: string, userId?: number) {
  try {
    const res = await prisma.matrixTask.create({
      data: { kegiatanId, namaTask, createdById: userId || null },
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
        unitProduksiId: payload.unitProduksiId || null,
        createdById: payload.createdById || null,
      },
    });
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSubTaskAction(id: number, payload: any) {
  try {
    const dataToUpdate: any = {};
    if (payload.namaSubTask !== undefined) dataToUpdate.namaSubTask = payload.namaSubTask;
    if (payload.goals !== undefined) dataToUpdate.goals = payload.goals || null;
    if (payload.actionPlan !== undefined) dataToUpdate.actionPlan = payload.actionPlan || null;
    if (payload.status !== undefined) dataToUpdate.status = payload.status || "OPEN";
    if (payload.sdiPengajuanRm !== undefined) dataToUpdate.sdiPengajuanRm = payload.sdiPengajuanRm || null;
    if (payload.sdiPengajuanRmLink !== undefined) dataToUpdate.sdiPengajuanRmLink = payload.sdiPengajuanRmLink || null;
    if (payload.ndIzinPrinsipGm !== undefined) dataToUpdate.ndIzinPrinsipGm = payload.ndIzinPrinsipGm || null;
    if (payload.ndIzinPrinsipGmLink !== undefined) dataToUpdate.ndIzinPrinsipGmLink = payload.ndIzinPrinsipGmLink || null;
    if (payload.ndIzinPrinsipDirsar !== undefined) dataToUpdate.ndIzinPrinsipDirsar = payload.ndIzinPrinsipDirsar || null;
    if (payload.ndIzinPrinsipDirsarLink !== undefined) dataToUpdate.ndIzinPrinsipDirsarLink = payload.ndIzinPrinsipDirsarLink || null;
    if (payload.ndIzinPenggunaanRka !== undefined) dataToUpdate.ndIzinPenggunaanRka = payload.ndIzinPenggunaanRka || null;
    if (payload.ndIzinPenggunaanRkaLink !== undefined) dataToUpdate.ndIzinPenggunaanRkaLink = payload.ndIzinPenggunaanRkaLink || null;
    if (payload.ndBalasanDivisiUmum !== undefined) dataToUpdate.ndBalasanDivisiUmum = payload.ndBalasanDivisiUmum || null;
    if (payload.ndBalasanDivisiUmumLink !== undefined) dataToUpdate.ndBalasanDivisiUmumLink = payload.ndBalasanDivisiUmumLink || null;
    if (payload.sdiPemberitahuanRm !== undefined) dataToUpdate.sdiPemberitahuanRm = payload.sdiPemberitahuanRm || null;
    if (payload.sdiPemberitahuanRmLink !== undefined) dataToUpdate.sdiPemberitahuanRmLink = payload.sdiPemberitahuanRmLink || null;
    if (payload.ndPermohonanPembayaran !== undefined) dataToUpdate.ndPermohonanPembayaran = payload.ndPermohonanPembayaran || null;
    if (payload.ndPermohonanPembayaranLink !== undefined) dataToUpdate.ndPermohonanPembayaranLink = payload.ndPermohonanPembayaranLink || null;
    if (payload.batasPenerbitanKontrak !== undefined) dataToUpdate.batasPenerbitanKontrak = payload.batasPenerbitanKontrak ? new Date(payload.batasPenerbitanKontrak) : null;
    if (payload.batasPenerbitanKontrakLink !== undefined) dataToUpdate.batasPenerbitanKontrakLink = payload.batasPenerbitanKontrakLink || null;
    if (payload.unitProduksiId !== undefined) dataToUpdate.unitProduksiId = payload.unitProduksiId || null;

    const res = await prisma.matrixSubTask.update({
      where: { id },
      data: dataToUpdate,
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

// ==========================================
// SUB-TASK COMMENTS ACTIONS
// ==========================================
export async function getSubTaskCommentsAction(subTaskId: number, section: string) {
  try {
    const comments = await prisma.subTaskComment.findMany({
      where: { subTaskId, section },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return { success: true, data: comments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function postSubTaskCommentAction(
  subTaskId: number, 
  section: string, 
  content: string, 
  userId: number, 
  parentId?: number
) {
  try {
    const res = await prisma.subTaskComment.create({
      data: {
        subTaskId,
        section,
        content,
        userId,
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
      }
    });

    // Handle Notifications
    const subTask = await prisma.matrixSubTask.findUnique({
      where: { id: subTaskId },
      include: { task: true }
    });
    const sender = await prisma.user.findUnique({ where: { id: userId } });

    if (subTask && sender) {
      const taskCreatorId = subTask.createdById;
      const sectionLabels: any = { GOALS: 'Goals', ACTION_PLAN: 'Action Plan', PROGRESS_ADMIN: 'Progress Admin' };
      const sectionTitle = `${sectionLabels[section] || section} - ${subTask.namaSubTask}`;
      const linkUrl = `/matrix-it/task/${subTask.taskId}?openComment=true&subTaskId=${subTaskId}&section=${section}&title=${encodeURIComponent(sectionTitle)}`;
      let notificationMsg = "";
      let targetUserId = null;

      if (parentId) {
        const parentComment = await prisma.subTaskComment.findUnique({ where: { id: parentId } });
        if (parentComment && parentComment.userId !== userId) {
          targetUserId = parentComment.userId;
          notificationMsg = `${sender.picName || sender.name} membalas komentar Anda di ${subTask.namaSubTask}`;
        }
      } else {
        if (sender.role === "PIC") {
          const superAdmins = await prisma.user.findMany({ where: { role: "SUPER_ADMIN" } });
          const notifications = superAdmins.filter((sa: any) => sa.id !== userId).map((sa: any) => ({
            userId: sa.id,
            senderId: userId,
            type: "NEW_COMMENT",
            message: `${sender.picName || sender.name} berkomentar di ${subTask.namaSubTask}`,
            linkUrl
          }));
          if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications });
          }
        } else if (sender.role === "SUPER_ADMIN") {
          if (taskCreatorId && taskCreatorId !== userId) {
            targetUserId = taskCreatorId;
            notificationMsg = `${sender.picName || sender.name} berkomentar di Task Anda: ${subTask.namaSubTask}`;
          }
        }
      }

      if (targetUserId) {
        await prisma.notification.create({
          data: {
            userId: targetUserId,
            senderId: userId,
            type: parentId ? "REPLY" : "NEW_COMMENT",
            message: notificationMsg,
            linkUrl
          }
        });
      }
    }

    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSubTaskCommentAction(id: number) {
  try {
    await prisma.subTaskComment.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
