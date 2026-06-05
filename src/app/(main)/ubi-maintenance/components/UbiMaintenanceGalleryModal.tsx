import React from "react";
import { X, FileText } from "lucide-react";
import Image from "next/image";

interface UbiMaintenanceGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: any;
  onPreviewImage: (url: string) => void;
}

export default function UbiMaintenanceGalleryModal({
  isOpen,
  onClose,
  selectedRecord,
  onPreviewImage
}: UbiMaintenanceGalleryModalProps) {
  if (!isOpen || !selectedRecord) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b shrink-0 bg-[#1A237E] text-white">
          <h2 className="text-lg font-black tracking-widest uppercase">Semua Dokumentasi</h2>
          <button onClick={onClose} className="text-white hover:text-red-400 transition-colors p-1 bg-white/10 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedRecord.dokumentasiUrls.map((url: string, index: number) => {
              const isImg = /\.(jpeg|jpg|gif|png|webp|heic)(\?.*)?$/i.test(url);
              return (
                <div key={index} onClick={() => onPreviewImage(url)} className="group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-all shadow-sm hover:shadow-md">
                  {isImg ? (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden relative">
                      <Image 
                        src={url} 
                        alt={`Dokumentasi ${index + 1}`} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                      <FileText size={40} className="mb-2" />
                      <span className="text-xs font-semibold">PDF / Dokumen</span>
                    </div>
                  )}
                  <div className="p-3 text-center bg-white">
                    <p className="text-sm font-semibold text-gray-800">File {index + 1}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
