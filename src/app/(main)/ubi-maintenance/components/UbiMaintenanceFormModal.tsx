"use client";

import React from "react";
import { X, FileText } from "lucide-react";
import SmoothDropdown from "../../../component/smoothDropdown";
import SmoothDatePicker from "../../../component/smoothDatePicker";
import SmoothAutocomplete from "../../../component/smoothAutocomplete";
import { adminSteps } from "../../../component/ubiMaintenanceClient";

interface UbiMaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: any | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSave: (e: React.FormEvent) => void;
  unitProduksiOptions: { label: string; value: string }[];
  filesToUpload: File[];
  setFilesToUpload: React.Dispatch<React.SetStateAction<File[]>>;
  isUploading: boolean;
}

export default function UbiMaintenanceFormModal({
  isOpen,
  onClose,
  selectedRecord,
  formData,
  setFormData,
  handleSave,
  unitProduksiOptions,
  filesToUpload,
  setFilesToUpload,
  isUploading,
}: UbiMaintenanceFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 bg-[#1A237E] text-white flex justify-between items-center shrink-0">
          <h3 className="font-black uppercase tracking-tight">
            {selectedRecord ? "Edit Data" : "Tambah Data Baru"}
          </h3>
          <X className="cursor-pointer hover:rotate-90 transition-all" onClick={onClose} />
        </div>
        
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6 text-black">
          {/* Seksi 1: Data Utama */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <h4 className="text-xs font-black uppercase text-blue-800 mb-4 tracking-wider">Informasi Utama</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Site</label>
                <SmoothAutocomplete
                  options={unitProduksiOptions}
                  value={formData.site}
                  onChange={(val) => setFormData({ ...formData, site: val })}
                  placeholder="Ketik atau pilih site..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status Pekerjaan</label>
                <SmoothDropdown
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  options={[
                    { value: "INISIASI", label: "Inisiasi" },
                    { value: "SEDANG_BERLANGSUNG", label: "Sedang Berlangsung" },
                    { value: "SELESAI", label: "Selesai" },
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
              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kegiatan</label>
                <input required type="text" className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-blue-400 text-sm" value={formData.kegiatan} onChange={e => setFormData({...formData, kegiatan: e.target.value})} />
              </div>
              
              {formData.status === "SELESAI" && (
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Upload Dokumentasi Pekerjaan (Wajib)</label>
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

              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Progress Administrasi</label>
                <input type="text" placeholder="Contoh: Pemberitahuan ke RM" className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-blue-400 text-sm" value={formData.progress} onChange={e => setFormData({...formData, progress: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Seksi 2: Finansial */}
          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
            <h4 className="text-xs font-black uppercase text-green-800 mb-4 tracking-wider">Finansial (Rp)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pengajuan</label>
                <input type="number" className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-green-400 text-sm" value={formData.nominalPengajuan} onChange={e => setFormData({...formData, nominalPengajuan: e.target.value})} />
              </div>
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

          {/* Seksi 3: Dokumen Administrasi */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-black uppercase text-slate-800 mb-4 tracking-wider">Tracker Nomor Dokumen Administrasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminSteps.map((step) => (
                <div key={step.key} className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{step.label}</label>
                  <input type="text" placeholder="No. Dokumen" className="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-slate-400 text-sm font-mono" value={formData[step.key]} onChange={e => setFormData({...formData, [step.key]: e.target.value})} />
                </div>
              ))}
              <div className="space-y-1 md:col-span-2 mt-2">
                <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Batas Penerbitan Kontrak/SPK</label>
                <SmoothDatePicker
                  value={formData.batasPenerbitanKontrak}
                  onChange={(val) => setFormData({ ...formData, batasPenerbitanKontrak: val })}
                  buttonClassName="w-full p-3 bg-white rounded-xl outline-none border border-gray-200 focus:border-red-400 text-sm"
                />
              </div>
            </div>
          </div>
        </form>
        
        <div className="p-6 border-t shrink-0 flex gap-4 bg-gray-50">
          <button type="button" onClick={onClose} disabled={isUploading} className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-300 transition-all disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSave} disabled={isUploading} className="flex-1 py-4 bg-[#1A237E] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-blue-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengupload & Menyimpan...
              </>
            ) : (
              "Simpan Data"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
