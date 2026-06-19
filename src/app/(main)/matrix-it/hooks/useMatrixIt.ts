/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getMatrixDataAction,
  createKegiatanAction,
  updateKegiatanAction,
  deleteKegiatanAction,
  createTaskAction,
  updateTaskAction,
  deleteTaskAction
} from "../../../actions/matrixIt";

export function useMatrixIt() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded states for nested accordion
  const [expandedKegiatan, setExpandedKegiatan] = useState<number[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);

  // Modals state
  const [modalType, setModalType] = useState<"KEGIATAN" | "TASK" | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    setLoading(true);
    const res = await getMatrixDataAction();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleKegiatan = (id: number) => {
    setExpandedKegiatan(prev => 
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
  };

  const toggleTask = (id: number) => {
    setExpandedTasks(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // KEGIATAN
  const openAddKegiatan = () => {
    setModalType("KEGIATAN");
    setEditMode(false);
    setEditingId(null);
    setFormData({ namaKegiatan: "" });
  };
  const openEditKegiatan = (item: any) => {
    setModalType("KEGIATAN");
    setEditMode(true);
    setEditingId(item.id);
    setFormData({ namaKegiatan: item.namaKegiatan });
  };

  // TASK
  const openAddTask = (kegiatanId: number) => {
    setModalType("TASK");
    setEditMode(false);
    setEditingId(null);
    setParentId(kegiatanId);
    setFormData({ namaTask: "" });
  };
  const openEditTask = (item: any) => {
    setModalType("TASK");
    setEditMode(true);
    setEditingId(item.id);
    setFormData({ namaTask: item.namaTask });
  };

  // SUB TASK is moved to TaskDetail

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === "KEGIATAN") {
        if (editMode && editingId) {
          await updateKegiatanAction(editingId, formData.namaKegiatan);
        } else {
          await createKegiatanAction(formData.namaKegiatan);
        }
      } else if (modalType === "TASK") {
        if (editMode && editingId) {
          await updateTaskAction(editingId, formData.namaTask);
        } else if (parentId) {
          await createTaskAction(parentId, formData.namaTask);
        }
      }
      Swal.fire({ icon: "success", title: "Berhasil Disimpan", timer: 1500, showConfirmButton: false });
      setModalType(null);
      fetchData();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Gagal menyimpan data", "error");
    }
  };

  const handleDelete = async (type: "KEGIATAN" | "TASK", id: number) => {
    Swal.fire({
      title: "Hapus Data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (res) => {
      if (res.isConfirmed) {
        if (type === "KEGIATAN") await deleteKegiatanAction(id);
        if (type === "TASK") await deleteTaskAction(id);
        Swal.fire({ icon: "success", title: "Terhapus", timer: 1500, showConfirmButton: false });
        fetchData();
      }
    });
  };

  return {
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
  };
}
