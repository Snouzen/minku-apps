"use client";

import React from "react";
import { ArrowLeft, Plus, CheckCircle2, Circle, Pencil, Trash2, CalendarDays, Flag, Clock, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "../../../../../component/ui/Button";
import SmoothDropdown from "../../../../../component/smoothDropdown";
import CommentDrawer from "../../../../../component/CommentDrawer";
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
    unitProduksiOptions,
    openAddSubTask,
    openEditSubTask,
    handleSave,
    handleDelete,
    toggleActionPlanItem,
    handleUpdateAdministrasi
  } = useTaskDetail(taskId);

  const [filterUnitProduksi, setFilterUnitProduksi] = React.useState<string>("ALL");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerConfig, setDrawerConfig] = React.useState({ subTaskId: 0, section: "", sectionTitle: "" });

  const searchParams = useSearchParams();
  const openedUrlRef = React.useRef<string>("");

  const [editingAdmin, setEditingAdmin] = React.useState<{subId: number, key: string} | null>(null);
  const [adminInputValue, setAdminInputValue] = React.useState("");
  const [adminLinkValue, setAdminLinkValue] = React.useState("");

  React.useEffect(() => {
    // Only proceed if taskData is fully loaded
    if (!taskData) return;

    const shouldOpen = searchParams.get('openComment') === 'true';

    if (shouldOpen) {
      setDrawerConfig({
        subTaskId: Number(searchParams.get('subTaskId')),
        section: searchParams.get('section') || '',
        sectionTitle: searchParams.get('title') || ''
      });
      setDrawerOpen(true);

      // Clean the URL so it doesn't reopen if taskData updates
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('openComment');
      newUrl.searchParams.delete('subTaskId');
      newUrl.searchParams.delete('section');
      newUrl.searchParams.delete('title');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, taskData]);

  const openComments = (subTaskId: number, section: string, sectionTitle: string) => {
    setDrawerConfig({ subTaskId, section, sectionTitle });
    setDrawerOpen(true);
  };

  const availableUnits = React.useMemo(() => {
    if (!taskData) return [];
    const unitsMap = new Map();
    let hasUnassigned = false;
    taskData.subTasks.forEach((sub: any) => {
      if (sub.unitProduksi) {
        unitsMap.set(sub.unitProduksiId, sub.unitProduksi.siteArea);
      } else {
        hasUnassigned = true;
      }
    });
    const units = Array.from(unitsMap.entries()).map(([value, label]) => ({ value, label }));
    if (hasUnassigned) {
      units.push({ value: "UNASSIGNED", label: "Belum Ada Site" });
    }
    return units;
  }, [taskData]);

  const filteredSubTasks = React.useMemo(() => {
    if (!taskData) return [];
    if (filterUnitProduksi === "ALL") return taskData.subTasks;
    if (filterUnitProduksi === "UNASSIGNED") return taskData.subTasks.filter((sub: any) => !sub.unitProduksiId);
    return taskData.subTasks.filter((sub: any) => sub.unitProduksiId === filterUnitProduksi);
  }, [taskData, filterUnitProduksi]);

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

  const submitAdminEdit = async (subId: number, key: string) => {
    const success = await handleUpdateAdministrasi(subId, key, adminInputValue, adminLinkValue);
    if (success) {
      setEditingAdmin(null);
      setAdminLinkValue("");
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
              {filterUnitProduksi !== "ALL" && filterUnitProduksi !== "UNASSIGNED" && (
                <span className="text-blue-500 ml-2">
                  {availableUnits.find((u: any) => u.value === filterUnitProduksi)?.label}
                </span>
              )}
            </h1>
          </div>
          <div className="shrink-0">
            <Button onClick={openAddSubTask} icon={Plus} label="Tambah Sub-Task" className="bg-[#1A237E] hover:bg-blue-900 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold" />
          </div>
        </div>
      </div>

      {/* Sub-Tasks Content */}
      <div className="space-y-6">
        {availableUnits.length > 0 && (
          <div className="w-64 mb-6">
            <SmoothDropdown
              options={[{ value: "ALL", label: "Semua Site Area" }, ...availableUnits]}
              value={filterUnitProduksi}
              onChange={(val) => setFilterUnitProduksi(val)}
              placeholder="Pilih Site Area"
              buttonClassName="bg-white shadow-sm border border-gray-200 hover:border-blue-300 px-4 py-2.5 rounded-xl font-semibold"
            />
          </div>
        )}
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

        {filteredSubTasks.map((sub: any, index: number) => {
          const statusStyle = getStatusStyle(sub.status);
          return (
            <div 
              key={`${sub.id}-${filterUnitProduksi}`} 
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditSubTask(sub)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm bg-white border border-gray-100"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(sub.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm bg-white border border-gray-100"><Trash2 size={16} /></button>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider flex items-center gap-1.5 w-fit border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {statusStyle.icon} {sub.status}
                    </span>
                    {sub.unitProduksi && (
                      <span className="text-xs font-semibold text-gray-500 mt-1">
                        📍 {sub.unitProduksi.siteArea}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title and Descriptions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 whitespace-pre-wrap">{sub.namaSubTask}</h2>
                      {sub.createdBy && (
                        <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mt-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold">
                            {sub.createdBy.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                          Dibuat oleh: <span className="text-gray-800 font-semibold">{sub.createdBy.picName || sub.createdBy.name}</span>
                        </div>
                      )}
                    </div>
                    {sub.goals && (
                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-bold text-orange-800 uppercase tracking-wider">Goals</div>
                          <button 
                            onClick={() => openComments(sub.id, "GOALS", `Goals - ${sub.namaSubTask}`)}
                            className="text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md transition-colors"
                          >
                            <MessageSquare size={14} /> Diskusi
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{sub.goals}</p>
                      </div>
                    )}
                    
                    {sub.actionPlan && (
                      <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">Action Plan</div>
                          <button 
                            onClick={() => openComments(sub.id, "ACTION_PLAN", `Action Plan - ${sub.namaSubTask}`)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md transition-colors"
                          >
                            <MessageSquare size={14} /> Diskusi
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(() => {
                            let parsed = [];
                            try {
                              parsed = JSON.parse(sub.actionPlan);
                              if (!Array.isArray(parsed)) throw new Error("Not array");
                            } catch {
                              // Legacy text support
                              return <p className="text-sm text-gray-700 whitespace-pre-wrap">{sub.actionPlan}</p>;
                            }

                            if (parsed.length === 0) {
                              return <p className="text-sm text-gray-400 italic">Belum ada action plan</p>;
                            }

                            return parsed.map((item: any) => (
                              <div key={item.id} className="flex items-start gap-2.5 group/item">
                                <button
                                  onClick={() => toggleActionPlanItem(sub.id, item.id)}
                                  className={`mt-0.5 shrink-0 transition-colors ${item.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                  {item.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                </button>
                                <span className={`text-sm transition-all ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                  {item.text}
                                </span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Administration Tracker Section */}
                  <div className="lg:col-span-7 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-bold text-[#1A237E] flex items-center gap-2 uppercase tracking-wider">
                        <CalendarDays size={16} /> Progress Administrasi
                      </h3>
                      <button 
                        onClick={() => openComments(sub.id, "PROGRESS_ADMIN", `Progress Admin - ${sub.namaSubTask}`)}
                        className="text-xs font-bold text-[#1A237E] hover:text-blue-800 flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-200 transition-colors shadow-sm"
                      >
                        <MessageSquare size={14} /> Diskusi
                      </button>
                    </div>
                    
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
                              <div className="flex-1 pb-1 group/step">
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-bold ${isFilled ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                  </div>
                                  {!editingAdmin && (
                                    <button
                                      onClick={() => {
                                        setEditingAdmin({ subId: sub.id, key: step.key });
                                        setAdminInputValue(val || "");
                                        setAdminLinkValue(sub[step.key + "Link"] || "");
                                      }}
                                      className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                      title="Edit Nomor/Kode"
                                    >
                                      <Pencil size={14} />
                                    </button>
                                  )}
                                </div>
                                
                                {editingAdmin?.subId === sub.id && editingAdmin?.key === step.key ? (
                                  <div className="mt-2 space-y-2">
                                    <input
                                      type="text"
                                      value={adminInputValue}
                                      onChange={(e) => setAdminInputValue(e.target.value)}
                                      placeholder="Nomor Surat/Dokumen..."
                                      className="w-full text-sm border border-blue-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder:text-gray-400"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') setEditingAdmin(null);
                                      }}
                                    />
                                    <div className="flex items-center gap-2">
                                      <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
                                      <input
                                        type="url"
                                        value={adminLinkValue}
                                        onChange={(e) => setAdminLinkValue(e.target.value)}
                                        placeholder="Link dokumen (opsional)..."
                                        className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder:text-gray-400"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') submitAdminEdit(sub.id, step.key);
                                          if (e.key === 'Escape') setEditingAdmin(null);
                                        }}
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => submitAdminEdit(sub.id, step.key)}
                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 font-medium"
                                      >
                                        Simpan
                                      </button>
                                      <button 
                                        onClick={() => { setEditingAdmin(null); setAdminLinkValue(""); }}
                                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200 font-medium"
                                      >
                                        Batal
                                      </button>
                                    </div>
                                  </div>
                                ) : isFilled ? (
                                  sub[step.key + "Link"] ? (
                                    <a
                                      href={sub[step.key + "Link"]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 mt-1 bg-white px-3 py-2 rounded-lg border border-blue-100 inline-flex items-center gap-1.5 shadow-sm hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                      {val}
                                      <ExternalLink size={12} className="flex-shrink-0" />
                                    </a>
                                  ) : (
                                    <div className="text-sm text-gray-600 mt-1 bg-white px-3 py-2 rounded-lg border border-gray-100 inline-block shadow-sm">
                                      {val}
                                    </div>
                                  )
                                ) : null}
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
                          <div className="flex-1 group/step pb-1">
                            <div className="flex items-center justify-between">
                              <div className={`text-sm font-bold ${sub.batasPenerbitanKontrak ? 'text-indigo-900' : 'text-gray-400'}`}>
                                Batas Penerbitan Kontrak
                              </div>
                              {!editingAdmin && (
                                <button
                                  onClick={() => {
                                    setEditingAdmin({ subId: sub.id, key: "batasPenerbitanKontrak" });
                                    setAdminInputValue(sub.batasPenerbitanKontrak ? new Date(sub.batasPenerbitanKontrak).toISOString().split('T')[0] : "");
                                    setAdminLinkValue(sub.batasPenerbitanKontrakLink || "");
                                  }}
                                  className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                  title="Set Tanggal Batas Kontrak"
                                >
                                  <Pencil size={14} />
                                </button>
                              )}
                            </div>
                            
                            {editingAdmin?.subId === sub.id && editingAdmin?.key === "batasPenerbitanKontrak" ? (
                              <div className="mt-2 space-y-2">
                                <input
                                  type="date"
                                  value={adminInputValue}
                                  onChange={(e) => setAdminInputValue(e.target.value)}
                                  className="w-full text-sm border border-blue-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder:text-gray-400"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') setEditingAdmin(null);
                                  }}
                                />
                                <div className="flex items-center gap-2">
                                  <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
                                  <input
                                    type="url"
                                    value={adminLinkValue}
                                    onChange={(e) => setAdminLinkValue(e.target.value)}
                                    placeholder="Link dokumen (opsional)..."
                                    className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder:text-gray-400"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') submitAdminEdit(sub.id, "batasPenerbitanKontrak");
                                      if (e.key === 'Escape') setEditingAdmin(null);
                                    }}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => submitAdminEdit(sub.id, "batasPenerbitanKontrak")}
                                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 font-medium"
                                  >
                                    Simpan
                                  </button>
                                  <button 
                                    onClick={() => { setEditingAdmin(null); setAdminLinkValue(""); }}
                                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200 font-medium"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : sub.batasPenerbitanKontrak ? (
                              sub.batasPenerbitanKontrakLink ? (
                                <a
                                  href={sub.batasPenerbitanKontrakLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-700 font-semibold mt-1 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 inline-flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer"
                                >
                                  {new Date(sub.batasPenerbitanKontrak).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  <ExternalLink size={12} className="flex-shrink-0" />
                                </a>
                              ) : (
                                <div className="text-sm text-indigo-700 font-semibold mt-1 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 inline-block">
                                  {new Date(sub.batasPenerbitanKontrak).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                              )
                            ) : null}
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
        unitProduksiOptions={unitProduksiOptions}
      />
        
      <CommentDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        subTaskId={drawerConfig.subTaskId}
        section={drawerConfig.section}
        sectionTitle={drawerConfig.sectionTitle}
      />
    </div>
  );
}
