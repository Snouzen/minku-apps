import React from "react";
import { X, Calendar, Building2, DollarSign, Activity, CheckCircle2, Circle, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface UbiMaintenanceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: any;
  onPreviewImage: (url: string) => void;
  onOpenGallery: () => void;
  adminSteps: { key: string; label: string }[];
}

const formatRupiah = (angka: number | null) => {
  if (angka === null || isNaN(angka)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

export default function UbiMaintenanceViewModal({
  isOpen,
  onClose,
  selectedRecord,
  onPreviewImage,
  onOpenGallery,
  adminSteps
}: UbiMaintenanceViewModalProps) {
  if (!isOpen || !selectedRecord) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A237E]/20 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-white max-h-[90vh] flex flex-col">
        <div className="p-6 bg-[#1A237E] text-white flex justify-between items-center shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">
              Detail & Tracker Administrasi
            </p>
            <h3 className="text-xl font-black uppercase italic tracking-tight mt-1">
              {selectedRecord.site}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto text-black flex-1 flex flex-col md:flex-row gap-8">
          {/* Left Column: Details */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-lg font-bold text-[#1A237E] flex items-center gap-2 mb-4 border-b pb-2">
                <Building2 size={20} /> Info Kegiatan
              </h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Deskripsi</p>
                  <p className="font-bold text-gray-800 leading-relaxed">{selectedRecord.kegiatan}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Progress Terakhir</p>
                  <p className="font-bold text-orange-600 bg-orange-50 inline-block px-3 py-1 rounded-lg">
                    {selectedRecord.progress || "Belum ada progress"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Batas Kontrak/SPK</p>
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Calendar size={16} className="text-red-500" />
                    {selectedRecord.batasPenerbitanKontrak ? format(new Date(selectedRecord.batasPenerbitanKontrak), "dd MMM yyyy", { locale: localeId }) : "-"}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vendor Pelaksana</p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 leading-relaxed">
                      {selectedRecord.vendor?.namaVendor || "-"}
                    </p>
                    {selectedRecord.vendor && (
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: 'Informasi Vendor',
                            html: `
                              <div class="text-left space-y-4 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Vendor</p>
                                  <p class="font-bold text-gray-800 text-lg">${selectedRecord.vendor.namaVendor}</p>
                                </div>
                                <div>
                                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">PIC Vendor</p>
                                  <p class="font-bold text-gray-800">${selectedRecord.vendor.picVendor || '-'}</p>
                                </div>
                              </div>
                            `,
                            confirmButtonColor: '#1A237E',
                            confirmButtonText: 'Tutup',
                            customClass: {
                              popup: 'rounded-3xl'
                            }
                          });
                        }}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Info Vendor"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {selectedRecord.dokumentasiUrls && selectedRecord.dokumentasiUrls.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dokumentasi</p>
                    <div className="flex flex-col gap-2">
                      {selectedRecord.dokumentasiUrls.slice(0, 3).map((url: string, index: number) => (
                        <button key={index} onClick={() => onPreviewImage(url)} className="text-left font-semibold text-blue-600 hover:underline text-sm flex items-center gap-2">
                          Lihat File Dokumentasi {index + 1}
                        </button>
                      ))}
                      {selectedRecord.dokumentasiUrls.length > 3 && (
                        <button onClick={onOpenGallery} className="text-left font-semibold text-[#1A237E] hover:underline text-sm flex items-center gap-2 mt-1 px-3 py-1 bg-blue-50 rounded-lg w-fit">
                          + Lihat {selectedRecord.dokumentasiUrls.length - 3} File Lainnya
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-lg font-bold text-[#1A237E] flex items-center gap-2 mb-4 border-b pb-2">
                <DollarSign size={20} /> Informasi Finansial
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500">Nominal Pengajuan</span>
                  <span className="font-black text-gray-800">{formatRupiah(selectedRecord.nominalPengajuan)}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500">Nominal Hasil Evaluasi</span>
                  <span className="font-black text-gray-800">{formatRupiah(selectedRecord.nominalHasilEvaluasi)}</span>
                </div>
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-100">
                  <span className="text-xs font-bold text-green-700">Nominal Realisasi</span>
                  <span className="font-black text-green-800">{formatRupiah(selectedRecord.nominalRealisasi)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tracker Stepper */}
          <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="text-lg font-bold text-[#1A237E] flex items-center gap-2 mb-6">
              <Activity size={20} /> Tracker Administrasi
            </h4>
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {adminSteps.map((step, idx) => {
                const docNumber = selectedRecord[step.key as keyof typeof selectedRecord];
                const isCompleted = !!docNumber;
                return (
                  <div key={step.key} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Status Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                      isCompleted ? "bg-green-500 border-white text-white" : "bg-white border-slate-200 text-slate-300"
                    }`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={10} className="fill-current" />}
                    </div>
                    
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-100 group-hover:-translate-y-1 my-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Tahap {idx + 1}</span>
                        <h5 className={`font-bold text-sm ${isCompleted ? "text-[#1A237E]" : "text-gray-500"}`}>{step.label}</h5>
                        {isCompleted ? (
                          <p className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded mt-1 border border-blue-100 inline-block max-w-full break-all">
                            {docNumber}
                          </p>
                        ) : (
                          <p className="text-[10px] text-gray-400 italic mt-1">Belum ada dokumen</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t shrink-0 flex justify-end bg-gray-50">
          <button onClick={onClose} className="px-8 py-3 bg-[#1A237E] text-white rounded-xl font-bold hover:bg-blue-900 transition-colors shadow-lg text-sm uppercase tracking-widest">
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
}
