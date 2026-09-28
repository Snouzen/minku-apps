"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Lock, Save, AlertCircle, ChevronDown, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { getCurrentUser } from "../../lib/auth";
import { getUserProfileAction, updateUserProfileAction } from "../../actions/user";

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    picName: "",
    jabatan: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchProfile(user.id);
    } else {
      setLoading(false);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchProfile = async (id: number) => {
    setLoading(true);
    const res = await getUserProfileAction(id);
    if (res.success && res.data) {
      setFormData({
        name: res.data.name || "",
        picName: res.data.picName || "",
        jabatan: res.data.jabatan || "",
        password: "",
        confirmPassword: ""
      });
    } else {
      console.error("Failed to fetch profile:", res.error);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Konfirmasi password tidak cocok", "error");
      return;
    }
    
    setSaving(true);
    const payload: any = {
      name: formData.name,
      picName: formData.picName,
      jabatan: formData.jabatan
    };
    
    if (formData.password) {
      payload.password = formData.password;
    }
    
    const res = await updateUserProfileAction(currentUser.id, payload);
    setSaving(false);
    
    if (res.success && res.data) {
      // Update local storage so navbar and other components update
      const updatedUser = {
        ...currentUser,
        name: res.data.name,
        picName: res.data.picName,
        jabatan: res.data.jabatan
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      Swal.fire({
        icon: "success",
        title: "Profile Berhasil Diupdate",
        text: "Jika ada perubahan nama, halaman akan direfresh untuk menerapkan perubahan.",
        showConfirmButton: true,
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire("Error", res.error || "Gagal mengupdate profile", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profile</h1>
        <p className="text-gray-500 mt-1">Kelola informasi akun dan kata sandi Anda</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-6" autoComplete="off">
            
            {/* Profil Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Informasi Dasar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={currentUser?.role === "SUPER_ADMIN" ? "col-span-1 md:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentUser?.role === "SUPER_ADMIN" ? "Nama Pengguna (Username)" : "Nama Lengkap"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black bg-white placeholder-gray-400"
                    placeholder="Masukkan nama pengguna"
                  />
                  {currentUser?.role === "SUPER_ADMIN" && (
                    <p className="text-xs text-gray-500 mt-1">Ini adalah nama yang digunakan untuk login dan tag di komentar.</p>
                  )}
                </div>
                
                {currentUser?.role !== "SUPER_ADMIN" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIC Name (Inisial/Singkatan) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="picName"
                      value={formData.picName}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black bg-white placeholder-gray-400"
                      placeholder="Contoh: RZY"
                    />
                    <p className="text-xs text-gray-500 mt-1">Digunakan untuk tag pada komentar/task.</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jabatan (Titel Pekerjaan) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      disabled={currentUser?.role !== "SUPER_ADMIN"}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`w-full px-4 py-2 text-left border rounded-xl outline-none transition-all flex justify-between items-center ${
                        currentUser?.role === "SUPER_ADMIN" 
                          ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white cursor-pointer" 
                          : "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span>
                        {formData.jabatan === "Manager" ? "Manager (Super Admin)" :
                         formData.jabatan === "Asman" ? "Asman (Assistant Manager)" :
                         formData.jabatan === "Staff" ? "Staff" :
                         formData.jabatan === "Guest" ? "Guest" :
                         "Pilih Jabatan..."}
                      </span>
                      {currentUser?.role === "SUPER_ADMIN" && (
                        <ChevronDown size={18} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    
                    {dropdownOpen && currentUser?.role === "SUPER_ADMIN" && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-60 overflow-auto">
                        <button
                          type="button"
                          onClick={() => { setFormData({...formData, jabatan: "Manager"}); setDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${formData.jabatan === "Manager" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                        >
                          Manager (Super Admin)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setFormData({...formData, jabatan: "Asman"}); setDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${formData.jabatan === "Asman" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                        >
                          Asman (Assistant Manager)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setFormData({...formData, jabatan: "Staff"}); setDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${formData.jabatan === "Staff" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                        >
                          Staff
                        </button>
                        <button
                          type="button"
                          onClick={() => { setFormData({...formData, jabatan: "Guest"}); setDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${formData.jabatan === "Guest" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                        >
                          Guest
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentUser?.role === "SUPER_ADMIN" 
                      ? "Hanya mengubah tampilan titel Anda di sistem." 
                      : "Hubungi Super Admin jika Anda ingin mengubah profil jabatan."}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Password */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock size={20} className="text-blue-600" />
                Ubah Kata Sandi
              </h2>
              
              <div className="bg-blue-50 p-4 rounded-xl mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Kosongkan field kata sandi jika Anda tidak ingin mengubahnya.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-1p-ignore
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black bg-white placeholder-gray-400"
                      placeholder="Masukkan kata sandi baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-1p-ignore
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black bg-white placeholder-gray-400"
                      placeholder="Ketik ulang kata sandi baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save size={18} />
                )}
                Simpan Perubahan
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
