"use client";

import React from "react";
import { Plus, Search } from "lucide-react";
import Button from "../../../component/ui/Button";
import { useVendor } from "../hooks/useVendor";
import VendorTable from "./VendorTable";
import VendorFormModal from "./VendorFormModal";

export default function VendorClient() {
  const {
    data,
    loading,
    searchTerm,
    setSearchTerm,
    modalOpen,
    setModalOpen,
    editMode,
    formData,
    setFormData,
    openAdd,
    openEdit,
    handleSave,
    handleDelete,
  } = useVendor();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Master Data Vendor
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data vendor yang terlibat dalam kegiatan UBI Maintenance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
            />
          </div>
          <Button onClick={openAdd} className="w-full sm:w-auto shadow-md shadow-blue-200">
            <Plus size={18} className="mr-2" />
            Tambah Vendor
          </Button>
        </div>
      </div>

      <VendorTable
        data={data}
        loading={loading}
        openEdit={openEdit}
        handleDelete={handleDelete}
      />

      <VendorFormModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
      />
    </div>
  );
}
