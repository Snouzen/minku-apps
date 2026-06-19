"use client";

import React from "react";
import { X } from "lucide-react";
import Button from "../../../component/ui/Button";

export default function VendorFormModal({
  modalOpen,
  setModalOpen,
  editMode,
  formData,
  setFormData,
  handleSave,
}: {
  modalOpen: boolean;
  setModalOpen: (val: boolean) => void;
  editMode: boolean;
  formData: any;
  setFormData: (val: any) => void;
  handleSave: (e: React.FormEvent) => void;
}) {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {editMode ? "Edit Vendor" : "Tambah Vendor Baru"}
          </h2>
          <button
            onClick={() => setModalOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="vendorForm" onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nama Vendor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan nama vendor..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={formData.namaVendor}
                onChange={(e) =>
                  setFormData({ ...formData, namaVendor: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                PIC Vendor
              </label>
              <input
                type="text"
                placeholder="Nama kontak / PIC (opsional)..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={formData.picVendor}
                onChange={(e) =>
                  setFormData({ ...formData, picVendor: e.target.value })
                }
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setModalOpen(false)}
            className="px-6"
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="vendorForm"
            variant="primary"
            className="px-6"
          >
            {editMode ? "Simpan Perubahan" : "Simpan Vendor"}
          </Button>
        </div>
      </div>
    </div>
  );
}
