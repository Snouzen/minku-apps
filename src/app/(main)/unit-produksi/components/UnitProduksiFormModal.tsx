import React from "react";
import { X } from "lucide-react";
import SmoothDropdown from "../../../component/smoothDropdown";
import Button from "../../../component/ui/Button";

interface UnitProduksiFormModalProps {
  modalType: "REGIONAL" | "SITE" | "EDIT" | null;
  onClose: () => void;
  handleSave: (e: React.FormEvent) => Promise<void>;
  formData: any;
  setFormData: (data: any) => void;
  uniqueRegionals: any[];
}

export default function UnitProduksiFormModal({
  modalType,
  onClose,
  handleSave,
  formData,
  setFormData,
  uniqueRegionals
}: UnitProduksiFormModalProps) {
  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-[#1A237E] text-white flex justify-between items-center">
          <h3 className="font-black uppercase tracking-tight">
            {modalType === "EDIT"
              ? "Ubah Data"
              : modalType === "REGIONAL"
              ? "Tambah Regional Baru"
              : "Tambah Site Area"}
          </h3>
          <X
            className="cursor-pointer hover:rotate-90 transition-all"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSave} className="p-8 space-y-5 text-black">
          {(modalType === "REGIONAL" || modalType === "EDIT") && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Nama Regional
                </label>
                <input
                  required
                  type="text"
                  placeholder="Misal: Jabar"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 transition-all text-sm font-medium"
                  value={formData.namaRegional}
                  onChange={(e) =>
                    setFormData({ ...formData, namaRegional: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Kode Regional
                </label>
                <input
                  type="text"
                  placeholder="Opsional (Misal: REG-01)"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 transition-all text-sm font-medium"
                  value={formData.kodeRegional}
                  onChange={(e) =>
                    setFormData({ ...formData, kodeRegional: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {modalType === "SITE" && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Pilih Regional
              </label>
              <SmoothDropdown
                value={formData.namaRegional}
                placeholder="-- Pilih Regional --"
                options={uniqueRegionals.map((r) => ({
                  value: r?.namaRegional || "",
                  label: `${r?.namaRegional} ${r?.kodeRegional ? `(${r.kodeRegional})` : ""}`,
                }))}
                onChange={(val) => {
                  const selected = uniqueRegionals.find((r) => r?.namaRegional === val);
                  setFormData({
                    ...formData,
                    namaRegional: val,
                    kodeRegional: selected?.kodeRegional || "",
                  });
                }}
                buttonClassName="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 text-sm font-medium"
              />
            </div>
          )}

          {(modalType === "SITE" || (modalType === "EDIT" && formData.siteArea !== "-")) && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Nama Site Area
                </label>
                <input
                  required
                  type="text"
                  placeholder="Misal: SPP Karawang"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 transition-all text-sm font-medium"
                  value={formData.siteArea}
                  onChange={(e) =>
                    setFormData({ ...formData, siteArea: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Alamat Lengkap
                </label>
                <textarea
                  placeholder="Opsional"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-blue-200 transition-all text-sm font-medium min-h-[100px]"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Data
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
