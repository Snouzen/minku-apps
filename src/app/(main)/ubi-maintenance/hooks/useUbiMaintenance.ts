import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getUbiMaintenancesAction,
  createUbiMaintenanceAction,
  updateUbiMaintenanceAction,
  deleteUbiMaintenanceAction,
} from "../../../actions/ubi";
import { getUnitProduksiAction } from "../../../actions/unitProduksi";
import { getVendorsAction } from "../../../actions/vendor";
import { getCurrentUser } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";

export interface KegiatanItem {
  kegiatan: string;
  site: string;
  sdiPengajuanRm: string;
  nominalPengajuan: string;
  progress: string;
}

const emptyKegiatanItem: KegiatanItem = {
  kegiatan: "",
  site: "",
  sdiPengajuanRm: "",
  nominalPengajuan: "",
  progress: "",
};

const initialFormData = {
  status: "INISIASI",
  dependency: "MINKU",
  vendorId: "",
  nominalHasilEvaluasi: "",
  nominalRealisasi: "",
  ndIzinPrinsipGm: "",
  ndIzinPrinsipDirsar: "",
  ndIzinPenggunaanRka: "",
  ndBalasanDivisiUmum: "",
  sdiPemberitahuanRm: "",
  ndPermohonanPembayaran: "",
  batasPenerbitanKontrak: "",
  dokumentasiUrls: [] as string[],
  kegiatanItems: [{ ...emptyKegiatanItem }] as KegiatanItem[],
};

export function useUbiMaintenance() {
  const [data, setData] = useState<any[]>([]);
  const [unitProduksiOptions, setUnitProduksiOptions] = useState<{label: string, value: string}[]>([]);
  const [vendorOptions, setVendorOptions] = useState<{label: string, value: string}[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDependency, setFilterDependency] = useState("All");

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

  const [formData, setFormData] = useState<any>({ ...initialFormData });

  const fetchData = useCallback(async () => {
    const res = await getUbiMaintenancesAction();
    if (res.success && res.maintenances) {
      setData(res.maintenances);
    }

    const unitRes = await getUnitProduksiAction();
    if (unitRes.success && unitRes.data) {
      const sites = unitRes.data.filter((d: any) => d.siteArea !== "-");
      const options = sites.map((s: any) => ({
        label: s.siteArea,
        value: s.siteArea,
      })).sort((a: any, b: any) => a.label.localeCompare(b.label));
      const uniqueOptions = Array.from(new Map(options.map((item: any) => [item.value, item])).values());
      setUnitProduksiOptions(uniqueOptions as {label: string, value: string}[]);
    }

    const vendorsRes = await getVendorsAction();
    if (vendorsRes.success && vendorsRes.data) {
      const vOpts = vendorsRes.data.map((v: any) => ({
        value: v.id.toString(),
        label: v.namaVendor
      }));
      setVendorOptions(vOpts);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== "SUPER_ADMIN" && currentUser?.role !== "PIC") {
       return Swal.fire("Error", "Unauthorized", "error");
    }

    // Validate: at least 1 kegiatan with name and site
    const validItems = formData.kegiatanItems?.filter((k: KegiatanItem) => k.kegiatan.trim() && k.site.trim());
    if (!validItems || validItems.length === 0) {
      return Swal.fire("Peringatan", "Minimal 1 kegiatan dengan nama dan site harus diisi!", "warning");
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

      const payload = { ...formData, dokumentasiUrls: finalDokumentasiUrls, kegiatanItems: validItems };

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

  const handleStatusChange = async (id: number, newStatus: string) => {
    const prevData = [...data];
    setData(prevData.map(item => item.id === id ? { ...item, status: newStatus } : item));
    
    try {
      const res = await updateUbiMaintenanceAction(id, { status: newStatus });
      if (!res.success) {
        Swal.fire("Error", res.error || "Gagal mengubah status", "error");
        setData(prevData);
      } else {
        Swal.fire({ icon: "success", title: "Status berhasil diubah", toast: true, position: "top-end", showConfirmButton: false, timer: 3000 });
      }
    } catch (err: any) {
      Swal.fire("Error", err.message || "Gagal mengubah status", "error");
      setData(prevData);
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
      dependency: item.dependency || "",
      vendorId: item.vendorId ? item.vendorId.toString() : "",
      nominalHasilEvaluasi: item.nominalHasilEvaluasi?.toString() || "",
      nominalRealisasi: item.nominalRealisasi?.toString() || "",
      ndIzinPrinsipGm: item.ndIzinPrinsipGm || "",
      ndIzinPrinsipDirsar: item.ndIzinPrinsipDirsar || "",
      ndIzinPenggunaanRka: item.ndIzinPenggunaanRka || "",
      ndBalasanDivisiUmum: item.ndBalasanDivisiUmum || "",
      sdiPemberitahuanRm: item.sdiPemberitahuanRm || "",
      ndPermohonanPembayaran: item.ndPermohonanPembayaran || "",
      batasPenerbitanKontrak: item.batasPenerbitanKontrak ? new Date(item.batasPenerbitanKontrak).toISOString().split('T')[0] : "",
      dokumentasiUrls: item.dokumentasiUrls || [],
      kegiatanItems: item.kegiatan?.length
        ? item.kegiatan.map((k: any) => ({
            kegiatan: k.kegiatan,
            site: k.site,
            sdiPengajuanRm: k.sdiPengajuanRm || "",
            nominalPengajuan: k.nominalPengajuan?.toString() || "",
            progress: k.progress || "",
          }))
        : [{ ...emptyKegiatanItem }],
    });
    setIsModalOpen(true);
  };

  const handleView = (item: any) => {
    setSelectedRecord(item);
    setIsViewModalOpen(true);
  };

  // Filter: search across all child kegiatan names & sites
  const filteredData = data.filter((item) => {
    const childTexts = (item.kegiatan || []).map((k: any) =>
      `${k.kegiatan} ${k.site}`.toLowerCase()
    ).join(" ");
    const matchesText = childTexts.includes(filterText.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesDependency = filterDependency === "All" || item.dependency === filterDependency;
    return matchesText && matchesStatus && matchesDependency;
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
    vendorOptions,
    filterText,
    setFilterText,
    filterStatus,
    setFilterStatus,
    filterDependency,
    setFilterDependency,
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
    handleStatusChange,
    handleEdit,
    handleView,
    initialFormData,
    emptyKegiatanItem,
  };
}
