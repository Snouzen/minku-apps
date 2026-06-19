import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getVendorsAction,
  createVendorAction,
  updateVendorAction,
  deleteVendorAction,
} from "../../../actions/vendor";

export function useVendor() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    namaVendor: "",
    picVendor: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await getVendorsAction();
    if (result.success && result.data) {
      setData(result.data);
    } else {
      Swal.fire("Error", "Gagal memuat data vendor", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.namaVendor.toLowerCase().includes(term) ||
      (item.picVendor && item.picVendor.toLowerCase().includes(term))
    );
  });

  const openAdd = () => {
    setEditMode(false);
    setEditingId(null);
    setFormData({ namaVendor: "", picVendor: "" });
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditMode(true);
    setEditingId(item.id);
    setFormData({
      namaVendor: item.namaVendor,
      picVendor: item.picVendor || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaVendor.trim()) {
      return Swal.fire("Warning", "Nama Vendor wajib diisi!", "warning");
    }

    try {
      if (editMode && editingId) {
        await updateVendorAction(editingId, formData);
        Swal.fire({ icon: "success", title: "Berhasil Diubah", timer: 1500, showConfirmButton: false });
      } else {
        await createVendorAction(formData);
        Swal.fire({ icon: "success", title: "Berhasil Ditambahkan", timer: 1500, showConfirmButton: false });
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      Swal.fire("Error", "Gagal menyimpan data", "error");
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Hapus Vendor?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteVendorAction(id);
        Swal.fire({ icon: "success", title: "Terhapus!", timer: 1500, showConfirmButton: false });
        fetchData();
      }
    });
  };

  return {
    data: filteredData,
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
  };
}
