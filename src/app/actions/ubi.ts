"use server";

import { prisma } from "../lib/prisma";

export async function getUbiMaintenancesAction() {
  try {
    const maintenances = await prisma.ubiMaintenance.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { success: true, maintenances };
  } catch (error) {
    console.error("Failed to fetch UBI maintenances:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function createUbiMaintenanceAction(data: any) {
  try {
    const newRecord = await prisma.ubiMaintenance.create({
      data: {
        status: data.status,
        dependency: data.dependency || null,
        kegiatan: data.kegiatan,
        site: data.site,
        nominalPengajuan: data.nominalPengajuan ? parseFloat(data.nominalPengajuan) : null,
        progress: data.progress || null,
        nominalHasilEvaluasi: data.nominalHasilEvaluasi ? parseFloat(data.nominalHasilEvaluasi) : null,
        nominalRealisasi: data.nominalRealisasi ? parseFloat(data.nominalRealisasi) : null,
        
        sdiPengajuanRm: data.sdiPengajuanRm || null,
        ndIzinPrinsipGm: data.ndIzinPrinsipGm || null,
        ndIzinPrinsipDirsar: data.ndIzinPrinsipDirsar || null,
        ndIzinPenggunaanRka: data.ndIzinPenggunaanRka || null,
        ndBalasanDivisiUmum: data.ndBalasanDivisiUmum || null,
        sdiPemberitahuanRm: data.sdiPemberitahuanRm || null,
        ndPermohonanPembayaran: data.ndPermohonanPembayaran || null,
        batasPenerbitanKontrak: data.batasPenerbitanKontrak ? new Date(data.batasPenerbitanKontrak) : null,
        dokumentasiUrls: data.dokumentasiUrls || [],
      }
    });
    return { success: true, record: newRecord };
  } catch (error: any) {
    console.error("Failed to create UBI maintenance:", error);
    return { success: false, error: "Failed to create record: " + (error?.message || String(error)) };
  }
}

export async function updateUbiMaintenanceAction(id: number, data: any) {
  try {
    const payload: any = {};
    if (data.status !== undefined) payload.status = data.status;
    if (data.dependency !== undefined) payload.dependency = data.dependency || null;
    if (data.kegiatan !== undefined) payload.kegiatan = data.kegiatan;
    if (data.site !== undefined) payload.site = data.site;
    if (data.nominalPengajuan !== undefined) payload.nominalPengajuan = data.nominalPengajuan ? parseFloat(data.nominalPengajuan) : null;
    if (data.progress !== undefined) payload.progress = data.progress;
    if (data.nominalHasilEvaluasi !== undefined) payload.nominalHasilEvaluasi = data.nominalHasilEvaluasi ? parseFloat(data.nominalHasilEvaluasi) : null;
    if (data.nominalRealisasi !== undefined) payload.nominalRealisasi = data.nominalRealisasi ? parseFloat(data.nominalRealisasi) : null;
    
    // Tracker fields
    if (data.sdiPengajuanRm !== undefined) payload.sdiPengajuanRm = data.sdiPengajuanRm;
    if (data.ndIzinPrinsipGm !== undefined) payload.ndIzinPrinsipGm = data.ndIzinPrinsipGm;
    if (data.ndIzinPrinsipDirsar !== undefined) payload.ndIzinPrinsipDirsar = data.ndIzinPrinsipDirsar;
    if (data.ndIzinPenggunaanRka !== undefined) payload.ndIzinPenggunaanRka = data.ndIzinPenggunaanRka;
    if (data.ndBalasanDivisiUmum !== undefined) payload.ndBalasanDivisiUmum = data.ndBalasanDivisiUmum;
    if (data.sdiPemberitahuanRm !== undefined) payload.sdiPemberitahuanRm = data.sdiPemberitahuanRm;
    if (data.ndPermohonanPembayaran !== undefined) payload.ndPermohonanPembayaran = data.ndPermohonanPembayaran;
    if (data.batasPenerbitanKontrak !== undefined) payload.batasPenerbitanKontrak = data.batasPenerbitanKontrak ? new Date(data.batasPenerbitanKontrak) : null;
    if (data.dokumentasiUrls !== undefined) payload.dokumentasiUrls = data.dokumentasiUrls;

    const updatedRecord = await prisma.ubiMaintenance.update({
      where: { id },
      data: payload
    });
    return { success: true, record: updatedRecord };
  } catch (error: any) {
    console.error("Failed to update UBI maintenance:", error);
    return { success: false, error: "Failed to update record: " + (error?.message || String(error)) };
  }
}

export async function deleteUbiMaintenanceAction(id: number) {
  try {
    await prisma.ubiMaintenance.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete UBI maintenance:", error);
    return { success: false, error: "Failed to delete record" };
  }
}
