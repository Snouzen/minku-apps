"use client";

import React from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import SearchInput from "./ui/SearchInput";
import Button from "./ui/Button";

import UbiMaintenanceFormModal from "../(main)/ubi-maintenance/components/UbiMaintenanceFormModal";
import UbiMaintenanceTable from "../(main)/ubi-maintenance/components/UbiMaintenanceTable";
import UbiMaintenanceViewModal from "../(main)/ubi-maintenance/components/UbiMaintenanceViewModal";
import UbiMaintenanceGalleryModal from "../(main)/ubi-maintenance/components/UbiMaintenanceGalleryModal";
import UbiMaintenanceImagePreview from "../(main)/ubi-maintenance/components/UbiMaintenanceImagePreview";
import { useUbiMaintenance } from "../(main)/ubi-maintenance/hooks/useUbiMaintenance";

export const adminSteps = [
  { key: "sdiPengajuanRm", label: "SDI Pengajuan RM" },
  { key: "ndIzinPrinsipGm", label: "ND Izin Prinsip GM" },
  { key: "ndIzinPrinsipDirsar", label: "ND Izin Prinsip Dirsar" },
  { key: "ndIzinPenggunaanRka", label: "ND Izin Peng. RKA" },
  { key: "ndBalasanDivisiUmum", label: "ND Balasan Divisi Umum" },
  { key: "sdiPemberitahuanRm", label: "SDI Pemberitahuan RM" },
  { key: "ndPermohonanPembayaran", label: "ND Permohonan Pembayaran" },
];

export default function UbiMaintenanceClient() {
  const {
    data,
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    unitProduksiOptions,
    vendorOptions,
    filterText,
    setFilterText,
    filterStatus,
    setFilterStatus,
    isModalOpen,
    setIsModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    selectedRecord,
    setSelectedRecord,
    filesToUpload,
    setFilesToUpload,
    isUploading,
    previewImageUrl,
    setPreviewImageUrl,
    isGalleryModalOpen,
    setIsGalleryModalOpen,
    formData,
    setFormData,
    handleSave,
    handleDelete,
    handleEdit,
    handleView,
    initialFormData,
    emptyKegiatanItem,
  } = useUbiMaintenance();

  const totalKegiatan = data?.length || 0;
  const totalInisiasi = data?.filter((d: any) => d.status === 'INISIASI').length || 0;
  const totalSedangBerlangsung = data?.filter((d: any) => d.status === 'SEDANG_BERLANGSUNG').length || 0;
  const totalSelesai = data?.filter((d: any) => d.status === 'SELESAI').length || 0;

  return (
    <div className="space-y-6">
      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setFilterStatus("All")}
          className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-center cursor-pointer transition-all hover:-translate-y-1 ${
            filterStatus === "All" ? "bg-white border-[#1A237E] ring-2 ring-[#1A237E]/20" : "bg-white border-gray-100 hover:border-[#1A237E]/50"
          }`}
        >
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Kegiatan</p>
          <p className="text-3xl font-black text-[#1A237E]">{totalKegiatan}</p>
        </div>
        <div 
          onClick={() => setFilterStatus("INISIASI")}
          className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-center cursor-pointer transition-all hover:-translate-y-1 ${
            filterStatus === "INISIASI" ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20" : "bg-blue-50/50 border-blue-100 hover:border-blue-400"
          }`}
        >
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Initiation</p>
          <p className="text-3xl font-black text-blue-800">{totalInisiasi}</p>
        </div>
        <div 
          onClick={() => setFilterStatus("SEDANG_BERLANGSUNG")}
          className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-center cursor-pointer transition-all hover:-translate-y-1 ${
            filterStatus === "SEDANG_BERLANGSUNG" ? "bg-orange-50 border-orange-500 ring-2 ring-orange-500/20" : "bg-orange-50/50 border-orange-100 hover:border-orange-400"
          }`}
        >
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">In Progress</p>
          <p className="text-3xl font-black text-orange-800">{totalSedangBerlangsung}</p>
        </div>
        <div 
          onClick={() => setFilterStatus("SELESAI")}
          className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-center cursor-pointer transition-all hover:-translate-y-1 ${
            filterStatus === "SELESAI" ? "bg-green-50 border-green-500 ring-2 ring-green-500/20" : "bg-green-50/50 border-green-100 hover:border-green-400"
          }`}
        >
          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Completed</p>
          <p className="text-3xl font-black text-green-800">{totalSelesai}</p>
        </div>
      </div>

      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <SearchInput 
            placeholder="Cari kegiatan atau site..." 
            value={filterText}
            onChange={setFilterText} 
          />
        </div>

        <Button
          onClick={() => {
            setSelectedRecord(null);
            setFilesToUpload([]);
            setFormData({ ...initialFormData, kegiatanItems: [{ ...emptyKegiatanItem }] });
            setIsModalOpen(true);
          }}
          className="w-full lg:w-auto uppercase tracking-wider"
          icon={Plus}
          label="Tambah Data"
        />
      </div>

      {/* TABLE */}
      <div className="flex flex-col gap-4">
        <UbiMaintenanceTable 
          data={paginatedData} 
          onEdit={handleEdit} 
          onView={handleView} 
          onDelete={handleDelete}
          currentPage={currentPage}
        />
        
        {/* PAGINATION UI */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-sm text-gray-500 font-medium">
              Halaman <span className="font-bold text-[#1A237E]">{currentPage}</span> dari <span className="font-bold text-gray-800">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-50 text-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-[#1A237E] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors"
                title="Selanjutnya"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <UbiMaintenanceViewModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedRecord={selectedRecord}
        onPreviewImage={setPreviewImageUrl}
        onOpenGallery={() => setIsGalleryModalOpen(true)}
        adminSteps={adminSteps}
      />

      <UbiMaintenanceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRecord={selectedRecord}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        unitProduksiOptions={unitProduksiOptions}
        vendorOptions={vendorOptions}
        filesToUpload={filesToUpload}
        setFilesToUpload={setFilesToUpload}
        isUploading={isUploading}
        emptyKegiatanItem={emptyKegiatanItem}
      />

      <UbiMaintenanceGalleryModal 
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        selectedRecord={selectedRecord}
        onPreviewImage={setPreviewImageUrl}
      />

      <UbiMaintenanceImagePreview 
        previewImageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
      />

    </div>
  );
}
