"use server";

import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export async function getUbiMaintenancesAction() {
  try {
    const records = await prisma.ubiAdministrasi.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        vendor: true,
        kegiatan: { orderBy: { id: "asc" } },
      },
    });
    return { success: true, maintenances: records };
  } catch (error) {
    console.error("Failed to fetch UBI data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function createUbiMaintenanceAction(data: any) {
  try {
    const record = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const parent = await tx.ubiAdministrasi.create({
        data: {
          status: data.status,
          dependency: data.dependency || null,
          vendorId: data.vendorId ? parseInt(data.vendorId, 10) : null,
          nominalHasilEvaluasi: data.nominalHasilEvaluasi ? parseFloat(data.nominalHasilEvaluasi) : null,
          nominalRealisasi: data.nominalRealisasi ? parseFloat(data.nominalRealisasi) : null,
          ndIzinPrinsipGm: data.ndIzinPrinsipGm || null,
          ndIzinPrinsipGmUrl: data.ndIzinPrinsipGmUrl || null,
          ndIzinPrinsipDirsar: data.ndIzinPrinsipDirsar || null,
          ndIzinPrinsipDirsarUrl: data.ndIzinPrinsipDirsarUrl || null,
          ndIzinPenggunaanRka: data.ndIzinPenggunaanRka || null,
          ndIzinPenggunaanRkaUrl: data.ndIzinPenggunaanRkaUrl || null,
          ndBalasanDivisiUmum: data.ndBalasanDivisiUmum || null,
          ndBalasanDivisiUmumUrl: data.ndBalasanDivisiUmumUrl || null,
          sdiPemberitahuanRm: data.sdiPemberitahuanRm || null,
          sdiPemberitahuanRmUrl: data.sdiPemberitahuanRmUrl || null,
          ndPermohonanPembayaran: data.ndPermohonanPembayaran || null,
          ndPermohonanPembayaranUrl: data.ndPermohonanPembayaranUrl || null,
          batasPenerbitanKontrak: data.batasPenerbitanKontrak ? new Date(data.batasPenerbitanKontrak) : null,
          tanggalKontrak: data.tanggalKontrak ? new Date(data.tanggalKontrak) : null,
          tanggalSelesai: data.tanggalSelesai ? new Date(data.tanggalSelesai) : null,
          sumberAnggaran: data.sumberAnggaran || null,
          dokumentasiUrls: data.dokumentasiUrls || [],
        },
      });

      if (data.kegiatanItems?.length) {
        await tx.ubiKegiatan.createMany({
          data: data.kegiatanItems.map((item: any) => ({
            administrasiId: parent.id,
            kegiatan: item.kegiatan,
            site: item.site,
            sdiPengajuanRm: item.sdiPengajuanRm || null,
            sdiPengajuanRmUrl: item.sdiPengajuanRmUrl || null,
            nominalPengajuan: item.nominalPengajuan ? parseFloat(item.nominalPengajuan) : null,
            progress: item.progress || null,
          })),
        });
      }

      return parent;
    }, { maxWait: 15000, timeout: 30000 });

    return { success: true, record };
  } catch (error: any) {
    console.error("Failed to create UBI record:", error);
    return { success: false, error: "Failed to create: " + (error?.message || String(error)) };
  }
}

