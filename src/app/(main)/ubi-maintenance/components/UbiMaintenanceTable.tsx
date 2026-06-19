"use client";

import React, { useState } from "react";
import { Eye, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import Badge from "../../../component/ui/Badge";
import Button from "../../../component/ui/Button";

interface UbiMaintenanceTableProps {
  data: any[];
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
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

export default function UbiMaintenanceTable({ data, onView, onEdit, onDelete, currentPage = 1 }: UbiMaintenanceTableProps) {
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
              <th className="px-6 py-5">Total Nominal</th>
              <th className="px-6 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, idx) => {
              // Status Badge Logic
              let statusColor: any = "gray";
              let statusLabel = item.status.replace("_", " ");
              if (item.status === "SELESAI") { statusColor = "green"; statusLabel = "COMPLETED"; }
              else if (item.status === "INISIASI") { statusColor = "blue"; statusLabel = "INITIATION"; }
              else if (item.status === "SEDANG_BERLANGSUNG") { statusColor = "orange"; statusLabel = "IN PROGRESS"; }

              // Dependency Badge Logic
              let depColor: any = "teal";
              if (item.dependency === "OPERASIONAL") depColor = "purple";

              const children: any[] = item.kegiatan || [];
              const isExpanded = expandedRows.has(item.id);
              const totalNominal = children.reduce((sum: number, k: any) => sum + (k.nominalPengajuan || 0), 0);

              // Build summary label from children
              const kegiatanSummary = children.length > 0
                ? children.map((k: any) => k.kegiatan).filter(Boolean).join(", ")
                : "-";
              const siteSummary = [...new Set(children.flatMap((k: any) => (k.site || "").split(",").map((s: string) => s.trim()).filter(Boolean)))].join(", ") || "-";

              return (
                <React.Fragment key={item.id}>
                  {/* Parent Row */}
                  <tr
                    className="hover:bg-gray-50/30 group transition-colors text-black cursor-pointer"
                    onClick={() => children.length > 0 && toggleRow(item.id)}
                  >
                    <td className="px-6 py-5 text-gray-400 text-center font-medium">
                      {(currentPage - 1) * 10 + idx + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {children.length > 0 && (
                          <span className="text-gray-400 transition-transform">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </span>
                        )}
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{kegiatanSummary}</p>
                          <p className="text-[11px] text-gray-400">{siteSummary} · {children.length} kegiatan</p>
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
                      <Badge label={statusLabel} color={statusColor} />
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-800">
                      {formatRupiah(totalNominal || null)}
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
                  {isExpanded && children.map((child: any, cIdx: number) => (
                    <tr key={`child-${child.id || cIdx}`} className="bg-blue-50/30 text-sm">
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3" colSpan={2}>
                        <div className="flex items-center gap-2 pl-6">
                          <span className="text-gray-300">├─</span>
                          <div>
                            <p className="font-semibold text-gray-700">{child.kegiatan}</p>
                            <p className="text-[11px] text-gray-400">{child.site}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{child.sdiPengajuanRm || "-"}</td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{child.progress || "-"}</td>
                      <td className="px-6 py-3 font-semibold text-gray-700">{formatRupiah(child.nominalPengajuan)}</td>
                      <td className="px-6 py-3"></td>
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
