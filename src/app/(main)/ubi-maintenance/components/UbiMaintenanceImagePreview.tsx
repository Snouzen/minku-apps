import React from "react";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";

interface UbiMaintenanceImagePreviewProps {
  previewImageUrl: string | null;
  onClose: () => void;
}

export default function UbiMaintenanceImagePreview({ previewImageUrl, onClose }: UbiMaintenanceImagePreviewProps) {
  if (!previewImageUrl) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center animate-scale-up" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 right-0 p-4 z-10 flex gap-2">
          <a href={previewImageUrl} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg">
            <ExternalLink size={24} />
          </a>
          <button onClick={onClose} className="bg-red-500/80 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg">
            <X size={24} />
          </button>
        </div>
        <div className="w-full h-full p-4 md:p-8 flex items-center justify-center bg-transparent rounded-2xl overflow-hidden relative">
          {/\.(jpeg|jpg|gif|png|webp|heic)(\?.*)?$/i.test(previewImageUrl) ? (
            <div className="relative w-full h-full">
              <Image 
                src={previewImageUrl} 
                alt="Preview" 
                fill
                className="object-contain rounded-lg shadow-2xl"
                sizes="100vw"
              />
            </div>
          ) : (
            <iframe src={previewImageUrl} className="w-full h-full bg-white rounded-lg shadow-2xl" title="Dokumen Preview" />
          )}
        </div>
      </div>
    </div>
  );
}
