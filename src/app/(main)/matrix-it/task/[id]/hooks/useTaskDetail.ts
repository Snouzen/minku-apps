/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  getTaskByIdAction, 
  createSubTaskAction, 
  updateSubTaskAction, 
  deleteSubTaskAction 
} from "../../../../../actions/matrixIt";
import { getUnitProduksiAction } from "../../../../../actions/unitProduksi";
import { getCurrentUser } from "../../../../../lib/auth";

export function useTaskDetail(taskId: number) {
  const [taskData, setTaskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unitProduksiOptions, setUnitProduksiOptions] = useState<{label: string, value: string}[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchTask = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTaskByIdAction(taskId);
      if (res?.success && res.data) {
        setTaskData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch task:", err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
    
    async function loadUnitProduksi() {
      const res = await getUnitProduksiAction();
      if (res.success && res.data) {
        setUnitProduksiOptions(res.data.map((item: any) => ({
          label: item.siteArea,
          value: item.idRegional
        })));
      }
    }
    loadUnitProduksi();
  }, [fetchTask]);

  const openAddSubTask = () => {
    setModalOpen(true);
    setEditMode(false);
    setEditingId(null);
    setFormData({ 
      namaSubTask: "",
      goals: "",
      actionPlan: [],
      status: "OPEN",
      sdiPengajuanRm: "",
      ndIzinPrinsipGm: "",
      ndIzinPrinsipDirsar: "",
      ndIzinPenggunaanRka: "",
      ndBalasanDivisiUmum: "",
      sdiPemberitahuanRm: "",
      ndPermohonanPembayaran: "",
      batasPenerbitanKontrak: "",
      unitProduksiId: ""
    });
  };

  const openEditSubTask = (item: any) => {
    setModalOpen(true);
    setEditMode(true);
    setEditingId(item.id);

    let parsedActionPlan = [];
    if (item.actionPlan) {
      try {
        parsedActionPlan = JSON.parse(item.actionPlan);
        if (!Array.isArray(parsedActionPlan)) parsedActionPlan = [];
      } catch (e) {
        // Fallback for legacy text data
        parsedActionPlan = [{ id: Date.now().toString(), text: item.actionPlan, isCompleted: false }];
      }
    }

    setFormData({ 
      namaSubTask: item.namaSubTask,
      goals: item.goals || "",
      actionPlan: parsedActionPlan,
      status: item.status || "OPEN",
      sdiPengajuanRm: item.sdiPengajuanRm || "",
      ndIzinPrinsipGm: item.ndIzinPrinsipGm || "",
      ndIzinPrinsipDirsar: item.ndIzinPrinsipDirsar || "",
      ndIzinPenggunaanRka: item.ndIzinPenggunaanRka || "",
      ndBalasanDivisiUmum: item.ndBalasanDivisiUmum || "",
      sdiPemberitahuanRm: item.sdiPemberitahuanRm || "",
      ndPermohonanPembayaran: item.ndPermohonanPembayaran || "",
      batasPenerbitanKontrak: item.batasPenerbitanKontrak ? new Date(item.batasPenerbitanKontrak).toISOString().split('T')[0] : "",
      unitProduksiId: item.unitProduksiId || ""
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = getCurrentUser();
      const payloadToSave = {
        ...formData,
        actionPlan: Array.isArray(formData.actionPlan) && formData.actionPlan.length > 0 
          ? JSON.stringify(formData.actionPlan) 
          : null,
        createdById: user?.id
      };

      let res;
      if (editMode && editingId) {
        res = await updateSubTaskAction(editingId, payloadToSave);
      } else {
        res = await createSubTaskAction(taskId, payloadToSave);
      }
      if (!res.success) throw new Error(res.error);
      Swal.fire({ icon: "success", title: "Berhasil Disimpan", timer: 1500, showConfirmButton: false });
      setModalOpen(false);
      fetchTask();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Gagal menyimpan data", "error");
    }
  };

  const toggleActionPlanItem = async (subTaskId: number, actionPlanId: string) => {
    try {
      const sub = taskData.subTasks.find((s: any) => s.id === subTaskId);
      if (!sub || !sub.actionPlan) return;
      
      let parsed = [];
      try { parsed = JSON.parse(sub.actionPlan); } catch (e) { return; }
      
      const newActionPlan = parsed.map((item: any) => 
        item.id === actionPlanId ? { ...item, isCompleted: !item.isCompleted } : item
      );

      // Optimistic update
      setTaskData((prev: any) => ({
        ...prev,
        subTasks: prev.subTasks.map((s: any) => 
          s.id === subTaskId ? { ...s, actionPlan: JSON.stringify(newActionPlan) } : s
        )
      }));

      await updateSubTaskAction(subTaskId, { actionPlan: JSON.stringify(newActionPlan) });
    } catch (err) {
      console.error(err);
      fetchTask(); // Revert on error
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

  const handleUpdateAdministrasi = async (subId: number, key: string, value: string, link?: string) => {
    // Build payload with both value and link
    const updatePayload: any = { [key]: value };
    const linkKey = key + "Link";
    if (link !== undefined) updatePayload[linkKey] = link;

    // Optimistic update
    setTaskData((prev: any) => ({
      ...prev,
      subTasks: prev.subTasks.map((s: any) => 
        s.id === subId ? { ...s, [key]: value, [linkKey]: link || s[linkKey] } : s
      )
    }));

    const res = await updateSubTaskAction(subId, updatePayload);
    if (res.success) {
      return true;
    } else {
      Swal.fire("Error", res.error || "Gagal mengupdate progress administrasi", "error");
      fetchTask(); // Revert optimistic update
      return false;
    }
  };

  return {
    taskData,
    loading,
    modalOpen,
    setModalOpen,
    editMode,
    formData,
    setFormData,
    unitProduksiOptions,
    openAddSubTask,
    openEditSubTask,
    handleSave,
    handleDelete,
    toggleActionPlanItem,
    handleUpdateAdministrasi
  };
}
