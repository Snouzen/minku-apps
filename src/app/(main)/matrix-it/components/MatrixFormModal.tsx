import React from "react";
import { X, CheckCircle2, Circle } from "lucide-react";
import Button from "../../../component/ui/Button";
import SmoothDropdown from "../../../component/smoothDropdown";
import SmoothDatePicker from "../../../component/smoothDatePicker";

interface MatrixFormModalProps {
  modalType: "KEGIATAN" | "TASK" | null;
  editMode: boolean;
  onClose: () => void;
  handleSave: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
}



export default function MatrixFormModal({
  modalType, editMode, onClose, handleSave, formData, setFormData
}: MatrixFormModalProps) {
  if (!modalType) return null;

  const title = editMode ? `Edit ${modalType}` : `Tambah ${modalType}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-up max-w-md`}>
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-bold text-[#1A237E]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="matrixForm" onSubmit={handleSave} className="space-y-5">
            {modalType === "KEGIATAN" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kegiatan <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.namaKegiatan || ""}
                  onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Masukkan nama kegiatan"
                />
              </div>
            )}

            {modalType === "TASK" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Task <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.namaTask || ""}
                  onChange={(e) => setFormData({ ...formData, namaTask: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Masukkan nama task"
                />
              </div>
            )}


          </form>
        </div>
        <div className="p-4 border-t bg-gray-50 shrink-0 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} label="Batal" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-100" />
          <Button type="submit" form="matrixForm" label="Simpan Data" />
        </div>
      </div>
    </div>
  );
}
