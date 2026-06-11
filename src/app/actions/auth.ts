"use server";

import { prisma } from "../lib/prisma";

import bcrypt from "bcryptjs";

export async function loginAction(name: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    if (!user) {
      return { success: false, error: "Username atau password salah!" };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: "Username atau password salah!" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        picName: user.picName,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function getUsersList() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: 'asc'
      }
    });
    return { success: true, users };
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return { success: false, users: [], error: error.message || String(error) };
  }
}
