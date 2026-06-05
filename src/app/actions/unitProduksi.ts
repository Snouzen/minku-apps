"use server";

import { prisma } from "../lib/prisma";

export async function getUnitProduksiAction() {
  try {
    const data = await prisma.unitProduksi.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching Unit Produksi:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function createUnitProduksiAction(payload: {
  namaRegional: string;
  siteArea: string;
  alamat?: string;
  kodeRegional?: string;
}) {
  try {
    const data = await prisma.unitProduksi.create({
      data: payload,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error creating Unit Produksi:", error);
    return { success: false, error: "Failed to create data" };
  }
}

export async function updateUnitProduksiAction(
  idRegional: string,
  payload: {
    namaRegional?: string;
    siteArea?: string;
    alamat?: string;
    kodeRegional?: string;
  }
) {
  try {
    const data = await prisma.unitProduksi.update({
      where: { idRegional },
      data: payload,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error updating Unit Produksi:", error);
    return { success: false, error: "Failed to update data" };
  }
}

export async function deleteUnitProduksiAction(idRegional: string) {
  try {
    await prisma.unitProduksi.delete({
      where: { idRegional },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting Unit Produksi:", error);
    return { success: false, error: "Failed to delete data" };
  }
}
