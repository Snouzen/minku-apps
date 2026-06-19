"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVendorsAction() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { namaVendor: "asc" },
    });
    return { success: true, data: vendors };
  } catch (error: any) {
    console.error("Error fetching vendors:", error);
    return { success: false, error: error.message };
  }
}

export async function createVendorAction(data: { namaVendor: string; picVendor?: string }) {
  try {
    const newVendor = await prisma.vendor.create({
      data: {
        namaVendor: data.namaVendor,
        picVendor: data.picVendor || null,
      },
    });
    revalidatePath("/vendor");
    return { success: true, data: newVendor };
  } catch (error: any) {
    console.error("Error creating vendor:", error);
    return { success: false, error: error.message };
  }
}

export async function updateVendorAction(id: number, data: { namaVendor: string; picVendor?: string }) {
  try {
    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: {
        namaVendor: data.namaVendor,
        picVendor: data.picVendor || null,
      },
    });
    revalidatePath("/vendor");
    return { success: true, data: updatedVendor };
  } catch (error: any) {
    console.error("Error updating vendor:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteVendorAction(id: number) {
  try {
    await prisma.vendor.delete({
      where: { id },
    });
    revalidatePath("/vendor");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting vendor:", error);
    return { success: false, error: error.message };
  }
}
