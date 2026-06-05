"use client";

import React from "react";
import { Plus, MapPin } from "lucide-react";
import SearchInput from "./ui/SearchInput";
import Button from "./ui/Button";

import UnitProduksiTable from "../(main)/unit-produksi/components/UnitProduksiTable";
import UnitProduksiFormModal from "../(main)/unit-produksi/components/UnitProduksiFormModal";
import { useUnitProduksi } from "../(main)/unit-produksi/hooks/useUnitProduksi";

export default function UnitProduksiClient() {
  const {
    filterText,
    setFilterText,
    loading,
    expandedRegionals,
    toggleAccordion,
    modalType,
    setModalType,
    formData,
    setFormData,
    uniqueRegionals,
    groupedData,
    handleSave,
    handleDelete,
    openAddRegionalModal,
    openAddSiteModal,
    openEditModal
  } = useUnitProduksi();

  return (
    <div className="space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <SearchInput
          placeholder="Cari Regional atau Site..."
          value={filterText}
          onChange={setFilterText}
          className="w-full"
        />
        <div className="flex flex-col lg:flex-row w-full lg:w-auto gap-2">
          <Button
            onClick={openAddRegionalModal}
            className="w-full lg:w-auto uppercase tracking-wider"
            icon={Plus}
            label="Tambah Regional"
          />
          <Button
            onClick={openAddSiteModal}
            className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 uppercase tracking-wider text-white"
            icon={MapPin}
            label="Tambah Site Area"
          />
        </div>
      </div>

      {/* ACCORDION LIST */}
      <UnitProduksiTable 
        loading={loading}
        groupedData={groupedData}
        expandedRegionals={expandedRegionals}
        toggleAccordion={toggleAccordion}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
      />

      {/* MODAL */}
      <UnitProduksiFormModal 
        modalType={modalType}
        onClose={() => setModalType(null)}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        uniqueRegionals={uniqueRegionals}
      />
    </div>
  );
}
