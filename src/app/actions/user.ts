"use server";

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

export async function getUserProfileAction(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        picName: true,
        role: true,
        jabatan: true,
      }
    });
    
    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserProfileAction(id: number, payload: { name: string, picName?: string, password?: string, jabatan?: string }) {
  try {
    const dataToUpdate: any = {
      name: payload.name,
      picName: payload.picName || null,
    };
    
    if (payload.jabatan) {
      dataToUpdate.jabatan = payload.jabatan;
    }
    
    if (payload.password) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(payload.password, salt);
    }
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        picName: true,
        role: true,
        jabatan: true,
      }
    });
    
    return { success: true, data: updatedUser };
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('picName')) {
      return { success: false, error: "PIC Name sudah digunakan oleh user lain." };
    }
    return { success: false, error: error.message || "Gagal mengupdate profile" };
  }
}
