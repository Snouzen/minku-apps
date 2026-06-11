"use client";

import React from "react";
import { ArrowLeft, Plus, CheckCircle2, Circle, Pencil, Trash2, CalendarDays, Flag, Clock } from "lucide-react";
import Link from "next/link";
import Button from "../../../../../component/ui/Button";
import { useTaskDetail } from "../hooks/useTaskDetail";
import SubTaskModal from "./SubTaskModal";

export default function TaskDetailClient({ taskId }: { taskId: number }) {
  const {
    taskData,
    loading,
    modalOpen,
    setModalOpen,
    editMode,
    formData,
    setFormData,
    openAddSubTask,
    openEditSubTask,
    handleSave,
    handleDelete
  } = useTaskDetail(taskId);

  if (loading) return <div className="text-center py-20 text-gray-500 font-semibold animate-pulse">Memuat detail task...</div>;
  if (!taskData) return <div className="text-center py-20 text-red-500 font-semibold">Data Task tidak ditemukan.</div>;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN": return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", icon: <Circle size={14} /> };
      case "IN_PROGRESS": return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: <Clock size={14} /> };
      case "COMPLETED": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: <CheckCircle2 size={14} /> };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", icon: <Circle size={14} /> };
    }
  };

  const trackerSteps = [
    { key: "sdiPengajuanRm", label: "SDI Pengajuan RM" },
    { key: "ndIzinPrinsipGm", label: "ND Izin Prinsip GM" },
    { key: "ndIzinPrinsipDirsar", label: "ND Izin Prinsip Dirsar" },
    { key: "ndIzinPenggunaanRka", label: "ND Izin Penggunaan RKA" },
    { key: "ndBalasanDivisiUmum", label: "ND Balasan Divisi Umum" },
    { key: "sdiPemberitahuanRm", label: "SDI Pemberitahuan RM" },
    { key: "ndPermohonanPembayaran", label: "ND Permohonan Pembayaran" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/matrix-it" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1A237E] transition-colors mb-4 bg-gray-50 px-3 py-1.5 rounded-lg">
              <ArrowLeft size={16} /> Kembali ke Daftar Task
            </Link>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Flag size={14} /> {taskData.kegiatan?.namaKegiatan}
            </div>
            <h1 className="text-3xl font-extrabold text-[#1A237E] leading-tight">
              {taskData.namaTask}
            </h1>
          </div>
          <div className="shrink-0">
            <Button onClick={openAddSubTask} icon={Plus} label="Tambah Sub-Task" className="bg-[#1A237E] hover:bg-blue-900 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold" />
          </div>
        </div>
      </div>

      {/* Sub-Tasks Content */}
      <div className="space-y-6">
        {taskData.subTasks.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Sub-Task</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Tambahkan sub-task untuk mulai merinci pekerjaan dan memonitor status administrasinya.</p>
            <Button onClick={openAddSubTask} label="Tambah Sub-Task Pertama" variant="outline" />
          </div>
        )}

        {taskData.subTasks.map((sub: any, index: number) => {
          const statusStyle = getStatusStyle(sub.status);
          return (
            <div key={sub.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative">
              
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditSubTask(sub)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm bg-white border border-gray-100"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(sub.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm bg-white border border-gray-100"><Trash2 size={16} /></button>
              </div>

              <div className="p-6 md:p-8">
                {/* Status Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    {statusStyle.icon} {sub.status.replace("_", " ")}
                  </span>
                </div>

                {/* Title and Descriptions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-5 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 whitespace-pre-wrap">{sub.namaSubTask}</h2>
                    
                    {sub.goals && (
                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <div className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">Goals</div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{sub.goals}</p>
                      </div>
                    )}
                    
                    {sub.actionPlan && (
                      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                        <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Action Plan</div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{sub.actionPlan}</p>
                      </div>
                    )}
                  </div>

                  {/* Tracker Administration Horizontal Timeline */}
                  <div className="lg:col-span-7 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-[#1A237E] uppercase tracking-wider mb-6 flex items-center gap-2">
                      <CalendarDays size={16} /> Progress Administrasi
                    </h3>
                    
                    <div className="relative">
                      {/* Vertical line connecting timeline items */}
                      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                      
                      <div className="space-y-4">
                        {trackerSteps.map((step, idx) => {
                          const val = sub[step.key];
                          const isFilled = !!val;
                          return (
                            <div key={idx} className="relative flex items-start gap-4">
                              <div className="relative z-10 flex-shrink-0 mt-0.5">
                                {isFilled ? (
                                  <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white ring-4 ring-gray-50">
                                    <CheckCircle2 size={16} />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-white ring-4 ring-gray-50">
                                    <Circle size={16} className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 pb-1">
                                <div className={`text-sm font-bold ${isFilled ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {step.label}
                                </div>
                                {isFilled && (
                                  <div className="text-sm text-gray-600 mt-1 bg-white px-3 py-2 rounded-lg border border-gray-100 inline-block shadow-sm">
                                    {val}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Batas Kontrak */}
                        <div className="relative flex items-start gap-4 pt-2">
                          <div className="relative z-10 flex-shrink-0 mt-0.5">
                            {sub.batasPenerbitanKontrak ? (
                              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white ring-4 ring-gray-50 shadow-md">
                                <CheckCircle2 size={16} />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-white ring-4 ring-gray-50">
                                <Circle size={16} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-bold ${sub.batasPenerbitanKontrak ? 'text-indigo-900' : 'text-gray-400'}`}>
                              Batas Penerbitan Kontrak
                            </div>
                            {sub.batasPenerbitanKontrak && (
                              <div className="text-sm text-indigo-700 font-semibold mt-1 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 inline-block">
                                {new Date(sub.batasPenerbitanKontrak).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SubTaskModal 
        isOpen={modalOpen}
        editMode={editMode}
        onClose={() => setModalOpen(false)}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
