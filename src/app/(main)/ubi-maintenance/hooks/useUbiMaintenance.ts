import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getUbiMaintenancesAction,
  createUbiMaintenanceAction,
  updateUbiMaintenanceAction,
  deleteUbiMaintenanceAction,
} from "../../../actions/ubi";
import { getUnitProduksiAction } from "../../../actions/unitProduksi";
import { getCurrentUser } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";

export function useUbiMaintenance() {
  const [data, setData] = useState<any[]>([]);
  const [unitProduksiOptions, setUnitProduksiOptions] = useState<{label: string, value: string}[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState<any>({
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

  const fetchData = async () => {
    const res = await getUbiMaintenancesAction();
    if (res.success && res.maintenances) {
      setData(res.maintenances);
    }
  };

  const fetchUnitProduksi = async () => {
    const res = await getUnitProduksiAction();
    if (res.success && res.data) {
      const sites = res.data.filter((d: any) => d.siteArea !== "-");
      const options = sites.map((s: any) => ({
        label: s.siteArea,
        value: s.siteArea,
      })).sort((a: any, b: any) => a.label.localeCompare(b.label));
      const uniqueOptions = Array.from(new Map(options.map((item: any) => [item.value, item])).values());
      setUnitProduksiOptions(uniqueOptions as {label: string, value: string}[]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUnitProduksi();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== "SUPER_ADMIN" && currentUser?.role !== "PIC") {
       return Swal.fire("Error", "Unauthorized", "error");
    }

    if (formData.status === "SELESAI" && (!formData.dokumentasiUrls || formData.dokumentasiUrls.length === 0) && filesToUpload.length === 0) {
      return Swal.fire("Peringatan", "Upload dokumentasi pekerjaan wajib untuk status Selesai!", "warning");
    }

    setIsUploading(true);
    let finalDokumentasiUrls = [...(formData.dokumentasiUrls || [])];

    try {
      if (filesToUpload.length > 0 && supabase) {
        const uploadPromises = filesToUpload.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `dokumentasi_pekerjaan/${fileName}`;

          const { error: uploadError } = await supabase!.storage
            .from("dokumentasi")
            .upload(filePath, file);

          if (uploadError) {
            throw new Error(`Gagal mengupload file ${file.name}: ` + uploadError.message);
          }

          const { data: publicUrlData } = supabase!.storage
            .from("dokumentasi")
            .getPublicUrl(filePath);

          return publicUrlData.publicUrl;
        });

        const newUrls = await Promise.all(uploadPromises);
        finalDokumentasiUrls = [...finalDokumentasiUrls, ...newUrls];
      }

      const payload = { ...formData, dokumentasiUrls: finalDokumentasiUrls };

      if (selectedRecord) {
        const res = await updateUbiMaintenanceAction(selectedRecord.id, payload);
        if (res.success) {
          Swal.fire({ icon: "success", title: "Berhasil Diupdate", timer: 1500, showConfirmButton: false });
          fetchData();
        } else {
          throw new Error(res.error);
        }
      } else {
        const res = await createUbiMaintenanceAction(payload);
        if (res.success) {
          Swal.fire({ icon: "success", title: "Berhasil Disimpan", timer: 1500, showConfirmButton: false });
          fetchData();
        } else {
          throw new Error(res.error);
        }
      }
      setIsModalOpen(false);
      setSelectedRecord(null);
      setFilesToUpload([]);
    } catch (err: any) {
      Swal.fire("Error", err.message || "Gagal menyimpan data", "error");
    } finally {
      setIsUploading(false);
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
        const delRes = await deleteUbiMaintenanceAction(id);
        if (delRes.success) {
          Swal.fire({ icon: "success", title: "Terhapus", timer: 1500, showConfirmButton: false });
          fetchData();
        }
      }
    });
  };

  const handleEdit = (item: any) => {
    setSelectedRecord(item);
    setFilesToUpload([]);
    setFormData({
      status: item.status,
      kegiatan: item.kegiatan,
      dependency: item.dependency || "",
      site: item.site,
      nominalPengajuan: item.nominalPengajuan || "",
      progress: item.progress || "",
      nominalHasilEvaluasi: item.nominalHasilEvaluasi || "",
      nominalRealisasi: item.nominalRealisasi || "",
      sdiPengajuanRm: item.sdiPengajuanRm || "",
      ndIzinPrinsipGm: item.ndIzinPrinsipGm || "",
      ndIzinPrinsipDirsar: item.ndIzinPrinsipDirsar || "",
      ndIzinPenggunaanRka: item.ndIzinPenggunaanRka || "",
      ndBalasanDivisiUmum: item.ndBalasanDivisiUmum || "",
      sdiPemberitahuanRm: item.sdiPemberitahuanRm || "",
      ndPermohonanPembayaran: item.ndPermohonanPembayaran || "",
      batasPenerbitanKontrak: item.batasPenerbitanKontrak ? new Date(item.batasPenerbitanKontrak).toISOString().split('T')[0] : "",
      dokumentasiUrls: item.dokumentasiUrls || [],
    });
    setIsModalOpen(true);
  };

  const handleView = (item: any) => {
    setSelectedRecord(item);
    setIsViewModalOpen(true);
  };

  const filteredData = data.filter((item) => {
    const matchesText =
      item.kegiatan.toLowerCase().includes(filterText.toLowerCase()) ||
      item.site.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesText && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, filterStatus]);

  return {
    data,
    paginatedData,
    filteredData,
    currentPage,
    setCurrentPage,
    totalPages,
    unitProduksiOptions,
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
  };
}