export async function updateUbiMaintenanceAction(id: number, data: any) {
  try {
    const record = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const parentPayload: any = {};
      if (data.status !== undefined) parentPayload.status = data.status;
      if (data.dependency !== undefined) parentPayload.dependency = data.dependency || null;
      if (data.vendorId !== undefined) parentPayload.vendorId = data.vendorId ? parseInt(data.vendorId, 10) : null;
      if (data.nominalHasilEvaluasi !== undefined) parentPayload.nominalHasilEvaluasi = data.nominalHasilEvaluasi ? parseFloat(data.nominalHasilEvaluasi) : null;
      if (data.nominalRealisasi !== undefined) parentPayload.nominalRealisasi = data.nominalRealisasi ? parseFloat(data.nominalRealisasi) : null;
      if (data.ndIzinPrinsipGm !== undefined) parentPayload.ndIzinPrinsipGm = data.ndIzinPrinsipGm;
      if (data.ndIzinPrinsipGmUrl !== undefined) parentPayload.ndIzinPrinsipGmUrl = data.ndIzinPrinsipGmUrl;
      if (data.ndIzinPrinsipDirsar !== undefined) parentPayload.ndIzinPrinsipDirsar = data.ndIzinPrinsipDirsar;
      if (data.ndIzinPrinsipDirsarUrl !== undefined) parentPayload.ndIzinPrinsipDirsarUrl = data.ndIzinPrinsipDirsarUrl;
      if (data.ndIzinPenggunaanRka !== undefined) parentPayload.ndIzinPenggunaanRka = data.ndIzinPenggunaanRka;
      if (data.ndIzinPenggunaanRkaUrl !== undefined) parentPayload.ndIzinPenggunaanRkaUrl = data.ndIzinPenggunaanRkaUrl;
      if (data.ndBalasanDivisiUmum !== undefined) parentPayload.ndBalasanDivisiUmum = data.ndBalasanDivisiUmum;
      if (data.ndBalasanDivisiUmumUrl !== undefined) parentPayload.ndBalasanDivisiUmumUrl = data.ndBalasanDivisiUmumUrl;
      if (data.sdiPemberitahuanRm !== undefined) parentPayload.sdiPemberitahuanRm = data.sdiPemberitahuanRm;
      if (data.sdiPemberitahuanRmUrl !== undefined) parentPayload.sdiPemberitahuanRmUrl = data.sdiPemberitahuanRmUrl;
      if (data.ndPermohonanPembayaran !== undefined) parentPayload.ndPermohonanPembayaran = data.ndPermohonanPembayaran;
      if (data.ndPermohonanPembayaranUrl !== undefined) parentPayload.ndPermohonanPembayaranUrl = data.ndPermohonanPembayaranUrl;
      if (data.batasPenerbitanKontrak !== undefined) parentPayload.batasPenerbitanKontrak = data.batasPenerbitanKontrak ? new Date(data.batasPenerbitanKontrak) : null;
      if (data.tanggalKontrak !== undefined) parentPayload.tanggalKontrak = data.tanggalKontrak ? new Date(data.tanggalKontrak) : null;
      if (data.tanggalSelesai !== undefined) parentPayload.tanggalSelesai = data.tanggalSelesai ? new Date(data.tanggalSelesai) : null;
      if (data.sumberAnggaran !== undefined) parentPayload.sumberAnggaran = data.sumberAnggaran || null;
      if (data.dokumentasiUrls !== undefined) parentPayload.dokumentasiUrls = data.dokumentasiUrls;

      const updated = await tx.ubiAdministrasi.update({
        where: { id },
        data: parentPayload,
      });

      // Replace children: delete old, create new
      if (data.kegiatanItems) {
        await tx.ubiKegiatan.deleteMany({ where: { administrasiId: id } });
        if (data.kegiatanItems.length) {
          await tx.ubiKegiatan.createMany({
            data: data.kegiatanItems.map((item: any) => ({
              administrasiId: id,
              kegiatan: item.kegiatan,
              site: item.site,
              sdiPengajuanRm: item.sdiPengajuanRm || null,
              sdiPengajuanRmUrl: item.sdiPengajuanRmUrl || null,
              nominalPengajuan: item.nominalPengajuan ? parseFloat(item.nominalPengajuan) : null,
              progress: item.progress || null,
            })),
          });
        }
      }

      return updated;
    }, { maxWait: 15000, timeout: 30000 });

    return { success: true, record };
  } catch (error: any) {
    console.error("Failed to update UBI record:", error);
    return { success: false, error: "Failed to update: " + (error?.message || String(error)) };
  }
}

export async function deleteUbiMaintenanceAction(id: number) {
  try {
    await prisma.ubiAdministrasi.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete UBI record:", error);
    return { success: false, error: "Failed to delete record" };
  }
}
