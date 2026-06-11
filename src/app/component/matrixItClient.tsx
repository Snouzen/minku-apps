"use client";

import React from "react";
import MatrixTable from "../(main)/matrix-it/components/MatrixTable";
import MatrixFormModal from "../(main)/matrix-it/components/MatrixFormModal";
import { useMatrixIt } from "../(main)/matrix-it/hooks/useMatrixIt";

export default function MatrixItClient() {
  const {
    data,
    loading,
    expandedKegiatan,
    expandedTasks,
    toggleKegiatan,
    toggleTask,
    modalType,
    setModalType,
    editMode,
    formData,
    setFormData,
    handleSave,
    handleDelete,
    openAddKegiatan,
    openEditKegiatan,
    openAddTask,
    openEditTask
  } = useMatrixIt();

  return (
    <div className="space-y-6">
      <MatrixTable
        data={data}
        loading={loading}
        expandedKegiatan={expandedKegiatan}
        expandedTasks={expandedTasks}
        toggleKegiatan={toggleKegiatan}
        toggleTask={toggleTask}
        openAddKegiatan={openAddKegiatan}
        openEditKegiatan={openEditKegiatan}
        openAddTask={openAddTask}
        openEditTask={openEditTask}
        handleDelete={handleDelete}
      />

      <MatrixFormModal
        modalType={modalType}
        editMode={editMode}
        onClose={() => setModalType(null)}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
