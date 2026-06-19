"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../../../component/ui/Button";

export default function VendorTable({
  data,
  loading,
  openEdit,
  handleDelete,
}: {
  data: any[];
  loading: boolean;
  openEdit: (item: any) => void;
  handleDelete: (id: number) => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/40">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/40">
        <p className="text-gray-500 font-medium">Belum ada data Vendor</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50">
            <tr>
              <th className="px-6 py-5 w-16 text-center">No</th>
              <th className="px-6 py-5">Nama Vendor</th>
              <th className="px-6 py-5">PIC Vendor</th>
              <th className="px-6 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, idx) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/30 group transition-colors text-black"
              >
                <td className="px-6 py-5 text-gray-400 text-center font-medium">{idx + 1}</td>
                <td className="px-6 py-5 font-bold text-gray-700">{item.namaVendor}</td>
                <td className="px-6 py-5 text-gray-600 font-medium">{item.picVendor || "-"}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-1 transition-all">
                    <Button variant="icon-orange" icon={Pencil} title="Edit" onClick={() => openEdit(item)} />
                    <Button variant="icon-red" icon={Trash2} title="Hapus" onClick={() => handleDelete(item.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
