import React from "react";
import { X, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
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
  unitProduksiOptions: {label: string, value: string}[];
}

export default function SubTaskModal({
  isOpen, editMode, onClose, handleSave, formData, setFormData, unitProduksiOptions
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
          <form id="subTaskForm" onSubmit={handleSave} className="flex flex-col gap-6">
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Action Plan <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  <button
                    type="button"
                    onClick={() => {
                      const current = Array.isArray(formData.actionPlan) ? formData.actionPlan : [];
                      setFormData({ ...formData, actionPlan: [...current, { id: Date.now().toString(), text: "", isCompleted: false }] });
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md"
                  >
                    <Plus size={14} /> Tambah Item
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {Array.isArray(formData.actionPlan) && formData.actionPlan.length > 0 ? (
                    formData.actionPlan.map((item: any, index: number) => (
                      <div key={item.id} className="flex items-start gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm relative group">
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = [...formData.actionPlan];
                            newArr[index].isCompleted = !newArr[index].isCompleted;
                            setFormData({ ...formData, actionPlan: newArr });
                          }}
                          className={`mt-1 flex-shrink-0 transition-colors ${item.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                          {item.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>
                        <textarea
                          value={item.text}
                          onChange={(e) => {
                            const newArr = [...formData.actionPlan];
                            newArr[index].text = e.target.value;
                            setFormData({ ...formData, actionPlan: newArr });
                          }}
                          className={`w-full px-2 py-1 text-sm bg-transparent border-none outline-none resize-none min-h-[40px] ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}
                          placeholder="Detail action plan..."
                          rows={2}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = formData.actionPlan.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, actionPlan: newArr });
                          }}
                          className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-300 hover:text-red-500 p-1 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                      <p className="text-sm text-gray-500 mb-2">Belum ada action plan.</p>
                    </div>
                  )}
                </div>
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
