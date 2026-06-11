import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  getTaskByIdAction, 
  createSubTaskAction, 
  updateSubTaskAction, 
  deleteSubTaskAction 
} from "../../../../../actions/matrixIt";

export function useTaskDetail(taskId: number) {
  const [taskData, setTaskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchTask = useCallback(async () => {
    setLoading(true);
    const res = await getTaskByIdAction(taskId);
    if (res.success && res.data) {
      setTaskData(res.data);
    }
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const openAddSubTask = () => {
    setModalOpen(true);
    setEditMode(false);
    setEditingId(null);
    setFormData({ 
      namaSubTask: "",
      goals: "",
      actionPlan: "",
      status: "OPEN",
      sdiPengajuanRm: "",
      ndIzinPrinsipGm: "",
      ndIzinPrinsipDirsar: "",
      ndIzinPenggunaanRka: "",
      ndBalasanDivisiUmum: "",
      sdiPemberitahuanRm: "",
      ndPermohonanPembayaran: "",
      batasPenerbitanKontrak: ""
    });
  };

  const openEditSubTask = (item: any) => {
    setModalOpen(true);
    setEditMode(true);
    setEditingId(item.id);
    setFormData({ 
      namaSubTask: item.namaSubTask,
      goals: item.goals || "",
      actionPlan: item.actionPlan || "",
      status: item.status || "OPEN",
      sdiPengajuanRm: item.sdiPengajuanRm || "",
      ndIzinPrinsipGm: item.ndIzinPrinsipGm || "",
      ndIzinPrinsipDirsar: item.ndIzinPrinsipDirsar || "",
      ndIzinPenggunaanRka: item.ndIzinPenggunaanRka || "",
      ndBalasanDivisiUmum: item.ndBalasanDivisiUmum || "",
      sdiPemberitahuanRm: item.sdiPemberitahuanRm || "",
      ndPermohonanPembayaran: item.ndPermohonanPembayaran || "",
      batasPenerbitanKontrak: item.batasPenerbitanKontrak ? new Date(item.batasPenerbitanKontrak).toISOString().split('T')[0] : "",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && editingId) {
        await updateSubTaskAction(editingId, formData);
      } else {
        await createSubTaskAction(taskId, formData);
      }
      Swal.fire({ icon: "success", title: "Berhasil Disimpan", timer: 1500, showConfirmButton: false });
      setModalOpen(false);
      fetchTask();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Gagal menyimpan data", "error");
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Hapus Data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await deleteSubTaskAction(id);
        Swal.fire({ icon: "success", title: "Terhapus", timer: 1500, showConfirmButton: false });
        fetchTask();
      }
    });
  };

  return {
    taskData,
    loading,
    modalOpen,
    setModalOpen,
    editMode,
    formData,
    setFormData,
    openAddSubTask,
    openEditSubTask,
    handleSave,
    handleDelete
  };
}
