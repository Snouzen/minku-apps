import React from "react";
import { X, CheckCircle2, Circle } from "lucide-react";
import Button from "../../../../../component/ui/Button";
import SmoothDropdown from "../../../../../component/smoothDropdown";
import SmoothDatePicker from "../../../../../component/smoothDatePicker";

interface SubTaskModalProps {
  isOpen: boolean;
  editMode: boolean;
  onClose: () => void;
  handleSave: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
}

const trackerSteps = [
  { key: "sdiPengajuanRm", label: "SDI Pengajuan RM" },
  { key: "ndIzinPrinsipGm", label: "ND Izin Prinsip GM" },
  { key: "ndIzinPrinsipDirsar", label: "ND Izin Prinsip Dirsar" },
  { key: "ndIzinPenggunaanRka", label: "ND Izin Penggunaan RKA" },
  { key: "ndBalasanDivisiUmum", label: "ND Balasan Divisi Umum" },
  { key: "sdiPemberitahuanRm", label: "SDI Pemberitahuan RM" },
  { key: "ndPermohonanPembayaran", label: "ND Permohonan Pembayaran" },
];

export default function SubTaskModal({
  isOpen, editMode, onClose, handleSave, formData, setFormData
}: SubTaskModalProps) {
  if (!isOpen) return null;

  const title = editMode ? "Edit Sub-Task" : "Tambah Sub-Task";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-h-[90vh] max-w-4xl overflow-hidden flex flex-col shadow-2xl animate-scale-up">
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-bold text-[#1A237E]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="subTaskForm" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Sub-Task <span className="text-red-500">*</span></label>
                <textarea
                  required
                  value={formData.namaSubTask || ""}
                  onChange={(e) => setFormData({ ...formData, namaSubTask: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[80px]"
                  placeholder="Detail pekerjaan..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Goals</label>
                <textarea
                  value={formData.goals || ""}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[80px]"
                  placeholder="Target dari pekerjaan ini..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Action Plan</label>
                <textarea
                  value={formData.actionPlan || ""}
                  onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[80px]"
                  placeholder="Rencana aksi..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                <SmoothDropdown
                  options={[
                    { label: "Open", value: "OPEN" },
                    { label: "In Progress", value: "IN_PROGRESS" },
                    { label: "Completed", value: "COMPLETED" },
                  ]}
                  value={formData.status || "OPEN"}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  placeholder="Pilih Status"
                />
              </div>
            </div>

            {/* Tracker Administrasi Side */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-bold text-[#1A237E] mb-4 uppercase tracking-wider flex items-center gap-2">
                Tracker Administrasi
              </h3>
              <div className="space-y-3 relative">
                <div className="absolute left-3 top-2 bottom-4 w-px bg-blue-100 z-0" />
                {trackerSteps.map((step, idx) => {
                  const isFilled = !!formData[step.key];
                  return (
                    <div key={idx} className="relative z-10 flex gap-3">
                      <div className="mt-1">
                        {isFilled ? (
                          <CheckCircle2 className="text-green-500 bg-gray-50" size={24} />
                        ) : (
                          <Circle className="text-gray-300 bg-gray-50" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{step.label}</label>
                        <input
                          type="text"
                          value={formData[step.key] || ""}
                          onChange={(e) => setFormData({ ...formData, [step.key]: e.target.value })}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          placeholder="Keterangan..."
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="relative z-10 flex gap-3 mt-4">
                  <div className="mt-1">
                    {formData.batasPenerbitanKontrak ? (
                      <CheckCircle2 className="text-green-500 bg-gray-50" size={24} />
                    ) : (
                      <Circle className="text-gray-300 bg-gray-50" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Batas Penerbitan Kontrak</label>
                    <SmoothDatePicker
                      value={formData.batasPenerbitanKontrak || ""}
                      onChange={(val) => setFormData({ ...formData, batasPenerbitanKontrak: val })}
                      placeholder="Pilih Tanggal..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="p-4 border-t bg-gray-50 shrink-0 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} label="Batal" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-100" />
          <Button type="submit" form="subTaskForm" label="Simpan Data" />
        </div>
      </div>
    </div>
  );
}
