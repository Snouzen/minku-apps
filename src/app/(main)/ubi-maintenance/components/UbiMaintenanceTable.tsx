"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import Badge from "../../../component/ui/Badge";
import Button from "../../../component/ui/Button";

interface UbiMaintenanceTableProps {
  data: any[];
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
  currentPage?: number;
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

const BadgeDropdown = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setConfig({
        style: {
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          width: 140,
          zIndex: 99999,
        }
      });
    }
  }, [isOpen]);

  const label = value === "SELESAI" ? "COMPLETED" : value === "SEDANG_BERLANGSUNG" ? "IN PROGRESS" : "INITIATION";
  const colorClass = value === "SELESAI" ? "bg-green-100 text-green-700 hover:bg-green-200" : value === "SEDANG_BERLANGSUNG" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200";

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={`flex items-center justify-between px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all min-w-[110px] ${colorClass}`}
      >
        <span>{label}</span>
        <ChevronDown size={14} className={`ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && config && typeof document !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          style={config.style}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] py-1 animate-in fade-in zoom-in-95 duration-200"
        >
          {[
            { v: "INISIASI", l: "INITIATION" },
            { v: "SEDANG_BERLANGSUNG", l: "IN PROGRESS" },
            { v: "SELESAI", l: "COMPLETED" },
          ].map(opt => (
            <button
              key={opt.v}
              onClick={() => { onChange(opt.v); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-gray-50 transition-colors ${value === opt.v ? "text-blue-600 bg-blue-50/50" : "text-gray-600"}`}
            >
              {opt.l}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default function UbiMaintenanceTable({ data, onView, onEdit, onDelete, onStatusChange, currentPage = 1 }: UbiMaintenanceTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50">
            <tr>
              <th className="px-6 py-5 w-16 text-center">No</th>
              <th className="px-6 py-5">Kegiatan</th>
              <th className="px-6 py-5">Vendor</th>
              <th className="px-6 py-5">Dependency</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Nominal Realisasi</th>
              <th className="px-6 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, idx) => {


              // Dependency Badge Logic
              let depColor: any = "teal";
              if (item.dependency === "OPERASIONAL") depColor = "purple";

              const children: any[] = item.kegiatan || [];
              const isExpanded = expandedRows.has(item.id);

              // Build summary label from children
              const kegiatanSummary = children.length > 0
                ? children.map((k: any) => k.kegiatan).filter(Boolean).join(", ")
                : "-";
              const siteSummary = [...new Set(children.flatMap((k: any) => (k.site || "").split(",").map((s: string) => s.trim()).filter(Boolean)))].join(", ") || "-";

              return (
                <React.Fragment key={item.id}>
                  {/* Parent Row */}
                  <tr
                    className={`hover:bg-gray-50/30 group transition-colors text-black ${children.length > 1 ? "cursor-pointer" : ""}`}
                    onClick={() => children.length > 1 && toggleRow(item.id)}
                  >
                    <td className="px-6 py-5 text-gray-400 text-center font-medium">
                      {(currentPage - 1) * 10 + idx + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {children.length > 1 ? (
                          <span className="text-gray-400 transition-transform flex-shrink-0">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </span>
                        ) : (
                          <span className="w-4 flex-shrink-0"></span>
                        )}
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{kegiatanSummary}</p>
                          <p className="text-[11px] text-gray-400">{siteSummary}{children.length > 1 ? ` · ${children.length} kegiatan` : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-sm text-gray-600">{item.vendor?.namaVendor || "-"}</td>
                    <td className="px-6 py-5">
                      {item.dependency ? (
                        <Badge label={item.dependency} color={depColor} />
                      ) : (
                        <span className="text-gray-400 font-bold">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <BadgeDropdown value={item.status} onChange={(val) => onStatusChange && onStatusChange(item.id, val)} />
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-800">
                      {formatRupiah(item.nominalRealisasi || null)}
                    </td>
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-1 transition-all">
                        <Button variant="icon-blue" icon={Eye} title="Lihat Detail & Tracker" onClick={() => onView(item)} />
                        <Button variant="icon-orange" icon={Pencil} title="Edit" onClick={() => onEdit(item)} />
                        <Button variant="icon-red" icon={Trash2} title="Hapus" onClick={() => onDelete(item.id)} />
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Children */}
                  {children.length > 1 && children.map((child: any, cIdx: number) => (
                    <tr key={`child-${child.id || cIdx}`} className="bg-blue-50/30 text-sm">
                      <td className="p-0 border-0">
                        <div className={`transition-all duration-500 ease-out grid ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden">
                            <div className="px-6 py-3"></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-0 border-0" colSpan={2}>
                        <div className={`transition-all duration-500 ease-out grid ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden">
                            <div className="px-6 py-3 flex items-center gap-2 pl-6">
                              <span className="text-gray-300">├─</span>
                              <div>
                                <p className="font-semibold text-gray-700">{child.kegiatan}</p>
                                <p className="text-[11px] text-gray-400">{child.site}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-0 border-0">
                        <div className={`transition-all duration-500 ease-out grid ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden">
                            <div className="px-6 py-3 text-gray-500 text-xs">{child.sdiPengajuanRm || "-"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-0 border-0">
                        <div className={`transition-all duration-500 ease-out grid ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden">
                            <div className="px-6 py-3 text-gray-500 text-xs">{child.progress || "-"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-0 border-0">
                        <div className={`transition-all duration-500 ease-out grid ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden">
                            <div className="px-6 py-3 font-semibold text-gray-700">{formatRupiah(child.nominalPengajuan)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-0 border-0">
                        <div className={`transition-all duration-500 ease-out grid ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden">
                            <div className="px-6 py-3"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
