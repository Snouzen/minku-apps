/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import SmoothDropdown from "../../../component/smoothDropdown";
import SmoothDatePicker from "../../../component/smoothDatePicker";
import SmoothAutocomplete from "../../../component/smoothAutocomplete";
import SmoothMultiAutocomplete from "../../../component/smoothMultiAutocomplete";
import { adminSteps } from "../../../component/ubiMaintenanceClient";
import type { KegiatanItem } from "../hooks/useUbiMaintenance";

interface UbiMaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: any | null;
  formData: any;
  setFormData: (val: any) => void;
  handleSave: (e: React.FormEvent) => void;
  unitProduksiOptions: { label: string; value: string }[];
  vendorOptions: { label: string; value: string }[];
  filesToUpload: File[];
  setFilesToUpload: React.Dispatch<React.SetStateAction<File[]>>;
  isUploading: boolean;
  emptyKegiatanItem: KegiatanItem;
}

const STEP_LABELS = ["Info Administrasi", "Daftar Kegiatan", "Finansial & Dokumen"];

export default function UbiMaintenanceFormModal({
  isOpen,
  onClose,
  selectedRecord,
  formData,
  setFormData,
  handleSave,
  unitProduksiOptions,
  vendorOptions,
  filesToUpload,
  setFilesToUpload,
  isUploading,
  emptyKegiatanItem,
}: UbiMaintenanceFormModalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const kegiatanItems: KegiatanItem[] = formData.kegiatanItems || [{ ...emptyKegiatanItem }];

  const updateKegiatanItem = (index: number, field: keyof KegiatanItem, value: string) => {
    const updated = [...kegiatanItems];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, kegiatanItems: updated });
  };

  const addKegiatanItem = () => {
    setFormData({ ...formData, kegiatanItems: [...kegiatanItems, { ...emptyKegiatanItem }] });
  };

  const removeKegiatanItem = (index: number) => {
    if (kegiatanItems.length <= 1) return;
    const updated = kegiatanItems.filter((_, i) => i !== index);
    setFormData({ ...formData, kegiatanItems: updated });
  };

  const canGoNext = () => {
    if (step === 0) return true;
    if (step === 1) return kegiatanItems.some((k) => k.kegiatan.trim() && k.site.trim());
    return true;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#1A237E] text-white flex justify-between items-center shrink-0">
          <h3 className="font-black uppercase tracking-tight">
            {selectedRecord ? "Edit Data" : "Tambah Data Baru"}
          </h3>
          <X className="cursor-pointer hover:rotate-90 transition-all" onClick={onClose} />
        </div>

        {/* Step Indicator */}
        <div className="px-8 pt-6 pb-2 flex items-center gap-2 shrink-0">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                  i === step
                    ? "bg-[#1A237E] text-white shadow-lg scale-110"
                    : i < step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </button>
              <span className={`text-[10px] font-black uppercase tracking-wider hidden md:block ${i === step ? "text-[#1A237E]" : "text-gray-400"}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 rounded mx-1" />}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6 text-black">
          {/* STEP 1: Info Administrasi */}
          {step === 0 && (
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-4">
              <h4 className="text-xs font-black uppercase text-blue-800 tracking-wider">Info Administrasi</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status Pekerjaan</label>
                  <SmoothDropdown
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    options={[
                      { value: "INISIASI", label: "Initiation" },
                      { value: "SEDANG_BERLANGSUNG", label: "In Progress" },
                      { value: "SELESAI", label: "Completed" },
                    ]}
                    buttonClassName="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-blue-400 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Dependency</label>
                  <SmoothDropdown
                    value={formData.dependency || "MINKU"}
                    onChange={(val) => setFormData({ ...formData, dependency: val })}
                    options={[
                      { value: "MINKU", label: "Minku" },
                      { value: "OPERASIONAL", label: "Operasional" },
                    ]}
                    buttonClassName="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-blue-400 text-sm"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Vendor</label>
                  <SmoothAutocomplete
                    options={vendorOptions}
                    value={formData.vendorId || ""}
                    onChange={(val) => setFormData({ ...formData, vendorId: val })}
                    placeholder="Pilih vendor..."
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Batas Penerbitan Kontrak/SPK</label>
                  <SmoothDatePicker
                    value={formData.batasPenerbitanKontrak}
                    onChange={(val) => setFormData({ ...formData, batasPenerbitanKontrak: val })}
                    buttonClassName="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-red-400 text-sm"
                  />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Tanggal Kontrak</label>
                  <SmoothDatePicker
                    value={formData.tanggalKontrak}
                    onChange={(val) => setFormData({ ...formData, tanggalKontrak: val })}
                    buttonClassName="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-blue-400 text-sm"
                  />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <label className="text-[10px] font-black text-green-500 uppercase tracking-widest ml-1">Tanggal Selesai</label>
                  <SmoothDatePicker
                    value={formData.tanggalSelesai}
                    onChange={(val) => setFormData({ ...formData, tanggalSelesai: val })}
                    buttonClassName="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-green-400 text-sm"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Sumber Anggaran</label>
                  <SmoothDropdown
                    value={formData.sumberAnggaran || ""}
                    onChange={(val) => setFormData({ ...formData, sumberAnggaran: val })}
                    options={[
                      { value: "", label: "Pilih Sumber Anggaran" },
                      { value: "DIVISI_UMUM", label: "Divisi Umum" },
                      { value: "DIVISI_TI", label: "Divisi TI" },
                      { value: "UBI_INDUSTRI", label: "UBI Industri" },
                    ]}
                    buttonClassName="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-blue-400 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Daftar Kegiatan */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-orange-800 tracking-wider">Daftar Kegiatan ({kegiatanItems.length})</h4>
                <button
                  type="button"
                  onClick={addKegiatanItem}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-white bg-[#1A237E] hover:bg-blue-900 px-4 py-2 rounded-xl transition-all"
                >
                  <Plus size={14} /> Tambah Kegiatan
                </button>
              </div>

              {kegiatanItems.map((item: KegiatanItem, idx: number) => (
                <div key={idx} className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">Kegiatan #{idx + 1}</span>
                    {kegiatanItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKegiatanItem(idx)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Hapus kegiatan"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Kegiatan</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-orange-400 text-sm"
                        value={item.kegiatan}
                        onChange={(e) => updateKegiatanItem(idx, "kegiatan", e.target.value)}
                        placeholder="Contoh: Perbaikan Atap Kantor"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Site (Multiple)</label>
                      <SmoothMultiAutocomplete
                        options={unitProduksiOptions}
                        value={item.site}
                        onChange={(val) => updateKegiatanItem(idx, "site", val)}
                        placeholder="Ketik atau pilih site..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nominal Pengajuan (Rp)</label>
                      <input
                        type="number"
                        className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-orange-400 text-sm"
                        value={item.nominalPengajuan}
                        onChange={(e) => updateKegiatanItem(idx, "nominalPengajuan", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">SDI Pengajuan RM</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-orange-400 text-sm font-mono"
                        value={item.sdiPengajuanRm}
                        onChange={(e) => updateKegiatanItem(idx, "sdiPengajuanRm", e.target.value)}
                        placeholder="No. Dokumen"
                      />
                      <input
                        type="text"
                        className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-orange-400 text-sm mt-2"
                        value={item.sdiPengajuanRmUrl}
                        onChange={(e) => updateKegiatanItem(idx, "sdiPengajuanRmUrl", e.target.value)}
                        placeholder="Link Dokumen URL"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Progress</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-orange-400 text-sm"
                        value={item.progress}
                        onChange={(e) => updateKegiatanItem(idx, "progress", e.target.value)}
                        placeholder="Contoh: Pemberitahuan ke RM"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Finansial & Dokumen Administrasi */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Finansial */}
              <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                <h4 className="text-xs font-black uppercase text-green-800 mb-4 tracking-wider">Finansial (Rp)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hasil Evaluasi</label>
                    <input type="number" className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-green-400 text-sm" value={formData.nominalHasilEvaluasi} onChange={e => setFormData({...formData, nominalHasilEvaluasi: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Realisasi</label>
                    <input type="number" className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-green-400 text-sm" value={formData.nominalRealisasi} onChange={e => setFormData({...formData, nominalRealisasi: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Tracker Administrasi */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-black uppercase text-slate-800 mb-4 tracking-wider">Tracker Nomor Dokumen Administrasi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminSteps.filter(s => s.key !== "sdiPengajuanRm").map((step) => (
                    <div key={step.key} className="space-y-2 bg-white p-3 border border-gray-100 rounded-xl">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{step.label}</label>
                      <input type="text" placeholder="No. Dokumen" className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-gray-200 focus:border-slate-400 text-sm font-mono" value={formData[step.key]} onChange={e => setFormData({...formData, [step.key]: e.target.value})} />
                      <input type="text" placeholder="Link Dokumen URL" className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-gray-200 focus:border-slate-400 text-sm" value={formData[`${step.key}Url`]} onChange={e => setFormData({...formData, [`${step.key}Url`]: e.target.value})} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Dokumentasi */}
              {formData.status === "SELESAI" && (
                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100">
                  <h4 className="text-xs font-black uppercase text-red-800 mb-4 tracking-wider">Upload Dokumentasi Pekerjaan</h4>
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    className="w-full p-2 bg-white rounded-xl outline-none border border-red-200 focus:border-red-400 text-sm"
                    onChange={(e) => setFilesToUpload(Array.from(e.target.files || []))}
                  />
                  <div className="flex flex-wrap gap-3 mt-3">
                    {formData.dokumentasiUrls?.map((url: string, idx: number) => {
                      const isImg = /\.(jpeg|jpg|gif|png|webp|heic)(\?.*)?$/i.test(url);
                      return (
                        <div key={`existing-${idx}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group bg-gray-50">
                          {isImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FileText size={20} />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const newUrls = [...formData.dokumentasiUrls];
                              newUrls.splice(idx, 1);
                              setFormData({ ...formData, dokumentasiUrls: newUrls });
                            }}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            title="Hapus Dokumen"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                    {filesToUpload.map((file: File, idx: number) => {
                      const isImg = file.type.startsWith('image/');
                      return (
                        <div key={`new-${idx}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-blue-200 group bg-blue-50" title="File Baru (Belum Disimpan)">
                          {isImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={URL.createObjectURL(file)} alt="To upload" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-400">
                              <FileText size={20} />
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-blue-500 text-white text-[8px] font-bold text-center leading-none py-1">BARU</div>
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = [...filesToUpload];
                              newFiles.splice(idx, 1);
                              setFilesToUpload(newFiles);
                            }}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            title="Batal Upload"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer Navigation */}
        <div className="p-6 border-t shrink-0 flex gap-4 bg-gray-50">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={isUploading}
              className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ChevronLeft size={16} /> Kembali
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-300 transition-all disabled:opacity-50"
            >
              Batal
            </button>
          )}

          {step < STEP_LABELS.length - 1 ? (
            <button
              type="button"
              onClick={() => canGoNext() && setStep(step + 1)}
              className="flex-1 py-4 bg-[#1A237E] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
            >
              Lanjut <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="flex-1 py-4 bg-[#1A237E] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-blue-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "Simpan Data"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
