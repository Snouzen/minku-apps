"use client";

import React from "react";
import { Plus } from "lucide-react";
import SmoothDropdown from "./smoothDropdown";
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
    handleView
  } = useUbiMaintenance();

  return (
    <div className="space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <SearchInput 
            placeholder="Cari kegiatan atau site..." 
            value={filterText}
            onChange={setFilterText} 
          />
          <div className="min-w-[160px]">
            <SmoothDropdown
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: "All", label: "Semua Status" },
                { value: "INISIASI", label: "Inisiasi" },
                { value: "SEDANG_BERLANGSUNG", label: "Sedang Berlangsung" },
                { value: "SELESAI", label: "Selesai" },
              ]}
              buttonClassName="bg-gray-50 px-4 py-2 rounded-xl text-sm outline-none border-none text-black w-full"
            />
          </div>
        </div>

        <Button
          onClick={() => {
            setSelectedRecord(null);
            setFilesToUpload([]);
            setFormData({
              status: "INISIASI",
              kegiatan: "",
              site: "",
              nominalPengajuan: "",
              progress: "",
              nominalHasilEvaluasi: "",
              nominalRealisasi: "",
              sdiPengajuanRm: "",
              ndIzinPrinsipGm: "",
              ndIzinPrinsipDirsar: "",
              ndIzinPenggunaanRka: "",
              ndBalasanDivisiUmum: "",
              sdiPemberitahuanRm: "",
              ndPermohonanPembayaran: "",
              batasPenerbitanKontrak: "",
              dokumentasiUrls: [],
            });
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
                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors font-bold text-sm"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#1A237E] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors font-bold text-sm"
              >
                Selanjutnya
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
