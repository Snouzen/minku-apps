import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "../../../component/ui/Badge";
import Button from "../../../component/ui/Button";

interface UbiMaintenanceTableProps {
  data: any[];
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
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

export default function UbiMaintenanceTable({ data, onView, onEdit, onDelete }: UbiMaintenanceTableProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50">
            <tr>
              <th className="px-6 py-5 w-16 text-center">No</th>
              <th className="px-6 py-5">Site</th>
              <th className="px-6 py-5 max-w-xs">Kegiatan</th>
              <th className="px-6 py-5">Dependency</th>
              <th className="px-6 py-5">Progress</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Nominal Pengajuan</th>
              <th className="px-6 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, idx) => {
              // Status Badge Logic
              let statusColor: any = "gray";
              let statusLabel = item.status.replace("_", " ");
              if (item.status === "SELESAI") statusColor = "green";
              else if (item.status === "INISIASI") statusColor = "blue";
              else if (item.status === "SEDANG_BERLANGSUNG") statusColor = "orange";

              // Dependency Badge Logic
              let depColor: any = "teal";
              if (item.dependency === "OPERASIONAL") depColor = "purple";

              return (
                <tr key={item.id} className="hover:bg-gray-50/30 group transition-colors text-black">
                  <td className="px-6 py-5 text-gray-400 text-center font-medium">{idx + 1}</td>
                  <td className="px-6 py-5 font-bold text-gray-700">{item.site}</td>
                  <td className="px-6 py-5 font-medium max-w-xs text-sm">{item.kegiatan}</td>
                  <td className="px-6 py-5">
                    {item.dependency ? (
                      <Badge label={item.dependency} color={depColor} />
                    ) : (
                      <span className="text-gray-400 font-bold">-</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600">{item.progress || "-"}</td>
                  <td className="px-6 py-5">
                    <Badge label={statusLabel} color={statusColor} />
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-800">
                    {formatRupiah(item.nominalPengajuan)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-1 group-hover:opacity-100 transition-all">
                      <Button variant="icon-blue" icon={Eye} title="Lihat Detail & Tracker" onClick={() => onView(item)} />
                      <Button variant="icon-orange" icon={Pencil} title="Edit" onClick={() => onEdit(item)} />
                      <Button variant="icon-red" icon={Trash2} title="Hapus" onClick={() => onDelete(item.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
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
