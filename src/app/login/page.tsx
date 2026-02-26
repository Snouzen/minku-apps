"use client";

import React, { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import Swal from "sweetalert2";

interface User {
  id: number;
  name: string;
  role: "super_admin" | "pic";
  picName?: string;
  password: string;
}

const users: User[] = [
  { id: 1, name: "User Master", role: "super_admin", password: "admin123" },
  { id: 2, name: "Agung", role: "pic", picName: "Agung", password: "agung123" },
  {
    id: 3,
    name: "Latifah",
    role: "pic",
    picName: "Latifah",
    password: "latifah123",
  },
  { id: 4, name: "Pepy", role: "pic", picName: "Pepy", password: "pepy123" },
  { id: 5, name: "Pandu", role: "pic", picName: "Pandu", password: "pandu123" },
  { id: 6, name: "Vivi", role: "pic", picName: "Vivi", password: "vivi123" },
  { id: 7, name: "Rama", role: "pic", picName: "Rama", password: "rama123" },
  {
    id: 8,
    name: "Raysha",
    role: "pic",
    picName: "Raysha",
    password: "raysha123",
  },
  { id: 9, name: "Ajo", role: "pic", picName: "Ajo", password: "ajo123" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.name === selectedUser && u.password === password,
    );

    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        role: user.role,
        picName: user.picName,
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Selamat datang, ${user.name}!`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Username atau password salah!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            SIKD - Minku UB Bulog
          </h1>
          <p className="text-gray-600">Silakan login untuk melanjutkan</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            >
              <option value="">-- Pilih User --</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff
                    size={20}
                    className="text-gray-400 hover:text-gray-600"
                  />
                ) : (
                  <Eye
                    size={20}
                    className="text-gray-400 hover:text-gray-600"
                  />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
