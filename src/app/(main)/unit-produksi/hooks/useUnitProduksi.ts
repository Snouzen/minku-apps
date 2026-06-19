/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getUnitProduksiAction,
  createUnitProduksiAction,
  updateUnitProduksiAction,
  deleteUnitProduksiAction,
} from "../../../actions/unitProduksi";

export function useUnitProduksi() {
  const [data, setData] = useState<any[]>([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedRegionals, setExpandedRegionals] = useState<string[]>([]);

  // Form Modal State
  const [modalType, setModalType] = useState<"REGIONAL" | "SITE" | "EDIT" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    namaRegional: "",
    kodeRegional: "",
    siteArea: "",
    alamat: "",
  });

  const uniqueRegionals = Array.from(new Set(data.map((d) => d.namaRegional)))
    .map((nama) => data.find((d) => d.namaRegional === nama))
    .filter(Boolean)
    .sort((a: any, b: any) => a.namaRegional.localeCompare(b.namaRegional));

  const loadData = async () => {
    setLoading(true);
    const res = await getUnitProduksiAction();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = data.filter((item) => {
    const term = filterText.toLowerCase();
    return (
      item.namaRegional.toLowerCase().includes(term) ||
      item.siteArea.toLowerCase().includes(term) ||
      (item.kodeRegional || "").toLowerCase().includes(term)
    );
  }).sort((a, b) => {
    const regCompare = a.namaRegional.localeCompare(b.namaRegional);
    if (regCompare !== 0) return regCompare;
    return a.siteArea.localeCompare(b.siteArea);
  });

  // Group data by Regional for Accordion
  const groupedData = Object.values(
    filteredData.reduce((acc: Record<string, any>, item) => {
      if (!acc[item.namaRegional]) {
        acc[item.namaRegional] = {
          namaRegional: item.namaRegional,
          kodeRegional: item.kodeRegional,
          rootItem: null,
          sites: [],
        };
      }
      if (item.siteArea === "-") {
        acc[item.namaRegional].rootItem = item;
      } else {
        acc[item.namaRegional].sites.push(item);
      }
      return acc;
    }, {})
  ).sort((a: any, b: any) => a.namaRegional.localeCompare(b.namaRegional));

  const toggleAccordion = (namaRegional: string) => {
    setExpandedRegionals((prev) =>
      prev.includes(namaRegional)
        ? prev.filter((name) => name !== namaRegional)
        : [...prev, namaRegional]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const res = await updateUnitProduksiAction(editingId, formData);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Data Updated",
            showConfirmButton: false,
            timer: 1500,
          });
          loadData();
          setModalType(null);
        } else {
          Swal.fire("Error", "Gagal mengupdate data", "error");
        }
      } else {
        // Create
        const payload = { ...formData };
        if (modalType === "REGIONAL") {
          payload.siteArea = "-"; // Placeholder for Regional only
        }

        const res = await createUnitProduksiAction(payload);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Data Saved",
            showConfirmButton: false,
            timer: 1500,
          });
          loadData();
          setModalType(null);
        } else {
          Swal.fire("Error", "Gagal menyimpan data", "error");
        }
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan sistem", "error");
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Hapus Data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A237E",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (res) => {
      if (res.isConfirmed) {
        const delRes = await deleteUnitProduksiAction(id);
        if (delRes.success) {
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            showConfirmButton: false,
            timer: 1500,
          });
          loadData();
        } else {
          Swal.fire("Error", "Gagal menghapus data", "error");
        }
      }
    });
  };

  const openAddRegionalModal = () => {
    setEditingId(null);
    setFormData({ namaRegional: "", kodeRegional: "", siteArea: "-", alamat: "" });
    setModalType("REGIONAL");
  };

  const openAddSiteModal = () => {
    setEditingId(null);
    setFormData({ namaRegional: "", kodeRegional: "", siteArea: "", alamat: "" });
    setModalType("SITE");
  };

  const openEditModal = (item: any) => {
    setEditingId(item.idRegional);
    setFormData({
      namaRegional: item.namaRegional,
      kodeRegional: item.kodeRegional || "",
      siteArea: item.siteArea,
      alamat: item.alamat || "",
    });
    setModalType("EDIT");
  };

  return {
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
  };
}
