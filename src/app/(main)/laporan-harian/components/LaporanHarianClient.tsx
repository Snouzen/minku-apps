      "use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { UploadCloud, FileSpreadsheet, Trash2, ChevronLeft, ChevronRight, ChevronDown, Download, Filter, ShoppingCart, Package, TrendingUp, Layers, CheckCircle2, RefreshCw, AlertCircle, Plus, FileUp, Search, Eye, Maximize2, X, Sliders, CheckSquare, Square, Check } from "lucide-react";
import * as XLSX from "xlsx";
import { toJpeg } from "html-to-image";
import pptxgen from "pptxgenjs";
import Swal from "sweetalert2";
import SmoothMultiAutocomplete from "../../../component/smoothMultiAutocomplete";
import SlideProgressOperasional from "./SlideProgressOperasional";
import SlideMonitoringUtilitas from "./SlideMonitoringUtilitas";
import SlideMonitoringUtilitasRMUSPP from "./SlideMonitoringUtilitasRMUSPP";
import SlideMonitoringUtilitasRMUSPB from "./SlideMonitoringUtilitasRMUSPB";
import SlideRealisasiPSOMakloon from "./SlideRealisasiPSOMakloon";
import SlideKuantumPenjualanUB from "./SlideKuantumPenjualanUB";
import SlideRealisasiPengadaanGabahBeras from "./SlideRealisasiPengadaanGabahBeras";
import SlidePenyerapanGKP from "./SlidePenyerapanGKP";
import SlideUpdatePersediaan from "./SlideUpdatePersediaan";
import SlideRealisasiOperasionalRegional from "./SlideRealisasiOperasionalRegional";
import SlideNilaiHPPGKG from "./SlideNilaiHPPGKG";
import SlideNilaiHPPBeras from "./SlideNilaiHPPBeras";
import SlideNilaiHPPBerasJadi from "./SlideNilaiHPPBerasJadi";
import SlideRealisasiPengadaanGabahBerasBawah from "./SlideRealisasiPengadaanGabahBerasBawah";
import SlideRealisasiPengadaanGabahBerasBawahPart2 from "./SlideRealisasiPengadaanGabahBerasBawahPart2";
import SlideRealisasiHargaGabahBerasAtas from "./SlideRealisasiHargaGabahBerasAtas";
import SlideRealisasiHargaGabahBerasBawah from "./SlideRealisasiHargaGabahBerasBawah";
import SlideRealisasiPenjualanAtas from "./SlideRealisasiPenjualanAtas";
import SlideRealisasiPenjualanBawah from "./SlideRealisasiPenjualanBawah";
import SlidePersediaanHasilSampingUB from "./SlidePersediaanHasilSampingUB";
import SlidePersediaanHasilSampingUB2 from "./SlidePersediaanHasilSampingUB2";
import SlideNilaiHPPKemasan from "./SlideNilaiHPPKemasan";
import { HISTORICAL_2026_DATA, HISTORICAL_HARGA_PEMBELIAN_2026_DATA, HISTORICAL_REALISASI_PENGADAAN_UB_JULI_2026, HISTORICAL_PENYERAPAN_GABAH_SPP_JULI_2026, HISTORICAL_REALISASI_PENJUALAN_2026_DATA, WAREHOUSE_METADATA, normalizeGudangName, TARGET_2026_DATA, TARGET_2026_TOTALS, TARGET_2026_RM, DATA_PENYERAPAN_2025, TARGET_REALISASI_PENJUALAN_2026_DATA, TARGET_REALISASI_PENJUALAN_2026_TOTALS, getInventoryRealQty } from "./historicalData2026";

const RAW_SLIDE_METADATA = [
  { title: "Progress Operasional", category: "Ringkasan" },
  { title: "Monitoring Utilitas RMU & CDC", category: "Utilitas" },
  { title: "Monitoring Utilitas RMU SPP", category: "Utilitas" },
  { title: "Monitoring Utilitas RMU SPB", category: "Utilitas" },
  { title: "Realisasi PSO & Makloon", category: "Utilitas" },
  { title: "Kuantum Penjualan UB Industri", category: "Penjualan" },
  { title: "Realisasi Pengadaan Gabah & Beras (Nasional)", category: "Pengadaan" },
  { title: "Realisasi Rekapitulasi Pengadaan Gabah dan Beras", category: "Pengadaan" },
  { title: "Realisasi Rekapitulasi Pengadaan Gabah dan Beras (UP & CDC)", category: "Pengadaan" },
  { title: "Penyerapan GKP SPP", category: "Pengadaan" },
  { title: "Realisasi Harga Pengadaan (Nasional)", category: "Harga" },
  { title: "Realisasi Harga Pengadaan (SPP/UP/SPB)", category: "Harga" },
  { title: "Update Persediaan Komoditi", category: "Persediaan" },
  { title: "Realisasi Operasional Regional", category: "Operasional" },
  { title: "Nilai HPP GKG", category: "HPP" },
  { title: "Nilai HPP Beras Bahan Baku", category: "HPP" },
  { title: "Nilai HPP Beras Jadi (Part 1)", category: "HPP" },
  { title: "Nilai HPP Beras Jadi (Part 2)", category: "HPP" },
  { title: "Persediaan Hasil Samping (Part 1)", category: "Persediaan" },
  { title: "Persediaan Hasil Samping (Part 2)", category: "Persediaan" },
  { title: "Nilai HPP Kemasan (Part 1)", category: "Kemasan" },
  { title: "Nilai HPP Kemasan (Part 2)", category: "Kemasan" },
  { title: "Nilai HPP Kemasan (Part 3)", category: "Kemasan" },
  { title: "Nilai HPP Kemasan (Part 4)", category: "Kemasan" },
  { title: "Nilai HPP Kemasan (Part 5)", category: "Kemasan" },
  { title: "Nilai HPP Kemasan (Part 6)", category: "Kemasan" },
  { title: "Realisasi Penjualan (Nasional & SPB)", category: "Penjualan" },
  { title: "Realisasi Penjualan (SPP, UP & CDC)", category: "Penjualan" },
];

export const SLIDE_METADATA = RAW_SLIDE_METADATA.map((s, idx) => ({
  id: idx + 1,
  ...s
}));

export const TOTAL_PPT_SLIDES = SLIDE_METADATA.length;

export default function LaporanHarianClient() {
  const [isExporting, setIsExporting] = useState(false);

  // PPT Preview Selected Slides for Export (On/Off per slide)
  const [enabledSlideIds, setEnabledSlideIds] = useState<number[]>(() =>
    Array.from({ length: TOTAL_PPT_SLIDES }, (_, i) => i + 1)
  );
  const [isSlideManagerOpen, setIsSlideManagerOpen] = useState<boolean>(false);

  useEffect(() => {
    setEnabledSlideIds(prev => {
      const allIds = Array.from({ length: TOTAL_PPT_SLIDES }, (_, i) => i + 1);
      const missing = allIds.filter(id => !prev.includes(id));
      if (missing.length > 0) {
        return [...prev, ...missing].sort((a, b) => a - b);
      }
      return prev;
    });
  }, []);

  const toggleSlideEnabled = (id: number) => {
    setEnabledSlideIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].sort((a, b) => a - b)
    );
  };

  const selectAllSlides = () => {
    setEnabledSlideIds(Array.from({ length: TOTAL_PPT_SLIDES }, (_, i) => i + 1));
  };

  const deselectAllSlides = () => {
    setEnabledSlideIds([]);
  };

  const exportToPPT = async () => {
    try {
      if (isExporting) return;

      const activeIds = enabledSlideIds.slice().sort((a, b) => a - b);
      if (activeIds.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Ada Slide Terpilih',
          text: 'Pilih minimal 1 slide (posisi ON) untuk diekspor ke format PowerPoint.',
        });
        return;
      }

      setIsExporting(true);
      
      const sliderContainer = document.getElementById('ppt-slider-container');
      if (!sliderContainer) {
        Swal.fire('Error', 'Container presentasi tidak ditemukan. Pastikan Anda berada di tab Preview PPT.', 'error');
        setIsExporting(false);
        return;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const fileName = `Laporan_Harian_ERP_${todayStr}.pptx`;

      // Show beautiful progress modal
      Swal.fire({
        title: 'Mempersiapkan PowerPoint...',
        html: `
          <div class="space-y-3 py-2 text-left">
            <div class="flex justify-between items-center text-xs font-semibold text-gray-700">
              <span id="ppt-progress-label">Menyiapkan slide...</span>
              <span id="ppt-progress-percent" class="text-[#1D63A8] font-bold">0%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div id="ppt-progress-bar" class="bg-[#1D63A8] h-2.5 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
            <div id="ppt-progress-sub" class="text-[11px] text-gray-500 font-medium truncate">Menghubungkan ke engine rendering Chromium...</div>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      // Extract all page stylesheets and styles once
      const styleEls = document.querySelectorAll('style, link[rel="stylesheet"]');
      const styles = Array.from(styleEls).map(el => el.outerHTML).join('\n');

      const ppt = new pptxgen();
      ppt.layout = 'LAYOUT_16x9';

      const updateProgress = (completed: number, total: number, slideTitle: string) => {
        const percent = Math.round((completed / total) * 100);
        const bar = document.getElementById('ppt-progress-bar');
        const textPercent = document.getElementById('ppt-progress-percent');
        const label = document.getElementById('ppt-progress-label');
        const sub = document.getElementById('ppt-progress-sub');

        if (bar) bar.style.width = `${percent}%`;
        if (textPercent) textPercent.innerText = `${percent}%`;
        if (label) label.innerText = `Memproses slide ${completed} dari ${total}`;
        if (sub) sub.innerText = `Memotret: ${slideTitle}`;
      };

      for (let i = 0; i < activeIds.length; i++) {
        const id = activeIds[i];
        const meta = SLIDE_METADATA.find(m => m.id === id);
        const slideTitle = meta?.title || `Slide ${id}`;

        updateProgress(i + 1, activeIds.length, slideTitle);

        const card = document.getElementById(`slide-card-${id}`);
        const slideInner = card?.querySelector('div[class*="w-[1280px]"][class*="h-[720px]"]') as HTMLElement;

        if (!slideInner) {
          console.warn(`Slide ${id} element not found in DOM`);
          continue;
        }

        let imageDataUrl: string | null = null;

        // 1. Call server API (/api/export-slide) powered by Browserless (Prod) or Local Chrome (Dev)
        try {
          const response = await fetch('/api/export-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slideId: id,
              title: slideTitle,
              html: slideInner.outerHTML,
              styles,
            }),
          });

          if (response.ok) {
            const blob = await response.blob();
            imageDataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          } else {
            const errData = await response.json().catch(() => null);
            console.warn(`Server render failed for slide ${id}:`, errData?.error || response.statusText);
          }
        } catch (fetchErr) {
          console.warn(`Network error for slide ${id}:`, fetchErr);
        }

        // 2. Fallback to toJpeg if server API fails
        if (!imageDataUrl) {
          try {
            imageDataUrl = await toJpeg(slideInner, {
              quality: 0.95,
              pixelRatio: 2,
              width: 1280,
              height: 720,
              backgroundColor: '#ffffff',
              skipFonts: true,
            });
          } catch (fallbackErr) {
            console.error(`Fallback render failed for slide ${id}:`, fallbackErr);
          }
        }

        if (imageDataUrl) {
          const slide = ppt.addSlide();
          slide.addImage({
            data: imageDataUrl,
            x: 0,
            y: 0,
            w: '100%',
            h: '100%',
          });
        }
      }

      // Finalize and download file
      const label = document.getElementById('ppt-progress-label');
      const sub = document.getElementById('ppt-progress-sub');
      const bar = document.getElementById('ppt-progress-bar');
      const textPercent = document.getElementById('ppt-progress-percent');
      if (bar) bar.style.width = '100%';
      if (textPercent) textPercent.innerText = '100%';
      if (label) label.innerText = 'Menyimpan File...';
      if (sub) sub.innerText = 'Mengemas presentasi PowerPoint (.pptx)...';

      await ppt.writeFile({ fileName });

      Swal.fire({
        icon: 'success',
        title: 'Export Selesai!',
        text: `Semua ${activeIds.length} slide berhasil diekspor dengan kualitas tinggi.`,
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error("Export PPT Error:", error);
      Swal.fire('Error', error?.message || 'Gagal melakukan export PPT. Silakan coba lagi.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // --- Slot 1: Data Pengadaan (PO) ---
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputPengadaanRef = useRef<HTMLInputElement>(null);

  // --- Slot 2: Data Persediaan (Stok & Valuation) ---
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [inventoryColumns, setInventoryColumns] = useState<string[]>([]);
  const [inventoryFileName, setInventoryFileName] = useState<string | null>(null);
  const fileInputPersediaanRef = useRef<HTMLInputElement>(null);

  // --- Slot 3: Data Penjualan (SO / Sales) ---
  const [salesData, setSalesData] = useState<any[]>([]);
  const [salesColumns, setSalesColumns] = useState<string[]>([]);
  const [salesFileName, setSalesFileName] = useState<string | null>(null);
  const fileInputPenjualanRef = useRef<HTMLInputElement>(null);

  // Global Drag & Raw Table Navigation
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);
  const [rawSubTab, setRawSubTab] = useState<"pengadaan" | "persediaan" | "penjualan">("pengadaan");
  const [rawSearchQuery, setRawSearchQuery] = useState<string>("");
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<string>("raw");
  const [filterKomoditi, setFilterKomoditi] = useState<string>("BERAS,BAHAN BAKU");
  const [showDaily, setShowDaily] = useState<boolean>(false);

  // PPT Preview Pop Out Full Screen State
  const [isPopOutOpen, setIsPopOutOpen] = useState<boolean>(false);
  const [currentPptSlideIdx, setCurrentPptSlideIdx] = useState<number>(0);
  const [popOutScale, setPopOutScale] = useState<number>(1);

  useEffect(() => {
    if (!isPopOutOpen) return;
    const handleResize = () => {
      const availW = window.innerWidth - 32;
      const availH = window.innerHeight - 80;
      const scaleW = availW / 1280;
      const scaleH = availH / 720;
      const finalScale = Math.min(scaleW, scaleH);
      setPopOutScale(Math.max(0.2, finalScale));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isPopOutOpen]);

  useEffect(() => {
    if (!isPopOutOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPopOutOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentPptSlideIdx(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPptSlideIdx(prev => Math.min(TOTAL_PPT_SLIDES - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPopOutOpen]);

  // Helper: Parse Excel Buffer to Headers & Rows
  const parseExcelBuffer = (arrayBuffer: ArrayBuffer): { headers: string[]; rows: any[] } => {
    const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (!jsonData || jsonData.length === 0) {
      return { headers: [], rows: [] };
    }
    
    const headers = (jsonData[0] as string[]).map(h => (h ? h.toString().trim() : ""));
    const rows = jsonData.slice(1).map((row: any) => {
      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });
    
    return { headers, rows };
  };

  // Smart Classifier: Automatically detect dataset type from column headers
  const classifyExcel = (headers: string[]): "pengadaan" | "persediaan" | "penjualan" => {
    const upperHeaders = headers.map(h => h.toUpperCase());
    
    // Check Persediaan keywords: REMAINING QTY, TOTAL VALUE, REMAINING VALUE, UNIT VALUE, ON HAND, REFERENCE
    const hasRemainingQty = upperHeaders.some(h => 
      h.includes("REMAINING QTY") || 
      h.includes("TOTAL VALUE") || 
      h.includes("REMAINING VALUE") || 
      h.includes("UNIT VALUE") || 
      h.includes("ON HAND") || 
      h.includes("REFERENCE")
    );
    const hasPoKeywords = upperHeaders.some(h => 
      h.includes("ORDER DATE") || 
      h.includes("TANGGAL PO") || 
      h.includes("PURCHASE") || 
      h.includes("VENDOR")
    );

    if (hasRemainingQty && !hasPoKeywords) {
      return "persediaan";
    }

    // Check Penjualan keywords: CUSTOMER, SALES, HARGA JUAL, SO NUMBER, FAKTUR, DELIVERY, PELANGGAN
    const hasCustomerOrSales = upperHeaders.some(h => 
      h.includes("CUSTOMER") || 
      h.includes("SALES") || 
      h.includes("HARGA JUAL") || 
      h.includes("FAKTUR") || 
      h.includes("DELIVERY") || 
      h.includes("SO NUMBER") ||
      h.includes("PELANGGAN")
    );
    if (hasCustomerOrSales) {
      return "penjualan";
    }

    // Default to Pengadaan (PO)
    return "pengadaan";
  };

  const processSingleFile = (file: File, targetSlot?: "pengadaan" | "persediaan" | "penjualan"): Promise<{ slot: "pengadaan" | "persediaan" | "penjualan"; fileName: string; rowCount: number } | null> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }

      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
      ];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
        Swal.fire("Format Tidak Sesuai", `File ${file.name} bukan format Excel (.xlsx atau .xls)`, "error");
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const { headers, rows } = parseExcelBuffer(buffer);
          if (rows.length === 0) {
            Swal.fire("File Kosong", `File ${file.name} tidak memiliki data baris.`, "warning");
            resolve(null);
            return;
          }

          const slot = targetSlot || classifyExcel(headers);
          if (slot === "persediaan") {
            setInventoryFileName(file.name);
            setInventoryColumns(headers);
            setInventoryData(rows);
          } else if (slot === "penjualan") {
            setSalesFileName(file.name);
            setSalesColumns(headers);
            setSalesData(rows);
          } else {
            setFileName(file.name);
            setColumns(headers);
            setData(rows);
          }
          resolve({ slot, fileName: file.name, rowCount: rows.length });
        } catch (err) {
          console.error("Error parsing file:", err);
          Swal.fire("Gagal Membaca File", `Terjadi kesalahan saat membaca file ${file.name}`, "error");
          resolve(null);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleMultipleFilesUpload = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    const results: { slot: string; fileName: string; rowCount: number }[] = [];
    for (const f of fileList) {
      const res = await processSingleFile(f);
      if (res) results.push(res);
    }

    if (results.length > 0) {
      const summaryMsg = results.map(r => {
        const slotName = r.slot === "pengadaan" ? "Data Pengadaan (PO)" : r.slot === "persediaan" ? "Data Persediaan (Stok)" : "Data Penjualan (SO)";
        return `<b>${slotName}</b>: ${r.fileName} (${r.rowCount.toLocaleString('id-ID')} baris)`;
      }).join("<br/>");

      Swal.fire({
        icon: "success",
        title: "File Berhasil Dimuat",
        html: `<div class="text-left text-sm space-y-1 mt-2">${summaryMsg}</div>`,
        timer: 3500,
        showConfirmButton: true,
        confirmButtonColor: "#1D63A8"
      });
    }
  };

  const clearPengadaan = () => {
    setData([]);
    setColumns([]);
    setFileName(null);
    if (fileInputPengadaanRef.current) fileInputPengadaanRef.current.value = "";
  };

  const clearPersediaan = () => {
    setInventoryData([]);
    setInventoryColumns([]);
    setInventoryFileName(null);
    if (fileInputPersediaanRef.current) fileInputPersediaanRef.current.value = "";
  };

  const clearPenjualan = () => {
    setSalesData([]);
    setSalesColumns([]);
    setSalesFileName(null);
    if (fileInputPenjualanRef.current) fileInputPenjualanRef.current.value = "";
  };

  const clearAllFiles = () => {
    Swal.fire({
      title: "Reset Semua Data?",
      text: "Semua file yang telah diupload (Pengadaan, Persediaan, Penjualan) akan dibersihkan dari memori.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Reset Semua",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        clearPengadaan();
        clearPersediaan();
        clearPenjualan();
        setActiveTab("raw");
        Swal.fire("Data Direset", "Semua dataset telah dibersihkan.", "info");
      }
    });
  };

  const parseDate = (val: any) => {
    if (!val) return null;
    
    // 1. Number (Excel Serial Date integer or float)
    if (typeof val === 'number') {
      const days = Math.floor(val);
      const ms = Math.round((days - 25569) * 86400 * 1000);
      const d = new Date(ms);
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }

    // 2. Date object (SheetJS or native Date)
    if (val instanceof Date && !isNaN(val.getTime())) {
      if (val.getUTCHours() === 0 && val.getUTCMinutes() === 0 && val.getUTCSeconds() === 0) {
        return new Date(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate());
      }
      const wib = new Date(val.getTime() + 7 * 3600 * 1000 + 60000);
      return new Date(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate());
    }

    // 3. String date formats
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return null;
      
      // A. ISO format / YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD (e.g. 2026-09-07 or 2026/09/07 14:30)
      const ymd = trimmed.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
      if (ymd) {
        return new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
      }

      // B. DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, or 2-digit year (07/09/26)
      const dmy = trimmed.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
      if (dmy) {
        const p1 = parseInt(dmy[1]);
        const p2 = parseInt(dmy[2]);
        let yr = parseInt(dmy[3]);
        if (yr < 100) yr += 2000;

        // If p2 > 12 && p1 <= 12 -> MM/DD/YYYY (e.g. 08/25/2026)
        if (p2 > 12 && p1 <= 12) {
          return new Date(yr, p1 - 1, p2);
        }
        // Standard Indonesian format is DD/MM/YYYY (e.g. 07/09/2026)
        return new Date(yr, p2 - 1, p1);
      }

      // C. Check dates with Indonesian / English month names (e.g. 07 September 2026, 7-Sep-2026, 07-Agu-2026)
      const monthNamesMap: Record<string, number> = {
        'JAN': 0, 'JANUARI': 0, 'JANUARY': 0,
        'FEB': 1, 'FEBRUARI': 1, 'FEBRUARY': 1,
        'MAR': 2, 'MARET': 2, 'MARCH': 2,
        'APR': 3, 'APRIL': 3,
        'MEI': 4, 'MAY': 4,
        'JUN': 5, 'JUNI': 5, 'JUNE': 5,
        'JUL': 6, 'JULI': 6, 'JULY': 6,
        'AGT': 7, 'AGU': 7, 'AGUSTUS': 7, 'AUG': 7, 'AUGUST': 7,
        'SEP': 8, 'SEPT': 8, 'SEPTEMBER': 8,
        'OKT': 9, 'OKTOBER': 9, 'OCT': 9, 'OCTOBER': 9,
        'NOV': 10, 'NOVEMBER': 10,
        'DES': 11, 'DESEMBER': 11, 'DEC': 11, 'DECEMBER': 11
      };

      const dmyText = trimmed.match(/^(\d{1,2})[\s\-\/\.]*([a-zA-Z]+)[\s\-\/\.]*(\d{2,4})/);
      if (dmyText) {
        const day = parseInt(dmyText[1]);
        const mStr = dmyText[2].toUpperCase();
        let yr = parseInt(dmyText[3]);
        if (yr < 100) yr += 2000;
        if (monthNamesMap[mStr] !== undefined) {
          return new Date(yr, monthNamesMap[mStr], day);
        }
      }

      const mdyText = trimmed.match(/^([a-zA-Z]+)[\s\-\/\.]*(\d{1,2})[,\s\-\/\.]+(\d{2,4})/);
      if (mdyText) {
        const mStr = mdyText[1].toUpperCase();
        const day = parseInt(mdyText[2]);
        let yr = parseInt(mdyText[3]);
        if (yr < 100) yr += 2000;
        if (monthNamesMap[mStr] !== undefined) {
          return new Date(yr, monthNamesMap[mStr], day);
        }
      }

      // D. Fallback native with WIB conversion
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) {
        const wib = new Date(d.getTime() + 7 * 3600 * 1000 + 60000);
        return new Date(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate());
      }
    }
    return null;
  };

  const parseNumber = (val: any) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    const valStr = val.toString().trim().replace(/"/g, '').replace(/\s/g, '');
    if (!valStr) return 0;

    let clean = valStr.replace(/[^\d.,-]/g, '');
    const lastComma = clean.lastIndexOf(',');
    const lastDot = clean.lastIndexOf('.');

    if (lastComma !== -1 && lastDot !== -1) {
      if (lastDot > lastComma) {
        clean = clean.replace(/,/g, '');
      } else {
        clean = clean.replace(/\./g, '').replace(',', '.');
      }
    } else if (lastComma !== -1) {
      const parts = clean.split(',');
      if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
        clean = clean.replace(/,/g, '');
      } else {
        clean = clean.replace(',', '.');
      }
    } else if (lastDot !== -1) {
      const parts = clean.split('.');
      if (parts.length > 2) {
        clean = clean.replace(/\./g, '');
      }
    }

    return parseFloat(clean) || 0;
  };

  const getRealKuantumKg = (row: any, kuantumCol: string, productCol: string, allCols: string[]) => {
    const qtyKg = parseNumber(row[kuantumCol]);
    const qtyRecCol = allCols.find(c => c.toLowerCase().includes('qty received') || c.toLowerCase().includes('received'));
    const qtyRec = qtyRecCol ? parseNumber(row[qtyRecCol]) : 0;
    
    const totalCol = allCols.find(c => c.toLowerCase() === 'total');
    const totalAmount = totalCol ? parseNumber(row[totalCol]) : 0;
    
    const productStr = (row[productCol] || '').toString().toUpperCase();

    if (totalAmount > 0) {
      const priceByKg = qtyKg > 0 ? totalAmount / qtyKg : 0;
      const priceByRec = qtyRec > 0 ? totalAmount / qtyRec : 0;

      // Case A: ERP multiplied qty by 50 into qty_kg (e.g. 20,250 kg became 1,012,500 kg, price dropped to ~165 Rp/kg)
      if (priceByKg < 2500 && 4000 <= priceByRec && priceByRec <= 25000) {
        return qtyRec;
      }

      // Case B: ERP entered number of sacks in qty_kg (e.g. 240 sacks of 50 kg, price jumped to ~640,000 Rp/kg)
      if (priceByKg > 50000 && 4000 <= (totalAmount / (qtyKg * 50)) && (totalAmount / (qtyKg * 50)) <= 25000) {
        return qtyKg * 50;
      }

      // Case C: qtyKg is 0 or unentered, but qtyRec is present
      if (qtyKg === 0 && qtyRec > 0) {
        if (4000 <= priceByRec && priceByRec <= 25000) {
          return qtyRec;
        } else if ((productStr.includes('50 KG') || productStr.includes('50KG')) && 4000 <= (totalAmount / (qtyRec * 50)) && (totalAmount / (qtyRec * 50)) <= 25000) {
          return qtyRec * 50;
        } else if ((productStr.includes('25 KG') || productStr.includes('25KG')) && 4000 <= (totalAmount / (qtyRec * 25)) && (totalAmount / (qtyRec * 25)) <= 25000) {
          return qtyRec * 25;
        }
      }
    }

    // Case D: Fallback pack size logic
    if ((productStr.includes('50 KG') || productStr.includes('50KG')) && qtyKg > 0 && qtyKg < 2000 && totalAmount > 0) {
      if (totalAmount / qtyKg > 50000) {
        return qtyKg * 50;
      }
    }
    if ((productStr.includes('25 KG') || productStr.includes('25KG')) && qtyKg > 0 && qtyKg < 2000 && totalAmount > 0) {
      if (totalAmount / qtyKg > 50000) {
        return qtyKg * 25;
      }
    }

    return qtyKg > 0 ? qtyKg : qtyRec;
  };

  const classifyCommodity = (categoryRaw: any, productRaw: any): 'BERAS' | 'GABAH' | 'JAGUNG' | 'LAINNYA' => {
    const cat = (categoryRaw || '').toString().trim().toUpperCase();
    const prod = (productRaw || '').toString().trim().toUpperCase();

    // 1. Strict Exclusion of non-commodities (Kemasan, non-commodity, spare part, biaya, dll)
    if (
      cat.includes('KEMASAN') ||
      cat.includes('NON COMODITY') ||
      cat.includes('NON KOMODITI') ||
      cat.includes('SPARE PART') ||
      cat.includes('JASTASMA') ||
      cat.includes('EXPENSE') ||
      cat.includes('BIAYA') ||
      cat.includes('SEWA') ||
      cat.includes('JASA') ||
      prod.startsWith('[D') || // Kemasan prefix
      prod.startsWith('[E')    // Expense prefix
    ) {
      return 'LAINNYA';
    }

    // 2. Clear Commodity Category matching
    if (cat.includes('JAGUNG') || prod.includes('JAGUNG')) {
      return 'JAGUNG';
    }
    if (cat.includes('GKP') || cat.includes('GABAH') || cat.includes('GKG')) {
      return 'GABAH';
    }
    if (cat.includes('BERAS') || cat.includes('BAHAN BAKU')) {
      return 'BERAS';
    }

    // 3. Fallback matching based on product code / description
    if (prod.includes('GKP') || prod.includes('GABAH') || prod.includes('GKG')) {
      return 'GABAH';
    }
    if (
      prod.includes('BERAS BAHAN BAKU') || 
      prod.includes('PECAH KULIT') || 
      prod.includes('BPK') || 
      prod.includes('BERAS ASALAN') ||
      prod.includes('BERAS')
    ) {
      return 'BERAS';
    }

    return 'LAINNYA';
  };

  // Extract unique komoditi for filter
  const komoditiOptions = useMemo(() => {
    if (!data.length) return [];
    // Assume column name might be 'komoditi', 'Komoditi', or 'Product Category'
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category'));
    if (!komoditiCol) return [];
    
    const unique = new Set(data.map(r => r[komoditiCol]).filter(Boolean));
    return Array.from(unique) as string[];
  }, [data, columns]);

  // Pivot Logic for Tab 1: Realisasi Pengadaan
  const reportRealisasiPengadaan = useMemo(() => {
    if (!data.length || activeTab !== "report1") return null;

    const gudangCol = columns.find(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company')) || 'Company';
    const tglPoCol = columns.find(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date')) || 'Order Date';
    const kuantumCol = columns.find(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)') || 'Qty (Kg)';
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category')) || 'Product Category';

    const pivot: Record<string, Record<string, number>> = {};
    const datesSet = new Set<string>();

    const selectedKomoditi = filterKomoditi.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);

    data.forEach(row => {
      const statusCol = columns.find(c => c.toLowerCase() === 'status') || 'Status';
      const statusVal = (row[statusCol] || '').toString().trim().toUpperCase();
      const productCol = columns.find(c => c.toLowerCase() === 'product') || 'Product';
      const komoditiType = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditiType === 'LAINNYA') return;

      const komoditiVal = (row[komoditiCol] || '').toString().toUpperCase();
      const productVal = (row[productCol] || '').toString().toUpperCase();
      const matchesFilter = selectedKomoditi.length === 0 || selectedKomoditi.some(k => 
        komoditiType === k || komoditiVal.includes(k) || productVal.includes(k)
      );
      if (!matchesFilter) return;

      const gudang = normalizeGudangName(row[gudangCol] || 'Tanpa Gudang');
      const val = getRealKuantumKg(row, kuantumCol, productCol, columns) / 1000; // Dibagi 1000 (Ton)
      if (val === 0) return;
      
      const dateObj = parseDate(row[tglPoCol]);
      let dateKey = "Unknown Date";
      let monthKey = "Unknown Month";
      if (dateObj) {
        // Format YYYY-MM-DD for sorting using local components (avoid UTC shift)
        dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        // Format Month
        monthKey = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
      }

      datesSet.add(dateKey);

      if (!pivot[gudang]) {
        pivot[gudang] = { 'Total': 0 };
      }
      if (!pivot[gudang][dateKey]) pivot[gudang][dateKey] = 0;
      if (!pivot[gudang][monthKey]) pivot[gudang][monthKey] = 0;
      
      pivot[gudang][dateKey] += val;
      pivot[gudang][monthKey] += val; // Aggregate by month
      pivot[gudang]['Total'] += val;
    });

    const dates = Array.from(datesSet).sort();
    
    // Group dates by month for header spanning
    const monthGroups: { month: string, count: number, dates: string[] }[] = [];
    dates.forEach(d => {
      if (d === "Unknown Date") {
        monthGroups.push({ month: "UNKNOWN MONTH", count: 1, dates: [d] });
        return;
      }
      const monthStr = new Date(d).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
      const lastGroup = monthGroups[monthGroups.length - 1];
      if (lastGroup && lastGroup.month === monthStr) {
        lastGroup.count += 1;
        lastGroup.dates.push(d);
      } else {
        monthGroups.push({ month: monthStr, count: 1, dates: [d] });
      }
    });

    return { pivot, dates, monthGroups, gudangCol, tglPoCol, kuantumCol };
  }, [data, columns, activeTab, filterKomoditi]);

  const [subTabReport1, setSubTabReport1] = useState<"pivot" | "final" | "jagung" | "rp-ubi" | "pivot-custom">("pivot");
  const [subTabReport2, setSubTabReport2] = useState<"pivot" | "final" | "jagung" | "rp-ubi" | "pivot-custom">("pivot");
  const [filterKomoditiReport2, setFilterKomoditiReport2] = useState<string>("BERAS,BAHAN BAKU");
  const [showDailyReport2, setShowDailyReport2] = useState<boolean>(false);
  const [subTabReport3, setSubTabReport3] = useState<"pivot" | "harga" | "final" | "pivot-custom">("pivot");
  const [filterKomoditiReport3Pivot, setFilterKomoditiReport3Pivot] = useState<string>("BERAS,BAHAN BAKU");
  const [showDailyReport3, setShowDailyReport3] = useState<boolean>(false);
  const [filterKomoditiReport3, setFilterKomoditiReport3] = useState<"BERAS" | "GABAH" | "JAGUNG">("BERAS");
  const [subTabReport4, setSubTabReport4] = useState<"penyerapan" | "hpp" | "final" | "pivot-custom">("penyerapan");
  const [subTabReport5, setSubTabReport5] = useState<"persediaan" | "hpp" | "hasil-samping">("persediaan");
  const [filterCategoriesReport5, setFilterCategoriesReport5] = useState<string[]>(["GKG"]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [hideZeroReport5, setHideZeroReport5] = useState<boolean>(true);

  const [filterCategoriesReport5HPP, setFilterCategoriesReport5HPP] = useState<string[]>(["GKG"]);
  const [isCategoryDropdownOpenHPP, setIsCategoryDropdownOpenHPP] = useState<boolean>(false);
  const categoryDropdownRefHPP = useRef<HTMLDivElement>(null);
  const [hideZeroReport5HPP, setHideZeroReport5HPP] = useState<boolean>(true);

  const [filterProductsReport5HasilSamping, setFilterProductsReport5HasilSamping] = useState<string[]>(["BROKEN"]);
  const [isProductDropdownOpenHasilSamping, setIsProductDropdownOpenHasilSamping] = useState<boolean>(false);
  const productDropdownRefHasilSamping = useRef<HTMLDivElement>(null);
  const [hideZeroReport5HasilSamping, setHideZeroReport5HasilSamping] = useState<boolean>(true);

  const [subTabReport6, setSubTabReport6] = useState<"pivot" | "final">("pivot");
  const [filterCategoriesReport6Pivot, setFilterCategoriesReport6Pivot] = useState<string[]>([
    "Beras Bahan Baku",
    "Beras Jadi",
    "Produk Sampingan",
    "Services"
  ]);
  const [isCategoryDropdownOpenReport6, setIsCategoryDropdownOpenReport6] = useState<boolean>(false);
  const categoryDropdownRefReport6 = useRef<HTMLDivElement>(null);
  const [showDailyReport6, setShowDailyReport6] = useState<boolean>(true);
  const [hideZeroReport6Pivot, setHideZeroReport6Pivot] = useState<boolean>(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (categoryDropdownRefHPP.current && !categoryDropdownRefHPP.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpenHPP(false);
      }
      if (productDropdownRefHasilSamping.current && !productDropdownRefHasilSamping.current.contains(event.target as Node)) {
        setIsProductDropdownOpenHasilSamping(false);
      }
      if (categoryDropdownRefReport6.current && !categoryDropdownRefReport6.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpenReport6(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pivot Logic for Tab 2: Harga Pembelian (Weighted Average Price Rp/Kg = Total / Qty)
  const reportHargaPembelianPivot = useMemo(() => {
    if (!data.length || activeTab !== "report2") return null;

    const gudangCol = columns.find(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company')) || 'Company';
    const tglPoCol = columns.find(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date')) || 'Order Date';
    const kuantumCol = columns.find(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)') || 'Qty (Kg)';
    const totalCol = columns.find(c => c.toLowerCase() === 'total') || 'Total';
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category')) || 'Product Category';
    const productCol = columns.find(c => c.toLowerCase() === 'product') || 'Product';

    const accum: Record<string, Record<string, { total: number, qty: number }>> = {};
    const datesSet = new Set<string>();

    const selectedKomoditi = filterKomoditiReport2.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);

    data.forEach(row => {
      const komoditiType = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditiType === 'LAINNYA') return;

      const komoditiVal = (row[komoditiCol] || '').toString().toUpperCase();
      const productVal = (row[productCol] || '').toString().toUpperCase();
      const matchesFilter = selectedKomoditi.length === 0 || selectedKomoditi.some(k => 
        komoditiType === k || komoditiVal.includes(k) || productVal.includes(k)
      );
      if (!matchesFilter) return;

      const gudang = normalizeGudangName(row[gudangCol] || 'Tanpa Gudang');
      const qtyKg = getRealKuantumKg(row, kuantumCol, productCol, columns);
      const totalRp = parseNumber(row[totalCol]);
      if (qtyKg === 0 || totalRp === 0) return;

      const dateObj = parseDate(row[tglPoCol]);
      let dateKey = "Unknown Date";
      let monthKey = "Unknown Month";
      if (dateObj) {
        dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        monthKey = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
      }

      datesSet.add(dateKey);

      if (!accum[gudang]) {
        accum[gudang] = { 'Total': { total: 0, qty: 0 } };
      }
      if (!accum[gudang][dateKey]) accum[gudang][dateKey] = { total: 0, qty: 0 };
      if (!accum[gudang][monthKey]) accum[gudang][monthKey] = { total: 0, qty: 0 };

      accum[gudang][dateKey].total += totalRp;
      accum[gudang][dateKey].qty += qtyKg;

      accum[gudang][monthKey].total += totalRp;
      accum[gudang][monthKey].qty += qtyKg;

      accum[gudang]['Total'].total += totalRp;
      accum[gudang]['Total'].qty += qtyKg;
    });

    const dates = Array.from(datesSet).sort();

    const monthGroups: { month: string, count: number, dates: string[] }[] = [];
    dates.forEach(d => {
      if (d === "Unknown Date") {
        monthGroups.push({ month: "UNKNOWN MONTH", count: 1, dates: [d] });
        return;
      }
      const monthStr = new Date(d).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
      const lastGroup = monthGroups[monthGroups.length - 1];
      if (lastGroup && lastGroup.month === monthStr) {
        lastGroup.count += 1;
        lastGroup.dates.push(d);
      } else {
        monthGroups.push({ month: monthStr, count: 1, dates: [d] });
      }
    });

    const pivot: Record<string, Record<string, number>> = {};
    const columnTotals: Record<string, { total: number, qty: number }> = {};

    Object.keys(accum).forEach(gudang => {
      pivot[gudang] = {};
      Object.keys(accum[gudang]).forEach(key => {
        const item = accum[gudang][key];
        pivot[gudang][key] = item.qty > 0 ? Math.round(item.total / item.qty) : 0;

        if (!columnTotals[key]) columnTotals[key] = { total: 0, qty: 0 };
        columnTotals[key].total += item.total;
        columnTotals[key].qty += item.qty;
      });
    });

    const grandAverages: Record<string, number> = {};
    Object.keys(columnTotals).forEach(key => {
      grandAverages[key] = columnTotals[key].qty > 0 ? Math.round(columnTotals[key].total / columnTotals[key].qty) : 0;
    });

    return { pivot, grandAverages, dates, monthGroups, gudangCol, tglPoCol, kuantumCol };
  }, [data, columns, activeTab, filterKomoditiReport2]);

  // Pivot Logic for Tab 3: Realisasi Pengadaan UB (Weighted Average Price Rp/Kg = Total / Qty)
  const reportPengadaanUBPivot = useMemo(() => {
    if (!data.length || activeTab !== "report3") return null;

    const gudangCol = columns.find(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company')) || 'Company';
    const tglPoCol = columns.find(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date')) || 'Order Date';
    const kuantumCol = columns.find(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)') || 'Qty (Kg)';
    const totalCol = columns.find(c => c.toLowerCase() === 'total') || 'Total';
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category')) || 'Product Category';
    const productCol = columns.find(c => c.toLowerCase() === 'product') || 'Product';

    const accum: Record<string, Record<string, { total: number, qty: number }>> = {};
    const datesSet = new Set<string>();

    const selectedKomoditi = filterKomoditiReport3Pivot.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);

    data.forEach(row => {
      const komoditiType = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditiType === 'LAINNYA') return;

      const komoditiVal = (row[komoditiCol] || '').toString().toUpperCase();
      const productVal = (row[productCol] || '').toString().toUpperCase();
      const matchesFilter = selectedKomoditi.length === 0 || selectedKomoditi.some(k => 
        komoditiType === k || komoditiVal.includes(k) || productVal.includes(k)
      );
      if (!matchesFilter) return;

      const gudang = normalizeGudangName(row[gudangCol] || 'Tanpa Gudang');
      const qtyKg = getRealKuantumKg(row, kuantumCol, productCol, columns);
      const totalRp = parseNumber(row[totalCol]);
      if (qtyKg === 0 || totalRp === 0) return;

      const dateObj = parseDate(row[tglPoCol]);
      let dateKey = "Unknown Date";
      let monthKey = "Unknown Month";
      if (dateObj) {
        dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        monthKey = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
      }

      datesSet.add(dateKey);

      if (!accum[gudang]) {
        accum[gudang] = { 'Total': { total: 0, qty: 0 } };
      }
      if (!accum[gudang][dateKey]) accum[gudang][dateKey] = { total: 0, qty: 0 };
      if (!accum[gudang][monthKey]) accum[gudang][monthKey] = { total: 0, qty: 0 };

      accum[gudang][dateKey].total += totalRp;
      accum[gudang][dateKey].qty += qtyKg;

      accum[gudang][monthKey].total += totalRp;
      accum[gudang][monthKey].qty += qtyKg;

      accum[gudang]['Total'].total += totalRp;
      accum[gudang]['Total'].qty += qtyKg;
    });

    const dates = Array.from(datesSet).sort();

    const monthGroups: { month: string, count: number, dates: string[] }[] = [];
    dates.forEach(d => {
      if (d === "Unknown Date") {
        monthGroups.push({ month: "UNKNOWN MONTH", count: 1, dates: [d] });
        return;
      }
      const monthStr = new Date(d).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
      const lastGroup = monthGroups[monthGroups.length - 1];
      if (lastGroup && lastGroup.month === monthStr) {
        lastGroup.count += 1;
        lastGroup.dates.push(d);
      } else {
        monthGroups.push({ month: monthStr, count: 1, dates: [d] });
      }
    });

    const pivot: Record<string, Record<string, number>> = {};
    const columnTotals: Record<string, { total: number, qty: number }> = {};

    Object.keys(accum).forEach(gudang => {
      pivot[gudang] = {};
      Object.keys(accum[gudang]).forEach(key => {
        const item = accum[gudang][key];
        pivot[gudang][key] = item.qty > 0 ? Math.round(item.total / item.qty) : 0;

        if (!columnTotals[key]) columnTotals[key] = { total: 0, qty: 0 };
        columnTotals[key].total += item.total;
        columnTotals[key].qty += item.qty;
      });
    });

    const grandAverages: Record<string, number> = {};
    Object.keys(columnTotals).forEach(key => {
      grandAverages[key] = columnTotals[key].qty > 0 ? Math.round(columnTotals[key].total / columnTotals[key].qty) : 0;
    });

    return { pivot, grandAverages, dates, monthGroups, gudangCol, tglPoCol, kuantumCol };
  }, [data, columns, activeTab, filterKomoditiReport3Pivot]);
  
  const report3HargaData = useMemo(() => {
    if (!data.length || activeTab !== 'report3' || subTabReport3 !== 'harga') return null;

    const gudangCol = columns.find(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company')) || 'Company';
    const tglPoCol = columns.find(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date')) || 'Order Date';
    const kuantumCol = columns.find(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)') || 'Qty (Kg)';
    const totalCol = columns.find(c => c.toLowerCase() === 'total') || 'Total';
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category')) || 'Product Category';
    const productCol = columns.find(c => c.toLowerCase() === 'product') || 'Product';

    // 1. Detect dynamic latest month and year
    let latestMonth = 7; // default August (0-indexed 7)
    let latestYear = 2026;
    data.forEach(row => {
      const d = parseDate(row[tglPoCol]);
      if (d) {
        const m = d.getMonth();
        const y = d.getFullYear();
        if (y > latestYear || (y === latestYear && m > latestMonth)) {
          latestMonth = m;
          latestYear = y;
        }
      }
    });

    const prevMonth = (latestMonth - 1 + 12) % 12;
    const fullMonthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
    const prevMonthName = fullMonthNames[prevMonth];
    const currentMonthName = fullMonthNames[latestMonth];

    const grouped: Record<string, {
      prevQty: number;
      prevTotal: number;
      currentQty: number;
      currentTotal: number;
      totalQty: number;
      totalNom: number;
      harga: number;
    }> = {};

    let grandPrevQty = 0;
    let grandPrevTotal = 0;
    let grandCurrentQty = 0;
    let grandCurrentTotal = 0;

    // Seed historical data for previous month (e.g. Juli 2026)
    const histData = HISTORICAL_REALISASI_PENGADAAN_UB_JULI_2026[filterKomoditiReport3] || {};
    Object.keys(histData).forEach(gudang => {
      const h = histData[gudang];
      if (!grouped[gudang]) {
        grouped[gudang] = {
          prevQty: 0,
          prevTotal: 0,
          currentQty: 0,
          currentTotal: 0,
          totalQty: 0,
          totalNom: 0,
          harga: 0
        };
      }
      grouped[gudang].prevQty += h.kuantum;
      grouped[gudang].prevTotal += h.nilai;
      grandPrevQty += h.kuantum;
      grandPrevTotal += h.nilai;
    });

    data.forEach(row => {
      const komoditi = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditi !== filterKomoditiReport3) return;

      const gudang = normalizeGudangName(row[gudangCol] || 'UNKNOWN');
      const qtyKg = getRealKuantumKg(row, kuantumCol, productCol, columns);
      const totalRp = parseNumber(row[totalCol]);

      if (qtyKg <= 0 && totalRp <= 0) return;

      if (!grouped[gudang]) {
        grouped[gudang] = {
          prevQty: 0,
          prevTotal: 0,
          currentQty: 0,
          currentTotal: 0,
          totalQty: 0,
          totalNom: 0,
          harga: 0
        };
      }

      // Add to current active month transactions
      grouped[gudang].currentQty += qtyKg;
      grouped[gudang].currentTotal += totalRp;
      grandCurrentQty += qtyKg;
      grandCurrentTotal += totalRp;
    });

    Object.keys(grouped).forEach(gudang => {
      const item = grouped[gudang];
      item.totalQty = item.prevQty + item.currentQty;
      item.totalNom = item.prevTotal + item.currentTotal;
      item.harga = item.totalQty > 0 ? Math.round(item.totalNom / item.totalQty) : 0;
    });

    const grandTotalQty = grandPrevQty + grandCurrentQty;
    const grandTotalNom = grandPrevTotal + grandCurrentTotal;
    const grandHarga = grandTotalQty > 0 ? Math.round(grandTotalNom / grandTotalQty) : 0;

    const sortedGudang = Object.keys(grouped).sort((a, b) => {
      const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
      const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
      if (ordA !== ordB) return ordA - ordB;
      return a.localeCompare(b);
    });

    return {
      grouped,
      sortedGudang,
      prevMonthName,
      currentMonthName,
      grandPrevQty,
      grandPrevTotal,
      grandCurrentQty,
      grandCurrentTotal,
      grandTotalQty,
      grandTotalNom,
      grandHarga
    };
  }, [data, columns, activeTab, subTabReport3, filterKomoditiReport3]);

  // Report 4: Data Penyerapan (Pure GKP / Gabah only, structured like Report 3 Harga)
  const report4PenyerapanData = useMemo(() => {
    if (!data.length) return null;

    const gudangCol = columns.find(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company')) || 'Company';
    const tglPoCol = columns.find(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date')) || 'Order Date';
    const kuantumCol = columns.find(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)') || 'Qty (Kg)';
    const totalCol = columns.find(c => c.toLowerCase() === 'total') || 'Total';
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category')) || 'Product Category';
    const productCol = columns.find(c => c.toLowerCase() === 'product') || 'Product';

    // 1. Detect dynamic latest date, month and year from uploaded dataset
    let maxDate = new Date(0);
    data.forEach(row => {
      const d = parseDate(row[tglPoCol]);
      if (d && d.getTime() > maxDate.getTime()) {
        maxDate = d;
      }
    });

    const fullMonthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
    const hasValidDate = maxDate.getTime() > 0;
    const latestMonth = hasValidDate ? maxDate.getMonth() : 7;
    const latestYear = hasValidDate ? maxDate.getFullYear() : 2026;
    const latestDay = hasValidDate ? maxDate.getDate() : 31;

    const prevMonth = (latestMonth - 1 + 12) % 12;
    const prevMonthName = fullMonthNames[prevMonth];
    const currentMonthName = fullMonthNames[latestMonth];
    const latestDateFormatted = `${latestDay} ${currentMonthName} ${latestYear}`;

    const grouped: Record<string, {
      prevQty: number;
      prevTotal: number;
      currentQty: number;
      currentTotal: number;
      totalQty: number;
      totalNom: number;
      harga: number;
    }> = {};

    let grandPrevQty = 0;
    let grandPrevTotal = 0;
    let grandCurrentQty = 0;
    let grandCurrentTotal = 0;

    // Seed historical data for previous month (GABAH SPP Penyerapan baseline)
    const histData = HISTORICAL_PENYERAPAN_GABAH_SPP_JULI_2026 || {};
    Object.keys(histData).forEach(gudang => {
      if (!gudang.startsWith('SPP') && WAREHOUSE_METADATA[gudang]?.group !== 'SPP') return;
      const h = histData[gudang];
      if (!grouped[gudang]) {
        grouped[gudang] = {
          prevQty: 0,
          prevTotal: 0,
          currentQty: 0,
          currentTotal: 0,
          totalQty: 0,
          totalNom: 0,
          harga: 0
        };
      }
      grouped[gudang].prevQty += h.kuantum;
      grouped[gudang].prevTotal += h.nilai;
      grandPrevQty += h.kuantum;
      grandPrevTotal += h.nilai;
    });

    data.forEach(row => {
      const status = (row['Status'] || '').trim().toUpperCase();
      if (status === 'CANCELLED' || status === 'DRAFT RFQ') return;

      const komoditi = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditi !== 'GABAH') return;

      const gudang = normalizeGudangName(row[gudangCol] || 'UNKNOWN');
      if (!gudang.startsWith('SPP') && WAREHOUSE_METADATA[gudang]?.group !== 'SPP') return;

      const qtyKg = getRealKuantumKg(row, kuantumCol, productCol, columns);
      const totalRp = parseNumber(row[totalCol]);

      if (qtyKg <= 0 && totalRp <= 0) return;

      if (!grouped[gudang]) {
        grouped[gudang] = {
          prevQty: 0,
          prevTotal: 0,
          currentQty: 0,
          currentTotal: 0,
          totalQty: 0,
          totalNom: 0,
          harga: 0
        };
      }

      // Add to current active month transactions
      grouped[gudang].currentQty += qtyKg;
      grouped[gudang].currentTotal += totalRp;
      grandCurrentQty += qtyKg;
      grandCurrentTotal += totalRp;
    });

    Object.keys(grouped).forEach(gudang => {
      const item = grouped[gudang];
      item.totalQty = item.prevQty + item.currentQty;
      item.totalNom = item.prevTotal + item.currentTotal;
      item.harga = item.totalQty > 0 ? Math.round(item.totalNom / item.totalQty) : 0;
    });

    const grandTotalQty = grandPrevQty + grandCurrentQty;
    const grandTotalNom = grandPrevTotal + grandCurrentTotal;
    const grandHarga = grandTotalQty > 0 ? Math.round(grandTotalNom / grandTotalQty) : 0;

    const sortedGudang = Object.keys(grouped).sort((a, b) => {
      const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
      const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
      if (ordA !== ordB) return ordA - ordB;
      return a.localeCompare(b);
    });

    return {
      grouped,
      sortedGudang,
      prevMonthName,
      currentMonthName,
      latestDay,
      latestYear,
      latestDateFormatted,
      grandPrevQty,
      grandPrevTotal,
      grandCurrentQty,
      grandCurrentTotal,
      grandTotalQty,
      grandTotalNom,
      grandHarga,
      latestMonth
    };
  }, [data, columns]);

  // Persediaan GKP & GKG for SPP (Table 3 in Tab Penyerapan)
  const persediaanSPP = useMemo(() => {
    const result: Record<string, { gkpTon: number; gkgTon: number }> = {};
    const sppList = [
      'SPP SUBANG', 'SPP KARAWANG', 'SPP LAMPUNG', 'SPP KENDAL',
      'SPP SRAGEN', 'SPP MAGETAN', 'SPP BOJONEGORO', 'SPP JEMBER',
      'SPP BANYUWANGI', 'SPP SUMBAWA'
    ];
    sppList.forEach(spp => {
      result[spp] = { gkpTon: 0, gkgTon: 0 };
    });

    if (!inventoryData || inventoryData.length === 0) {
      return result;
    }

    const companyCol = inventoryColumns.find(c => c.toLowerCase().includes('company') || c.toLowerCase().includes('gudang')) || 'Company';
    const catCol = inventoryColumns.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const prodCol = inventoryColumns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('produk')) || 'Product';
    const qtyCol = inventoryColumns.find(c => c.toLowerCase().includes('remaining') || c.toLowerCase().includes('qty') || c.toLowerCase().includes('kuantum')) || 'Remaining Qty';

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany || !result[normCompany]) return;

      const cat = (row[catCol]?.toString() || '').toUpperCase();
      const prod = (row[prodCol]?.toString() || '').toUpperCase();
      
      let rawQty = row[qtyCol];
      if (typeof rawQty === 'string') {
        rawQty = parseFloat(rawQty.replace(/,/g, ''));
      }
      const qtyKg = typeof rawQty === 'number' && !isNaN(rawQty) ? rawQty : 0;
      const ton = qtyKg / 1000;

      if (cat.includes('GKP') || prod.includes('GKP') || cat.includes('GABAH KERING PANEN') || prod.includes('GABAH KERING PANEN')) {
        result[normCompany].gkpTon += ton;
      } else if (cat.includes('GKG') || prod.includes('GKG') || cat.includes('GABAH KERING GILING') || prod.includes('GABAH KERING GILING')) {
        result[normCompany].gkgTon += ton;
      }
    });

    return result;
  }, [inventoryData, inventoryColumns]);

  // Stok Hari Ini (Slot 2 Persediaan / Actual Inventory Accumulation for Slide 1)
  const stokHariIni = useMemo(() => {
    if (!inventoryData || inventoryData.length === 0) return null;

    const companyCol = inventoryColumns.find(c => {
      const s = c.toLowerCase();
      return s.includes('company') || s.includes('gudang') || s.includes('lokasi') || s.includes('unit') || s.includes('cabang');
    }) || 'Company';

    const catCol = inventoryColumns.find(c => {
      const s = c.toLowerCase();
      return s.includes('category') || s.includes('kategori') || s.includes('komoditi') || s.includes('commodity');
    }) || 'Product Category';

    const prodCol = inventoryColumns.find(c => {
      const s = c.toLowerCase();
      return s === 'product' || s.includes('produk') || s.includes('item') || s.includes('barang') || s.includes('deskripsi') || s.includes('description') || s.includes('nama');
    }) || 'Product';

    const qtyCol = inventoryColumns.find(c => {
      const s = c.toLowerCase();
      return s.includes('remaining') || s.includes('qty') || s.includes('kuantum') || s.includes('stok') || s.includes('stock') || s.includes('saldo') || s.includes('jumlah');
    }) || 'Remaining Qty';

    // Prioritize explicit Kg column if available in dataset
    const explicitKgCol = inventoryColumns.find(c => {
      const s = c.toLowerCase();
      return s.includes('(kg)') || s.includes('kg') || s.includes('kuantum (kg)');
    });

    const activeQtyCol = explicitKgCol || qtyCol;

    let gabahKg = 0;
    let berasKg = 0;
    let jagungKg = 0;
    let gabahExplicitKg = 0;
    let berasExplicitKg = 0;

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany) return;

      const cat = (row[catCol] || '').toString().toUpperCase();
      const prod = (row[prodCol] || '').toString().toUpperCase();

      // 1. Exclude Kemasan
      if (cat.includes('KEMASAN') || prod.startsWith('[D') || prod.includes('KARPLAS')) return;

      // 2. Exclude Hasil Samping (Produk Sampingan: category SAMPINGAN or SKU starting with [C])
      if (cat.includes('SAMPINGAN') || prod.startsWith('[C')) return;

      // 3. Exclude Other Non-Commodities (Spare parts, barang pelengkap, jasa)
      if (cat.includes('SPARE PART') || cat.includes('PELENGKAP') || cat.includes('JASA') || cat.includes('BIAYA') || cat.includes('SEWA')) return;

      let rawQty = row[qtyCol];
      if (typeof rawQty === 'string') rawQty = parseFloat(rawQty.replace(/,/g, ''));
      const qty = typeof rawQty === 'number' && !isNaN(rawQty) ? rawQty : 0;

      let expQty = explicitKgCol ? row[explicitKgCol] : rawQty;
      if (typeof expQty === 'string') expQty = parseFloat(expQty.replace(/,/g, ''));
      const expKg = typeof expQty === 'number' && !isNaN(expQty) ? expQty : qty;

      const isGabah = (
        cat.includes('GKG') ||
        cat.includes('GKP') ||
        cat.includes('GABAH') ||
        prod.includes('GKG') ||
        prod.includes('GKP') ||
        prod.includes('GABAH') ||
        prod.startsWith('[A005')
      );

      const isBeras = (
        (cat === 'BERAS BAHAN BAKU' || cat.includes('BAHAN BAKU') || prod.startsWith('[A004') || (prod.includes('BERAS BAHAN BAKU') && !prod.includes('WIP'))) ||
        ((cat === 'BERAS JADI' || cat.includes('BERAS PREMIUM') || cat.includes('BERAS MEDIUM') || prod.startsWith('[B00')) && !cat.includes('BAHAN BAKU') && !prod.includes('BAHAN BAKU'))
      ) && !cat.includes('WIP') && !cat.includes('MAKLON') && !cat.includes('SAMPINGAN') && !cat.includes('KEMASAN');

      const isJagung = (
        cat.includes('JAGUNG') ||
        prod.includes('JAGUNG') ||
        prod.startsWith('[A003')
      );

      if (isGabah) {
        gabahKg += getInventoryRealQty(row, inventoryColumns, false);
      } else if (isBeras) {
        berasKg += getInventoryRealQty(row, inventoryColumns, false);
      } else if (isJagung) {
        jagungKg += getInventoryRealQty(row, inventoryColumns, false);
      }
    });

    const catSummary: Record<string, number> = {};
    const unclassifiedRows: Array<{ company: string; cat: string; prod: string; qtyKg: number }> = [];

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const cat = (row[catCol] || '').toString().toUpperCase();
      const prod = (row[prodCol] || '').toString().toUpperCase();
      let rawQty = row[qtyCol];
      if (typeof rawQty === 'string') rawQty = parseFloat(rawQty.replace(/,/g, ''));
      const qtyKg = typeof rawQty === 'number' && !isNaN(rawQty) ? rawQty : 0;
      if (qtyKg <= 0) return;

      catSummary[cat || 'NO_CAT'] = (catSummary[cat || 'NO_CAT'] || 0) + qtyKg;

      const isGabah = (
        cat.includes('GKG') ||
        cat.includes('GKP') ||
        cat.includes('GABAH') ||
        prod.includes('GKG') ||
        prod.includes('GKP') ||
        prod.includes('GABAH') ||
        prod.startsWith('[A005')
      );
      const isKemasan = (cat.includes('KEMASAN') || prod.startsWith('[D') || prod.includes('KARPLAS'));
      const isSampingan = (cat.includes('SAMPINGAN') || prod.startsWith('[C'));
      const isOtherNonComm = (cat.includes('SPARE PART') || cat.includes('PELENGKAP') || cat.includes('JASA') || cat.includes('BIAYA') || cat.includes('SEWA'));

      const isBeras = (
        cat.includes('BERAS') ||
        cat.includes('BAHAN BAKU') ||
        cat.includes('WIP') ||
        cat.includes('PROSES') ||
        cat.includes('SETENGAH JADI') ||
        cat.includes('OLAH') ||
        prod.includes('BERAS') ||
        prod.includes('WIP') ||
        prod.includes('OLAH') ||
        prod.startsWith('[A004') ||
        prod.startsWith('[B') ||
        prod.startsWith('[F')
      );

      if (!isGabah && !isBeras && !isKemasan && !isSampingan && !isOtherNonComm) {
        unclassifiedRows.push({ company: rawCompany, cat, prod: prod.slice(0, 50), qtyKg: Math.round(qtyKg) });
      }
    });

    // Deep diagnostics to determine origin of 5,129 Ton
    const valCol = inventoryColumns.find(c => {
      const s = c.toLowerCase();
      return s.includes('total val') || s.includes('remaining val') || s.includes('nilai') || s.includes('amount');
    }) || 'Total Value';

    const uomCol = inventoryColumns.find(c => {
      const s = c.toLowerCase();
      return s.includes('uom') || s.includes('unit of measure') || s.includes('satuan');
    }) || 'Unit of Measure';

    let berasConvertedKg = 0;
    const berasByCat: Record<string, { count: number; rawKg: number; val: number; convKg: number }> = {};
    const uomList: Record<string, number> = {};

    inventoryData.forEach(row => {
      const cat = (row[catCol] || '').toString().toUpperCase();
      const prod = (row[prodCol] || '').toString().toUpperCase();
      const uom = (row[uomCol] || '').toString();
      let rawQty = row[qtyCol];
      if (typeof rawQty === 'string') rawQty = parseFloat(rawQty.replace(/,/g, ''));
      const qty = typeof rawQty === 'number' && !isNaN(rawQty) ? rawQty : 0;
      if (qty <= 0) return;

      let rawVal = row[valCol];
      if (typeof rawVal === 'string') rawVal = parseFloat(rawVal.replace(/,/g, ''));
      const val = typeof rawVal === 'number' && !isNaN(rawVal) ? rawVal : 0;

      const isBerasRow = cat.includes('BERAS') || prod.includes('BERAS') || cat.includes('WIP') || prod.includes('WIP');
      if (isBerasRow) {
        uomList[uom || 'EMPTY'] = (uomList[uom || 'EMPTY'] || 0) + 1;
        const unitPrice = qty > 0 ? val / qty : 0;
        const matchKg = prod.match(/(\d+)\s*KG/);
        const packSize = matchKg ? parseFloat(matchKg[1]) : 1;
        const conv = (unitPrice > 25000 && packSize > 1) ? qty * packSize : qty;
        berasConvertedKg += conv;

        if (!berasByCat[cat]) berasByCat[cat] = { count: 0, rawKg: 0, val: 0, convKg: 0 };
        berasByCat[cat].count += 1;
        berasByCat[cat].rawKg += qty;
        berasByCat[cat].val += val;
        berasByCat[cat].convKg += conv;
      }
    });

    return {
      gabahTon: Math.round(gabahKg / 1000),
      berasTon: Math.round(berasKg / 1000),
      jagungTon: Math.round(jagungKg / 1000),
    };
  }, [inventoryData, inventoryColumns]);

  // Calculation for Report 5 Tab 1: Persediaan (Sum of Qty per Company filtered by Category Multi-Select)
  const report5PersediaanData = useMemo(() => {
    if (!inventoryData.length || activeTab !== "report5") return null;

    const companyCol = inventoryColumns.find(c => c.toLowerCase().includes('company') || c.toLowerCase().includes('gudang') || c.toLowerCase().includes('lokasi')) || 'Company';
    const catCol = inventoryColumns.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const prodCol = inventoryColumns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('produk')) || 'Product';
    const qtyCol = inventoryColumns.find(c => c.toLowerCase().includes('remaining') || c.toLowerCase().includes('qty') || c.toLowerCase().includes('kuantum')) || 'Remaining Qty';
    const valCol = inventoryColumns.find(c => c.toLowerCase().includes('total value') || c.toLowerCase().includes('remaining value') || c.toLowerCase().includes('nilai') || c.toLowerCase().includes('nominal')) || 'Total Value';

    // 1. Initialize all standard companies from WAREHOUSE_METADATA
    const grouped: Record<string, { qty: number; value: number }> = {};
    Object.keys(WAREHOUSE_METADATA).forEach(w => {
      grouped[w] = { qty: 0, value: 0 };
    });

    const selectedCategories = filterCategoriesReport5.map(s => s.trim().toUpperCase()).filter(Boolean);

    // Helper matcher
    const matchesSingleCategory = (cat: string, prod: string, filter: string): boolean => {
      const f = filter.toUpperCase();
      if (f === 'GKG') {
        return (cat.includes('GKG') || cat.includes('GABAH KERING GILING') || prod.includes('GKG') || prod.includes('GABAH KERING GILING'));
      }
      if (f === 'GKP') {
        return ((cat.includes('GKP') || cat.includes('GABAH KERING PANEN') || prod.includes('GKP') || prod.includes('GABAH KERING PANEN')) && !cat.includes('GKG') && !prod.includes('GKG'));
      }
      if (f.includes('BAHAN BAKU') || f === 'BERAS BAHAN BAKU') {
        if (cat.includes('WIP') || cat.includes('SAMPINGAN') || cat.includes('KEMASAN') || cat.includes('MAKLON')) return false;
        return (cat.includes('BERAS BAHAN BAKU') || cat.includes('BAHAN BAKU') || prod.startsWith('[A004') || (prod.includes('BERAS BAHAN BAKU') && !prod.includes('WIP')));
      }
      if (f.includes('BERAS JADI') || f === 'BERAS JADI') {
        if (cat.includes('WIP') || cat.includes('SAMPINGAN') || cat.includes('KEMASAN') || cat.includes('MAKLON')) return false;
        return ((cat.includes('BERAS JADI') || cat.includes('BERAS PREMIUM') || cat.includes('BERAS MEDIUM') || prod.startsWith('[B00')) && !cat.includes('BAHAN BAKU') && !prod.includes('BAHAN BAKU'));
      }
      if (f.includes('KEMASAN') || f === 'KEMASAN') {
        return (cat.includes('KEMASAN') || prod.startsWith('[D00') || prod.includes('KARPLAS') || prod.includes('KEMASAN'));
      }
      if (f.includes('SAMPINGAN') || f === 'PRODUK SAMPINGAN') {
        return (cat.includes('PRODUK SAMPINGAN') || cat.includes('SAMPINGAN') || prod.startsWith('[C0') || prod.includes('BROKEN') || prod.includes('MENIR') || prod.includes('BEKATUL') || prod.includes('DEDAK') || prod.includes('SEKAM') || prod.includes('BUTIR RIJEK'));
      }
      return false;
    };

    const matchesRow = (category: string, product: string): boolean => {
      if (selectedCategories.length === 0) return true;
      const c = category.toUpperCase();
      const p = product.toUpperCase();
      return selectedCategories.some(filter => matchesSingleCategory(c, p, filter));
    };

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany) return;

      const cat = (row[catCol]?.toString() || '');
      const prod = (row[prodCol]?.toString() || '');

      if (!matchesRow(cat, prod)) return;

      const isKemasan = selectedCategories.length === 1 && selectedCategories[0] === 'KEMASAN';
      const qty = getInventoryRealQty(row, inventoryColumns, isKemasan);

      let rawVal = row[valCol];
      if (typeof rawVal === 'string') {
        rawVal = parseFloat(rawVal.replace(/,/g, ''));
      }
      const val = typeof rawVal === 'number' && !isNaN(rawVal) ? rawVal : 0;

      if (!grouped[normCompany]) {
        grouped[normCompany] = { qty: 0, value: 0 };
      }

      grouped[normCompany].qty += qty;
      grouped[normCompany].value += val;
    });

    // Sort companies by standard WAREHOUSE_METADATA order
    const sortedGudang = Object.keys(grouped).sort((a, b) => {
      const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
      const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
      if (ordA !== ordB) return ordA - ordB;
      return a.localeCompare(b);
    });

    // Totals
    let totalQty = 0;
    let totalValue = 0;
    sortedGudang.forEach(g => {
      totalQty += grouped[g].qty;
      totalValue += grouped[g].value;
    });

    return {
      grouped,
      sortedGudang,
      totalQty,
      totalValue,
      selectedCategories
    };
  }, [inventoryData, inventoryColumns, activeTab, filterCategoriesReport5]);

  // Calculation for Report 5 Tab 2: HPP (Grouped by Company & Product with Qty, Total Value, and Average HPP)
  const report5HPPData = useMemo(() => {
    if (!inventoryData.length || activeTab !== "report5") return null;

    const companyCol = inventoryColumns.find(c => c.toLowerCase().includes('company') || c.toLowerCase().includes('gudang') || c.toLowerCase().includes('lokasi')) || 'Company';
    const catCol = inventoryColumns.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const prodCol = inventoryColumns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('produk')) || 'Product';
    const qtyCol = inventoryColumns.find(c => c.toLowerCase().includes('remaining') || c.toLowerCase().includes('qty') || c.toLowerCase().includes('kuantum')) || 'Remaining Qty';
    const valCol = inventoryColumns.find(c => c.toLowerCase().includes('total value') || c.toLowerCase().includes('remaining value') || c.toLowerCase().includes('nilai') || c.toLowerCase().includes('nominal')) || 'Total Value';

    // 1. Initialize all standard companies from WAREHOUSE_METADATA
    const grouped: Record<string, Record<string, { qty: number; value: number }>> = {};
    Object.keys(WAREHOUSE_METADATA).forEach(w => {
      grouped[w] = {};
    });

    const selectedCategories = filterCategoriesReport5HPP.map(s => s.trim().toUpperCase()).filter(Boolean);

    const matchesSingleCategory = (cat: string, prod: string, filter: string): boolean => {
      const f = filter.toUpperCase();
      if (f === 'GKG') {
        return (cat.includes('GKG') || cat.includes('GABAH KERING GILING') || prod.includes('GKG') || prod.includes('GABAH KERING GILING'));
      }
      if (f.includes('BAHAN BAKU') || f === 'BERAS BAHAN BAKU') {
        if (cat.includes('WIP') || cat.includes('SAMPINGAN') || cat.includes('KEMASAN') || cat.includes('MAKLON')) return false;
        return (cat.includes('BERAS BAHAN BAKU') || cat.includes('BAHAN BAKU') || prod.startsWith('[A004') || (prod.includes('BERAS BAHAN BAKU') && !prod.includes('WIP')));
      }
      if (f.includes('BERAS JADI') || f === 'BERAS JADI') {
        if (cat.includes('WIP') || cat.includes('SAMPINGAN') || cat.includes('KEMASAN') || cat.includes('MAKLON')) return false;
        return ((cat.includes('BERAS JADI') || cat.includes('BERAS PREMIUM') || cat.includes('BERAS MEDIUM') || prod.startsWith('[B00')) && !cat.includes('BAHAN BAKU') && !prod.includes('BAHAN BAKU'));
      }
      if (f.includes('KEMASAN') || f === 'KEMASAN') {
        return (cat.includes('KEMASAN') || prod.startsWith('[D00') || prod.includes('KARPLAS') || prod.includes('KEMASAN'));
      }
      if (f.includes('SAMPINGAN') || f === 'PRODUK SAMPINGAN') {
        return (cat.includes('PRODUK SAMPINGAN') || cat.includes('SAMPINGAN') || prod.startsWith('[C0') || prod.includes('BROKEN') || prod.includes('MENIR') || prod.includes('BEKATUL') || prod.includes('DEDAK') || prod.includes('SEKAM') || prod.includes('BUTIR RIJEK'));
      }
      return false;
    };

    const matchesRow = (category: string, product: string): boolean => {
      if (selectedCategories.length === 0) return true;
      const c = category.toUpperCase();
      const p = product.toUpperCase();
      return selectedCategories.some(filter => matchesSingleCategory(c, p, filter));
    };

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany) return;

      const cat = (row[catCol]?.toString() || '');
      const prod = (row[prodCol]?.toString() || '').trim();
      if (!prod) return;

      if (!matchesRow(cat, prod)) return;

      const isKemasan = selectedCategories.length === 1 && selectedCategories[0] === 'KEMASAN';
      const qty = getInventoryRealQty(row, inventoryColumns, isKemasan);

      let rawVal = row[valCol];
      if (typeof rawVal === 'string') {
        rawVal = parseFloat(rawVal.replace(/,/g, ''));
      }
      const val = typeof rawVal === 'number' && !isNaN(rawVal) ? rawVal : 0;

      if (!grouped[normCompany]) {
        grouped[normCompany] = {};
      }
      if (!grouped[normCompany][prod]) {
        grouped[normCompany][prod] = { qty: 0, value: 0 };
      }

      grouped[normCompany][prod].qty += qty;
      grouped[normCompany][prod].value += val;
    });

    // Sort companies by standard WAREHOUSE_METADATA order
    const sortedGudang = Object.keys(grouped).sort((a, b) => {
      const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
      const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
      if (ordA !== ordB) return ordA - ordB;
      return a.localeCompare(b);
    });

    // Totals
    let totalQty = 0;
    let totalValue = 0;

    // Convert into company groups
    const companyGroups: Array<{
      company: string;
      totalCompanyQty: number;
      totalCompanyValue: number;
      products: Array<{
        productName: string;
        qty: number;
        value: number;
        avgHPP: number;
      }>;
    }> = [];

    sortedGudang.forEach(company => {
      const prodMap = grouped[company] || {};
      const prodKeys = Object.keys(prodMap).sort();

      let companyQty = 0;
      let companyVal = 0;
      const products: Array<{ productName: string; qty: number; value: number; avgHPP: number }> = [];

      prodKeys.forEach(pName => {
        const item = prodMap[pName];
        if (item.qty > 0 || item.value > 0) {
          companyQty += item.qty;
          companyVal += item.value;
          totalQty += item.qty;
          totalValue += item.value;
          products.push({
            productName: pName,
            qty: item.qty,
            value: item.value,
            avgHPP: item.qty > 0 ? item.value / item.qty : 0
          });
        }
      });

      companyGroups.push({
        company,
        totalCompanyQty: companyQty,
        totalCompanyValue: companyVal,
        products
      });
    });

    const grandAvgHPP = totalQty > 0 ? totalValue / totalQty : 0;

    return {
      companyGroups,
      totalQty,
      totalValue,
      grandAvgHPP,
      selectedCategories
    };
  }, [inventoryData, inventoryColumns, activeTab, filterCategoriesReport5HPP]);

  // Options for Report 5 Tab 3: Hasil Samping (Unique products under Produk Sampingan)
  const report5HasilSampingOptions = useMemo(() => {
    const standard = ["BROKEN", "MENIR", "BEKATUL", "BUTIR RIJEK", "DEDAK", "SEKAM"];
    const fromData = new Set<string>();

    const catCol = inventoryColumns.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const prodCol = inventoryColumns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('produk')) || 'Product';

    inventoryData.forEach(row => {
      const cat = (row[catCol]?.toString() || '').toUpperCase();
      const prod = (row[prodCol]?.toString() || '').toUpperCase();
      if (cat.includes('PRODUK SAMPINGAN') || cat.includes('SAMPINGAN') || prod.startsWith('[C0')) {
        standard.forEach(std => {
          if (prod.includes(std)) fromData.add(std);
        });
        const cleanName = prod.replace(/^\[[A-Z0-9]+\]\s*/i, '').trim();
        if (cleanName) fromData.add(cleanName);
      }
    });

    return Array.from(new Set([...standard, ...Array.from(fromData)]));
  }, [inventoryData, inventoryColumns]);

  // Calculation for Report 5 Tab 3: Hasil Samping (Grouped by Company & SKU with Kuantum, Nilai Persediaan, and HPP)
  const report5HasilSampingData = useMemo(() => {
    if (!inventoryData.length || activeTab !== "report5") return null;

    const companyCol = inventoryColumns.find(c => c.toLowerCase().includes('company') || c.toLowerCase().includes('gudang') || c.toLowerCase().includes('lokasi')) || 'Company';
    const catCol = inventoryColumns.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const prodCol = inventoryColumns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('produk')) || 'Product';
    const qtyCol = inventoryColumns.find(c => c.toLowerCase().includes('remaining') || c.toLowerCase().includes('qty') || c.toLowerCase().includes('kuantum')) || 'Remaining Qty';
    const valCol = inventoryColumns.find(c => c.toLowerCase().includes('total value') || c.toLowerCase().includes('remaining value') || c.toLowerCase().includes('nilai') || c.toLowerCase().includes('nominal')) || 'Total Value';

    // 1. Initialize all standard companies from WAREHOUSE_METADATA
    const grouped: Record<string, Record<string, { qty: number; value: number }>> = {};
    Object.keys(WAREHOUSE_METADATA).forEach(w => {
      grouped[w] = {};
    });

    const selectedProds = filterProductsReport5HasilSamping.map(s => s.trim().toUpperCase()).filter(Boolean);

    const matchesProduct = (prod: string): boolean => {
      if (selectedProds.length === 0) return true;
      const p = prod.toUpperCase();
      return selectedProds.some(filter => p.includes(filter));
    };

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany) return;

      const cat = (row[catCol]?.toString() || '').toUpperCase();
      const prod = (row[prodCol]?.toString() || '').trim();
      if (!prod) return;

      // Must be Produk Sampingan
      const isSideProduct = cat.includes('PRODUK SAMPINGAN') || cat.includes('SAMPINGAN') || prod.startsWith('[C0') || prod.toUpperCase().includes('BROKEN') || prod.toUpperCase().includes('MENIR') || prod.toUpperCase().includes('BEKATUL') || prod.toUpperCase().includes('BUTIR RIJEK') || prod.toUpperCase().includes('DEDAK') || prod.toUpperCase().includes('SEKAM');
      if (!isSideProduct) return;

      if (!matchesProduct(prod)) return;

      let rawQty = row[qtyCol];
      if (typeof rawQty === 'string') {
        rawQty = parseFloat(rawQty.replace(/,/g, ''));
      }
      const qty = typeof rawQty === 'number' && !isNaN(rawQty) ? rawQty : 0;

      let rawVal = row[valCol];
      if (typeof rawVal === 'string') {
        rawVal = parseFloat(rawVal.replace(/,/g, ''));
      }
      const val = typeof rawVal === 'number' && !isNaN(rawVal) ? rawVal : 0;

      if (!grouped[normCompany]) {
        grouped[normCompany] = {};
      }
      if (!grouped[normCompany][prod]) {
        grouped[normCompany][prod] = { qty: 0, value: 0 };
      }

      grouped[normCompany][prod].qty += qty;
      grouped[normCompany][prod].value += val;
    });

    // Sort companies by standard WAREHOUSE_METADATA order
    const sortedGudang = Object.keys(grouped).sort((a, b) => {
      const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
      const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
      if (ordA !== ordB) return ordA - ordB;
      return a.localeCompare(b);
    });

    let totalQty = 0;
    let totalValue = 0;

    const companyGroups: Array<{
      company: string;
      totalCompanyQty: number;
      totalCompanyValue: number;
      products: Array<{
        productName: string;
        qty: number;
        value: number;
        avgHPP: number;
      }>;
    }> = [];

    sortedGudang.forEach(company => {
      const prodMap = grouped[company] || {};
      const prodKeys = Object.keys(prodMap).sort();

      let companyQty = 0;
      let companyVal = 0;
      const products: Array<{ productName: string; qty: number; value: number; avgHPP: number }> = [];

      prodKeys.forEach(pName => {
        const item = prodMap[pName];
        if (item.qty > 0 || item.value > 0) {
          companyQty += item.qty;
          companyVal += item.value;
          totalQty += item.qty;
          totalValue += item.value;
          products.push({
            productName: pName,
            qty: item.qty,
            value: item.value,
            avgHPP: item.qty > 0 ? item.value / item.qty : 0
          });
        }
      });

      companyGroups.push({
        company,
        totalCompanyQty: companyQty,
        totalCompanyValue: companyVal,
        products
      });
    });

    const grandAvgHPP = totalQty > 0 ? totalValue / totalQty : 0;

    return {
      companyGroups,
      totalQty,
      totalValue,
      grandAvgHPP,
      selectedProds
    };
  }, [inventoryData, inventoryColumns, activeTab, filterProductsReport5HasilSamping]);

  // Pivot Logic for Tab 6: Realisasi Penjualan (Sum of Total Sales per Company)
  const report6PivotData = useMemo(() => {
    if (!salesData.length || activeTab !== "report6") return null;

    const companyCol = salesColumns.find(c => c.toLowerCase().includes('company') || c.toLowerCase().includes('gudang') || c.toLowerCase().includes('lokasi')) || 'Company';
    const tglCol = salesColumns.find(c => c.toLowerCase().includes('order date') || c.toLowerCase().includes('tanggal')) || 'Order Date';
    const catCol = salesColumns.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const prodCol = salesColumns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('produk')) || 'Product';
    const totalCol = salesColumns.find(c => c.toLowerCase() === 'total' || c.toLowerCase().includes('amount') || c.toLowerCase().includes('nominal')) || 'Total';

    const pivot: Record<string, Record<string, number>> = {};
    const datesSet = new Set<string>();

    // Initialize all standard companies
    Object.keys(WAREHOUSE_METADATA).forEach(w => {
      pivot[w] = { 'Total': 0 };
    });

    const matchesSalesCategory = (cat: string, prod: string, selectedFilters: string[]): boolean => {
      if (selectedFilters.length === 0) return true;
      const c = cat.toUpperCase();
      const p = prod.toUpperCase();

      return selectedFilters.some(filter => {
        const f = filter.toUpperCase();
        if (f.includes('BAHAN BAKU') || f === 'BERAS BAHAN BAKU') {
          return (c.includes('BAHAN BAKU') || p.includes('BAHAN BAKU') || p.startsWith('[A004'));
        }
        if (f.includes('BERAS JADI') || f === 'BERAS JADI') {
          return ((c.includes('BERAS JADI') || c.includes('BERAS PREMIUM') || c.includes('BERAS MEDIUM') || p.startsWith('[B00')) && !c.includes('BAHAN BAKU') && !p.includes('BAHAN BAKU'));
        }
        if (f.includes('SAMPINGAN') || f === 'PRODUK SAMPINGAN') {
          return (c.includes('PRODUK SAMPINGAN') || c.includes('SAMPINGAN') || p.startsWith('[C0') || p.includes('BROKEN') || p.includes('MENIR') || p.includes('BEKATUL') || p.includes('DEDAK') || p.includes('SEKAM') || p.includes('BUTIR RIJEK'));
        }
        if (f.includes('SERVICES') || f.includes('SERVICE') || f.includes('JASA')) {
          return (c.includes('SERVICE') || c.includes('JASA') || c.includes('SEWA') || c.includes('JASTASMA') || p.includes('JASA') || p.includes('SERVICE') || p.startsWith('[E0') || p.startsWith('[D0'));
        }
        return c.includes(f) || p.includes(f);
      });
    };

    salesData.forEach(row => {
      const cat = (row[catCol]?.toString() || '');
      const prod = (row[prodCol]?.toString() || '');

      if (!matchesSalesCategory(cat, prod, filterCategoriesReport6Pivot)) return;

      const rawCompany = row[companyCol]?.toString() || 'Tanpa Gudang';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany) return;

      let rawTotal = row[totalCol];
      if (typeof rawTotal === 'string') {
        rawTotal = parseFloat(rawTotal.replace(/,/g, ''));
      }
      const val = typeof rawTotal === 'number' && !isNaN(rawTotal) ? rawTotal : 0;
      if (val === 0) return;

      const dateObj = parseDate(row[tglCol]);
      let dateKey = "Unknown Date";
      let monthKey = "Unknown Month";
      if (dateObj) {
        // Format YYYY-MM-DD for sorting using local components (avoid UTC shift)
        dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        monthKey = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
      }

      datesSet.add(dateKey);

      if (!pivot[normCompany]) {
        pivot[normCompany] = { 'Total': 0 };
      }
      if (!pivot[normCompany][dateKey]) pivot[normCompany][dateKey] = 0;
      if (!pivot[normCompany][monthKey]) pivot[normCompany][monthKey] = 0;

      pivot[normCompany][dateKey] += val;
      pivot[normCompany][monthKey] += val;
      pivot[normCompany]['Total'] += val;
    });

    const dates = Array.from(datesSet).sort();

    // Group dates by month for header spanning
    const monthGroups: { month: string, count: number, dates: string[] }[] = [];
    dates.forEach(d => {
      if (d === "Unknown Date") {
        monthGroups.push({ month: "UNKNOWN MONTH", count: 1, dates: [d] });
        return;
      }
      const monthStr = new Date(d).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
      const lastGroup = monthGroups[monthGroups.length - 1];
      if (lastGroup && lastGroup.month === monthStr) {
        lastGroup.count += 1;
        lastGroup.dates.push(d);
      } else {
        monthGroups.push({ month: monthStr, count: 1, dates: [d] });
      }
    });

    // Sort companies according to WAREHOUSE_METADATA order
    const sortedCompanies = Object.keys(pivot).sort((a, b) => {
      const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
      const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
      if (ordA !== ordB) return ordA - ordB;
      return a.localeCompare(b);
    });

    return { pivot, dates, monthGroups, sortedCompanies };
  }, [salesData, salesColumns, activeTab, filterCategoriesReport6Pivot]);

  // Final Report Logic for Tab 6: Realisasi Penjualan
  const finalReportRealisasiPenjualan = useMemo(() => {
    // 1. Detect latest date, month and year
    let maxDate = new Date(0);
    const companyCol = salesColumns.find(c => c.toLowerCase().includes('company') || c.toLowerCase().includes('gudang') || c.toLowerCase().includes('lokasi')) || 'Company';
    const tglCol = salesColumns.find(c => c.toLowerCase().includes('order date') || c.toLowerCase().includes('tanggal')) || 'Order Date';
    const catCol = salesColumns.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const prodCol = salesColumns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('produk')) || 'Product';
    const totalCol = salesColumns.find(c => c.toLowerCase() === 'total' || c.toLowerCase().includes('amount') || c.toLowerCase().includes('nominal')) || 'Total';

    salesData.forEach(row => {
      const d = parseDate(row[tglCol]);
      if (d && d.getTime() > maxDate.getTime()) {
        maxDate = d;
      }
    });

    const hasValidDate = maxDate.getTime() > 0;
    const latestMonth = hasValidDate ? maxDate.getMonth() : 7; // Default August (0-indexed 7)
    const latestYear = hasValidDate ? maxDate.getFullYear() : 2026;

    const generateWeeks = (year: number, month: number) => {
      const buckets = [];
      const lastDay = new Date(year, month + 1, 0).getDate();
      let currentStart = 1;
      while (currentStart <= lastDay) {
        let currentEnd = currentStart;
        let d = new Date(year, month, currentEnd);
        while (d.getDay() !== 0 && currentEnd < lastDay) {
          currentEnd++;
          d = new Date(year, month, currentEnd);
        }
        if (currentStart === 1 && currentEnd <= 2 && currentEnd < lastDay) {
          currentEnd++;
          d = new Date(year, month, currentEnd);
          while (d.getDay() !== 0 && currentEnd < lastDay) {
            currentEnd++;
            d = new Date(year, month, currentEnd);
          }
        }
        if (lastDay - currentEnd <= 2) {
          currentEnd = lastDay;
        }
        buckets.push(currentStart === currentEnd ? `W_${currentStart}` : `W_${currentStart}-${currentEnd}`);
        currentStart = currentEnd + 1;
      }
      return buckets;
    };

    const weeks = generateWeeks(latestYear, latestMonth);

    // Setup finalData structure: group -> warehouse -> 'PRODUK' | 'JASA' -> bucket -> value in Rp Juta
    const finalData: Record<string, Record<string, Record<'PRODUK' | 'JASA', Record<string, number>>>> = {
      'SPB': {}, 'SPP': {}, 'UP': {}, 'CDC': {}
    };

    // Initialize all standard 24 warehouses
    Object.keys(WAREHOUSE_METADATA).forEach(gudang => {
      const group = WAREHOUSE_METADATA[gudang]?.group;
      if (group && finalData[group]) {
        finalData[group][gudang] = {
          PRODUK: {},
          JASA: {}
        };
      }
    });

    // Seed historical baseline (JAN - JULI, M_0 - M_6)
    if (HISTORICAL_REALISASI_PENJUALAN_2026_DATA) {
      Object.keys(HISTORICAL_REALISASI_PENJUALAN_2026_DATA).forEach(gudang => {
        const group = WAREHOUSE_METADATA[gudang]?.group;
        if (group && finalData[group] && finalData[group][gudang]) {
          const hist = HISTORICAL_REALISASI_PENJUALAN_2026_DATA[gudang];
          if (hist.PRODUK) {
            Object.keys(hist.PRODUK).forEach(mKey => {
              finalData[group][gudang].PRODUK[mKey] = hist.PRODUK[mKey];
            });
          }
          if (hist.JASA) {
            Object.keys(hist.JASA).forEach(mKey => {
              finalData[group][gudang].JASA[mKey] = hist.JASA[mKey];
            });
          }
        }
      });
    }

    // Accumulate raw Rp totals from salesData
    const currentUploadRaw: Record<string, Record<'PRODUK' | 'JASA', Record<string, number>>> = {};
    const nationalRaw: Record<'PRODUK' | 'JASA', Record<string, number>> = {
      PRODUK: {},
      JASA: {}
    };

    const isJasaType = (categoryRaw: any, productRaw: any): boolean => {
      const c = (categoryRaw || '').toString().trim().toUpperCase();
      const p = (productRaw || '').toString().trim().toUpperCase();
      return (
        c.includes('SERVICE') ||
        c.includes('JASA') ||
        c.includes('SEWA') ||
        c.includes('JASTASMA') ||
        p.includes('JASA') ||
        p.includes('SERVICE') ||
        p.startsWith('[E0') ||
        p.startsWith('[D0')
      );
    };

    salesData.forEach(row => {
      const statusCol = salesColumns.find(c => c.toLowerCase() === 'status') || 'Status';
      const statusVal = (row[statusCol] || '').toString().trim().toUpperCase();
      if (statusVal === 'CANCELLED' || statusVal === 'DRAFT RFQ') return;

      const rawGudang = row[companyCol]?.toString() || '';
      const gudangClean = normalizeGudangName(rawGudang);
      const meta = WAREHOUSE_METADATA[gudangClean];
      if (!meta) return;
      const group = meta.group;

      const catVal = row[catCol];
      const prodVal = row[prodCol];
      const itemType: 'PRODUK' | 'JASA' = isJasaType(catVal, prodVal) ? 'JASA' : 'PRODUK';

      let rawTotal = row[totalCol];
      if (typeof rawTotal === 'string') {
        rawTotal = parseFloat(rawTotal.replace(/,/g, ''));
      }
      const val = typeof rawTotal === 'number' && !isNaN(rawTotal) ? rawTotal : 0;
      if (val === 0) return;

      const d = parseDate(row[tglCol]);
      if (!d) return;

      const m = d.getMonth();
      const y = d.getFullYear();
      const dateNum = d.getDate();

      let bucket = "";
      if (y < latestYear || (y === latestYear && m < latestMonth)) {
        bucket = `M_${m}`;
      } else if (y === latestYear && m === latestMonth) {
        const match = weeks.find(b => {
          const range = b.replace('W_', '').split('-');
          if (range.length === 1) return dateNum === parseInt(range[0]);
          return dateNum >= parseInt(range[0]) && dateNum <= parseInt(range[1]);
        });
        if (match) bucket = match;
      } else {
        return;
      }

      if (!currentUploadRaw[gudangClean]) {
        currentUploadRaw[gudangClean] = { PRODUK: {}, JASA: {} };
      }
      if (!currentUploadRaw[gudangClean][itemType][bucket]) {
        currentUploadRaw[gudangClean][itemType][bucket] = 0;
      }
      currentUploadRaw[gudangClean][itemType][bucket] += val;

      if (!nationalRaw[itemType][bucket]) {
        nationalRaw[itemType][bucket] = 0;
      }
      nationalRaw[itemType][bucket] += val;

      if (y === latestYear && m === latestMonth) {
        const actMKey = `M_${latestMonth}`;
        nationalRaw[itemType][actMKey] = (nationalRaw[itemType][actMKey] || 0) + val;
      }
    });

    // Populate current upload data into finalData in Rp Juta
    Object.keys(currentUploadRaw).forEach(gudang => {
      const meta = WAREHOUSE_METADATA[gudang];
      if (!meta) return;
      const group = meta.group;

      (['PRODUK', 'JASA'] as const).forEach(itemType => {
        const buckets = currentUploadRaw[gudang][itemType];
        Object.keys(buckets).forEach(buck => {
          const rawAmount = buckets[buck];
          const jutaVal = Math.round(rawAmount / 1000000);
          finalData[group][gudang][itemType][buck] = (finalData[group][gudang][itemType][buck] || 0) + jutaVal;
        });
      });
    });

    const pastMonths: number[] = [];
    for (let i = 0; i < latestMonth; i++) {
      pastMonths.push(i);
    }
    const monthNames = ["JAN", "FEB", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGT", "SEPT", "OKT", "NOV", "DES"];
    const fullMonthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

    // Compute Footers
    const finalTotals: Record<string, Record<string, number>> = {
      'TOTAL PRODUK SPB': {},
      'TOTAL JASA SPB': {},
      'TOTAL PRODUK SPP': {},
      'TOTAL JASA SPP': {},
      'TOTAL PRODUK UP': {},
      'TOTAL JASA UP': {},
      'TOTAL PRODUK CDC': {},
      'TOTAL JASA CDC': {},
      'TOTAL PRODUK': {},
      'TOTAL JASA': {},
      'GRAND TOTAL': {}
    };

    const initializeBuckets = (key: string) => {
      pastMonths.forEach(m => finalTotals[key][`M_${m}`] = 0);
      finalTotals[key][`M_${latestMonth}`] = 0;
      weeks.forEach(w => finalTotals[key][w] = 0);
      finalTotals[key]['REAL_SD'] = 0;
    };

    Object.keys(finalTotals).forEach(initializeBuckets);

    // Sum group totals directly from warehouse rows
    (['SPB', 'SPP', 'UP', 'CDC'] as const).forEach(group => {
      const gData = finalData[group] || {};
      const prodTargetKey = `TOTAL PRODUK ${group}`;
      const jasaTargetKey = `TOTAL JASA ${group}`;

      Object.keys(gData).forEach(gudang => {
        const prodItem = gData[gudang]?.PRODUK || {};
        const jasaItem = gData[gudang]?.JASA || {};

        // 1. Past months
        pastMonths.forEach(m => {
          const mKey = `M_${m}`;
          finalTotals[prodTargetKey][mKey] += (prodItem[mKey] || 0);
          finalTotals[jasaTargetKey][mKey] += (jasaItem[mKey] || 0);
        });

        // 2. Weekly buckets
        weeks.forEach(w => {
          finalTotals[prodTargetKey][w] += (prodItem[w] || 0);
          finalTotals[jasaTargetKey][w] += (jasaItem[w] || 0);
        });

        // 3. Active Month (Sum of weeks for closed matrix consistency)
        const currentProdActiveMonth = weeks.reduce((sum, w) => sum + (prodItem[w] || 0), 0);
        const currentJasaActiveMonth = weeks.reduce((sum, w) => sum + (jasaItem[w] || 0), 0);
        finalTotals[prodTargetKey][`M_${latestMonth}`] += currentProdActiveMonth;
        finalTotals[jasaTargetKey][`M_${latestMonth}`] += currentJasaActiveMonth;

        // 4. Real S/D (Sum of past months + active month)
        const prodSd = pastMonths.reduce((sum, m) => sum + (prodItem[`M_${m}`] || 0), 0) + currentProdActiveMonth;
        const jasaSd = pastMonths.reduce((sum, m) => sum + (jasaItem[`M_${m}`] || 0), 0) + currentJasaActiveMonth;
        finalTotals[prodTargetKey]['REAL_SD'] += prodSd;
        finalTotals[jasaTargetKey]['REAL_SD'] += jasaSd;
      });
    });

    // Compute National Totals
    // For buckets with uploaded raw transactions, calculate national summary footers using unrounded raw totals (matching Excel SUM behavior)
    const allBuckets = [...pastMonths.map(m => `M_${m}`), `M_${latestMonth}`, ...weeks];
    allBuckets.forEach(buck => {
      const rawProd = nationalRaw['PRODUK'][buck];
      const rawJasa = nationalRaw['JASA'][buck];

      if (rawProd !== undefined && rawProd > 0) {
        finalTotals['TOTAL PRODUK'][buck] = Math.round(rawProd / 1000000);
      } else {
        finalTotals['TOTAL PRODUK'][buck] = 
          (finalTotals['TOTAL PRODUK SPB'][buck] || 0) +
          (finalTotals['TOTAL PRODUK SPP'][buck] || 0) +
          (finalTotals['TOTAL PRODUK UP'][buck] || 0) +
          (finalTotals['TOTAL PRODUK CDC'][buck] || 0);
      }

      if (rawJasa !== undefined && rawJasa > 0) {
        finalTotals['TOTAL JASA'][buck] = Math.round(rawJasa / 1000000);
      } else {
        finalTotals['TOTAL JASA'][buck] = 
          (finalTotals['TOTAL JASA SPB'][buck] || 0) +
          (finalTotals['TOTAL JASA SPP'][buck] || 0) +
          (finalTotals['TOTAL JASA UP'][buck] || 0) +
          (finalTotals['TOTAL JASA CDC'][buck] || 0);
      }

      if ((rawProd && rawProd > 0) || (rawJasa && rawJasa > 0)) {
        finalTotals['GRAND TOTAL'][buck] = Math.round(((rawProd || 0) + (rawJasa || 0)) / 1000000);
      } else {
        finalTotals['GRAND TOTAL'][buck] =
          (finalTotals['TOTAL PRODUK'][buck] || 0) +
          (finalTotals['TOTAL JASA'][buck] || 0);
      }
    });

    // Recompute National REAL_SD
    const nationalProdSd = pastMonths.reduce((sum, m) => sum + (finalTotals['TOTAL PRODUK'][`M_${m}`] || 0), 0) + (finalTotals['TOTAL PRODUK'][`M_${latestMonth}`] || 0);
    const nationalJasaSd = pastMonths.reduce((sum, m) => sum + (finalTotals['TOTAL JASA'][`M_${m}`] || 0), 0) + (finalTotals['TOTAL JASA'][`M_${latestMonth}`] || 0);
    finalTotals['TOTAL PRODUK']['REAL_SD'] = nationalProdSd;
    finalTotals['TOTAL JASA']['REAL_SD'] = nationalJasaSd;
    finalTotals['GRAND TOTAL']['REAL_SD'] = nationalProdSd + nationalJasaSd;

    return {
      finalData,
      finalTotals,
      pastMonths,
      latestMonth,
      monthNames,
      fullMonthNames,
      weeks,
      hasValidDate
    };
  }, [salesData, salesColumns]);

  // Final Report Logic for Tab 3: Realisasi Pengadaan UB
  const finalReportPengadaanUB = useMemo(() => {
    if (!data.length) return null;

    const gudangCol = columns.find(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company')) || 'Company';
    const tglPoCol = columns.find(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date')) || 'Order Date';
    const kuantumCol = columns.find(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)') || 'Qty (Kg)';
    const totalCol = columns.find(c => c.toLowerCase() === 'total') || 'Total';
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category')) || 'Product Category';
    const productCol = columns.find(c => c.toLowerCase() === 'product') || 'Product';

    // Find latest date in the dataset
    let maxDate = new Date(0);
    data.forEach(row => {
      const d = parseDate(row[tglPoCol]);
      if (d && d > maxDate) maxDate = d;
    });

    if (maxDate.getTime() === 0) return null;

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const latestMonthIdx = maxDate.getMonth();
    const latestYear = maxDate.getFullYear();
    const latestDay = maxDate.getDate();
    const activeMonthName = monthNames[latestMonthIdx];

    const latestDayStr = `${latestDay} ${activeMonthName} ${latestYear}`;
    const prevDate = new Date(latestYear, latestMonthIdx, latestDay - 1);
    const prevDayStr = `s.d ${prevDate.getDate()} ${monthNames[prevDate.getMonth()]} ${prevDate.getFullYear()}`;

    // Infrastruktur list in exact ordered sequence 1-24
    const infrastructures = [
      { no: 1, name: 'SPP SUBANG', displayName: 'SPP SUBANG' },
      { no: 2, name: 'SPP KARAWANG', displayName: 'SPP KARAWANG' },
      { no: 3, name: 'SPP LAMPUNG', displayName: 'SPP LAMPUNG' },
      { no: 4, name: 'SPP KENDAL', displayName: 'SPP KENDAL' },
      { no: 5, name: 'SPP SRAGEN', displayName: 'SPP SRAGEN' },
      { no: 6, name: 'SPP MAGETAN', displayName: 'SPP MAGETAN' },
      { no: 7, name: 'SPP BOJONEGORO', displayName: 'SPP BOJONEGORO' },
      { no: 8, name: 'SPP JEMBER', displayName: 'SPP JEMBER' },
      { no: 9, name: 'SPP BANYUWANGI', displayName: 'SPP BANYUWANGI' },
      { no: 10, name: 'SPP SUMBAWA', displayName: 'SPP SUMBAWA' },
      { no: 11, name: 'SPB JAKARTA', displayName: 'SPB JAKARTA' },
      { no: 12, name: 'SPB INDRAMAYU', displayName: 'SPB INDRAMAYU' },
      { no: 13, name: 'SPB SUKOHARJO', displayName: 'SPB SUKOHARJO' },
      { no: 14, name: 'SPB SIDOARJO', displayName: 'SPB SIDOARJO' },
      { no: 15, name: 'SPB LOMBOK TIMUR', displayName: 'SPB LOMBOK TIMUR' },
      { no: 16, name: 'SPB SIDRAP', displayName: 'SPB SIDRAP' },
      { no: 17, name: 'SPB MAKASSAR', displayName: 'SPB MAKASSAR' },
      { no: 18, name: 'UP BANTUL', displayName: 'UP BANTUL' },
      { no: 19, name: 'UP CANDIREJO', displayName: 'UP CANDIREJO' },
      { no: 20, name: 'UP MOJOLABAN', displayName: 'UP MOJOLABAN' },
      { no: 21, name: 'UP LANCIRANG', displayName: 'UP LANCIRANG' },
      { no: 22, name: 'UP ANABANUA', displayName: 'UP ANABANUA' },
      { no: 23, name: 'CDC DOMPU', displayName: 'CDC DOMPU' },
      { no: 24, name: 'CDC BOLMONG', displayName: 'CDC BOLAANG MONGONDOW' }
    ];

    // Aggregate current month & prior uploaded months transactions per warehouse per commodity
    const currentMonthData: Record<string, Record<'GABAH' | 'BERAS' | 'JAGUNG', { qtyAll: number, nomAll: number, qtyLatest: number, nomLatest: number }>> = {};
    const priorUploadedData: Record<string, Record<'GABAH' | 'BERAS' | 'JAGUNG', { qty: number, nom: number }>> = {};
    
    infrastructures.forEach(inf => {
      currentMonthData[inf.name] = {
        GABAH: { qtyAll: 0, nomAll: 0, qtyLatest: 0, nomLatest: 0 },
        BERAS: { qtyAll: 0, nomAll: 0, qtyLatest: 0, nomLatest: 0 },
        JAGUNG: { qtyAll: 0, nomAll: 0, qtyLatest: 0, nomLatest: 0 }
      };
      priorUploadedData[inf.name] = {
        GABAH: { qty: 0, nom: 0 },
        BERAS: { qty: 0, nom: 0 },
        JAGUNG: { qty: 0, nom: 0 }
      };
    });

    data.forEach(row => {
      const status = (row['Status'] || '').trim().toUpperCase();
      if (status === 'CANCELLED' || status === 'DRAFT RFQ') return;

      const kom = classifyCommodity(row[komoditiCol], row[productCol]);
      if (!kom || (kom !== 'GABAH' && kom !== 'BERAS' && kom !== 'JAGUNG')) return;

      const gudang = normalizeGudangName(row[gudangCol]);
      if (!currentMonthData[gudang]) return;

      const qtyKg = getRealKuantumKg(row, kuantumCol, productCol, columns);
      const totalRp = parseNumber(row[totalCol]);
      if (qtyKg <= 0 || totalRp <= 0) return;

      const d = parseDate(row[tglPoCol]);
      if (!d) return;

      if (d.getMonth() === latestMonthIdx && d.getFullYear() === latestYear) {
        const isLatestDay = (d.getDate() === latestDay);
        currentMonthData[gudang][kom].qtyAll += qtyKg;
        currentMonthData[gudang][kom].nomAll += totalRp;
        if (isLatestDay) {
          currentMonthData[gudang][kom].qtyLatest += qtyKg;
          currentMonthData[gudang][kom].nomLatest += totalRp;
        }
      } else if (d < maxDate) {
        priorUploadedData[gudang][kom].qty += qtyKg;
        priorUploadedData[gudang][kom].nom += totalRp;
      }
    });

    let grandTargetGabah = 77290;
    let grandTargetBeras = 37130;
    let grandTargetJagung = 2700;

    let grandPrevGabahTon = 0;
    let grandPrevBerasTon = 0;
    let grandPrevJagungTon = 0;

    let grandLatestGabahTon = 0;
    let grandLatestBerasTon = 0;
    let grandLatestJagungTon = 0;

    let grandTotalGabahTon = 0;
    let grandTotalBerasTon = 0;
    let grandTotalJagungTon = 0;

    let grandCurGabahKg = 0;
    let grandCurGabahNom = 0;
    let grandTotGabahKg = 0;
    let grandTotGabahNom = 0;

    let grandCurBerasKg = 0;
    let grandCurBerasNom = 0;
    let grandTotBerasKg = 0;
    let grandTotBerasNom = 0;

    let grandCurJagungKg = 0;
    let grandCurJagungNom = 0;
    let grandTotJagungKg = 0;
    let grandTotJagungNom = 0;

    const rows = infrastructures.map(inf => {
      const wh = inf.name;
      const tgt = TARGET_2026_DATA[wh] || {};
      const tgtGabah = tgt.GABAH || 0;
      const tgtBeras = tgt.BERAS || 0;
      const tgtJagung = tgt.JAGUNG || 0;

      // Gabah
      const histGabah = HISTORICAL_REALISASI_PENGADAAN_UB_JULI_2026.GABAH[wh] || { kuantum: 0, nilai: 0 };
      const curGabah = currentMonthData[wh].GABAH;
      const priorGabah = priorUploadedData[wh].GABAH;
      const totGabahKg = histGabah.kuantum + priorGabah.qty + curGabah.qtyAll;
      const totGabahNom = histGabah.nilai + priorGabah.nom + curGabah.nomAll;
      const totGabahTon = Math.round(totGabahKg / 1000);
      const latestGabahTon = Math.round(curGabah.qtyLatest / 1000);
      const prevGabahTon = totGabahTon - latestGabahTon;
      const pctGabah = tgtGabah > 0 ? Math.round((totGabahTon / tgtGabah) * 100) : 0;
      const hrgGabahAgt = curGabah.qtyAll > 0 ? Math.round(curGabah.nomAll / curGabah.qtyAll) : 0;
      const hrgGabahSd = totGabahKg > 0 ? Math.round(totGabahNom / totGabahKg) : 0;

      // Beras
      const histBeras = HISTORICAL_REALISASI_PENGADAAN_UB_JULI_2026.BERAS[wh] || { kuantum: 0, nilai: 0 };
      const curBeras = currentMonthData[wh].BERAS;
      const priorBeras = priorUploadedData[wh].BERAS;
      const totBerasKg = histBeras.kuantum + priorBeras.qty + curBeras.qtyAll;
      const totBerasNom = histBeras.nilai + priorBeras.nom + curBeras.nomAll;
      const totBerasTon = Math.round(totBerasKg / 1000);
      const latestBerasTon = Math.round(curBeras.qtyLatest / 1000);
      const prevBerasTon = totBerasTon - latestBerasTon;
      const pctBeras = tgtBeras > 0 ? Math.round((totBerasTon / tgtBeras) * 100) : 0;
      const hrgBerasAgt = curBeras.qtyAll > 0 ? Math.round(curBeras.nomAll / curBeras.qtyAll) : 0;
      const hrgBerasSd = totBerasKg > 0 ? Math.round(totBerasNom / totBerasKg) : 0;

      // Jagung
      const histJagung = HISTORICAL_REALISASI_PENGADAAN_UB_JULI_2026.JAGUNG?.[wh] || { kuantum: 0, nilai: 0 };
      const curJagung = currentMonthData[wh].JAGUNG;
      const priorJagung = priorUploadedData[wh].JAGUNG;
      const totJagungKg = histJagung.kuantum + priorJagung.qty + curJagung.qtyAll;
      const totJagungNom = histJagung.nilai + priorJagung.nom + curJagung.nomAll;
      const totJagungTon = Math.round(totJagungKg / 1000);
      const latestJagungTon = Math.round(curJagung.qtyLatest / 1000);
      const prevJagungTon = totJagungTon - latestJagungTon;
      const pctJagung = tgtJagung > 0 ? Math.round((totJagungTon / tgtJagung) * 100) : 0;
      const hrgJagungAgt = curJagung.qtyAll > 0 ? Math.round(curJagung.nomAll / curJagung.qtyAll) : 0;
      const hrgJagungSd = totJagungKg > 0 ? Math.round(totJagungNom / totJagungKg) : 0;

      // Accumulate grand totals
      grandPrevGabahTon += prevGabahTon;
      grandPrevBerasTon += prevBerasTon;
      grandPrevJagungTon += prevJagungTon;

      grandLatestGabahTon += latestGabahTon;
      grandLatestBerasTon += latestBerasTon;
      grandLatestJagungTon += latestJagungTon;

      grandTotalGabahTon += totGabahTon;
      grandTotalBerasTon += totBerasTon;
      grandTotalJagungTon += totJagungTon;

      grandCurGabahKg += curGabah.qtyAll;
      grandCurGabahNom += curGabah.nomAll;
      grandTotGabahKg += totGabahKg;
      grandTotGabahNom += totGabahNom;

      grandCurBerasKg += curBeras.qtyAll;
      grandCurBerasNom += curBeras.nomAll;
      grandTotBerasKg += totBerasKg;
      grandTotBerasNom += totBerasNom;

      grandCurJagungKg += curJagung.qtyAll;
      grandCurJagungNom += curJagung.nomAll;
      grandTotJagungKg += totJagungKg;
      grandTotJagungNom += totJagungNom;

      return {
        no: inf.no,
        displayName: inf.displayName,
        target: { gabah: tgtGabah, beras: tgtBeras, jagung: tgtJagung },
        realPrev: { gabah: prevGabahTon, beras: prevBerasTon, jagung: prevJagungTon },
        realLatest: { gabah: latestGabahTon, beras: latestBerasTon, jagung: latestJagungTon },
        realTotal: { gabah: totGabahTon, beras: totBerasTon, jagung: totJagungTon },
        percentage: { gabah: pctGabah, beras: pctBeras, jagung: pctJagung },
        priceGabah: { agt: hrgGabahAgt, sd: hrgGabahSd },
        priceBeras: { agt: hrgBerasAgt, sd: hrgBerasSd },
        priceJagung: { agt: hrgJagungAgt, sd: hrgJagungSd },
      };
    });

    const grandTotals = {
      target: { gabah: grandTargetGabah, beras: grandTargetBeras, jagung: grandTargetJagung },
      realPrev: { gabah: grandPrevGabahTon, beras: grandPrevBerasTon, jagung: grandPrevJagungTon },
      realLatest: { gabah: grandLatestGabahTon, beras: grandLatestBerasTon, jagung: grandLatestJagungTon },
      realTotal: { gabah: grandTotalGabahTon, beras: grandTotalBerasTon, jagung: grandTotalJagungTon },
      percentage: {
        gabah: grandTargetGabah > 0 ? Math.round((grandTotalGabahTon / grandTargetGabah) * 100) : 0,
        beras: grandTargetBeras > 0 ? Math.round((grandTotalBerasTon / grandTargetBeras) * 100) : 0,
        jagung: grandTargetJagung > 0 ? Math.round((grandTotalJagungTon / grandTargetJagung) * 100) : 0
      },
      priceGabah: {
        agt: grandCurGabahKg > 0 ? Math.round(grandCurGabahNom / grandCurGabahKg) : 0,
        sd: grandTotGabahKg > 0 ? Math.round(grandTotGabahNom / grandTotGabahKg) : 0
      },
      priceBeras: {
        agt: grandCurBerasKg > 0 ? Math.round(grandCurBerasNom / grandCurBerasKg) : 0,
        sd: grandTotBerasKg > 0 ? Math.round(grandTotBerasNom / grandTotBerasKg) : 0
      },
      priceJagung: {
        agt: grandCurJagungKg > 0 ? Math.round(grandCurJagungNom / grandCurJagungKg) : 0,
        sd: grandTotJagungKg > 0 ? Math.round(grandTotJagungNom / grandTotJagungKg) : 0
      }
    };

    return {
      rows,
      grandTotals,
      latestDayStr,
      prevDayStr,
      activeMonthName
    };
  }, [data, columns]);


const finalReportHargaPembelian = useMemo(() => {
    if (!data.length) return null;

    const gudangCol = columns.find(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company') || c.toLowerCase().includes('perusahaan') || c.toLowerCase().includes('lokasi')) || 'Company';
    const tglPoCol = columns.find(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date') || c.toLowerCase().includes('po date') || c.toLowerCase().includes('tgl po') || c.toLowerCase().includes('tanggal') || c.toLowerCase().includes('date')) || 'Order Date';
    const kuantumCol = columns.find(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)' || c.toLowerCase().includes('qty (kg)')) || 'Qty (Kg)';
    const totalCol = columns.find(c => c.toLowerCase() === 'total' || c.toLowerCase().includes('total rp') || c.toLowerCase().includes('nominal') || c.toLowerCase().includes('amount') || c.toLowerCase().includes('nilai')) || 'Total';
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const productCol = columns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('nama produk') || c.toLowerCase().includes('item') || c.toLowerCase().includes('barang') || c.toLowerCase().includes('produk')) || 'Product';

    // 1. Find the latest month in the dataset from valid commodity rows
    let maxDate = new Date(0);
    data.forEach(row => {
      const statusCol = columns.find(c => c.toLowerCase() === 'status') || 'Status';
      const statusVal = (row[statusCol] || '').toString().trim().toUpperCase();
      if (statusVal === 'CANCELLED' || statusVal === 'DRAFT RFQ') return;

      const komoditi = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditi === 'LAINNYA') return;

      const d = parseDate(row[tglPoCol]);
      if (d && d.getFullYear() === 2026 && d > maxDate) {
        maxDate = d;
      }
    });
    
    if (maxDate.getTime() === 0) return null; // No valid dates

    const latestMonth = maxDate.getMonth(); // 0-11
    const latestYear = maxDate.getFullYear();

    const generateWeeks = (year: number, month: number) => {
      const buckets = [];
      const lastDay = new Date(year, month + 1, 0).getDate();
      let currentStart = 1;
      while (currentStart <= lastDay) {
        let currentEnd = currentStart;
        let d = new Date(year, month, currentEnd);
        while (d.getDay() !== 0 && currentEnd < lastDay) {
          currentEnd++;
          d = new Date(year, month, currentEnd);
        }
        if (currentStart === 1 && currentEnd <= 2 && currentEnd < lastDay) {
          currentEnd++;
          d = new Date(year, month, currentEnd);
          while (d.getDay() !== 0 && currentEnd < lastDay) {
            currentEnd++;
            d = new Date(year, month, currentEnd);
          }
        }
        if (lastDay - currentEnd <= 2) {
          currentEnd = lastDay;
        }
        buckets.push(currentStart === currentEnd ? `W_${currentStart}` : `W_${currentStart}-${currentEnd}`);
        currentStart = currentEnd + 1;
      }
      return buckets;
    };

    const weeks = generateWeeks(latestYear, latestMonth);
    
    // DEBUG: Show detected configuration
    console.log('[DEBUG-HARGA] maxDate:', `${maxDate.getFullYear()}-${maxDate.getMonth()+1}-${maxDate.getDate()}`, 'latestMonth:', latestMonth, 'weeks:', weeks, 'columns:', columns, 'kuantumCol:', kuantumCol, 'tglPoCol:', tglPoCol);

    // 2. Setup Data Structure for accumulation
    // For Harga, we need sum(nom) / sum(qty). 
    // We will store { nom: 0, qty: 0 } then map to average at the end.
    
    const accumData: Record<string, Record<string, Record<string, Record<string, { nom: number, qty: number }>>>> = {
      'SPB': {}, 'SPP': {}, 'UP': {}, 'CDC': {}
    };
    
    const accumTotals: Record<string, Record<string, { nom: number, qty: number }>> = {
      'TOTAL BERAS SPB': {},
      'TOTAL BERAS SPP': {},
      'TOTAL GABAH SPP': {},
      'TOTAL GABAH UP': {},
      'TOTAL BERAS UP': {},
      'JUMLAH BERAS': {},
      'JUMLAH GABAH': {},
      'TOTAL JAGUNG': {}
    };

    
    const finalData: Record<string, Record<string, Record<string, Record<string, number | null>>>> = {
      'SPB': {}, 'SPP': {}, 'UP': {}, 'CDC': {}
    };

    const pastMonthsSet = new Set<number>();

    // HISTORICAL INJECTION
    if (latestYear === 2026) {
      Object.keys(HISTORICAL_HARGA_PEMBELIAN_2026_DATA).forEach(gudang => {
        if (gudang === 'TOTALS') return;
        
        let group = "OTHER";
        if (gudang.startsWith("SPB")) group = "SPB";
        else if (gudang.startsWith("SPP")) group = "SPP";
        else if (gudang.startsWith("UP")) group = "UP";
        
        if (group !== "OTHER") {
          if (!finalData[group][gudang]) finalData[group][gudang] = {};
          Object.keys(HISTORICAL_HARGA_PEMBELIAN_2026_DATA[gudang]).forEach(komoditi => {
            if (!finalData[group][gudang][komoditi]) {
              finalData[group][gudang][komoditi] = {};
            }
            Object.keys(HISTORICAL_HARGA_PEMBELIAN_2026_DATA[gudang][komoditi]).forEach(monthKey => {
              const val = HISTORICAL_HARGA_PEMBELIAN_2026_DATA[gudang][komoditi][monthKey];
              finalData[group][gudang][komoditi][monthKey] = val;
              pastMonthsSet.add(parseInt(monthKey.replace("M_", "")));
            });
          });
        }
      });
    }

    data.forEach(row => {
      const statusCol = columns.find(c => c.toLowerCase() === 'status') || 'Status';
      const statusVal = (row[statusCol] || '').toString().trim().toUpperCase();
      if (statusVal === 'CANCELLED' || statusVal === 'DRAFT RFQ') return;

      const gudangClean = normalizeGudangName(row[gudangCol]);
      let group = 'OTHER';
      if (gudangClean.startsWith('SPB')) group = 'SPB';
      else if (gudangClean.startsWith('SPP')) group = 'SPP';
      else if (gudangClean.startsWith('UP')) group = 'UP';
      else if (gudangClean.startsWith('CDC')) group = 'CDC';

      if (group === 'OTHER') return;

      const komoditi = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditi === 'LAINNYA') return;

      if (group === 'SPB' && komoditi !== 'BERAS') return; 
      if (group === 'CDC' && komoditi !== 'JAGUNG') return;
      if (group !== 'CDC' && !['BERAS', 'GABAH'].includes(komoditi)) return; 

      const d = parseDate(row[tglPoCol]);
      if (!d) return;

      const m = d.getMonth();
      const y = d.getFullYear();
      const dateNum = d.getDate();
      
      let bucket = "";
      if (y === latestYear && m === latestMonth) {
        const match = weeks.find(b => {
          const range = b.replace('W_', '').split('-');
          if (range.length === 1) return dateNum === parseInt(range[0]);
          return dateNum >= parseInt(range[0]) && dateNum <= parseInt(range[1]);
        });
        if (match) bucket = match;
      } else if (y < latestYear || (y === latestYear && m < latestMonth)) {
        bucket = `M_${m}`;
      } else {
        return; // Future dates ignored
      }

      const qty = getRealKuantumKg(row, kuantumCol, productCol, columns);
      const nom = parseNumber(row[totalCol]);
      
      // DEBUG: Log ALL Sept 7 rows regardless of warehouse
      if (dateNum === 7 && m === latestMonth) {
        console.log(`[DEBUG-SEPT7] ${gudangClean} | grp:${group} | kom:${komoditi} | bkt:${bucket} | qty:${qty} | nom:${nom}`);
      }
      
      if (qty <= 0 && nom <= 0) return;

      if (!accumData[group][gudangClean]) accumData[group][gudangClean] = {};
      if (!accumData[group][gudangClean][komoditi]) accumData[group][gudangClean][komoditi] = {};
      if (!accumData[group][gudangClean][komoditi][bucket]) accumData[group][gudangClean][komoditi][bucket] = { nom: 0, qty: 0 };
      
      accumData[group][gudangClean][komoditi][bucket].nom += nom;
      accumData[group][gudangClean][komoditi][bucket].qty += qty;

      // Active Month Total (e.g. M_8 / SEPT)
      if (y === latestYear && m === latestMonth) {
        const curMKey = `M_${latestMonth}`;
        if (!accumData[group][gudangClean][komoditi][curMKey]) accumData[group][gudangClean][komoditi][curMKey] = { nom: 0, qty: 0 };
        accumData[group][gudangClean][komoditi][curMKey].nom += nom;
        accumData[group][gudangClean][komoditi][curMKey].qty += qty;
      }

      // Multi-month Cumulative REAL_SD (all ERP data up to latestMonth)
      if (y < latestYear || (y === latestYear && m <= latestMonth)) {
        if (!accumData[group][gudangClean][komoditi]['REAL_SD']) accumData[group][gudangClean][komoditi]['REAL_SD'] = { nom: 0, qty: 0 };
        accumData[group][gudangClean][komoditi]['REAL_SD'].nom += nom;
        accumData[group][gudangClean][komoditi]['REAL_SD'].qty += qty;
      }
      
      const addTotal = (key: string, buck: string, n: number, q: number) => {
        if (!accumTotals[key][buck]) accumTotals[key][buck] = { nom: 0, qty: 0 };
        accumTotals[key][buck].nom += n;
        accumTotals[key][buck].qty += q;
      };

      const recordTotal = (key: string) => {
        addTotal(key, bucket, nom, qty);
        if (y === latestYear && m === latestMonth) {
          addTotal(key, `M_${latestMonth}`, nom, qty);
        }
        if (y < latestYear || (y === latestYear && m <= latestMonth)) {
          addTotal(key, 'REAL_SD', nom, qty);
        }
      };

      if (group === 'SPB' && komoditi === 'BERAS') {
        recordTotal('TOTAL BERAS SPB');
      }
      if (group === 'SPP' && komoditi === 'BERAS') {
        recordTotal('TOTAL BERAS SPP');
      }
      if (group === 'SPP' && komoditi === 'GABAH') {
        recordTotal('TOTAL GABAH SPP');
      }
      if (group === 'UP' && komoditi === 'GABAH') {
        recordTotal('TOTAL GABAH UP');
      }
      if (group === 'UP' && komoditi === 'BERAS') {
        recordTotal('TOTAL BERAS UP');
      }
      
      if (komoditi === 'BERAS') {
        recordTotal('JUMLAH BERAS');
      }
      if (komoditi === 'GABAH') {
        recordTotal('JUMLAH GABAH');
      }
      if (komoditi === 'JAGUNG') {
        recordTotal('TOTAL JAGUNG');
      }

    });

    // Translate accumulated into finalData
    Object.keys(accumData).forEach(group => {
      Object.keys(accumData[group]).forEach(gudang => {
        if (!finalData[group][gudang]) finalData[group][gudang] = {};
        Object.keys(accumData[group][gudang]).forEach(komoditi => {
          if (!finalData[group][gudang][komoditi]) finalData[group][gudang][komoditi] = {};
          
          // Map past months from ERP if present
          for (let i = 0; i < latestMonth; i++) {
            const mKey = `M_${i}`;
            const item = accumData[group][gudang][komoditi][mKey];
            if (item && item.qty > 0) {
              finalData[group][gudang][komoditi][mKey] = Math.round(item.nom / item.qty);
            }
          }

          // Active Month (e.g. SEPT) weighted average price
          const curMonthItem = accumData[group][gudang][komoditi][`M_${latestMonth}`];
          if (curMonthItem && curMonthItem.qty > 0) {
            finalData[group][gudang][komoditi][`M_${latestMonth}`] = Math.round(curMonthItem.nom / curMonthItem.qty);
          } else {
            finalData[group][gudang][komoditi][`M_${latestMonth}`] = null;
          }

          // Weekly buckets
          weeks.forEach(bucket => {
            const item = accumData[group][gudang][komoditi][bucket];
            if (item && item.qty > 0) {
              finalData[group][gudang][komoditi][bucket] = Math.round(item.nom / item.qty);
            } else {
              finalData[group][gudang][komoditi][bucket] = null;
            }
          });

          // REAL S/D cumulative weighted average price (August + September + etc.)
          const realSdItem = accumData[group][gudang][komoditi]['REAL_SD'];
          if (realSdItem && realSdItem.qty > 0) {
            finalData[group][gudang][komoditi]['REAL_SD'] = Math.round(realSdItem.nom / realSdItem.qty);
          } else {
            finalData[group][gudang][komoditi]['REAL_SD'] = finalData[group][gudang][komoditi][`M_${latestMonth}`] || null;
          }
        });
      });
    });

    const finalTotals: Record<string, Record<string, number | null>> = {};
    Object.keys(accumTotals).forEach(key => {
      finalTotals[key] = {};

      // Map past months totals from ERP if present or fallback to historical totals
      for (let i = 0; i < latestMonth; i++) {
        const mKey = `M_${i}`;
        const item = accumTotals[key][mKey];
        if (item && item.qty > 0) {
          finalTotals[key][mKey] = Math.round(item.nom / item.qty);
        } else if (HISTORICAL_HARGA_PEMBELIAN_2026_DATA['TOTALS']?.[key]?.[mKey]) {
          finalTotals[key][mKey] = HISTORICAL_HARGA_PEMBELIAN_2026_DATA['TOTALS'][key][mKey];
        }
      }

      // Active Month total
      const curMonthTotal = accumTotals[key][`M_${latestMonth}`];
      if (curMonthTotal && curMonthTotal.qty > 0) {
        finalTotals[key][`M_${latestMonth}`] = Math.round(curMonthTotal.nom / curMonthTotal.qty);
      } else {
        finalTotals[key][`M_${latestMonth}`] = null;
      }

      // Weekly totals
      weeks.forEach(buck => {
        const item = accumTotals[key][buck];
        if (item && item.qty > 0) {
          finalTotals[key][buck] = Math.round(item.nom / item.qty);
        } else {
          finalTotals[key][buck] = null;
        }
      });

      // REAL S/D total
      const realSdTotal = accumTotals[key]['REAL_SD'];
      if (realSdTotal && realSdTotal.qty > 0) {
        finalTotals[key]['REAL_SD'] = Math.round(realSdTotal.nom / realSdTotal.qty);
      } else {
        finalTotals[key]['REAL_SD'] = finalTotals[key][`M_${latestMonth}`] || null;
      }
    });

    const pastMonths: number[] = [];
    for (let i = 0; i < latestMonth; i++) {
      pastMonths.push(i);
    }
    const monthNames = ["JAN", "FEB", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGT", "SEPT", "OKT", "NOV", "DES"];
    const fullMonthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

    // DEBUG: Log all calculated values for W_7-13
    const w7_13_summary: Record<string, any> = {};
    Object.keys(finalData).forEach(grp => {
      Object.keys(finalData[grp]).forEach(gdg => {
        Object.keys(finalData[grp][gdg]).forEach(kom => {
          const val = finalData[grp][gdg][kom]['W_7-13'];
          if (val) w7_13_summary[`${gdg} (${kom})`] = val;
        });
      });
    });
    console.log('[DEBUG-RESULT-W_7-13] Gudang values:', w7_13_summary);

    return { 
      finalData,
      finalTotals,
      pastMonths,
      latestMonth,
      monthNames,
      fullMonthNames,
      weeks
    };
  }, [data, columns, activeTab, subTabReport2]);

  const finalReportRealisasiPengadaan = useMemo(() => {
    if (!data.length) return null;

    const gudangCol = columns.find(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company') || c.toLowerCase().includes('perusahaan') || c.toLowerCase().includes('lokasi')) || 'Company';
    const tglPoCol = columns.find(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date') || c.toLowerCase().includes('po date') || c.toLowerCase().includes('tgl po') || c.toLowerCase().includes('tanggal') || c.toLowerCase().includes('date')) || 'Order Date';
    const kuantumCol = columns.find(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)' || c.toLowerCase().includes('qty (kg)')) || 'Qty (Kg)';
    const komoditiCol = columns.find(c => c.toLowerCase() === 'komoditi' || c.toLowerCase().includes('product category') || c.toLowerCase().includes('kategori')) || 'Product Category';
    const productCol = columns.find(c => c.toLowerCase() === 'product' || c.toLowerCase().includes('nama produk') || c.toLowerCase().includes('item') || c.toLowerCase().includes('barang') || c.toLowerCase().includes('produk')) || 'Product';

    // 1. Find the latest month in the dataset from valid commodity rows
    let maxDate = new Date(0);
    data.forEach(row => {
      const statusCol = columns.find(c => c.toLowerCase() === 'status') || 'Status';
      const statusVal = (row[statusCol] || '').toString().trim().toUpperCase();
      if (statusVal === 'CANCELLED' || statusVal === 'DRAFT RFQ') return;

      const komoditi = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditi === 'LAINNYA') return;

      const d = parseDate(row[tglPoCol]);
      if (d && d.getFullYear() === 2026 && d > maxDate) {
        maxDate = d;
      }
    });
    
    if (maxDate.getTime() === 0) return null; // No valid dates

    const latestMonth = maxDate.getMonth(); // 0-11
    const latestYear = maxDate.getFullYear();

    const generateWeeks = (year: number, month: number) => {
      const buckets = [];
      const lastDay = new Date(year, month + 1, 0).getDate();
      let currentStart = 1;
      while (currentStart <= lastDay) {
        let currentEnd = currentStart;
        let d = new Date(year, month, currentEnd);
        while (d.getDay() !== 0 && currentEnd < lastDay) {
          currentEnd++;
          d = new Date(year, month, currentEnd);
        }
        if (currentStart === 1 && currentEnd <= 2 && currentEnd < lastDay) {
          currentEnd++;
          d = new Date(year, month, currentEnd);
          while (d.getDay() !== 0 && currentEnd < lastDay) {
            currentEnd++;
            d = new Date(year, month, currentEnd);
          }
        }
        if (lastDay - currentEnd <= 2) {
          currentEnd = lastDay;
        }
        buckets.push(currentStart === currentEnd ? `W_${currentStart}` : `W_${currentStart}-${currentEnd}`);
        currentStart = currentEnd + 1;
      }
      return buckets;
    };

    const weeks = generateWeeks(latestYear, latestMonth);

    // 2. Setup Data Structure
    const finalData: Record<string, Record<string, Record<string, Record<string, number>>>> = {
      'SPB': {}, 'SPP': {}, 'UP': {}, 'CDC': {}
    };

    // Keep track of which months exist before the latest month
    const pastMonthsSet = new Set<number>();

    // HISTORICAL INJECTION
    if (latestYear === 2026) {
      Object.keys(HISTORICAL_2026_DATA).forEach(gudang => {
        let group = "OTHER";
        if (gudang.startsWith("SPB")) group = "SPB";
        else if (gudang.startsWith("SPP")) group = "SPP";
        else if (gudang.startsWith("UP")) group = "UP";
        else if (gudang.startsWith("CDC")) group = "CDC";
        
        if (group !== "OTHER") {
          if (!finalData[group][gudang]) finalData[group][gudang] = {};
          Object.keys(HISTORICAL_2026_DATA[gudang]).forEach(komoditi => {
            if (!finalData[group][gudang][komoditi]) {
              finalData[group][gudang][komoditi] = { 'REAL_YTD': 0 };
            } else if (!finalData[group][gudang][komoditi]['REAL_YTD']) {
              finalData[group][gudang][komoditi]['REAL_YTD'] = 0;
            }
            Object.keys(HISTORICAL_2026_DATA[gudang][komoditi]).forEach(monthKey => {
              const val = HISTORICAL_2026_DATA[gudang][komoditi][monthKey];
              finalData[group][gudang][komoditi][monthKey] = val;
              finalData[group][gudang][komoditi]['REAL_YTD'] += val;
              pastMonthsSet.add(parseInt(monthKey.replace("M_", "")));
            });
          });
        }
      });
    }

    data.forEach(row => {
      const statusCol = columns.find(c => c.toLowerCase() === 'status') || 'Status';
      const statusVal = (row[statusCol] || '').toString().trim().toUpperCase();
      if (statusVal === 'CANCELLED' || statusVal === 'DRAFT RFQ') return;

      const gudangClean = normalizeGudangName(row[gudangCol]);
      let group = 'OTHER';
      if (gudangClean.startsWith('SPB')) group = 'SPB';
      else if (gudangClean.startsWith('SPP')) group = 'SPP';
      else if (gudangClean.startsWith('UP')) group = 'UP';
      else if (gudangClean.startsWith('CDC')) group = 'CDC';

      if (group === 'OTHER') return; // Skip unknown groups

      const komoditi = classifyCommodity(row[komoditiCol], row[productCol]);
      if (komoditi === 'LAINNYA') return;

      if (group === 'SPB' && komoditi !== 'BERAS') return; // SPB only Beras
      if (group === 'CDC' && komoditi !== 'JAGUNG') return; // CDC only Jagung
      if (group !== 'CDC' && !['BERAS', 'GABAH'].includes(komoditi)) return; // Others only Beras/Gabah

      const d = parseDate(row[tglPoCol]);
      if (!d) return;

      const m = d.getMonth();
      const y = d.getFullYear();
      const dateNum = d.getDate();
      
      let bucket = "";
      if (y < latestYear || (y === latestYear && m < latestMonth)) {
        bucket = `M_${m}`;
        pastMonthsSet.add(m);
      } else if (y === latestYear && m === latestMonth) {
        const match = weeks.find(b => {
          const range = b.replace('W_', '').split('-');
          if (range.length === 1) return dateNum === parseInt(range[0]);
          return dateNum >= parseInt(range[0]) && dateNum <= parseInt(range[1]);
        });
        if (match) bucket = match;
      } else {
        return; // Future dates ignored
      }

      const val = getRealKuantumKg(row, kuantumCol, productCol, columns);

      if (!finalData[group][gudangClean]) finalData[group][gudangClean] = {};
      if (!finalData[group][gudangClean][komoditi]) finalData[group][gudangClean][komoditi] = {};
      if (!finalData[group][gudangClean][komoditi][bucket]) finalData[group][gudangClean][komoditi][bucket] = 0;
      if (!finalData[group][gudangClean][komoditi]['REAL_YTD']) finalData[group][gudangClean][komoditi]['REAL_YTD'] = 0;

      finalData[group][gudangClean][komoditi][bucket] += val;
      finalData[group][gudangClean][komoditi]['REAL_YTD'] += val;
    });

    // Ensure CDC exists with static data if empty
    if (Object.keys(finalData['CDC']).length === 0) {
      finalData['CDC'] = {
        'CDC DOMPU': { 'JAGUNG': {} },
        'CDC BOLMONG': { 'JAGUNG': {} }
      };
    }

    const _tempPast = [0, 1, 2, 3, 4, 5, 6];
    for (let i = 0; i <= latestMonth; i++) {
      _tempPast.push(i);
    }
    const pastMonths = Array.from(new Set(_tempPast)).sort((a,b)=>a-b);
    const monthNames = ["JAN", "FEB", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGT", "SEPT", "OKT", "NOV", "DES"];
    const fullMonthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

    const finalTotals: Record<string, Record<string, number>> = {
      'TOTAL BERAS SPB': {},
      'TOTAL BERAS SPP': {},
      'TOTAL GABAH SPP': {},
      'TOTAL BERAS UP': {},
      'TOTAL GABAH UP': {},
      'TOTAL JAGUNG': {},
      'JUMLAH BERAS': {},
      'JUMLAH GABAH': {}
    };
    
    const initializeBuckets = (key: string) => {
      pastMonths.forEach(m => finalTotals[key][`M_${m}`] = 0);
      weeks.forEach(w => finalTotals[key][w] = 0);
      finalTotals[key]['REAL_YTD'] = 0;
    };
    
    Object.keys(finalTotals).forEach(initializeBuckets);

    // Aggregate summary rows directly from rounded Ton values to guarantee vertical & horizontal math consistency
    const addGudangToTotals = (groupKey: 'SPB' | 'SPP' | 'UP' | 'CDC') => {
      Object.keys(finalData[groupKey]).forEach(gudang => {
        Object.keys(finalData[groupKey][gudang]).forEach(komoditi => {
          let targetKey = '';
          if (groupKey === 'SPB' && komoditi === 'BERAS') targetKey = 'TOTAL BERAS SPB';
          else if (groupKey === 'SPP') targetKey = komoditi === 'GABAH' ? 'TOTAL GABAH SPP' : 'TOTAL BERAS SPP';
          else if (groupKey === 'UP') targetKey = komoditi === 'GABAH' ? 'TOTAL GABAH UP' : 'TOTAL BERAS UP';
          else if (groupKey === 'CDC' && komoditi === 'JAGUNG') targetKey = 'TOTAL JAGUNG';
          if (!targetKey) return;

          // Add past months
          pastMonths.forEach(m => {
            if (m === latestMonth) {
              const currentMonthTon = weeks.reduce((sum, w) => sum + Math.round((finalData[groupKey][gudang][komoditi][w] || 0) / 1000), 0);
              finalTotals[targetKey][`M_${m}`] = (finalTotals[targetKey][`M_${m}`] || 0) + currentMonthTon;
            } else {
              const pastMonthTon = Math.round((finalData[groupKey][gudang][komoditi][`M_${m}`] || 0) / 1000);
              finalTotals[targetKey][`M_${m}`] = (finalTotals[targetKey][`M_${m}`] || 0) + pastMonthTon;
            }
          });

          // Add weeks
          weeks.forEach(w => {
            const weekTon = Math.round((finalData[groupKey][gudang][komoditi][w] || 0) / 1000);
            finalTotals[targetKey][w] = (finalTotals[targetKey][w] || 0) + weekTon;
          });
        });
      });
    };

    addGudangToTotals('SPB');
    addGudangToTotals('SPP');
    addGudangToTotals('UP');
    addGudangToTotals('CDC');

    const allBuckets = [...pastMonths.map(m => `M_${m}`), ...weeks];
    allBuckets.forEach(buck => {
      finalTotals['JUMLAH BERAS'][buck] = 
        (finalTotals['TOTAL BERAS SPB'][buck] || 0) + 
        (finalTotals['TOTAL BERAS SPP'][buck] || 0) + 
        (finalTotals['TOTAL BERAS UP'][buck] || 0);

      finalTotals['JUMLAH GABAH'][buck] = 
        (finalTotals['TOTAL GABAH SPP'][buck] || 0) + 
        (finalTotals['TOTAL GABAH UP'][buck] || 0);
    });

    const rmData: Record<string, Record<string, Record<string, number>>> = {
      'RM I': { 'GABAH': {}, 'BERAS': {}, 'JAGUNG': {} },
      'RM II': { 'GABAH': {}, 'BERAS': {}, 'JAGUNG': {} },
      'RM III': { 'GABAH': {}, 'BERAS': {}, 'JAGUNG': {} },
    };

    ['RM I', 'RM II', 'RM III'].forEach(rm => {
      ['GABAH', 'BERAS', 'JAGUNG'].forEach(kom => {
        pastMonths.forEach(m => rmData[rm][kom][`M_${m}`] = 0);
        weeks.forEach(w => rmData[rm][kom][w] = 0);
      });
    });

    ['SPB', 'SPP', 'UP', 'CDC'].forEach(grp => {
      const gData = finalData[grp as 'SPB' | 'SPP' | 'UP' | 'CDC'];
      Object.keys(gData).forEach(gudang => {
        const rawRm = WAREHOUSE_METADATA[gudang]?.rm;
        if (!rawRm) return;
        const rm = rawRm.startsWith('RM') ? rawRm : `RM ${rawRm}`;
        if (!rmData[rm]) return;

        Object.keys(gData[gudang]).forEach(komoditi => {
          if (!rmData[rm][komoditi]) return;

          pastMonths.forEach(m => {
            if (m === latestMonth) {
              const currentMonthTon = weeks.reduce((sum, w) => sum + Math.round((gData[gudang][komoditi][w] || 0) / 1000), 0);
              rmData[rm][komoditi][`M_${m}`] += currentMonthTon;
            } else {
              const pastMonthTon = Math.round((gData[gudang][komoditi][`M_${m}`] || 0) / 1000);
              rmData[rm][komoditi][`M_${m}`] += pastMonthTon;
            }
          });

          weeks.forEach(w => {
            const weekTon = Math.round((gData[gudang][komoditi][w] || 0) / 1000);
            rmData[rm][komoditi][w] += weekTon;
          });
        });
      });
    });

    return { 
      finalData, 
      finalTotals, 
      rmData,
      pastMonths,
      latestMonth,
      monthNames,
      fullMonthNames,
      weeks
    };
  }, [data, columns]);

  const hasAnyData = !!(fileName || inventoryFileName || salesFileName);

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs for 3 Slots & Multi-Upload */}
      <input type="file" ref={fileInputPengadaanRef} className="hidden" accept=".xlsx, .xls" onChange={(e) => e.target.files?.[0] && processSingleFile(e.target.files[0], "pengadaan")} />
      <input type="file" ref={fileInputPersediaanRef} className="hidden" accept=".xlsx, .xls" onChange={(e) => e.target.files?.[0] && processSingleFile(e.target.files[0], "persediaan")} />
      <input type="file" ref={fileInputPenjualanRef} className="hidden" accept=".xlsx, .xls" onChange={(e) => e.target.files?.[0] && processSingleFile(e.target.files[0], "penjualan")} />
      <input type="file" ref={multiFileInputRef} className="hidden" accept=".xlsx, .xls" multiple onChange={(e) => e.target.files && handleMultipleFilesUpload(e.target.files)} />

      {!hasAnyData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Slot 1: Pengadaan */}
          <div 
            className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group hover:border-[#1D63A8]"
            onClick={() => fileInputPengadaanRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.length) processSingleFile(e.dataTransfer.files[0], "pengadaan");
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 text-[#1D63A8] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                  <ShoppingCart size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">SLOT 1</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-6">1. Data Pengadaan (PO)</h4>
            </div>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputPengadaanRef.current?.click(); }}
              className="w-full py-2.5 px-4 bg-blue-50 hover:bg-[#1D63A8] text-[#1D63A8] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-blue-200 hover:border-transparent"
            >
              <Plus size={14} /> Upload File Pengadaan
            </button>
          </div>

          {/* Slot 2: Persediaan */}
          <div 
            className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group hover:border-purple-600"
            onClick={() => fileInputPersediaanRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.length) processSingleFile(e.dataTransfer.files[0], "persediaan");
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                  <Package size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">SLOT 2</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-6">2. Data Persediaan (Stok)</h4>
            </div>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputPersediaanRef.current?.click(); }}
              className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-700 text-purple-700 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-purple-200 hover:border-transparent"
            >
              <Plus size={14} /> Upload File Persediaan
            </button>
          </div>

          {/* Slot 3: Penjualan */}
          <div 
            className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group hover:border-amber-600"
            onClick={() => fileInputPenjualanRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.length) processSingleFile(e.dataTransfer.files[0], "penjualan");
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                  <TrendingUp size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">SLOT 3</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-6">3. Data Penjualan (SO)</h4>
            </div>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputPenjualanRef.current?.click(); }}
              className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-700 text-amber-700 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-amber-200 hover:border-transparent"
            >
              <Plus size={14} /> Upload File Penjualan
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Persistent 3-Slot Data Center Card Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-[#1D63A8]">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">ERP Data Center (3 Hub Varian)</h3>
                  <p className="text-xs text-gray-500">Kelola 3 varian sumber data Excel yang dimuat di browser.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={clearAllFiles}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                >
                  <Trash2 size={14} /> Reset Semua
                </button>
                <button
                  onClick={exportToPPT}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 text-white hover:bg-orange-600 rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  <Download size={14} /> {isExporting ? "Mengekspor..." : "Export to PPT"}
                </button>
              </div>
            </div>

            {/* 3-Slot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Slot 1: Pengadaan */}
              <div 
                className={`p-3.5 rounded-xl border transition-all ${
                  fileName 
                    ? 'bg-blue-50/40 border-blue-200' 
                    : 'bg-gray-50/50 border-gray-200 border-dashed hover:border-[#1D63A8] hover:bg-blue-50/30 cursor-pointer group'
                }`}
                onClick={() => {
                  if (!fileName) fileInputPengadaanRef.current?.click();
                }}
                onDragOver={(e) => { if (!fileName) e.preventDefault(); }}
                onDrop={(e) => {
                  if (!fileName) {
                    e.preventDefault();
                    if (e.dataTransfer.files?.length) processSingleFile(e.dataTransfer.files[0], "pengadaan");
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={16} className={fileName ? "text-[#1D63A8]" : "text-gray-400 group-hover:text-[#1D63A8] transition-colors"} />
                    <span className="text-xs font-bold text-gray-900">1. Data Pengadaan (PO)</span>
                  </div>
                  {fileName ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={11} /> Terisi
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      Belum Ada
                    </span>
                  )}
                </div>
                {fileName ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={fileName}>{fileName}</p>
                    <p className="text-[11px] text-gray-500"><span className="font-bold text-gray-700">{data.length.toLocaleString('id-ID')}</span> baris data</p>
                    <div className="flex gap-2 pt-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); fileInputPengadaanRef.current?.click(); }}
                        className="text-[11px] font-semibold text-[#1D63A8] hover:underline"
                      >
                        Ganti File
                      </button>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearPengadaan(); }}
                        className="text-[11px] font-semibold text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-xs text-gray-400 italic">Belum diupload</p>
                    <span className="text-xs font-bold text-[#1D63A8] group-hover:underline flex items-center gap-1">
                      <Plus size={12} /> Upload
                    </span>
                  </div>
                )}
              </div>

              {/* Slot 2: Persediaan */}
              <div 
                className={`p-3.5 rounded-xl border transition-all ${
                  inventoryFileName 
                    ? 'bg-purple-50/40 border-purple-200' 
                    : 'bg-gray-50/50 border-gray-200 border-dashed hover:border-purple-600 hover:bg-purple-50/30 cursor-pointer group'
                }`}
                onClick={() => {
                  if (!inventoryFileName) fileInputPersediaanRef.current?.click();
                }}
                onDragOver={(e) => { if (!inventoryFileName) e.preventDefault(); }}
                onDrop={(e) => {
                  if (!inventoryFileName) {
                    e.preventDefault();
                    if (e.dataTransfer.files?.length) processSingleFile(e.dataTransfer.files[0], "persediaan");
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Package size={16} className={inventoryFileName ? "text-purple-700" : "text-gray-400 group-hover:text-purple-700 transition-colors"} />
                    <span className="text-xs font-bold text-gray-900">2. Data Persediaan (Stok)</span>
                  </div>
                  {inventoryFileName ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={11} /> Terisi
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      Belum Ada
                    </span>
                  )}
                </div>
                {inventoryFileName ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={inventoryFileName}>{inventoryFileName}</p>
                    <p className="text-[11px] text-gray-500"><span className="font-bold text-gray-700">{inventoryData.length.toLocaleString('id-ID')}</span> baris data</p>
                    <div className="flex gap-2 pt-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); fileInputPersediaanRef.current?.click(); }}
                        className="text-[11px] font-semibold text-purple-700 hover:underline"
                      >
                        Ganti File
                      </button>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearPersediaan(); }}
                        className="text-[11px] font-semibold text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-xs text-gray-400 italic">Belum diupload</p>
                    <span className="text-xs font-bold text-purple-700 group-hover:underline flex items-center gap-1">
                      <Plus size={12} /> Upload
                    </span>
                  </div>
                )}
              </div>

              {/* Slot 3: Penjualan */}
              <div 
                className={`p-3.5 rounded-xl border transition-all ${
                  salesFileName 
                    ? 'bg-amber-50/40 border-amber-200' 
                    : 'bg-gray-50/50 border-gray-200 border-dashed hover:border-amber-600 hover:bg-amber-50/30 cursor-pointer group'
                }`}
                onClick={() => {
                  if (!salesFileName) fileInputPenjualanRef.current?.click();
                }}
                onDragOver={(e) => { if (!salesFileName) e.preventDefault(); }}
                onDrop={(e) => {
                  if (!salesFileName) {
                    e.preventDefault();
                    if (e.dataTransfer.files?.length) processSingleFile(e.dataTransfer.files[0], "penjualan");
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className={salesFileName ? "text-amber-700" : "text-gray-400 group-hover:text-amber-700 transition-colors"} />
                    <span className="text-xs font-bold text-gray-900">3. Data Penjualan (SO)</span>
                  </div>
                  {salesFileName ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={11} /> Terisi
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      Belum Ada
                    </span>
                  )}
                </div>
                {salesFileName ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={salesFileName}>{salesFileName}</p>
                    <p className="text-[11px] text-gray-500"><span className="font-bold text-gray-700">{salesData.length.toLocaleString('id-ID')}</span> baris data</p>
                    <div className="flex gap-2 pt-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); fileInputPenjualanRef.current?.click(); }}
                        className="text-[11px] font-semibold text-amber-700 hover:underline"
                      >
                        Ganti File
                      </button>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearPenjualan(); }}
                        className="text-[11px] font-semibold text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-xs text-gray-400 italic">Belum diupload</p>
                    <span className="text-xs font-bold text-amber-700 group-hover:underline flex items-center gap-1">
                      <Plus size={12} /> Upload
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl border border-gray-100 p-1 flex overflow-x-auto shadow-sm">
            {[
              { id: "raw", label: "0. Raw Data" },
              { id: "report1", label: "1. Realisasi Pengadaan (Tonase)" },
              { id: "report2", label: "2. Harga Pembelian" },
              { id: "report3", label: "3. Realisasi Pengadaan UB" },
              { id: "report4", label: "4. Data Penyerapan" },
              { id: "report5", label: "5. Data Persediaan" },
              { id: "report6", label: "6. Realisasi Penjualan" },
              { id: "preview-ppt", label: "Preview PPT" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {activeTab === "raw" && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setRawSubTab("pengadaan")}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold border transition-colors flex items-center gap-1.5 ${
                        rawSubTab === "pengadaan"
                          ? "bg-[#1D63A8] text-white border-[#1D63A8]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <ShoppingCart size={13} /> Pengadaan ({data.length.toLocaleString('id-ID')})
                    </button>
                    <button
                      onClick={() => setRawSubTab("persediaan")}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold border transition-colors flex items-center gap-1.5 ${
                        rawSubTab === "persediaan"
                          ? "bg-purple-700 text-white border-purple-700"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Package size={13} /> Persediaan ({inventoryData.length.toLocaleString('id-ID')})
                    </button>
                    <button
                      onClick={() => setRawSubTab("penjualan")}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold border transition-colors flex items-center gap-1.5 ${
                        rawSubTab === "penjualan"
                          ? "bg-amber-700 text-white border-amber-700"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <TrendingUp size={13} /> Penjualan ({salesData.length.toLocaleString('id-ID')})
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari dalam raw data..."
                      value={rawSearchQuery}
                      onChange={(e) => setRawSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D63A8]"
                    />
                  </div>
                </div>

                {/* SubTab Content */}
                {rawSubTab === "pengadaan" && (
                  data.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-600">
                        <thead className="text-xs uppercase bg-gray-50 text-gray-700 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 font-bold text-center w-16">No</th>
                            {columns.map((col, idx) => <th key={idx} className="px-6 py-4 font-bold whitespace-nowrap">{col}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {data
                            .filter(row => {
                              if (!rawSearchQuery.trim()) return true;
                              const q = rawSearchQuery.toLowerCase();
                              return Object.values(row).some(v => v !== undefined && v !== null && v.toString().toLowerCase().includes(q));
                            })
                            .slice(0, 100)
                            .map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-gray-50/50">
                                <td className="px-6 py-3 text-center font-medium text-gray-400">{rIdx + 1}</td>
                                {columns.map((col, cIdx) => (
                                  <td key={cIdx} className="px-6 py-3 whitespace-nowrap truncate max-w-xs">{row[col]?.toString() || "-"}</td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center bg-gray-50/50">
                      <div className="w-12 h-12 bg-blue-100 text-[#1D63A8] rounded-xl flex items-center justify-center mb-3">
                        <ShoppingCart size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Data Pengadaan (PO) Belum Dimuat</h4>
                      <p className="text-xs text-gray-500 mb-4 max-w-sm">Silakan upload file Excel Data Pengadaan ERP untuk melihat preview data mentah.</p>
                      <button
                        onClick={() => fileInputPengadaanRef.current?.click()}
                        className="px-4 py-2 bg-[#1D63A8] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Upload File Pengadaan
                      </button>
                    </div>
                  )
                )}

                {rawSubTab === "persediaan" && (
                  inventoryData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-600">
                        <thead className="text-xs uppercase bg-purple-50 text-purple-900 border-b border-purple-100">
                          <tr>
                            <th className="px-6 py-4 font-bold text-center w-16">No</th>
                            {inventoryColumns.map((col, idx) => <th key={idx} className="px-6 py-4 font-bold whitespace-nowrap">{col}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {inventoryData
                            .filter(row => {
                              if (!rawSearchQuery.trim()) return true;
                              const q = rawSearchQuery.toLowerCase();
                              return Object.values(row).some(v => v !== undefined && v !== null && v.toString().toLowerCase().includes(q));
                            })
                            .slice(0, 100)
                            .map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-gray-50/50">
                                <td className="px-6 py-3 text-center font-medium text-gray-400">{rIdx + 1}</td>
                                {inventoryColumns.map((col, cIdx) => (
                                  <td key={cIdx} className="px-6 py-3 whitespace-nowrap truncate max-w-xs">{row[col]?.toString() || "-"}</td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center bg-gray-50/50">
                      <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-3">
                        <Package size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Data Persediaan (Stok) Belum Dimuat</h4>
                      <p className="text-xs text-gray-500 mb-4 max-w-sm">Silakan upload file Excel Data Persediaan ERP untuk melihat preview data mentah.</p>
                      <button
                        onClick={() => fileInputPersediaanRef.current?.click()}
                        className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Upload File Persediaan
                      </button>
                    </div>
                  )
                )}

                {rawSubTab === "penjualan" && (
                  salesData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-600">
                        <thead className="text-xs uppercase bg-amber-50 text-amber-900 border-b border-amber-100">
                          <tr>
                            <th className="px-6 py-4 font-bold text-center w-16">No</th>
                            {salesColumns.map((col, idx) => <th key={idx} className="px-6 py-4 font-bold whitespace-nowrap">{col}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {salesData
                            .filter(row => {
                              if (!rawSearchQuery.trim()) return true;
                              const q = rawSearchQuery.toLowerCase();
                              return Object.values(row).some(v => v !== undefined && v !== null && v.toString().toLowerCase().includes(q));
                            })
                            .slice(0, 100)
                            .map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-gray-50/50">
                                <td className="px-6 py-3 text-center font-medium text-gray-400">{rIdx + 1}</td>
                                {salesColumns.map((col, cIdx) => (
                                  <td key={cIdx} className="px-6 py-3 whitespace-nowrap truncate max-w-xs">{row[col]?.toString() || "-"}</td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center bg-gray-50/50">
                      <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-3">
                        <TrendingUp size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Data Penjualan (SO) Belum Dimuat</h4>
                      <p className="text-xs text-gray-500 mb-4 max-w-sm">Silakan upload file Excel Data Penjualan ERP untuk melihat preview data mentah.</p>
                      <button
                        onClick={() => fileInputPenjualanRef.current?.click()}
                        className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Upload File Penjualan
                      </button>
                    </div>
                  )
                )}
              </>
            )}

            {activeTab === 'report1' && (
              <>
                  <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">1. Realisasi Pengadaan (Tonase)</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button onClick={() => setSubTabReport1('pivot')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport1 === 'pivot' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Pivot Raw Data</button>
                    <button onClick={() => setSubTabReport1('final')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport1 === 'final' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Final Report (Gabah & Beras)</button>
                    <button onClick={() => setSubTabReport1('jagung')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport1 === 'jagung' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Final Report (Jagung)</button>
                    <button onClick={() => setSubTabReport1('rp-ubi')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport1 === 'rp-ubi' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>R. Pengadaan UB</button>
                    <button onClick={() => setSubTabReport1('pivot-custom')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport1 === 'pivot-custom' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Pivot Custom</button>
                  </div>
                </div>
                {subTabReport1 === 'pivot' && (
                  <div className="px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <select 
                        value={filterKomoditi}
                        onChange={(e) => setFilterKomoditi(e.target.value)}
                        className="text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8]"
                      >
                        <option value="BERAS,BAHAN BAKU">Beras (Beras Bahan Baku)</option>
                        <option value="GABAH,GKP">Gabah (GKP)</option>
                        <option value="JAGUNG">Jagung</option>
                    </select>
                    <button onClick={() => setShowDaily(!showDaily)} className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors border ${showDaily ? "bg-[#1D63A8] text-white border-[#1D63A8]" : "bg-white text-gray-600 border-gray-200"}`}>
                      {showDaily ? "Tampilkan Per Bulan" : "Tampilkan Harian"}
                    </button>
                  </div>
                )}
                {subTabReport1 === 'pivot' && reportRealisasiPengadaan && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                        <tr>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] w-10 bg-clip-padding">No</th>
                          <th rowSpan={2} className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[200px] bg-clip-padding">Row Labels</th>
                          {reportRealisasiPengadaan.monthGroups.map((g: any, i: number) => (
                            <th key={i} colSpan={showDaily ? g.count : 1} className="px-2 py-3 border border-white bg-[#1D63A8] whitespace-nowrap bg-clip-padding">
                              {g.month}
                            </th>
                          ))}
                          {showDaily && <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] font-bold bg-clip-padding">Grand Total</th>}
                        </tr>
                        {showDaily && (
                          <tr>
                            {reportRealisasiPengadaan.monthGroups.flatMap((g: any) => g.dates.map((d: any) => {
                              const dayStr = d === "Unknown Date" ? d : new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }).toUpperCase();
                              return (
                                <th key={d} className="px-2 py-2 border border-white bg-[#1D63A8] min-w-[100px] text-[10px] bg-clip-padding">
                                  {dayStr}
                                </th>
                              );
                            }))}
                          </tr>
                        )}
                      </thead>
                      <tbody className="bg-[#DDEBF7]">
                        {Object.keys(reportRealisasiPengadaan.pivot).sort().map((gudang, idx) => (
                          <tr key={idx} className="hover:bg-blue-100 transition-colors">
                            <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{idx + 1}</td>
                            <td className="px-2 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                            {showDaily ? (
                              reportRealisasiPengadaan.dates.map((d: any) => (
                                <td key={d} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {reportRealisasiPengadaan.pivot[gudang][d] ? reportRealisasiPengadaan.pivot[gudang][d].toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : "-"}
                                </td>
                              ))
                            ) : (
                              reportRealisasiPengadaan.monthGroups.map((g: any) => (
                                <td key={g.month} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {reportRealisasiPengadaan.pivot[gudang][g.month] ? reportRealisasiPengadaan.pivot[gudang][g.month].toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : "-"}
                                </td>
                              ))
                            )}
                            {showDaily && (
                              <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#1D63A8] text-white bg-clip-padding">
                                {reportRealisasiPengadaan.pivot[gudang]['Total'] ? reportRealisasiPengadaan.pivot[gudang]['Total'].toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : "-"}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                        <tr className="bg-[#c1d9f0]">
                          <td colSpan={2} className="px-4 py-1.5 border border-white text-center bg-clip-padding">Grand Total</td>
                          {showDaily ? (
                            reportRealisasiPengadaan.dates.map((d: any) => {
                              const sum = Object.keys(reportRealisasiPengadaan.pivot).reduce((acc, gudang) => acc + (reportRealisasiPengadaan.pivot[gudang][d] || 0), 0);
                              return (
                                <td key={d} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {sum > 0 ? sum.toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : "-"}
                                </td>
                              );
                            })
                          ) : (
                            reportRealisasiPengadaan.monthGroups.map((g: any) => {
                              const sum = Object.keys(reportRealisasiPengadaan.pivot).reduce((acc, gudang) => acc + (reportRealisasiPengadaan.pivot[gudang][g.month] || 0), 0);
                              return (
                                <td key={g.month} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {sum > 0 ? sum.toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : "-"}
                                </td>
                              );
                            })
                          )}
                          {showDaily && (
                            <td className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                              {Object.keys(reportRealisasiPengadaan.pivot).reduce((acc, gudang) => acc + (reportRealisasiPengadaan.pivot[gudang]['Total'] || 0), 0).toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 2})}
                            </td>
                          )}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                {subTabReport1 === 'pivot-custom' && (
                  <div className="p-6 text-center text-gray-700">
                    Pivot Custom Data
                  </div>
                )}

                {subTabReport1 === 'final' && finalReportRealisasiPengadaan && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="text-white text-center uppercase bg-blue-600 font-bold sticky top-0 z-20 shadow-md">
                        <tr>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-10 bg-clip-padding">No</th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-12 bg-clip-padding">RM</th>
                          <th rowSpan={2} className="px-4 py-3 border border-white bg-blue-600 min-w-[200px] bg-clip-padding">LOKASI</th>
                          {finalReportRealisasiPengadaan.pastMonths.map(m => (
                            <th key={m} rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding">{finalReportRealisasiPengadaan.monthNames[m]}<br/><span className="text-[9px] font-normal">TON</span></th>
                          ))}
                          <th colSpan={finalReportRealisasiPengadaan.weeks.length} className="px-2 py-2 border border-white bg-[#1D63A8] bg-clip-padding">MINGGUAN</th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[80px] bg-clip-padding">
                            REAL S/D<br/>{finalReportRealisasiPengadaan.fullMonthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[9px] font-normal">TON</span>
                          </th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[70px] bg-clip-padding">
                            TARGET 2026<br/><span className="text-[9px] font-normal">%</span>
                          </th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[70px] bg-clip-padding">
                            VS TGT 2026 (%)<br/><span className="text-[9px] font-normal">%</span>
                          </th>
                        </tr>
                        <tr>
                          {finalReportRealisasiPengadaan.weeks.map(w => (
                            <th key={w} className="px-2 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                              {w.replace('W_', '')} {finalReportRealisasiPengadaan.fullMonthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[9px] font-normal">TON</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                        <tbody className="bg-[#DDEBF7]">
                        {['SPB', 'SPP', 'UP', 'CDC'].map((group, gIdx) => {
                          const groupData = finalReportRealisasiPengadaan.finalData[group] || {};
                          const gudangList = Object.keys(groupData).sort((a, b) => {
                            const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
                            const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
                            if (ordA !== ordB) return ordA - ordB;
                            return a.localeCompare(b);
                          });
                          if (gudangList.length === 0) return null;

                          return (
                            <React.Fragment key={group}>
                              {/* Group Header Row */}
                              <tr className="bg-[#1D63A8] text-white font-bold">
                                <td className="px-2 py-1 border border-white text-center bg-[#1D63A8] bg-clip-padding">{String.fromCharCode(65 + gIdx)}</td>
                                <td className="px-2 py-1 border border-white text-center bg-[#1D63A8] bg-clip-padding"></td>
                                <td colSpan={1 + finalReportRealisasiPengadaan.pastMonths.length + finalReportRealisasiPengadaan.weeks.length + 3} className="px-4 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                                  {group === 'UP' ? 'UNIT PENGOLAHAN' : group}
                                </td>
                              </tr>
                              
                              {/* Gudang Rows */}
                              {gudangList.map((gudang, idx) => {
                                const isSPB = group === 'SPB';
                                const meta = WAREHOUSE_METADATA[gudang];
                                const rowNum = meta?.order || (idx + 1);
                                const rmVal = meta?.rm || '-';
                                
                                const renderValueCell = (komoditi: string) => (bucket: string) => {
                                   let rounded = 0;
                                   if (bucket.startsWith('M_')) {
                                     const m = parseInt(bucket.replace('M_', ''));
                                     if (m === finalReportRealisasiPengadaan.latestMonth) {
                                       rounded = finalReportRealisasiPengadaan.weeks.reduce((sum, w) => {
                                         return sum + Math.round((groupData[gudang]?.[komoditi]?.[w] || 0) / 1000);
                                       }, 0);
                                     } else {
                                       rounded = Math.round((groupData[gudang]?.[komoditi]?.[bucket] || 0) / 1000);
                                     }
                                   } else {
                                     rounded = Math.round((groupData[gudang]?.[komoditi]?.[bucket] || 0) / 1000);
                                   }
                                   return (
                                     <td key={bucket} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                       {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                                     </td>
                                   );
                                 };

                                 const renderRealAndTargetCells = (komoditi: string) => {
                                   let totalTon = 0;
                                   for (let m = 0; m <= finalReportRealisasiPengadaan.latestMonth; m++) {
                                     if (m === finalReportRealisasiPengadaan.latestMonth) {
                                       const currentMonthTon = finalReportRealisasiPengadaan.weeks.reduce((sum, w) => {
                                         return sum + Math.round((groupData[gudang]?.[komoditi]?.[w] || 0) / 1000);
                                       }, 0);
                                       totalTon += currentMonthTon;
                                     } else {
                                       totalTon += Math.round((groupData[gudang]?.[komoditi]?.[`M_${m}`] || 0) / 1000);
                                     }
                                   }
                                   const realSdTon = totalTon;
                                   const targetTon = TARGET_2026_DATA[gudang]?.[komoditi] || 0;
                                   const vsTgtPct = targetTon > 0 && realSdTon > 0 ? `${Math.round((realSdTon / targetTon) * 100)}%` : "-";

                                  return (
                                    <>
                                      <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#DDEBF7] bg-clip-padding">
                                        {realSdTon > 0 ? realSdTon.toLocaleString('id-ID') : "-"}
                                      </td>
                                      <td className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                        {targetTon > 0 ? targetTon.toLocaleString('id-ID') : "-"}
                                      </td>
                                      <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                        {vsTgtPct}
                                      </td>
                                    </>
                                  );
                                };

                                if (isSPB) {
                                  return (
                                    <tr key={gudang} className="hover:bg-[#c1d9f0] transition-colors">
                                      <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{rowNum}</td>
                                      <td className="px-2 py-1.5 border border-white text-center font-bold bg-clip-padding">{rmVal}</td>
                                      <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                                      {finalReportRealisasiPengadaan.pastMonths.map(m => renderValueCell('BERAS')(`M_${m}`))}
                                      {finalReportRealisasiPengadaan.weeks.map(w => renderValueCell('BERAS')(w))}
                                      {renderRealAndTargetCells('BERAS')}
                                    </tr>
                                  );
                                } else if (group === 'CDC') {
                                  return (
                                    <tr key={gudang} className="hover:bg-[#c1d9f0] transition-colors">
                                      <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{rowNum}</td>
                                      <td className="px-2 py-1.5 border border-white text-center font-bold bg-clip-padding">{rmVal}</td>
                                      <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                                      {finalReportRealisasiPengadaan.pastMonths.map(m => renderValueCell('JAGUNG')(`M_${m}`))}
                                      {finalReportRealisasiPengadaan.weeks.map(w => renderValueCell('JAGUNG')(w))}
                                      {renderRealAndTargetCells('JAGUNG')}
                                    </tr>
                                  );
                                } else {
                                  return (
                                    <React.Fragment key={gudang}>
                                      <tr className="bg-[#DDEBF7] font-bold">
                                        <td className="px-2 py-1 border border-white text-center bg-clip-padding">{rowNum}</td>
                                        <td className="px-2 py-1 border border-white text-center font-bold bg-clip-padding">{rmVal}</td>
                                        <td className="px-4 py-1 border border-white font-bold bg-clip-padding">{gudang}</td>
                                        {finalReportRealisasiPengadaan.pastMonths.map(m => (
                                          <td key={m} className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        ))}
                                        {finalReportRealisasiPengadaan.weeks.map(w => (
                                          <td key={w} className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        ))}
                                        <td colSpan={3} className="px-2 py-1 border border-white bg-clip-padding"></td>
                                      </tr>
                                      <tr className="hover:bg-[#c1d9f0] transition-colors text-gray-700">
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-4 py-1 border border-white pl-8 bg-clip-padding">BERAS</td>
                                        {finalReportRealisasiPengadaan.pastMonths.map(m => renderValueCell('BERAS')(`M_${m}`))}
                                        {finalReportRealisasiPengadaan.weeks.map(w => renderValueCell('BERAS')(w))}
                                        {renderRealAndTargetCells('BERAS')}
                                      </tr>
                                      <tr className="hover:bg-[#c1d9f0] transition-colors text-gray-700">
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-4 py-1 border border-white pl-8 bg-clip-padding">GABAH</td>
                                        {finalReportRealisasiPengadaan.pastMonths.map(m => renderValueCell('GABAH')(`M_${m}`))}
                                        {finalReportRealisasiPengadaan.weeks.map(w => renderValueCell('GABAH')(w))}
                                        {renderRealAndTargetCells('GABAH')}
                                      </tr>
                                    </React.Fragment>
                                  );
                                }
                              })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                        {(() => {
                          const renderTotalCell = (valTon: any) => {
                            const val = Math.round(valTon || 0);
                            return (
                              <td key={Math.random()} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                {val > 0 ? val.toLocaleString('id-ID') : "-"}
                              </td>
                            );
                          };

                          const renderTotalRealAndTargetCells = (rowKey: string) => {
                            let totalRealSdTon = 0;
                            for (let m = 0; m <= finalReportRealisasiPengadaan.latestMonth; m++) {
                              if (m === finalReportRealisasiPengadaan.latestMonth) {
                                totalRealSdTon += finalReportRealisasiPengadaan.weeks.reduce((sum, w) => sum + (finalReportRealisasiPengadaan.finalTotals[rowKey]?.[w] || 0), 0);
                              } else {
                                totalRealSdTon += finalReportRealisasiPengadaan.finalTotals[rowKey]?.[`M_${m}`] || 0;
                              }
                            }
                            const totalTargetTon = TARGET_2026_TOTALS[rowKey] || 0;
                            const totalVsTgtPct = totalTargetTon > 0 && totalRealSdTon > 0 ? `${Math.round((totalRealSdTon / totalTargetTon) * 100)}%` : "-";

                            return (
                              <>
                                <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#1D63A8]/20 bg-clip-padding">
                                  {totalRealSdTon > 0 ? totalRealSdTon.toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                  {totalTargetTon > 0 ? totalTargetTon.toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                  {totalVsTgtPct}
                                </td>
                              </>
                            );
                          };
                          
                          const rowDefs = [
                            { label: 'TOTAL BERAS SPB', key: 'TOTAL BERAS SPB' },
                            { label: 'TOTAL BERAS SPP', key: 'TOTAL BERAS SPP' },
                            { label: 'TOTAL GABAH SPP', key: 'TOTAL GABAH SPP' },
                            { label: 'TOTAL BERAS UP', key: 'TOTAL BERAS UP' },
                            { label: 'TOTAL GABAH UP', key: 'TOTAL GABAH UP' },
                            { label: 'TOTAL JAGUNG', key: 'TOTAL JAGUNG' },
                            { label: 'JUMLAH BERAS', key: 'JUMLAH BERAS', bg: 'bg-[#1D63A8] text-white' },
                            { label: 'JUMLAH GABAH', key: 'JUMLAH GABAH', bg: 'bg-[#1D63A8] text-white' }
                          ];
                          
                          return (
                            <>
                              {rowDefs.map(row => {
                                return (
                                  <tr key={row.label} className={row.bg || 'hover:bg-[#DDEBF7]'}>
                                    <td colSpan={3} className="px-4 py-1.5 border border-white bg-clip-padding">{row.label}</td>
                                    {finalReportRealisasiPengadaan.pastMonths.map(m => {
                                      const val = finalReportRealisasiPengadaan.finalTotals[row.key]?.[`M_${m}`] || 0;
                                      return renderTotalCell(val);
                                    })}
                                    {finalReportRealisasiPengadaan.weeks.map(w => {
                                      const val = finalReportRealisasiPengadaan.finalTotals[row.key]?.[w] || 0;
                                      return renderTotalCell(val);
                                    })}
                                    {renderTotalRealAndTargetCells(row.key)}
                                  </tr>
                                );
                              })}
                            </>
                          );
                        })()}
                      </tfoot>
                    </table>
                  </div>
                )}
                
                {subTabReport1 === 'jagung' && finalReportRealisasiPengadaan && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="text-white text-center uppercase bg-blue-600 font-bold sticky top-0 z-20 shadow-md">
                        <tr>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-10 bg-clip-padding">No</th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-12 bg-clip-padding">RM</th>
                          <th rowSpan={2} className="px-4 py-3 border border-white bg-blue-600 min-w-[200px] bg-clip-padding">LOKASI</th>
                          {finalReportRealisasiPengadaan.pastMonths.map(m => (
                            <th key={m} rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding">{finalReportRealisasiPengadaan.monthNames[m]}<br/><span className="text-[9px] font-normal">TON</span></th>
                          ))}
                          <th colSpan={finalReportRealisasiPengadaan.weeks.length} className="px-2 py-2 border border-white bg-[#1D63A8] bg-clip-padding">MINGGUAN</th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[80px] bg-clip-padding">
                            REAL S/D<br/>{finalReportRealisasiPengadaan.fullMonthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[9px] font-normal">TON</span>
                          </th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[70px] bg-clip-padding">
                            TARGET 2026<br/><span className="text-[9px] font-normal">%</span>
                          </th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[70px] bg-clip-padding">
                            VS TGT 2026 (%)<br/><span className="text-[9px] font-normal">%</span>
                          </th>
                        </tr>
                        <tr>
                          {finalReportRealisasiPengadaan.weeks.map(w => (
                            <th key={w} className="px-2 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                              {w.replace('W_', '')} {finalReportRealisasiPengadaan.fullMonthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[9px] font-normal">TON</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-[#DDEBF7]">
                        {(() => {
                          const groupData = finalReportRealisasiPengadaan.finalData['CDC'] || {};
                          const gudangList = ['CDC DOMPU', 'CDC BOLMONG'];
                          
                          const renderValueCell = (gudang: string, bucket: string) => {
                            let val = 0;
                            if (bucket.startsWith('M_')) {
                              const m = parseInt(bucket.replace('M_', ''));
                              if (m === finalReportRealisasiPengadaan.latestMonth) {
                                val = finalReportRealisasiPengadaan.weeks.reduce((sum, w) => sum + (groupData[gudang]?.['JAGUNG']?.[w] || 0), 0);
                              } else {
                                val = groupData[gudang]?.['JAGUNG']?.[bucket] || 0;
                              }
                            } else {
                              val = groupData[gudang]?.['JAGUNG']?.[bucket] || 0;
                            }
                            const rounded = Math.round((val || 0) / 1000);
                            return (
                              <td key={bucket} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                              </td>
                            );
                          };

                          return gudangList.map((gudang) => {
                            const meta = WAREHOUSE_METADATA[gudang];
                            let totalKg = 0;
                            for (let m = 0; m <= finalReportRealisasiPengadaan.latestMonth; m++) {
                              if (m === finalReportRealisasiPengadaan.latestMonth) {
                                totalKg += finalReportRealisasiPengadaan.weeks.reduce((sum, w) => sum + (groupData[gudang]?.['JAGUNG']?.[w] || 0), 0);
                              } else {
                                totalKg += groupData[gudang]?.['JAGUNG']?.[`M_${m}`] || 0;
                              }
                            }
                            const realSdTon = Math.round(totalKg / 1000);
                            const targetTon = TARGET_2026_DATA[gudang]?.['JAGUNG'] || 1350;
                            const vsTgtPct = targetTon > 0 && realSdTon > 0 ? `${Math.round((realSdTon / targetTon) * 100)}%` : "-";

                            return (
                              <tr key={gudang} className="hover:bg-[#c1d9f0] transition-colors">
                                <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{meta?.order || 1}</td>
                                <td className="px-2 py-1.5 border border-white text-center font-bold bg-clip-padding">{meta?.rm || 'III'}</td>
                                <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                                {finalReportRealisasiPengadaan.pastMonths.map(m => renderValueCell(gudang, `M_${m}`))}
                                {finalReportRealisasiPengadaan.weeks.map(w => renderValueCell(gudang, w))}
                                <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#DDEBF7] bg-clip-padding">
                                  {realSdTon > 0 ? realSdTon.toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                  {targetTon > 0 ? targetTon.toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                  {vsTgtPct}
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                      <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                        {(() => {
                          const renderTotalCell = (val: any) => {
                            const rounded = Math.round((val || 0) / 1000);
                            return (
                              <td key={Math.random()} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                              </td>
                            );
                          };
                          
                          let totalJagungKg = 0;
                          for (let m = 0; m <= finalReportRealisasiPengadaan.latestMonth; m++) {
                            if (m === finalReportRealisasiPengadaan.latestMonth) {
                              totalJagungKg += finalReportRealisasiPengadaan.weeks.reduce((sum, w) => sum + (finalReportRealisasiPengadaan.finalTotals['TOTAL JAGUNG']?.[w] || 0), 0);
                            } else {
                              totalJagungKg += finalReportRealisasiPengadaan.finalTotals['TOTAL JAGUNG']?.[`M_${m}`] || 0;
                            }
                          }
                          const totalRealSdTon = Math.round(totalJagungKg / 1000);
                          const totalTargetTon = TARGET_2026_TOTALS['TOTAL JAGUNG'] || 2700;
                          const totalVsTgtPct = totalTargetTon > 0 && totalRealSdTon > 0 ? `${Math.round((totalRealSdTon / totalTargetTon) * 100)}%` : "-";

                          return (
                            <tr className="bg-[#c1d9f0]">
                              <td colSpan={3} className="px-4 py-1.5 border border-white text-center bg-clip-padding">TOTAL JAGUNG</td>
                              {finalReportRealisasiPengadaan.pastMonths.map(m => {
                                let val = 0;
                                if (m === finalReportRealisasiPengadaan.latestMonth) {
                                  val = finalReportRealisasiPengadaan.weeks.reduce((sum, w) => sum + (finalReportRealisasiPengadaan.finalTotals['TOTAL JAGUNG']?.[w] || 0), 0);
                                } else {
                                  val = finalReportRealisasiPengadaan.finalTotals['TOTAL JAGUNG']?.[`M_${m}`] || 0;
                                }
                                return renderTotalCell(val);
                              })}
                              {finalReportRealisasiPengadaan.weeks.map(w => renderTotalCell(finalReportRealisasiPengadaan.finalTotals['TOTAL JAGUNG']?.[w] || 0))}
                              <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#1D63A8]/20 bg-clip-padding">
                                {totalRealSdTon > 0 ? totalRealSdTon.toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                {totalTargetTon > 0 ? totalTargetTon.toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                {totalVsTgtPct}
                              </td>
                            </tr>
                          );
                        })()}
                      </tfoot>
                    </table>
                  </div>
                )}

                {subTabReport1 === 'rp-ubi' && finalReportRealisasiPengadaan && (
                  <div className="space-y-6">
                    {/* TABLE 1: REALISASI PENGADAAN UBI */}
                    <div>
                      <div className="bg-blue-600 text-white text-xs font-bold text-center py-2 uppercase tracking-wider rounded-t-lg shadow-sm">
                        REALISASI PENGADAAN UBI
                      </div>
                      <div className="overflow-x-auto scroll-smooth [transform:translateZ(0)] border border-gray-200 rounded-b-lg shadow-sm">
                        <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                          <thead className="text-white text-center uppercase bg-blue-600 font-bold sticky top-0 z-20 shadow-md">
                            <tr>
                              <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-10 bg-clip-padding">No</th>
                              <th rowSpan={2} className="px-4 py-3 border border-white bg-blue-600 min-w-[160px] bg-clip-padding">LOKASI</th>
                              {finalReportRealisasiPengadaan.pastMonths.map(m => (
                                <th key={m} rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding">
                                  {finalReportRealisasiPengadaan.monthNames[m]}<br/><span className="text-[9px] font-normal">TON</span>
                                </th>
                              ))}
                              <th colSpan={finalReportRealisasiPengadaan.weeks.length} className="px-2 py-2 border border-white bg-[#1D63A8] bg-clip-padding">MINGGUAN</th>
                              <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[80px] bg-clip-padding">
                                REAL S/D<br/>{finalReportRealisasiPengadaan.fullMonthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[9px] font-normal">TON</span>
                              </th>
                              <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[70px] bg-clip-padding">
                                TARGET 2026<br/><span className="text-[9px] font-normal">TON</span>
                              </th>
                              <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[70px] bg-clip-padding">
                                VS TGT 2026 (%)<br/><span className="text-[9px] font-normal">%</span>
                              </th>
                            </tr>
                            <tr>
                              {finalReportRealisasiPengadaan.weeks.map(w => (
                                <th key={w} className="px-2 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                                  {w.replace('W_', '')} {finalReportRealisasiPengadaan.fullMonthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[9px] font-normal">TON</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-[#DDEBF7]">
                            {(() => {
                              const ubiRows = [
                                { no: 1, label: 'GABAH', key: 'JUMLAH GABAH', target: TARGET_2026_TOTALS['JUMLAH GABAH'] || 77290 },
                                { no: 2, label: 'BERAS', key: 'JUMLAH BERAS', target: TARGET_2026_TOTALS['JUMLAH BERAS'] || 37130 },
                                { no: 3, label: 'JAGUNG', key: 'TOTAL JAGUNG', target: TARGET_2026_TOTALS['TOTAL JAGUNG'] || 2700 }
                              ];

                              const renderCell = (val: number) => (
                                <td key={Math.random()} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                </td>
                              );

                              return ubiRows.map(row => {
                                let totalSdTon = 0;
                                for (let m = 0; m <= finalReportRealisasiPengadaan.latestMonth; m++) {
                                  totalSdTon += finalReportRealisasiPengadaan.finalTotals[row.key]?.[`M_${m}`] || 0;
                                }
                                const vsTgtPct = row.target > 0 && totalSdTon > 0 ? `${Math.round((totalSdTon / row.target) * 100)}%` : "-";

                                return (
                                  <tr key={row.label} className="hover:bg-[#c1d9f0] transition-colors">
                                    <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{row.no}</td>
                                    <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{row.label}</td>
                                    {finalReportRealisasiPengadaan.pastMonths.map(m => {
                                      const val = finalReportRealisasiPengadaan.finalTotals[row.key]?.[`M_${m}`] || 0;
                                      return renderCell(val);
                                    })}
                                    {finalReportRealisasiPengadaan.weeks.map(w => {
                                      const val = finalReportRealisasiPengadaan.finalTotals[row.key]?.[w] || 0;
                                      return renderCell(val);
                                    })}
                                    <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#1D63A8]/20 bg-clip-padding">
                                      {totalSdTon > 0 ? totalSdTon.toLocaleString('id-ID') : "-"}
                                    </td>
                                    <td className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                      {row.target > 0 ? row.target.toLocaleString('id-ID') : "-"}
                                    </td>
                                    <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                      {vsTgtPct}
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* TABLE 2: REALISASI PENGADAAN PER RM */}
                    <div>
                      <div className="overflow-x-auto scroll-smooth [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                        <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                          <thead className="text-white text-center uppercase bg-blue-600 font-bold sticky top-0 z-20 shadow-md">
                            <tr>
                              <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-10 bg-clip-padding">No</th>
                              <th rowSpan={2} className="px-4 py-3 border border-white bg-blue-600 min-w-[160px] bg-clip-padding">LOKASI</th>
                              {finalReportRealisasiPengadaan.pastMonths.map(m => (
                                <th key={m} rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding">
                                  {finalReportRealisasiPengadaan.monthNames[m]}<br/><span className="text-[9px] font-normal">TON</span>
                                </th>
                              ))}
                              <th colSpan={finalReportRealisasiPengadaan.weeks.length} className="px-2 py-2 border border-white bg-[#1D63A8] bg-clip-padding">MINGGUAN</th>
                              <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[80px] bg-clip-padding">
                                REAL S/D<br/>{finalReportRealisasiPengadaan.fullMonthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[9px] font-normal">TON</span>
                              </th>
                              <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[70px] bg-clip-padding">
                                TARGET 2026<br/><span className="text-[9px] font-normal">TON</span>
                              </th>
                              <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[70px] bg-clip-padding">
                                VS TGT 2026 (%)<br/><span className="text-[9px] font-normal">%</span>
                              </th>
                            </tr>
                            <tr>
                              {finalReportRealisasiPengadaan.weeks.map(w => (
                                <th key={w} className="px-2 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                                  {w.replace('W_', '')} {finalReportRealisasiPengadaan.fullMonthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[9px] font-normal">TON</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-[#DDEBF7]">
                            {(() => {
                              const rmList = [
                                { no: 1, rm: 'RM I' },
                                { no: 2, rm: 'RM II' },
                                { no: 3, rm: 'RM III' },
                              ];
                              const komoditiList = ['GABAH', 'BERAS', 'JAGUNG'];

                              const renderCell = (val: number) => (
                                <td key={Math.random()} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                </td>
                              );

                              return rmList.map(rmItem => {
                                return (
                                  <React.Fragment key={rmItem.rm}>
                                    <tr className="bg-[#c1d9f0] font-bold">
                                      <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{rmItem.no}</td>
                                      <td className="px-4 py-1.5 border border-white font-bold bg-clip-padding">{rmItem.rm}</td>
                                      {finalReportRealisasiPengadaan.pastMonths.map(m => (
                                        <td key={m} className="px-2 py-1.5 border border-white bg-clip-padding"></td>
                                      ))}
                                      {finalReportRealisasiPengadaan.weeks.map(w => (
                                        <td key={w} className="px-2 py-1.5 border border-white bg-clip-padding"></td>
                                      ))}
                                      <td colSpan={3} className="px-2 py-1.5 border border-white bg-clip-padding"></td>
                                    </tr>
                                    {komoditiList.map(kom => {
                                      const dataDict = finalReportRealisasiPengadaan.rmData[rmItem.rm]?.[kom] || {};
                                      let totalSdTon = 0;
                                      for (let m = 0; m <= finalReportRealisasiPengadaan.latestMonth; m++) {
                                        totalSdTon += dataDict[`M_${m}`] || 0;
                                      }
                                      const targetTon = TARGET_2026_RM[rmItem.rm]?.[kom] || 0;
                                      const vsTgtPct = targetTon > 0 && totalSdTon > 0 ? `${Math.round((totalSdTon / targetTon) * 100)}%` : "-";

                                      return (
                                        <tr key={kom} className="hover:bg-[#c1d9f0] transition-colors text-gray-700">
                                          <td className="px-2 py-1.5 border border-white bg-clip-padding"></td>
                                          <td className="px-4 py-1.5 border border-white pl-8 bg-clip-padding font-medium">{kom}</td>
                                          {finalReportRealisasiPengadaan.pastMonths.map(m => {
                                            const val = dataDict[`M_${m}`] || 0;
                                            return renderCell(val);
                                          })}
                                          {finalReportRealisasiPengadaan.weeks.map(w => {
                                            const val = dataDict[w] || 0;
                                            return renderCell(val);
                                          })}
                                          <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#1D63A8]/20 bg-clip-padding">
                                            {totalSdTon > 0 ? totalSdTon.toLocaleString('id-ID') : "-"}
                                          </td>
                                          <td className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                            {targetTon > 0 ? targetTon.toLocaleString('id-ID') : "-"}
                                          </td>
                                          <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                            {vsTgtPct}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </React.Fragment>
                                );
                              });
                            })()}
                          </tbody>
                          <tfoot className="bg-[#1D63A8] text-white font-bold border-t-2 border-white">
                            {(() => {
                              const footerRows = [
                                { label: 'JUMLAH BERAS', key: 'JUMLAH BERAS', target: TARGET_2026_TOTALS['JUMLAH BERAS'] || 37130 },
                                { label: 'JUMLAH GABAH', key: 'JUMLAH GABAH', target: TARGET_2026_TOTALS['JUMLAH GABAH'] || 77290 },
                                { label: 'JUMLAH JAGUNG', key: 'TOTAL JAGUNG', target: TARGET_2026_TOTALS['TOTAL JAGUNG'] || 2700 }
                              ];

                              const renderFooterCell = (val: number) => (
                                <td key={Math.random()} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                </td>
                              );

                              return footerRows.map(row => {
                                let totalSdTon = 0;
                                for (let m = 0; m <= finalReportRealisasiPengadaan.latestMonth; m++) {
                                  totalSdTon += finalReportRealisasiPengadaan.finalTotals[row.key]?.[`M_${m}`] || 0;
                                }
                                const vsTgtPct = row.target > 0 && totalSdTon > 0 ? `${Math.round((totalSdTon / row.target) * 100)}%` : "-";

                                return (
                                  <tr key={row.label}>
                                    <td colSpan={2} className="px-4 py-1.5 border border-white bg-clip-padding">{row.label}</td>
                                    {finalReportRealisasiPengadaan.pastMonths.map(m => {
                                      const val = finalReportRealisasiPengadaan.finalTotals[row.key]?.[`M_${m}`] || 0;
                                      return renderFooterCell(val);
                                    })}
                                    {finalReportRealisasiPengadaan.weeks.map(w => {
                                      const val = finalReportRealisasiPengadaan.finalTotals[row.key]?.[w] || 0;
                                      return renderFooterCell(val);
                                    })}
                                    <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#1D63A8]/40 bg-clip-padding">
                                      {totalSdTon > 0 ? totalSdTon.toLocaleString('id-ID') : "-"}
                                    </td>
                                    <td className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                      {row.target > 0 ? row.target.toLocaleString('id-ID') : "-"}
                                    </td>
                                    <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                      {vsTgtPct}
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}    </>
            )}

            {activeTab === 'report2' && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">2. Harga Pembelian</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button onClick={() => setSubTabReport2('pivot')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport2 === 'pivot' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Pivot Raw Data</button>
                      <button onClick={() => setSubTabReport2('final')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport2 === 'final' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Final Report (Gabah & Beras)</button>
                      <button onClick={() => setSubTabReport2('jagung')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport2 === 'jagung' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Final Report (Jagung)</button>
                      <button onClick={() => setSubTabReport2('rp-ubi')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport2 === 'rp-ubi' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>R. Harga Pembelian</button>
                      <button onClick={() => setSubTabReport2('pivot-custom')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport2 === 'pivot-custom' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Pivot Custom</button>
                    </div>
                  </div>
                </div>

                {subTabReport2 === 'pivot' && (
                  <div className="px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <select 
                      value={filterKomoditiReport2}
                      onChange={(e) => setFilterKomoditiReport2(e.target.value)}
                      className="text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8]"
                    >
                      <option value="BERAS,BAHAN BAKU">Beras (Beras Bahan Baku)</option>
                      <option value="GABAH,GKP">Gabah (GKP)</option>
                      <option value="JAGUNG">Jagung</option>
                    </select>
                    <button 
                      onClick={() => setShowDailyReport2(!showDailyReport2)} 
                      className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors border ${showDailyReport2 ? "bg-[#1D63A8] text-white border-[#1D63A8]" : "bg-white text-gray-600 border-gray-200"}`}
                    >
                      {showDailyReport2 ? "Tampilkan Per Bulan" : "Tampilkan Harian"}
                    </button>
                  </div>
                )}

                {subTabReport2 === 'pivot' && reportHargaPembelianPivot && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                        <tr>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] w-10 bg-clip-padding">No</th>
                          <th rowSpan={2} className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[200px] bg-clip-padding">Company</th>
                          {reportHargaPembelianPivot.monthGroups.map((g: any, i: number) => (
                            <th key={i} colSpan={showDailyReport2 ? g.count : 1} className="px-2 py-3 border border-white bg-[#1D63A8] whitespace-nowrap bg-clip-padding">
                              {g.month}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          ))}
                          {showDailyReport2 && (
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] font-bold bg-clip-padding">
                              Rata-rata<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          )}
                        </tr>
                        {showDailyReport2 && (
                          <tr>
                            {reportHargaPembelianPivot.monthGroups.flatMap((g: any) => g.dates.map((d: any) => {
                              const dayStr = d === "Unknown Date" ? d : new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }).toUpperCase();
                              return (
                                <th key={d} className="px-2 py-2 border border-white bg-[#1D63A8] min-w-[100px] text-[10px] bg-clip-padding">
                                  {dayStr}<br/><span className="text-[8px] font-normal">Rp/KG</span>
                                </th>
                              );
                            }))}
                          </tr>
                        )}
                      </thead>
                      <tbody className="bg-[#DDEBF7]">
                        {Object.keys(reportHargaPembelianPivot.pivot).sort().map((gudang, idx) => (
                          <tr key={idx} className="hover:bg-blue-100 transition-colors">
                            <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{idx + 1}</td>
                            <td className="px-2 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                            {showDailyReport2 ? (
                              reportHargaPembelianPivot.dates.map((d: any) => (
                                <td key={d} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {reportHargaPembelianPivot.pivot[gudang][d] ? reportHargaPembelianPivot.pivot[gudang][d].toLocaleString('id-ID') : "-"}
                                </td>
                              ))
                            ) : (
                              reportHargaPembelianPivot.monthGroups.map((g: any) => (
                                <td key={g.month} className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                  {reportHargaPembelianPivot.pivot[gudang][g.month] ? reportHargaPembelianPivot.pivot[gudang][g.month].toLocaleString('id-ID') : "-"}
                                </td>
                              ))
                            )}
                            {showDailyReport2 && (
                              <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#1D63A8]/20 bg-clip-padding">
                                {reportHargaPembelianPivot.pivot[gudang]['Total'] ? reportHargaPembelianPivot.pivot[gudang]['Total'].toLocaleString('id-ID') : "-"}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[#1D63A8] text-white font-bold sticky bottom-0 z-10 shadow-inner">
                        <tr>
                          <td colSpan={2} className="px-4 py-2 border border-white text-center bg-clip-padding">RATA-RATA HARGA (Rp/KG)</td>
                          {showDailyReport2 ? (
                            reportHargaPembelianPivot.dates.map((d: any) => (
                              <td key={d} className="px-2 py-2 border border-white text-right bg-clip-padding">
                                {reportHargaPembelianPivot.grandAverages[d] ? reportHargaPembelianPivot.grandAverages[d].toLocaleString('id-ID') : "-"}
                              </td>
                            ))
                          ) : (
                            reportHargaPembelianPivot.monthGroups.map((g: any) => (
                              <td key={g.month} className="px-2 py-2 border border-white text-right font-bold bg-clip-padding">
                                {reportHargaPembelianPivot.grandAverages[g.month] ? reportHargaPembelianPivot.grandAverages[g.month].toLocaleString('id-ID') : "-"}
                              </td>
                            ))
                          )}
                          {showDailyReport2 && (
                            <td className="px-2 py-2 border border-white text-right font-bold bg-[#1D63A8]/40 bg-clip-padding">
                              {reportHargaPembelianPivot.grandAverages['Total'] ? reportHargaPembelianPivot.grandAverages['Total'].toLocaleString('id-ID') : "-"}
                            </td>
                          )}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                  {subTabReport2 === 'final' && finalReportHargaPembelian && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="text-white text-center uppercase bg-blue-600 font-bold sticky top-0 z-20 shadow-md">
                        <tr>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-10 bg-clip-padding">No</th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-12 bg-clip-padding">RM</th>
                          <th rowSpan={2} className="px-4 py-3 border border-white bg-blue-600 min-w-[200px] bg-clip-padding">LOKASI</th>
                          {finalReportHargaPembelian.pastMonths.map(m => (
                            <th key={m} rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding">
                              {finalReportHargaPembelian.monthNames[m]}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          ))}
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding">
                            {finalReportHargaPembelian.monthNames[finalReportHargaPembelian.latestMonth]}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                          </th>
                          <th colSpan={finalReportHargaPembelian.weeks.length} className="px-2 py-2 border border-white bg-[#1D63A8] bg-clip-padding">MINGGUAN</th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[90px] bg-clip-padding">
                            REAL S/D<br/>{finalReportHargaPembelian.fullMonthNames[finalReportHargaPembelian.latestMonth]}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                          </th>
                        </tr>
                        <tr>
                          {finalReportHargaPembelian.weeks.map(w => (
                            <th key={w} className="px-2 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                              {w.replace('W_', '')} {finalReportHargaPembelian.fullMonthNames[finalReportHargaPembelian.latestMonth]}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-[#DDEBF7]">
                        {['SPB', 'SPP', 'UP', 'CDC'].map((group, gIdx) => {
                          const groupData = finalReportHargaPembelian.finalData[group] || {};
                          const gudangList = Object.keys(groupData).sort((a, b) => {
                            const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
                            const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
                            if (ordA !== ordB) return ordA - ordB;
                            return a.localeCompare(b);
                          });
                          if (gudangList.length === 0) return null;

                          return (
                            <React.Fragment key={group}>
                              {/* Group Header Row */}
                              <tr className="bg-[#1D63A8] text-white font-bold">
                                <td className="px-2 py-1 border border-white text-center bg-[#1D63A8] bg-clip-padding">{String.fromCharCode(65 + gIdx)}</td>
                                <td className="px-2 py-1 border border-white text-center bg-[#1D63A8] bg-clip-padding"></td>
                                <td colSpan={1 + finalReportHargaPembelian.pastMonths.length + 1 + finalReportHargaPembelian.weeks.length + 1} className="px-4 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                                  {group === 'UP' ? 'UNIT PENGOLAHAN' : group}
                                </td>
                              </tr>
                              
                              {/* Gudang Rows */}
                              {gudangList.map((gudang, idx) => {
                                const isSPB = group === 'SPB';
                                const meta = WAREHOUSE_METADATA[gudang];
                                const rowNum = meta?.order || (idx + 1);
                                const rmVal = meta?.rm || '-';
                                
                                const renderValueCell = (komoditi: string, isTotal = false) => (bucket: string) => {
                                  const val = groupData[gudang]?.[komoditi]?.[bucket] || 0;
                                  const rounded = Math.round(val);
                                  return (
                                    <td key={bucket} className={`px-2 py-1.5 border border-white text-right bg-clip-padding ${isTotal ? 'font-bold bg-[#1D63A8]/20' : ''}`}>
                                      {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                                    </td>
                                  );
                                };

                                if (isSPB) {
                                  return (
                                    <tr key={gudang} className="hover:bg-[#c1d9f0] transition-colors">
                                      <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{rowNum}</td>
                                      <td className="px-2 py-1.5 border border-white text-center font-bold bg-clip-padding">{rmVal}</td>
                                      <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                                      {finalReportHargaPembelian.pastMonths.map(m => renderValueCell('BERAS')(`M_${m}`))}
                                      {renderValueCell('BERAS')(`M_${finalReportHargaPembelian.latestMonth}`)}
                                      {finalReportHargaPembelian.weeks.map(w => renderValueCell('BERAS')(w))}
                                      {renderValueCell('BERAS', true)('REAL_SD')}
                                    </tr>
                                  );
                                } else if (group === 'CDC') {
                                  return (
                                    <tr key={gudang} className="hover:bg-[#c1d9f0] transition-colors">
                                      <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{rowNum}</td>
                                      <td className="px-2 py-1.5 border border-white text-center font-bold bg-clip-padding">{rmVal}</td>
                                      <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                                      {finalReportHargaPembelian.pastMonths.map(m => renderValueCell('JAGUNG')(`M_${m}`))}
                                      {renderValueCell('JAGUNG')(`M_${finalReportHargaPembelian.latestMonth}`)}
                                      {finalReportHargaPembelian.weeks.map(w => renderValueCell('JAGUNG')(w))}
                                      {renderValueCell('JAGUNG', true)('REAL_SD')}
                                    </tr>
                                  );
                                } else {
                                  return (
                                    <React.Fragment key={gudang}>
                                      <tr className="bg-[#DDEBF7] font-bold">
                                        <td className="px-2 py-1 border border-white text-center bg-clip-padding">{rowNum}</td>
                                        <td className="px-2 py-1 border border-white text-center font-bold bg-clip-padding">{rmVal}</td>
                                        <td className="px-4 py-1 border border-white font-bold bg-clip-padding">{gudang}</td>
                                        {finalReportHargaPembelian.pastMonths.map(m => (
                                          <td key={m} className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        ))}
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        {finalReportHargaPembelian.weeks.map(w => (
                                          <td key={w} className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        ))}
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                      </tr>
                                      <tr className="hover:bg-[#c1d9f0] transition-colors text-gray-700">
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-4 py-1 border border-white pl-8 bg-clip-padding font-medium">BERAS</td>
                                        {finalReportHargaPembelian.pastMonths.map(m => renderValueCell('BERAS')(`M_${m}`))}
                                        {renderValueCell('BERAS')(`M_${finalReportHargaPembelian.latestMonth}`)}
                                        {finalReportHargaPembelian.weeks.map(w => renderValueCell('BERAS')(w))}
                                        {renderValueCell('BERAS', true)('REAL_SD')}
                                      </tr>
                                      <tr className="hover:bg-[#c1d9f0] transition-colors text-gray-700">
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-4 py-1 border border-white pl-8 bg-clip-padding font-medium">GABAH</td>
                                        {finalReportHargaPembelian.pastMonths.map(m => renderValueCell('GABAH')(`M_${m}`))}
                                        {renderValueCell('GABAH')(`M_${finalReportHargaPembelian.latestMonth}`)}
                                        {finalReportHargaPembelian.weeks.map(w => renderValueCell('GABAH')(w))}
                                        {renderValueCell('GABAH', true)('REAL_SD')}
                                      </tr>
                                    </React.Fragment>
                                  );
                                }
                              })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                        {(() => {
                          const renderTotalCell = (val: any, isTotal = false) => {
                            const rounded = Math.round(val || 0);
                            return (
                              <td key={Math.random()} className={`px-2 py-1.5 border border-white text-right bg-clip-padding ${isTotal ? 'font-bold bg-[#1D63A8]/20' : ''}`}>
                                {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                              </td>
                            );
                          };
                          
                          const rowDefs = [
                            { label: 'HARGA BERAS SPB', key: 'TOTAL BERAS SPB' },
                            { label: 'HARGA BERAS SPP', key: 'TOTAL BERAS SPP' },
                            { label: 'HARGA GABAH SPP', key: 'TOTAL GABAH SPP' },
                            { label: 'HARGA BERAS UP', key: 'TOTAL BERAS UP' },
                            { label: 'HARGA GABAH UP', key: 'TOTAL GABAH UP' },
                            { label: 'HARGA JAGUNG', key: 'TOTAL JAGUNG' },
                            { label: 'HARGA BERAS', key: 'JUMLAH BERAS', bg: 'bg-[#1D63A8] text-white' },
                            { label: 'HARGA GABAH', key: 'JUMLAH GABAH', bg: 'bg-[#1D63A8] text-white' }
                          ];
                          
                          return (
                            <>
                              {rowDefs.map(row => {
                                return (
                                  <tr key={row.label} className={row.bg || 'hover:bg-[#DDEBF7]'}>
                                    <td colSpan={3} className="px-4 py-1.5 border border-white bg-clip-padding font-bold">{row.label}</td>
                                    {finalReportHargaPembelian.pastMonths.map(m => {
                                      let val = 0;
                                      try {
                                        val = finalReportHargaPembelian.finalTotals[row.key]?.[`M_${m}`] || HISTORICAL_HARGA_PEMBELIAN_2026_DATA['TOTALS']?.[row.key]?.[`M_${m}`] || 0;
                                      } catch(e) {}
                                      return renderTotalCell(val);
                                    })}
                                    {renderTotalCell(finalReportHargaPembelian.finalTotals[row.key]?.[`M_${finalReportHargaPembelian.latestMonth}`] || 0)}
                                    {finalReportHargaPembelian.weeks.map(w => {
                                      const val = finalReportHargaPembelian.finalTotals[row.key]?.[w] || 0;
                                      return renderTotalCell(val);
                                    })}
                                    {renderTotalCell(finalReportHargaPembelian.finalTotals[row.key]?.['REAL_SD'] || 0, true)}
                                  </tr>
                                );
                              })}
                            </>
                          );
                        })()}
                      </tfoot>
                    </table>
                  </div>
                )}
                
                {subTabReport2 === 'jagung' && finalReportHargaPembelian && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="text-white text-center uppercase bg-blue-600 font-bold sticky top-0 z-20 shadow-md">
                        <tr>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-10 bg-clip-padding">No</th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-12 bg-clip-padding">RM</th>
                          <th rowSpan={2} className="px-4 py-3 border border-white min-w-[200px] bg-clip-padding">LOKASI</th>
                          {finalReportHargaPembelian.pastMonths.map(m => (
                            <th key={m} rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding">
                              {finalReportHargaPembelian.monthNames[m]}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          ))}
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] bg-clip-padding">
                            {finalReportHargaPembelian.monthNames[finalReportHargaPembelian.latestMonth]}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                          </th>
                          <th colSpan={finalReportHargaPembelian.weeks.length} className="px-2 py-2 border border-white bg-[#1D63A8] bg-clip-padding">MINGGUAN</th>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[90px] bg-clip-padding">
                            REAL S/D<br/>{finalReportHargaPembelian.fullMonthNames[finalReportHargaPembelian.latestMonth]}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                          </th>
                        </tr>
                        <tr>
                          {finalReportHargaPembelian.weeks.map(w => (
                            <th key={w} className="px-2 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                              {w.replace('W_', '')} {finalReportHargaPembelian.fullMonthNames[finalReportHargaPembelian.latestMonth]}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-[#DDEBF7]">
                        {(() => {
                          const groupData = finalReportHargaPembelian.finalData['CDC'] || {};
                          const gudangList = ['CDC DOMPU', 'CDC BOLMONG'];
                          
                          const renderValueCell = (gudang: string, bucket: string, isTotal = false) => {
                            const val = groupData[gudang]?.['JAGUNG']?.[bucket] || 0;
                            const rounded = Math.round(val);
                            return (
                              <td key={bucket} className={`px-2 py-1.5 border border-white text-right bg-clip-padding ${isTotal ? 'font-bold bg-[#1D63A8]/20' : ''}`}>
                                {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                              </td>
                            );
                          };

                          return gudangList.map((gudang) => {
                            const meta = WAREHOUSE_METADATA[gudang];
                            return (
                              <tr key={gudang} className="hover:bg-[#c1d9f0] transition-colors">
                                <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{meta?.order || 1}</td>
                                <td className="px-2 py-1.5 border border-white text-center font-bold bg-clip-padding">{meta?.rm || 'III'}</td>
                                <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                                {finalReportHargaPembelian.pastMonths.map(m => renderValueCell(gudang, `M_${m}`))}
                                {renderValueCell(gudang, `M_${finalReportHargaPembelian.latestMonth}`)}
                                {finalReportHargaPembelian.weeks.map(w => renderValueCell(gudang, w))}
                                {renderValueCell(gudang, 'REAL_SD', true)}
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                      <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                        {(() => {
                          const renderTotalCell = (val: any, isTotal = false) => {
                            const rounded = Math.round(val || 0);
                            return (
                              <td key={Math.random()} className={`px-2 py-1.5 border border-white text-right bg-clip-padding ${isTotal ? 'font-bold bg-[#1D63A8]/20' : ''}`}>
                                {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                              </td>
                            );
                          };
                          
                          return (
                            <tr className="bg-[#c1d9f0]">
                              <td colSpan={3} className="px-4 py-1.5 border border-white text-center font-bold bg-clip-padding">HARGA JAGUNG</td>
                              {finalReportHargaPembelian.pastMonths.map(m => {
                                return renderTotalCell(0);
                              })}
                              {renderTotalCell(finalReportHargaPembelian.finalTotals['TOTAL JAGUNG']?.[`M_${finalReportHargaPembelian.latestMonth}`] || 0)}
                              {finalReportHargaPembelian.weeks.map(w => renderTotalCell(finalReportHargaPembelian.finalTotals['TOTAL JAGUNG']?.[w] || 0))}
                              {renderTotalCell(finalReportHargaPembelian.finalTotals['TOTAL JAGUNG']?.['REAL_SD'] || 0, true)}
                            </tr>
                          );
                        })()}
                      </tfoot>
                    </table>
                  </div>
                )}

                {subTabReport2 === 'rp-ubi' && finalReportHargaPembelian && (
                  <div className="space-y-4">
                    <div className="overflow-auto scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm bg-white p-4">
                      <div className="text-center font-bold text-sm text-gray-800 uppercase tracking-wide mb-3">
                        REALISASI HARGA PEMBELIAN UBI
                      </div>
                      <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                        <thead className="text-white text-center uppercase bg-[#1D63A8] font-bold sticky top-0 z-20 shadow-md">
                          <tr>
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] w-12 bg-clip-padding">NO</th>
                            <th rowSpan={2} className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[200px] bg-clip-padding">LOKASI</th>
                            {finalReportHargaPembelian.pastMonths.map(m => (
                              <th key={m} className="px-3 py-1.5 border border-white bg-[#1D63A8] bg-clip-padding">
                                {finalReportHargaPembelian.monthNames[m]}
                              </th>
                            ))}
                            <th className="px-3 py-1.5 border border-white bg-[#1D63A8] bg-clip-padding">
                              {finalReportHargaPembelian.monthNames[finalReportHargaPembelian.latestMonth]}
                            </th>
                            <th colSpan={finalReportHargaPembelian.weeks.length} className="px-3 py-1.5 border border-white bg-[#1D63A8] bg-clip-padding">
                              MINGGUAN
                            </th>
                            <th className="px-3 py-1.5 border border-white bg-[#1D63A8] min-w-[100px] bg-clip-padding">
                              REAL S/D<br/>{finalReportHargaPembelian.fullMonthNames[finalReportHargaPembelian.latestMonth]}
                            </th>
                          </tr>
                          <tr className="text-[9px] font-normal bg-[#1D63A8]">
                            {finalReportHargaPembelian.pastMonths.map(m => (
                              <th key={m} className="px-2 py-1 border border-white bg-clip-padding font-normal">Rp/KG</th>
                            ))}
                            <th className="px-2 py-1 border border-white bg-clip-padding font-normal">Rp/KG</th>
                            {finalReportHargaPembelian.weeks.map(w => (
                              <th key={w} className="px-2 py-1 border border-white bg-clip-padding font-normal">
                                {w.replace('W_', '')} {finalReportHargaPembelian.fullMonthNames[finalReportHargaPembelian.latestMonth]}<br/>
                                <span className="text-[9px] font-normal">Rp/KG</span>
                              </th>
                            ))}
                            <th className="px-2 py-1 border border-white bg-clip-padding font-normal">Rp/KG</th>
                          </tr>
                        </thead>
                        <tbody className="bg-[#DDEBF7]">
                          {(() => {
                            const rows = [
                              { no: 1, label: 'GABAH', key: 'JUMLAH GABAH' },
                              { no: 2, label: 'BERAS', key: 'JUMLAH BERAS' },
                              { no: 3, label: 'JAGUNG', key: 'TOTAL JAGUNG' }
                            ];

                            const renderCell = (val: any, isTotal = false) => {
                              const rounded = Math.round(val || 0);
                              return (
                                <td key={Math.random()} className={`px-3 py-2 border border-white text-right bg-clip-padding ${isTotal ? 'font-bold bg-[#1D63A8]/20' : ''}`}>
                                  {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                                </td>
                              );
                            };

                            return rows.map((r) => {
                              return (
                                <tr key={r.label} className="hover:bg-[#c1d9f0] transition-colors font-medium">
                                  <td className="px-2 py-2 border border-white text-center bg-clip-padding">{r.no}</td>
                                  <td className="px-4 py-2 border border-white bg-clip-padding font-semibold">{r.label}</td>
                                  {finalReportHargaPembelian.pastMonths.map(m => {
                                    let val = 0;
                                    try {
                                      val = finalReportHargaPembelian.finalTotals[r.key]?.[`M_${m}`] || HISTORICAL_HARGA_PEMBELIAN_2026_DATA['TOTALS']?.[r.key]?.[`M_${m}`] || 0;
                                    } catch(e) {}
                                    return renderCell(val);
                                  })}
                                  {renderCell(finalReportHargaPembelian.finalTotals[r.key]?.[`M_${finalReportHargaPembelian.latestMonth}`] || 0)}
                                  {finalReportHargaPembelian.weeks.map(w => {
                                    const val = finalReportHargaPembelian.finalTotals[r.key]?.[w] || 0;
                                    return renderCell(val);
                                  })}
                                  {renderCell(finalReportHargaPembelian.finalTotals[r.key]?.['REAL_SD'] || 0, true)}
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'report3' && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">3. Realisasi Pengadaan UB</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button onClick={() => setSubTabReport3('pivot')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport3 === 'pivot' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Pivot Raw Data</button>
                      <button onClick={() => setSubTabReport3('harga')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport3 === 'harga' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Harga</button>
                      <button onClick={() => setSubTabReport3('final')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport3 === 'final' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Final Report</button>
                      <button onClick={() => setSubTabReport3('pivot-custom')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport3 === 'pivot-custom' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Pivot Custom</button>
                    </div>
                  </div>
                  {subTabReport3 === 'harga' && (
                    <div className="flex items-center gap-2">
                      <select 
                        value={filterKomoditiReport3}
                        onChange={(e) => setFilterKomoditiReport3(e.target.value as "GABAH" | "BERAS")}
                        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8]"
                      >
                        <option value="GABAH">GABAH</option>
                        <option value="BERAS">BERAS</option>
                      </select>
                    </div>
                  )}
                </div>

                {subTabReport3 === 'pivot' && (
                  <div className="px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <select 
                      value={filterKomoditiReport3Pivot}
                      onChange={(e) => setFilterKomoditiReport3Pivot(e.target.value)}
                      className="text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8]"
                    >
                      <option value="BERAS,BAHAN BAKU">Beras (Beras Bahan Baku)</option>
                      <option value="GABAH,GKP">Gabah (GKP)</option>
                      <option value="JAGUNG">Jagung</option>
                    </select>
                    <button 
                      onClick={() => setShowDailyReport3(!showDailyReport3)} 
                      className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors border ${showDailyReport3 ? "bg-[#1D63A8] text-white border-[#1D63A8]" : "bg-white text-gray-600 border-gray-200"}`}
                    >
                      {showDailyReport3 ? "Tampilkan Per Bulan" : "Tampilkan Harian"}
                    </button>
                  </div>
                )}

                {subTabReport3 === 'pivot' && reportPengadaanUBPivot && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                        <tr>
                          <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] w-10 bg-clip-padding">No</th>
                          <th rowSpan={2} className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[200px] bg-clip-padding">Company</th>
                          {reportPengadaanUBPivot.monthGroups.map((g: any, i: number) => (
                            <th key={i} colSpan={showDailyReport3 ? g.count : 1} className="px-2 py-3 border border-white bg-[#1D63A8] whitespace-nowrap bg-clip-padding">
                              {g.month}<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          ))}
                          {showDailyReport3 && (
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] font-bold bg-clip-padding">
                              Rata-rata<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          )}
                        </tr>
                        {showDailyReport3 && (
                          <tr>
                            {reportPengadaanUBPivot.monthGroups.flatMap((g: any) => g.dates.map((d: any) => {
                              const dayStr = d === "Unknown Date" ? d : new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }).toUpperCase();
                              return (
                                <th key={d} className="px-2 py-2 border border-white bg-[#1D63A8] min-w-[100px] text-[10px] bg-clip-padding">
                                  {dayStr}<br/><span className="text-[8px] font-normal">Rp/KG</span>
                                </th>
                              );
                            }))}
                          </tr>
                        )}
                      </thead>
                      <tbody className="bg-[#DDEBF7]">
                        {Object.keys(reportPengadaanUBPivot.pivot).sort().map((gudang, idx) => (
                          <tr key={idx} className="hover:bg-blue-100 transition-colors">
                            <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{idx + 1}</td>
                            <td className="px-2 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                            {showDailyReport3 ? (
                              reportPengadaanUBPivot.dates.map((d: any) => (
                                <td key={d} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                  {reportPengadaanUBPivot.pivot[gudang][d] ? reportPengadaanUBPivot.pivot[gudang][d].toLocaleString('id-ID') : "-"}
                                </td>
                              ))
                            ) : (
                              reportPengadaanUBPivot.monthGroups.map((g: any) => (
                                <td key={g.month} className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                  {reportPengadaanUBPivot.pivot[gudang][g.month] ? reportPengadaanUBPivot.pivot[gudang][g.month].toLocaleString('id-ID') : "-"}
                                </td>
                              ))
                            )}
                            {showDailyReport3 && (
                              <td className="px-2 py-1.5 border border-white text-right font-bold bg-[#1D63A8]/20 bg-clip-padding">
                                {reportPengadaanUBPivot.pivot[gudang]['Total'] ? reportPengadaanUBPivot.pivot[gudang]['Total'].toLocaleString('id-ID') : "-"}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[#1D63A8] text-white font-bold sticky bottom-0 z-10 shadow-inner">
                        <tr>
                          <td colSpan={2} className="px-4 py-2 border border-white text-center bg-clip-padding">RATA-RATA HARGA (Rp/KG)</td>
                          {showDailyReport3 ? (
                            reportPengadaanUBPivot.dates.map((d: any) => (
                              <td key={d} className="px-2 py-2 border border-white text-right bg-clip-padding">
                                {reportPengadaanUBPivot.grandAverages[d] ? reportPengadaanUBPivot.grandAverages[d].toLocaleString('id-ID') : "-"}
                              </td>
                            ))
                          ) : (
                            reportPengadaanUBPivot.monthGroups.map((g: any) => (
                              <td key={g.month} className="px-2 py-2 border border-white text-right font-bold bg-clip-padding">
                                {reportPengadaanUBPivot.grandAverages[g.month] ? reportPengadaanUBPivot.grandAverages[g.month].toLocaleString('id-ID') : "-"}
                              </td>
                            ))
                          )}
                          {showDailyReport3 && (
                            <td className="px-2 py-2 border border-white text-right font-bold bg-[#1D63A8]/40 bg-clip-padding">
                              {reportPengadaanUBPivot.grandAverages['Total'] ? reportPengadaanUBPivot.grandAverages['Total'].toLocaleString('id-ID') : "-"}
                            </td>
                          )}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {subTabReport3 === 'harga' && (
                  <div className="px-6 py-3 flex items-center gap-3">
                    <select 
                      value={filterKomoditiReport3}
                      onChange={(e) => setFilterKomoditiReport3(e.target.value as "BERAS" | "GABAH" | "JAGUNG")}
                      className="text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8]"
                    >
                      <option value="BERAS">Beras (Beras Bahan Baku)</option>
                      <option value="GABAH">Gabah (GKP)</option>
                      <option value="JAGUNG">Jagung</option>
                    </select>
                  </div>
                )}

                {subTabReport3 === 'harga' && report3HargaData && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                        <tr>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-3 w-12 text-center bg-clip-padding">No</th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-4 py-3 min-w-[200px] text-left bg-clip-padding">Company</th>
                          <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding uppercase">
                            31 {report3HargaData.prevMonthName} 2026
                          </th>
                          <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding uppercase">
                            S/d Terakhir
                          </th>
                          <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding uppercase">
                            Total
                          </th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-3 py-3 text-right min-w-[100px] bg-clip-padding">
                            HARGA<br/><span className="text-[9px] font-normal">Rp/KG</span>
                          </th>
                        </tr>
                        <tr className="text-[9px] font-normal bg-[#1D63A8]">
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Kuantum</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Nilai</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Kuantum</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Nilai</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Kuantum</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Nilai</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#DDEBF7]">
                        {report3HargaData.sortedGudang.map((gudang, idx) => {
                          const item = report3HargaData.grouped[gudang];
                          return (
                            <tr key={gudang} className="hover:bg-blue-100 transition-colors">
                              <td className="border border-white px-2 py-1.5 text-center bg-clip-padding">{idx + 1}</td>
                              <td className="border border-white px-4 py-1.5 font-medium bg-clip-padding">{gudang}</td>
                              <td className="border border-white px-2 py-1.5 text-right bg-clip-padding">
                                {item.prevQty > 0 ? Math.round(item.prevQty).toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white px-2 py-1.5 text-right bg-clip-padding">
                                {item.prevTotal > 0 ? Math.round(item.prevTotal).toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white px-2 py-1.5 text-right bg-clip-padding">
                                {item.currentQty > 0 ? Math.round(item.currentQty).toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white px-2 py-1.5 text-right bg-clip-padding">
                                {item.currentTotal > 0 ? Math.round(item.currentTotal).toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white px-2 py-1.5 text-right font-semibold bg-clip-padding">
                                {item.totalQty > 0 ? Math.round(item.totalQty).toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white px-2 py-1.5 text-right font-semibold bg-clip-padding">
                                {item.totalNom > 0 ? Math.round(item.totalNom).toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white px-3 py-1.5 text-right font-bold bg-[#1D63A8]/20 bg-clip-padding">
                                {item.harga > 0 ? item.harga.toLocaleString('id-ID') : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-[#1D63A8] text-white font-bold sticky bottom-0 z-10 shadow-inner">
                        <tr>
                          <td colSpan={2} className="border border-white px-4 py-2 text-center bg-clip-padding">Grand Total</td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {report3HargaData.grandPrevQty > 0 ? Math.round(report3HargaData.grandPrevQty).toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {report3HargaData.grandPrevTotal > 0 ? Math.round(report3HargaData.grandPrevTotal).toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {report3HargaData.grandCurrentQty > 0 ? Math.round(report3HargaData.grandCurrentQty).toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {report3HargaData.grandCurrentTotal > 0 ? Math.round(report3HargaData.grandCurrentTotal).toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {report3HargaData.grandTotalQty > 0 ? Math.round(report3HargaData.grandTotalQty).toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {report3HargaData.grandTotalNom > 0 ? Math.round(report3HargaData.grandTotalNom).toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-3 py-2 text-right bg-[#1D63A8]/40 bg-clip-padding">
                            {report3HargaData.grandHarga > 0 ? report3HargaData.grandHarga.toLocaleString('id-ID') : "-"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                
                {subTabReport3 === 'pivot-custom' && (
                  <div className="p-6 text-center text-gray-700 font-semibold">
                    Pivot Custom Data
                  </div>
                )}

                {subTabReport3 === 'final' && finalReportPengadaanUB && (
                  <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                      <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                        <tr>
                          <th rowSpan={3} className="border border-white bg-[#1D63A8] px-2 py-3 w-10 text-center bg-clip-padding">NO</th>
                          <th rowSpan={3} className="border border-white bg-[#1D63A8] px-4 py-3 min-w-[200px] text-left bg-clip-padding">Infrastruktur</th>
                          <th colSpan={3} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding">Target 2026</th>
                          <th colSpan={9} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding">Realisasi (ton)</th>
                          <th colSpan={3} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding">Persentase Pencapaian (%)</th>
                          <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding">Harga Rata-rata Gabah (Rp/kg)</th>
                          <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding">Harga Rata-rata Beras (Rp/kg)</th>
                          <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding">Harga Rata-rata Jagung (Rp/kg)</th>
                        </tr>
                        <tr>
                          {/* Target 2026 */}
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Gabah</th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Beras</th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Jagung</th>

                          {/* Realisasi Sub-groups */}
                          <th colSpan={3} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding uppercase text-[10px]">
                            {finalReportPengadaanUB.prevDayStr}
                          </th>
                          <th colSpan={3} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding uppercase text-[10px]">
                            {finalReportPengadaanUB.latestDayStr}
                          </th>
                          <th colSpan={3} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding uppercase text-[10px]">
                            Total (ton)
                          </th>

                          {/* Persentase Pencapaian */}
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Gabah</th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Beras</th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Jagung</th>

                          {/* Harga Rata-rata Gabah */}
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding capitalize min-w-[70px]">{finalReportPengadaanUB.activeMonthName}</th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding min-w-[80px]">Real s.d.<br/>{finalReportPengadaanUB.activeMonthName}</th>

                          {/* Harga Rata-rata Beras */}
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding capitalize min-w-[70px]">{finalReportPengadaanUB.activeMonthName}</th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding min-w-[80px]">Real s.d.<br/>{finalReportPengadaanUB.activeMonthName}</th>

                          {/* Harga Rata-rata Jagung */}
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding capitalize min-w-[70px]">{finalReportPengadaanUB.activeMonthName}</th>
                          <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding min-w-[80px]">Real s.d.<br/>{finalReportPengadaanUB.activeMonthName}</th>
                        </tr>
                        <tr className="text-[9px] bg-[#1D63A8]">
                          {/* s.d prevDay */}
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Gabah</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Beras</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Jagung</th>

                          {/* latestDay */}
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Gabah</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Beras</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Jagung</th>

                          {/* Total */}
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Gabah</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Beras</th>
                          <th className="border border-white bg-[#1D63A8] px-2 py-1 text-center bg-clip-padding">Jagung</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {finalReportPengadaanUB.rows.map((r, idx) => (
                          <tr key={idx} className="hover:bg-blue-50 transition-colors">
                            <td className="border border-gray-200 px-2 py-1.5 text-center bg-clip-padding">{r.no}</td>
                            <td className="border border-gray-200 px-4 py-1.5 font-medium whitespace-nowrap bg-clip-padding">{r.displayName}</td>

                            {/* Target 2026 */}
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.target.gabah > 0 ? r.target.gabah.toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.target.beras > 0 ? r.target.beras.toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.target.jagung > 0 ? r.target.jagung.toLocaleString('id-ID') : "-"}
                            </td>

                            {/* Realisasi s.d Prev Day */}
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.realPrev.gabah > 0 ? r.realPrev.gabah.toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.realPrev.beras > 0 ? r.realPrev.beras.toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.realPrev.jagung > 0 ? r.realPrev.jagung.toLocaleString('id-ID') : "-"}
                            </td>

                            {/* Realisasi Latest Day */}
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.realLatest.gabah > 0 ? r.realLatest.gabah.toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.realLatest.beras > 0 ? r.realLatest.beras.toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.realLatest.jagung > 0 ? r.realLatest.jagung.toLocaleString('id-ID') : "-"}
                            </td>

                            {/* Realisasi Total */}
                            <td className="border border-gray-200 px-2 py-1.5 text-right font-semibold bg-clip-padding">
                              {r.realTotal.gabah > 0 ? r.realTotal.gabah.toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right font-semibold bg-clip-padding">
                              {r.realTotal.beras > 0 ? r.realTotal.beras.toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right font-semibold bg-clip-padding">
                              {r.realTotal.jagung > 0 ? r.realTotal.jagung.toLocaleString('id-ID') : "-"}
                            </td>

                            {/* Persentase Pencapaian */}
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.target.gabah > 0 ? `${r.percentage.gabah}%` : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.target.beras > 0 ? `${r.percentage.beras}%` : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right bg-clip-padding">
                              {r.target.jagung > 0 ? `${r.percentage.jagung}%` : "-"}
                            </td>

                            {/* Harga Rata-rata Gabah */}
                            <td className="border border-gray-200 px-2 py-1.5 text-right whitespace-nowrap bg-clip-padding">
                              {r.priceGabah.agt > 0 ? `Rp ${r.priceGabah.agt.toLocaleString('id-ID')}` : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right whitespace-nowrap bg-clip-padding">
                              {r.priceGabah.sd > 0 ? `Rp ${r.priceGabah.sd.toLocaleString('id-ID')}` : "-"}
                            </td>

                            {/* Harga Rata-rata Beras */}
                            <td className="border border-gray-200 px-2 py-1.5 text-right whitespace-nowrap bg-clip-padding">
                              {r.priceBeras.agt > 0 ? `Rp ${r.priceBeras.agt.toLocaleString('id-ID')}` : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right whitespace-nowrap bg-clip-padding">
                              {r.priceBeras.sd > 0 ? `Rp ${r.priceBeras.sd.toLocaleString('id-ID')}` : "-"}
                            </td>

                            {/* Harga Rata-rata Jagung */}
                            <td className="border border-gray-200 px-2 py-1.5 text-right whitespace-nowrap bg-clip-padding">
                              {r.priceJagung.agt > 0 ? `Rp ${r.priceJagung.agt.toLocaleString('id-ID')}` : "-"}
                            </td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right whitespace-nowrap bg-clip-padding">
                              {r.priceJagung.sd > 0 ? `Rp ${r.priceJagung.sd.toLocaleString('id-ID')}` : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[#1D63A8] text-white font-bold sticky bottom-0 z-10 shadow-inner">
                        <tr>
                          <td colSpan={2} className="border border-white px-4 py-2 text-center bg-clip-padding uppercase">GRAND TOTAL</td>

                          {/* Target 2026 */}
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.target.gabah.toLocaleString('id-ID')}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.target.beras.toLocaleString('id-ID')}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.target.jagung.toLocaleString('id-ID')}
                          </td>

                          {/* Realisasi s.d Prev Day */}
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realPrev.gabah > 0 ? finalReportPengadaanUB.grandTotals.realPrev.gabah.toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realPrev.beras > 0 ? finalReportPengadaanUB.grandTotals.realPrev.beras.toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realPrev.jagung > 0 ? finalReportPengadaanUB.grandTotals.realPrev.jagung.toLocaleString('id-ID') : "-"}
                          </td>

                          {/* Realisasi Latest Day */}
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realLatest.gabah > 0 ? finalReportPengadaanUB.grandTotals.realLatest.gabah.toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realLatest.beras > 0 ? finalReportPengadaanUB.grandTotals.realLatest.beras.toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realLatest.jagung > 0 ? finalReportPengadaanUB.grandTotals.realLatest.jagung.toLocaleString('id-ID') : "-"}
                          </td>

                          {/* Realisasi Total */}
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realTotal.gabah > 0 ? finalReportPengadaanUB.grandTotals.realTotal.gabah.toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realTotal.beras > 0 ? finalReportPengadaanUB.grandTotals.realTotal.beras.toLocaleString('id-ID') : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.realTotal.jagung > 0 ? finalReportPengadaanUB.grandTotals.realTotal.jagung.toLocaleString('id-ID') : "-"}
                          </td>

                          {/* Persentase Pencapaian */}
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {`${finalReportPengadaanUB.grandTotals.percentage.gabah}%`}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {`${finalReportPengadaanUB.grandTotals.percentage.beras}%`}
                          </td>
                          <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                            {`${finalReportPengadaanUB.grandTotals.percentage.jagung}%`}
                          </td>

                          {/* Harga Rata-rata Gabah */}
                          <td className="border border-white px-2 py-2 text-right whitespace-nowrap bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.priceGabah.agt > 0 ? `Rp ${finalReportPengadaanUB.grandTotals.priceGabah.agt.toLocaleString('id-ID')}` : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right whitespace-nowrap bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.priceGabah.sd > 0 ? `Rp ${finalReportPengadaanUB.grandTotals.priceGabah.sd.toLocaleString('id-ID')}` : "-"}
                          </td>

                          {/* Harga Rata-rata Beras */}
                          <td className="border border-white px-2 py-2 text-right whitespace-nowrap bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.priceBeras.agt > 0 ? `Rp ${finalReportPengadaanUB.grandTotals.priceBeras.agt.toLocaleString('id-ID')}` : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right whitespace-nowrap bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.priceBeras.sd > 0 ? `Rp ${finalReportPengadaanUB.grandTotals.priceBeras.sd.toLocaleString('id-ID')}` : "-"}
                          </td>

                          {/* Harga Rata-rata Jagung */}
                          <td className="border border-white px-2 py-2 text-right whitespace-nowrap bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.priceJagung.agt > 0 ? `Rp ${finalReportPengadaanUB.grandTotals.priceJagung.agt.toLocaleString('id-ID')}` : "-"}
                          </td>
                          <td className="border border-white px-2 py-2 text-right whitespace-nowrap bg-clip-padding">
                            {finalReportPengadaanUB.grandTotals.priceJagung.sd > 0 ? `Rp ${finalReportPengadaanUB.grandTotals.priceJagung.sd.toLocaleString('id-ID')}` : "-"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </>
            )}

            {activeTab === 'report4' && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">4. Data Penyerapan</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button onClick={() => setSubTabReport4('penyerapan')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport4 === 'penyerapan' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Penyerapan</button>
                      <button onClick={() => setSubTabReport4('hpp')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport4 === 'hpp' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>HPP</button>
                      <button onClick={() => setSubTabReport4('final')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport4 === 'final' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Final Report</button>
                      <button onClick={() => setSubTabReport4('pivot-custom')} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTabReport4 === 'pivot-custom' ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Pivot Custom</button>
                    </div>
                  </div>
                </div>

                {subTabReport4 === 'pivot-custom' && (
                  <div className="p-6 text-center text-gray-700 font-semibold">
                    Pivot Custom Data
                  </div>
                )}

                {subTabReport4 === 'penyerapan' && report4PenyerapanData && (
                  <div className="p-6 space-y-8">
                    {/* Table 1: Penyerapan (Historical vs Current Month vs Total) */}
                    <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                      <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                        <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                          <tr>
                            <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-3 w-12 text-center bg-clip-padding">No</th>
                            <th rowSpan={2} className="border border-white bg-[#1D63A8] px-4 py-3 min-w-[200px] text-left bg-clip-padding">Company</th>
                            <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding uppercase">
                              31 {report4PenyerapanData.prevMonthName} 2026
                            </th>
                            <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding uppercase">
                              S/d Terakhir
                            </th>
                            <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2 text-center bg-clip-padding uppercase">
                              Total
                            </th>
                            <th rowSpan={2} className="border border-white bg-[#1D63A8] px-3 py-3 text-right min-w-[100px] bg-clip-padding">
                              HARGA<br/><span className="text-[9px] font-normal">Rp/KG</span>
                            </th>
                          </tr>
                          <tr className="text-[9px] font-normal bg-[#1D63A8]">
                            <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Kuantum</th>
                            <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Nilai</th>
                            <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Kuantum</th>
                            <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Nilai</th>
                            <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Kuantum</th>
                            <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding">Nilai</th>
                          </tr>
                        </thead>
                        <tbody className="bg-[#DDEBF7]">
                          {report4PenyerapanData.sortedGudang.map((gudang, idx) => {
                            const item = report4PenyerapanData.grouped[gudang];
                            return (
                              <tr key={gudang} className="hover:bg-blue-100 transition-colors">
                                <td className="border border-white px-2 py-1.5 text-center bg-clip-padding">{idx + 1}</td>
                                <td className="border border-white px-4 py-1.5 font-medium bg-clip-padding">{gudang}</td>
                                <td className="border border-white px-2 py-1.5 text-right bg-clip-padding">
                                  {item.prevQty > 0 ? Math.round(item.prevQty).toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="border border-white px-2 py-1.5 text-right bg-clip-padding">
                                  {item.prevTotal > 0 ? Math.round(item.prevTotal).toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="border border-white px-2 py-1.5 text-right bg-clip-padding">
                                  {item.currentQty > 0 ? Math.round(item.currentQty).toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="border border-white px-2 py-1.5 text-right bg-clip-padding">
                                  {item.currentTotal > 0 ? Math.round(item.currentTotal).toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="border border-white px-2 py-1.5 text-right font-semibold bg-clip-padding">
                                  {item.totalQty > 0 ? Math.round(item.totalQty).toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="border border-white px-2 py-1.5 text-right font-semibold bg-clip-padding">
                                  {item.totalNom > 0 ? Math.round(item.totalNom).toLocaleString('id-ID') : "-"}
                                </td>
                                <td className="border border-white px-3 py-1.5 text-right font-bold bg-[#1D63A8]/20 bg-clip-padding">
                                  {item.harga > 0 ? item.harga.toLocaleString('id-ID') : "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-[#1D63A8] text-white font-bold sticky bottom-0 z-10 shadow-inner">
                          <tr>
                            <td colSpan={2} className="border border-white px-4 py-2 text-center bg-clip-padding">Grand Total</td>
                            <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                              {report4PenyerapanData.grandPrevQty > 0 ? Math.round(report4PenyerapanData.grandPrevQty).toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                              {report4PenyerapanData.grandPrevTotal > 0 ? Math.round(report4PenyerapanData.grandPrevTotal).toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                              {report4PenyerapanData.grandCurrentQty > 0 ? Math.round(report4PenyerapanData.grandCurrentQty).toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                              {report4PenyerapanData.grandCurrentTotal > 0 ? Math.round(report4PenyerapanData.grandCurrentTotal).toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                              {report4PenyerapanData.grandTotalQty > 0 ? Math.round(report4PenyerapanData.grandTotalQty).toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                              {report4PenyerapanData.grandTotalNom > 0 ? Math.round(report4PenyerapanData.grandTotalNom).toLocaleString('id-ID') : "-"}
                            </td>
                            <td className="border border-white px-3 py-2 text-right bg-[#1D63A8]/40 bg-clip-padding">
                              {report4PenyerapanData.grandHarga > 0 ? report4PenyerapanData.grandHarga.toLocaleString('id-ID') : "-"}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Bottom Section: Table 2 (2026 vs 2025) on the left & Table 3 (1 Jan - 31 Aug 2026 Ringkasan Penyerapan & Persediaan) on the right */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {/* Table 2: Perbandingan Realisasi Penyerapan 2026 vs 2025 */}
                      <div className="overflow-auto scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                        <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                          <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                            <tr>
                              <th rowSpan={2} className="border border-white bg-[#1D63A8] px-4 py-3 min-w-[140px] text-left bg-clip-padding uppercase">COMPANY</th>
                              <th colSpan={1} className="border border-white bg-[#1D63A8] px-3 py-1.5 text-center bg-clip-padding">2026</th>
                              <th colSpan={1} className="border border-white bg-[#1D63A8] px-3 py-1.5 text-center bg-clip-padding">2025</th>
                              <th colSpan={1} className="border border-white bg-[#1D63A8] px-3 py-1.5 text-center bg-clip-padding">2026</th>
                              <th colSpan={1} className="border border-white bg-[#1D63A8] px-3 py-1.5 text-center bg-clip-padding">2025</th>
                            </tr>
                            <tr className="text-[10px] font-semibold bg-[#1D63A8]">
                              <th className="border border-white bg-[#1D63A8] px-3 py-1 text-right bg-clip-padding uppercase min-w-[70px]">TON</th>
                              <th className="border border-white bg-[#1D63A8] px-3 py-1 text-right bg-clip-padding uppercase min-w-[70px]">TON</th>
                              <th className="border border-white bg-[#1D63A8] px-3 py-1 text-right bg-clip-padding min-w-[70px]">Rp</th>
                              <th className="border border-white bg-[#1D63A8] px-3 py-1 text-right bg-clip-padding min-w-[70px]">Rp</th>
                            </tr>
                          </thead>
                          <tbody className="bg-[#DDEBF7]">
                            {report4PenyerapanData.sortedGudang.map((gudang) => {
                              const item = report4PenyerapanData.grouped[gudang];
                              const data2025 = DATA_PENYERAPAN_2025[gudang] || { ton: 0, rp: 0 };
                              const ton2026 = item.totalQty > 0 ? Math.round(item.totalQty / 1000) : 0;
                              const rp2026 = item.harga > 0 ? item.harga : 0;

                              return (
                                <tr key={gudang} className="hover:bg-blue-100 transition-colors font-medium">
                                  <td className="border border-white px-4 py-2 font-semibold bg-clip-padding">{gudang}</td>
                                  <td className="border border-white px-3 py-2 text-right bg-clip-padding">
                                    {ton2026 > 0 ? ton2026.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white px-3 py-2 text-right bg-clip-padding">
                                    {data2025.ton > 0 ? data2025.ton.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white px-3 py-2 text-right bg-clip-padding font-semibold">
                                    {rp2026 > 0 ? rp2026.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white px-3 py-2 text-right bg-clip-padding font-semibold">
                                    {data2025.rp > 0 ? data2025.rp.toLocaleString('id-ID') : "-"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="bg-[#1D63A8] text-white font-bold sticky bottom-0 z-10 shadow-inner">
                            <tr>
                              <td className="border border-white px-4 py-2 text-left bg-clip-padding uppercase">TOTAL</td>
                              <td className="border border-white px-3 py-2 text-right bg-clip-padding">
                                {Math.round(report4PenyerapanData.grandTotalQty / 1000).toLocaleString('id-ID')}
                              </td>
                              <td className="border border-white px-3 py-2 text-right bg-clip-padding">
                                {Object.values(DATA_PENYERAPAN_2025).reduce((acc, curr) => acc + curr.ton, 0).toLocaleString('id-ID')}
                              </td>
                              <td className="border border-white px-3 py-2 text-right bg-clip-padding">
                                {report4PenyerapanData.grandHarga > 0 ? report4PenyerapanData.grandHarga.toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white px-3 py-2 text-right bg-clip-padding">
                                {(() => {
                                  const totalTon2025 = Object.values(DATA_PENYERAPAN_2025).reduce((acc, curr) => acc + curr.ton, 0);
                                  const totalNom2025 = Object.values(DATA_PENYERAPAN_2025).reduce((acc, curr) => acc + (curr.ton * curr.rp), 0);
                                  const avgHarga2025 = totalTon2025 > 0 ? Math.round(totalNom2025 / totalTon2025) : 0;
                                  return avgHarga2025 > 0 ? avgHarga2025.toLocaleString('id-ID') : "-";
                                })()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Table 3: 1 Jan - 31 Aug 2026 (Kuantum, Harga, Persediaan GKP/GKG) */}
                      <div className="overflow-auto scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm">
                        <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                          <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                            <tr>
                              <th colSpan={6} className="border border-white bg-[#1D63A8] px-3 py-1.5 text-center bg-clip-padding font-bold text-xs uppercase">
                                1 Jan - {report4PenyerapanData.latestDateFormatted}
                              </th>
                            </tr>
                            <tr>
                              <th rowSpan={2} className="border border-white bg-[#1D63A8] px-2 py-2.5 w-10 text-center bg-clip-padding uppercase">No</th>
                              <th rowSpan={2} className="border border-white bg-[#1D63A8] px-4 py-2.5 min-w-[140px] text-left bg-clip-padding uppercase">Lokasi</th>
                              <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1.5 text-center bg-clip-padding uppercase">Penyerapan</th>
                              <th colSpan={2} className="border border-white bg-[#1D63A8] px-2 py-1.5 text-center bg-clip-padding uppercase">Persediaan</th>
                            </tr>
                            <tr className="text-[10px] font-semibold bg-[#1D63A8]">
                              <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding min-w-[80px]">Kuantum<br/>Penyerapan<br/>(Ton)</th>
                              <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding min-w-[75px]">Harga Rata-<br/>Rata (Rp)</th>
                              <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding min-w-[75px]">Persediaan<br/>GKP (TON)</th>
                              <th className="border border-white bg-[#1D63A8] px-2 py-1 text-right bg-clip-padding min-w-[75px]">Persediaan<br/>GKG (TON)</th>
                            </tr>
                          </thead>
                          <tbody className="bg-[#DDEBF7]">
                            {report4PenyerapanData.sortedGudang.map((gudang, idx) => {
                              const item = report4PenyerapanData.grouped[gudang];
                              const tonPenyerapan = item.totalQty > 0 ? Math.round(item.totalQty / 1000) : 0;
                              const hargaRata = item.harga > 0 ? item.harga : 0;
                              const gkpTon = persediaanSPP[gudang]?.gkpTon || 0;
                              const gkgTon = persediaanSPP[gudang]?.gkgTon || 0;

                              return (
                                <tr key={gudang} className="hover:bg-blue-100 transition-colors font-medium">
                                  <td className="border border-white px-2 py-2 text-center bg-clip-padding">{idx + 1}</td>
                                  <td className="border border-white px-4 py-2 font-semibold bg-clip-padding">{gudang}</td>
                                  <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                                    {tonPenyerapan > 0 ? tonPenyerapan.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white px-2 py-2 text-right bg-clip-padding font-semibold">
                                    {hargaRata > 0 ? hargaRata.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                                    {gkpTon > 0 ? Math.round(gkpTon).toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                                    {gkgTon > 0 ? Math.round(gkgTon).toLocaleString('id-ID') : "-"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="bg-[#1D63A8] text-white font-bold sticky bottom-0 z-10 shadow-inner">
                            <tr>
                              <td colSpan={2} className="border border-white px-4 py-2 text-center bg-clip-padding uppercase">Total</td>
                              <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                                {Math.round(report4PenyerapanData.grandTotalQty / 1000).toLocaleString('id-ID')}
                              </td>
                              <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                                {report4PenyerapanData.grandHarga > 0 ? report4PenyerapanData.grandHarga.toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                                {(() => {
                                  const totalGkp = report4PenyerapanData.sortedGudang.reduce((acc, g) => acc + (persediaanSPP[g]?.gkpTon || 0), 0);
                                  return totalGkp > 0 ? Math.round(totalGkp).toLocaleString('id-ID') : "-";
                                })()}
                              </td>
                              <td className="border border-white px-2 py-2 text-right bg-clip-padding">
                                {(() => {
                                  const totalGkg = report4PenyerapanData.sortedGudang.reduce((acc, g) => acc + (persediaanSPP[g]?.gkgTon || 0), 0);
                                  return totalGkg > 0 ? Math.round(totalGkg).toLocaleString('id-ID') : "-";
                                })()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {subTabReport4 !== 'penyerapan' && subTabReport4 !== 'pivot-custom' && (
                  <div className="p-10 flex flex-col items-center justify-center text-gray-400 bg-gray-50 h-64">
                    <p>Tab ini sedang dalam pengembangan.</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'report5' && (
              inventoryData.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50/50">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 mb-3 shadow-inner">
                    <Package size={28} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Data Persediaan (Stok) Belum Dimuat</h3>
                  <p className="text-xs text-gray-500 max-w-md mb-4">Modul Data Persediaan membutuhkan file Excel data persediaan / mutasi stok ERP. Silakan upload file persediaan terlebih dahulu.</p>
                  <button
                    onClick={() => fileInputPersediaanRef.current?.click()}
                    className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Plus size={14} /> Upload Data Persediaan
                  </button>
                </div>
              ) : (
                <>
                  {/* Report 5 Sub-Tabs Navigation */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900">5. Data Persediaan</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => setSubTabReport5('persediaan')}
                        className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                          subTabReport5 === 'persediaan'
                            ? 'bg-[#1D63A8] text-white border-[#1D63A8]'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Persediaan
                      </button>
                      <button
                        onClick={() => setSubTabReport5('hpp')}
                        className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                          subTabReport5 === 'hpp'
                            ? 'bg-[#1D63A8] text-white border-[#1D63A8]'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        HPP
                      </button>
                      <button
                        onClick={() => setSubTabReport5('hasil-samping')}
                        className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                          subTabReport5 === 'hasil-samping'
                            ? 'bg-[#1D63A8] text-white border-[#1D63A8]'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Hasil Samping
                      </button>
                    </div>
                  </div>

                  {/* Sub-Tab 1: Persediaan (Sum of Qty per Company filtered by Product Category Multi-Select) */}
                  {subTabReport5 === 'persediaan' && (
                    <>
                      <div className="px-6 py-3 flex flex-wrap items-center gap-3">
                        <div className="relative" ref={categoryDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                            className="text-sm text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8] flex items-center justify-between gap-3 min-w-[220px] shadow-sm hover:border-gray-400 transition-colors"
                          >
                            <span className="truncate font-medium">
                              {filterCategoriesReport5.length === 0
                                ? "Pilih Kategori..."
                                : filterCategoriesReport5.length === 1
                                ? filterCategoriesReport5[0]
                                : `${filterCategoriesReport5.join(", ")}`}
                            </span>
                            <ChevronDown size={14} className="text-gray-500 shrink-0" />
                          </button>

                          {isCategoryDropdownOpen && (
                            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30 text-xs">
                              <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Pilih Kategori (Multi-Select)</span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setFilterCategoriesReport5(["GKG", "GKP", "Beras Bahan Baku", "Beras Jadi", "Kemasan", "Produk Sampingan"])}
                                    className="text-[10px] text-[#1D63A8] hover:underline font-semibold"
                                  >
                                    Semua
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    type="button"
                                    onClick={() => setFilterCategoriesReport5([])}
                                    className="text-[10px] text-red-500 hover:underline font-semibold"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                              <div className="py-1">
                                {[
                                  { id: "GKG", label: "GKG" },
                                  { id: "GKP", label: "GKP" },
                                  { id: "Beras Bahan Baku", label: "Beras Bahan Baku" },
                                  { id: "Beras Jadi", label: "Beras Jadi" },
                                  { id: "Kemasan", label: "Kemasan" },
                                  { id: "Produk Sampingan", label: "Produk Sampingan" },
                                ].map(cat => {
                                  const isChecked = filterCategoriesReport5.includes(cat.id);
                                  return (
                                    <label
                                      key={cat.id}
                                      className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-50 cursor-pointer select-none font-medium text-gray-800"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setFilterCategoriesReport5(prev => prev.filter(c => c !== cat.id));
                                          } else {
                                            setFilterCategoriesReport5(prev => [...prev, cat.id]);
                                          }
                                        }}
                                        className="rounded text-[#1D63A8] focus:ring-[#1D63A8] h-3.5 w-3.5 border-gray-300 cursor-pointer"
                                      />
                                      <span>{cat.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Checkbox Sembunyikan Gudang Kosong */}
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 select-none cursor-pointer bg-white px-3 py-1.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-colors">
                          <input
                            type="checkbox"
                            checked={hideZeroReport5}
                            onChange={(e) => setHideZeroReport5(e.target.checked)}
                            className="rounded text-[#1D63A8] focus:ring-[#1D63A8] h-3.5 w-3.5 border-gray-300 cursor-pointer"
                          />
                          <span>Sembunyikan Gudang Kosong</span>
                        </label>
                      </div>

                      {report5PersediaanData && (
                        <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm m-6 mt-0">
                          <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                            <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                              <tr>
                                <th className="px-2 py-3 border border-white bg-[#1D63A8] w-10 bg-clip-padding">No</th>
                                <th className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[200px] text-left bg-clip-padding">Row Labels</th>
                                <th className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[150px] text-right bg-clip-padding">
                                  Sum of Qty {filterCategoriesReport5.length === 1 && filterCategoriesReport5[0] === 'Kemasan' ? '(Pcs)' : '(Kg)'}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-[#DDEBF7]">
                              {report5PersediaanData.sortedGudang
                                .filter(gudang => {
                                  if (!hideZeroReport5) return true;
                                  const item = report5PersediaanData.grouped[gudang];
                                  return item && item.qty > 0;
                                })
                                .map((gudang, idx) => {
                                  const item = report5PersediaanData.grouped[gudang] || { qty: 0, value: 0 };
                                  return (
                                    <tr key={gudang} className="hover:bg-blue-100 transition-colors">
                                      <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{idx + 1}</td>
                                      <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                                      <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">
                                        {item.qty > 0 ? Math.round(item.qty).toLocaleString('id-ID') : "-"}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                            <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                              <tr className="bg-[#c1d9f0]">
                                <td colSpan={2} className="px-4 py-1.5 border border-white text-center bg-clip-padding">Grand Total</td>
                                <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">
                                  {report5PersediaanData.totalQty > 0
                                    ? Math.round(report5PersediaanData.totalQty).toLocaleString('id-ID')
                                    : "-"}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </>
                  )}

                  {/* Sub-Tab 2: HPP (Grouped by Company & Product with Qty, Total Value, and Average HPP) */}
                  {subTabReport5 === 'hpp' && (
                    <>
                      <div className="px-6 py-3 flex flex-wrap items-center gap-3">
                        <div className="relative" ref={categoryDropdownRefHPP}>
                          <button
                            type="button"
                            onClick={() => setIsCategoryDropdownOpenHPP(prev => !prev)}
                            className="text-sm text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8] flex items-center justify-between gap-3 min-w-[220px] shadow-sm hover:border-gray-400 transition-colors"
                          >
                            <span className="truncate font-medium">
                              {filterCategoriesReport5HPP.length === 0
                                ? "Pilih Kategori..."
                                : filterCategoriesReport5HPP.length === 1
                                ? filterCategoriesReport5HPP[0]
                                : `${filterCategoriesReport5HPP.join(", ")}`}
                            </span>
                            <ChevronDown size={14} className="text-gray-500 shrink-0" />
                          </button>

                          {isCategoryDropdownOpenHPP && (
                            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30 text-xs">
                              <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Pilih Kategori (Multi-Select)</span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setFilterCategoriesReport5HPP(["GKG", "Beras Bahan Baku", "Beras Jadi", "Kemasan", "Produk Sampingan"])}
                                    className="text-[10px] text-[#1D63A8] hover:underline font-semibold"
                                  >
                                    Semua
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    type="button"
                                    onClick={() => setFilterCategoriesReport5HPP([])}
                                    className="text-[10px] text-red-500 hover:underline font-semibold"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                              <div className="py-1">
                                {[
                                  { id: "GKG", label: "GKG" },
                                  { id: "Beras Bahan Baku", label: "Beras Bahan Baku" },
                                  { id: "Beras Jadi", label: "Beras Jadi" },
                                  { id: "Kemasan", label: "Kemasan" },
                                  { id: "Produk Sampingan", label: "Produk Sampingan" },
                                ].map(cat => {
                                  const isChecked = filterCategoriesReport5HPP.includes(cat.id);
                                  return (
                                    <label
                                      key={cat.id}
                                      className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-50 cursor-pointer select-none font-medium text-gray-800"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setFilterCategoriesReport5HPP(prev => prev.filter(c => c !== cat.id));
                                          } else {
                                            setFilterCategoriesReport5HPP(prev => [...prev, cat.id]);
                                          }
                                        }}
                                        className="rounded text-[#1D63A8] focus:ring-[#1D63A8] h-3.5 w-3.5 border-gray-300 cursor-pointer"
                                      />
                                      <span>{cat.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Checkbox Sembunyikan Gudang Kosong */}
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 select-none cursor-pointer bg-white px-3 py-1.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-colors">
                          <input
                            type="checkbox"
                            checked={hideZeroReport5HPP}
                            onChange={(e) => setHideZeroReport5HPP(e.target.checked)}
                            className="rounded text-[#1D63A8] focus:ring-[#1D63A8] h-3.5 w-3.5 border-gray-300 cursor-pointer"
                          />
                          <span>Sembunyikan Gudang Kosong</span>
                        </label>
                      </div>

                      {report5HPPData && (
                        <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm m-6 mt-0">
                          <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                            <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                              <tr>
                                <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] w-10 bg-clip-padding align-middle">No</th>
                                <th rowSpan={2} className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[180px] text-left bg-clip-padding align-middle">Company</th>
                                <th rowSpan={2} className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[220px] text-left bg-clip-padding align-middle">Product</th>
                                <th colSpan={3} className="px-4 py-1.5 border border-white bg-[#1D63A8] bg-clip-padding text-center">Values</th>
                              </tr>
                              <tr>
                                <th className="px-4 py-2 border border-white bg-[#1D63A8] min-w-[130px] text-right bg-clip-padding">
                                  Sum of Qty {filterCategoriesReport5HPP.length === 1 && filterCategoriesReport5HPP[0] === 'Kemasan' ? '(Pcs)' : '(Kg)'}
                                </th>
                                <th className="px-4 py-2 border border-white bg-[#1D63A8] min-w-[150px] text-right bg-clip-padding">
                                  Sum of Total Value
                                </th>
                                <th className="px-4 py-2 border border-white bg-[#1D63A8] min-w-[130px] text-right bg-clip-padding">
                                  Average of HPP
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-[#DDEBF7]">
                              {(() => {
                                const visibleGroups = report5HPPData.companyGroups.filter(g => {
                                  if (!hideZeroReport5HPP) return true;
                                  return g.products.length > 0 && g.totalCompanyQty > 0;
                                });

                                let rowCounter = 0;

                                return visibleGroups.map((group) => {
                                  if (group.products.length === 0) {
                                    rowCounter++;
                                    return (
                                      <tr key={group.company} className="hover:bg-blue-100 transition-colors">
                                        <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{rowCounter}</td>
                                        <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{group.company}</td>
                                        <td className="px-4 py-1.5 border border-white text-center bg-clip-padding">-</td>
                                        <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">-</td>
                                        <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">-</td>
                                        <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">-</td>
                                      </tr>
                                    );
                                  }

                                  rowCounter++;
                                  const currentNo = rowCounter;

                                  return group.products.map((prod, pIdx) => (
                                    <tr key={`${group.company}-${prod.productName}-${pIdx}`} className="hover:bg-blue-100 transition-colors">
                                      {pIdx === 0 && (
                                        <>
                                          <td
                                            rowSpan={group.products.length}
                                            className="px-2 py-1.5 border border-white text-center font-medium bg-clip-padding align-top"
                                          >
                                            {currentNo}
                                          </td>
                                          <td
                                            rowSpan={group.products.length}
                                            className="px-4 py-1.5 border border-white font-semibold bg-clip-padding align-top"
                                          >
                                            {group.company}
                                          </td>
                                        </>
                                      )}
                                      <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{prod.productName}</td>
                                      <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">
                                        {prod.qty > 0 ? Math.round(prod.qty).toLocaleString('id-ID') : "-"}
                                      </td>
                                      <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">
                                        {prod.value > 0 ? Math.round(prod.value).toLocaleString('id-ID') : "-"}
                                      </td>
                                      <td className="px-4 py-1.5 border border-white text-right font-semibold bg-clip-padding">
                                        {prod.avgHPP > 0 ? Math.round(prod.avgHPP).toLocaleString('id-ID') : "-"}
                                      </td>
                                    </tr>
                                  ));
                                });
                              })()}
                            </tbody>
                            <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                              <tr className="bg-[#c1d9f0]">
                                <td colSpan={3} className="px-4 py-1.5 border border-white text-center bg-clip-padding font-bold">
                                  Grand Total
                                </td>
                                <td className="px-4 py-1.5 border border-white text-right bg-clip-padding font-bold">
                                  {report5HPPData.totalQty > 0
                                    ? Math.round(report5HPPData.totalQty).toLocaleString('id-ID')
                                    : "-"}
                                </td>
                                <td className="px-4 py-1.5 border border-white text-right bg-clip-padding font-bold">
                                  {report5HPPData.totalValue > 0
                                    ? Math.round(report5HPPData.totalValue).toLocaleString('id-ID')
                                    : "-"}
                                </td>
                                <td className="px-4 py-1.5 border border-white text-right bg-clip-padding font-bold">
                                  {report5HPPData.grandAvgHPP > 0
                                    ? Math.round(report5HPPData.grandAvgHPP).toLocaleString('id-ID')
                                    : "-"}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </>
                  )}

                  {/* Sub-Tab 3: Hasil Samping (Grouped by Company & SKU under Produk Sampingan) */}
                  {subTabReport5 === 'hasil-samping' && (
                    <>
                      <div className="px-6 py-3 flex flex-wrap items-center gap-3">
                        <div className="relative" ref={productDropdownRefHasilSamping}>
                          <button
                            type="button"
                            onClick={() => setIsProductDropdownOpenHasilSamping(prev => !prev)}
                            className="text-sm text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8] flex items-center justify-between gap-3 min-w-[220px] shadow-sm hover:border-gray-400 transition-colors"
                          >
                            <span className="truncate font-medium">
                              {filterProductsReport5HasilSamping.length === 0
                                ? "Pilih Produk..."
                                : filterProductsReport5HasilSamping.length === 1
                                ? filterProductsReport5HasilSamping[0]
                                : `${filterProductsReport5HasilSamping.join(", ")}`}
                            </span>
                            <ChevronDown size={14} className="text-gray-500 shrink-0" />
                          </button>

                          {isProductDropdownOpenHasilSamping && (
                            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30 text-xs">
                              <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Pilih Produk (Multi-Select)</span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setFilterProductsReport5HasilSamping([...report5HasilSampingOptions])}
                                    className="text-[10px] text-[#1D63A8] hover:underline font-semibold"
                                  >
                                    Semua
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    type="button"
                                    onClick={() => setFilterProductsReport5HasilSamping([])}
                                    className="text-[10px] text-red-500 hover:underline font-semibold"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                              <div className="py-1 max-h-56 overflow-y-auto">
                                {report5HasilSampingOptions.map(pName => {
                                  const isChecked = filterProductsReport5HasilSamping.includes(pName);
                                  return (
                                    <label
                                      key={pName}
                                      className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-50 cursor-pointer select-none font-medium text-gray-800"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setFilterProductsReport5HasilSamping(prev => prev.filter(c => c !== pName));
                                          } else {
                                            setFilterProductsReport5HasilSamping(prev => [...prev, pName]);
                                          }
                                        }}
                                        className="rounded text-[#1D63A8] focus:ring-[#1D63A8] h-3.5 w-3.5 border-gray-300 cursor-pointer"
                                      />
                                      <span>{pName}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Checkbox Sembunyikan Gudang Kosong */}
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 select-none cursor-pointer bg-white px-3 py-1.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-colors">
                          <input
                            type="checkbox"
                            checked={hideZeroReport5HasilSamping}
                            onChange={(e) => setHideZeroReport5HasilSamping(e.target.checked)}
                            className="rounded text-[#1D63A8] focus:ring-[#1D63A8] h-3.5 w-3.5 border-gray-300 cursor-pointer"
                          />
                          <span>Sembunyikan Gudang Kosong</span>
                        </label>
                      </div>

                      {report5HasilSampingData && (
                        <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm m-6 mt-0">
                          <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                            <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md uppercase">
                              <tr>
                                <th className="px-2 py-3 border border-white bg-[#1D63A8] w-10 bg-clip-padding align-middle">No</th>
                                <th className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[180px] text-left bg-clip-padding align-middle">INFRASTRUKTUR</th>
                                <th className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[220px] text-left bg-clip-padding align-middle">SKU</th>
                                <th className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[130px] text-right bg-clip-padding align-middle">KUANTUM (KG)</th>
                                <th className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[150px] text-right bg-clip-padding align-middle">NILAI PERSEDIAAN</th>
                                <th className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[130px] text-right bg-clip-padding align-middle">HPP</th>
                              </tr>
                            </thead>
                            <tbody className="bg-[#DDEBF7]">
                              {(() => {
                                const visibleGroups = report5HasilSampingData.companyGroups.filter(g => {
                                  if (!hideZeroReport5HasilSamping) return true;
                                  return g.products.length > 0 && g.totalCompanyQty > 0;
                                });

                                let rowCounter = 0;

                                return visibleGroups.map((group) => {
                                  if (group.products.length === 0) {
                                    rowCounter++;
                                    return (
                                      <tr key={group.company} className="hover:bg-blue-100 transition-colors">
                                        <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{rowCounter}</td>
                                        <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{group.company}</td>
                                        <td className="px-4 py-1.5 border border-white text-center bg-clip-padding">-</td>
                                        <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">-</td>
                                        <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">-</td>
                                        <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">-</td>
                                      </tr>
                                    );
                                  }

                                  rowCounter++;
                                  const currentNo = rowCounter;

                                  return group.products.map((prod, pIdx) => (
                                    <tr key={`${group.company}-${prod.productName}-${pIdx}`} className="hover:bg-blue-100 transition-colors">
                                      {pIdx === 0 && (
                                        <>
                                          <td
                                            rowSpan={group.products.length}
                                            className="px-2 py-1.5 border border-white text-center font-medium bg-clip-padding align-top"
                                          >
                                            {currentNo}
                                          </td>
                                          <td
                                            rowSpan={group.products.length}
                                            className="px-4 py-1.5 border border-white font-bold bg-clip-padding align-top"
                                          >
                                            {group.company}
                                          </td>
                                        </>
                                      )}
                                      <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{prod.productName}</td>
                                      <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">
                                        {prod.qty > 0 ? Math.round(prod.qty).toLocaleString('id-ID') : "-"}
                                      </td>
                                      <td className="px-4 py-1.5 border border-white text-right bg-clip-padding">
                                        {prod.value > 0 ? `Rp ${Math.round(prod.value).toLocaleString('id-ID')}` : "-"}
                                      </td>
                                      <td className="px-4 py-1.5 border border-white text-right font-semibold bg-clip-padding">
                                        {prod.avgHPP > 0 ? `Rp ${Math.round(prod.avgHPP).toLocaleString('id-ID')}` : "-"}
                                      </td>
                                    </tr>
                                  ));
                                });
                              })()}
                            </tbody>
                            <tfoot className="bg-[#1D63A8] text-white font-bold border-t-2 border-white">
                              <tr>
                                <td colSpan={3} className="px-4 py-2 border border-white text-center bg-clip-padding uppercase font-bold">
                                  TOTAL
                                </td>
                                <td className="px-4 py-2 border border-white text-right bg-clip-padding font-bold">
                                  {report5HasilSampingData.totalQty > 0
                                    ? Math.round(report5HasilSampingData.totalQty).toLocaleString('id-ID')
                                    : "-"}
                                </td>
                                <td className="px-4 py-2 border border-white text-right bg-clip-padding font-bold">
                                  {report5HasilSampingData.totalValue > 0
                                    ? `Rp ${Math.round(report5HasilSampingData.totalValue).toLocaleString('id-ID')}`
                                    : "-"}
                                </td>
                                <td className="px-4 py-2 border border-white text-right bg-clip-padding font-bold">
                                  {report5HasilSampingData.grandAvgHPP > 0
                                    ? `Rp ${Math.round(report5HasilSampingData.grandAvgHPP).toLocaleString('id-ID')}`
                                    : "-"}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </>
              )
            )}

            {activeTab === 'report6' && (
              salesData.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50/50">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 mb-3 shadow-inner">
                    <TrendingUp size={28} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Data Penjualan (SO) Belum Dimuat</h3>
                  <p className="text-xs text-gray-500 max-w-md mb-4">Modul Realisasi Penjualan membutuhkan file Excel data penjualan (Sales Order / SO). Silakan upload file penjualan terlebih dahulu.</p>
                  <button
                    onClick={() => fileInputPenjualanRef.current?.click()}
                    className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Plus size={14} /> Upload Data Penjualan
                  </button>
                </div>
              ) : (
                <div className="space-y-0">
                  <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">6. Realisasi Penjualan</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={() => setSubTabReport6('pivot')}
                          className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                            subTabReport6 === 'pivot'
                              ? 'bg-[#1D63A8] text-white border-[#1D63A8]'
                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Pivot Raw Data
                        </button>
                        <button
                          onClick={() => setSubTabReport6('final')}
                          className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                            subTabReport6 === 'final'
                              ? 'bg-[#1D63A8] text-white border-[#1D63A8]'
                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Final Report
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sub-Tab 1: Pivot Raw Data */}
                  {subTabReport6 === 'pivot' && (
                    <>
                      <div className="px-6 py-3 flex flex-wrap items-center gap-3">
                        <div className="relative" ref={categoryDropdownRefReport6}>
                          <button
                            type="button"
                            onClick={() => setIsCategoryDropdownOpenReport6(prev => !prev)}
                            className="text-sm text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D63A8] flex items-center justify-between gap-3 min-w-[220px] shadow-sm hover:border-gray-400 transition-colors"
                          >
                            <span className="truncate font-medium">
                              {filterCategoriesReport6Pivot.length === 0
                                ? "Pilih Kategori..."
                                : filterCategoriesReport6Pivot.length === 4
                                ? "Semua Kategori"
                                : filterCategoriesReport6Pivot.length === 1
                                ? filterCategoriesReport6Pivot[0]
                                : `${filterCategoriesReport6Pivot.join(", ")}`}
                            </span>
                            <ChevronDown size={14} className="text-gray-500 shrink-0" />
                          </button>

                          {isCategoryDropdownOpenReport6 && (
                            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30 text-xs">
                              <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Pilih Kategori (Multi-Select)</span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setFilterCategoriesReport6Pivot(["Beras Bahan Baku", "Beras Jadi", "Produk Sampingan", "Services"])}
                                    className="text-[10px] text-[#1D63A8] hover:underline font-semibold"
                                  >
                                    Semua
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    type="button"
                                    onClick={() => setFilterCategoriesReport6Pivot([])}
                                    className="text-[10px] text-red-500 hover:underline font-semibold"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                              <div className="py-1">
                                {[
                                  { id: "Beras Bahan Baku", label: "Beras Bahan Baku" },
                                  { id: "Beras Jadi", label: "Beras Jadi" },
                                  { id: "Produk Sampingan", label: "Produk Sampingan" },
                                  { id: "Services", label: "Services" },
                                ].map(cat => {
                                  const isChecked = filterCategoriesReport6Pivot.includes(cat.id);
                                  return (
                                    <label
                                      key={cat.id}
                                      className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-50 cursor-pointer select-none font-medium text-gray-800"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setFilterCategoriesReport6Pivot(prev => prev.filter(c => c !== cat.id));
                                          } else {
                                            setFilterCategoriesReport6Pivot(prev => [...prev, cat.id]);
                                          }
                                        }}
                                        className="rounded text-[#1D63A8] focus:ring-[#1D63A8] h-3.5 w-3.5 border-gray-300 cursor-pointer"
                                      />
                                      <span>{cat.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setShowDailyReport6(!showDailyReport6)}
                          className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors border ${
                            showDailyReport6 ? "bg-[#1D63A8] text-white border-[#1D63A8]" : "bg-white text-gray-600 border-gray-200"
                          }`}
                        >
                          {showDailyReport6 ? "Tampilkan Per Bulan" : "Tampilkan Harian"}
                        </button>

                        {/* Checkbox Sembunyikan Gudang Kosong */}
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 select-none cursor-pointer bg-white px-3 py-1.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-colors">
                          <input
                            type="checkbox"
                            checked={hideZeroReport6Pivot}
                            onChange={(e) => setHideZeroReport6Pivot(e.target.checked)}
                            className="rounded text-[#1D63A8] focus:ring-[#1D63A8] h-3.5 w-3.5 border-gray-300 cursor-pointer"
                          />
                          <span>Sembunyikan Gudang Kosong</span>
                        </label>
                      </div>

                      {report6PivotData && (
                        <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm m-6 mt-0">
                          <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                            <thead className="bg-[#1D63A8] text-white sticky top-0 z-20 font-semibold text-center shadow-md">
                              <tr>
                                <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] w-10 bg-clip-padding align-middle">No</th>
                                <th rowSpan={2} className="px-4 py-3 border border-white bg-[#1D63A8] min-w-[200px] text-left bg-clip-padding align-middle">Row Labels</th>
                                {report6PivotData.monthGroups.map((g, i) => (
                                  <th key={i} colSpan={showDailyReport6 ? g.count : 1} className="px-2 py-3 border border-white bg-[#1D63A8] whitespace-nowrap bg-clip-padding align-middle">
                                    {g.month}
                                  </th>
                                ))}
                                {showDailyReport6 && (
                                  <th rowSpan={2} className="px-4 py-3 border border-white bg-[#1D63A8] font-bold bg-clip-padding align-middle text-right min-w-[140px]">
                                    Grand Total
                                  </th>
                                )}
                              </tr>
                              {showDailyReport6 && (
                                <tr>
                                  {report6PivotData.monthGroups.flatMap(g => g.dates.map(d => {
                                    const dayStr = d === "Unknown Date" ? d : new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }).toUpperCase();
                                    return (
                                      <th key={d} className="px-2 py-2 border border-white bg-[#1D63A8] min-w-[110px] text-[10px] text-right bg-clip-padding">
                                        {dayStr}
                                      </th>
                                    );
                                  }))}
                                </tr>
                              )}
                            </thead>
                            <tbody className="bg-[#DDEBF7]">
                              {(() => {
                                const visibleCompanies = report6PivotData.sortedCompanies.filter(gudang => {
                                  if (!hideZeroReport6Pivot) return true;
                                  return (report6PivotData.pivot[gudang]?.['Total'] || 0) > 0;
                                });

                                return visibleCompanies.map((gudang, idx) => (
                                  <tr key={gudang} className="hover:bg-blue-100 transition-colors">
                                    <td className="px-2 py-1.5 border border-white text-center bg-clip-padding">{idx + 1}</td>
                                    <td className="px-4 py-1.5 border border-white font-medium bg-clip-padding">{gudang}</td>
                                    {showDailyReport6 ? (
                                      report6PivotData.dates.map(d => (
                                        <td key={d} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                          {report6PivotData.pivot[gudang]?.[d] ? Math.round(report6PivotData.pivot[gudang][d]).toLocaleString('id-ID') : "-"}
                                        </td>
                                      ))
                                    ) : (
                                      report6PivotData.monthGroups.map(g => (
                                        <td key={g.month} className="px-2 py-1.5 border border-white text-right bg-clip-padding">
                                          {report6PivotData.pivot[gudang]?.[g.month] ? Math.round(report6PivotData.pivot[gudang][g.month]).toLocaleString('id-ID') : "-"}
                                        </td>
                                      ))
                                    )}
                                    {showDailyReport6 && (
                                      <td className="px-4 py-1.5 border border-white text-right font-bold bg-[#1D63A8] text-white bg-clip-padding">
                                        {report6PivotData.pivot[gudang]?.['Total'] ? Math.round(report6PivotData.pivot[gudang]['Total']).toLocaleString('id-ID') : "-"}
                                      </td>
                                    )}
                                  </tr>
                                ));
                              })()}
                            </tbody>
                            <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                              <tr className="bg-[#c1d9f0]">
                                <td colSpan={2} className="px-4 py-1.5 border border-white text-center bg-clip-padding font-bold">Grand Total</td>
                                {showDailyReport6 ? (
                                  report6PivotData.dates.map(d => {
                                    const sum = report6PivotData.sortedCompanies.reduce((acc, gudang) => acc + (report6PivotData.pivot[gudang]?.[d] || 0), 0);
                                    return (
                                      <td key={d} className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                        {sum > 0 ? Math.round(sum).toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  })
                                ) : (
                                  report6PivotData.monthGroups.map(g => {
                                    const sum = report6PivotData.sortedCompanies.reduce((acc, gudang) => acc + (report6PivotData.pivot[gudang]?.[g.month] || 0), 0);
                                    return (
                                      <td key={g.month} className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                        {sum > 0 ? Math.round(sum).toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  })
                                )}
                                {showDailyReport6 && (
                                  <td className="px-4 py-1.5 border border-white text-right font-bold bg-[#1D63A8] text-white bg-clip-padding">
                                    {(() => {
                                      const total = report6PivotData.sortedCompanies.reduce((acc, gudang) => acc + (report6PivotData.pivot[gudang]?.['Total'] || 0), 0);
                                      return total > 0 ? Math.round(total).toLocaleString('id-ID') : "-";
                                    })()}
                                  </td>
                                )}
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </>
                  )}

                  {/* Sub-Tab 2: Final Report */}
                  {subTabReport6 === 'final' && finalReportRealisasiPenjualan && (
                    <div className="overflow-auto max-h-[600px] scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm m-6 mt-4">
                      <table className="w-full text-left text-[11px] text-gray-700 border-separate border-spacing-0 relative">
                        <thead className="text-white text-center uppercase bg-blue-600 font-bold sticky top-0 z-20 shadow-md">
                          <tr>
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-10 bg-clip-padding align-middle">No</th>
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 w-12 bg-clip-padding align-middle">RM</th>
                            <th rowSpan={2} className="px-4 py-3 border border-white bg-blue-600 min-w-[200px] bg-clip-padding align-middle">LOKASI</th>
                            {finalReportRealisasiPenjualan.pastMonths.map(m => (
                              <th key={m} rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding align-middle">
                                {finalReportRealisasiPenjualan.monthNames[m]}<br/><span className="text-[9px] font-normal">Rp Juta</span>
                              </th>
                            ))}
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-blue-600 bg-clip-padding align-middle">
                              {finalReportRealisasiPenjualan.monthNames[finalReportRealisasiPenjualan.latestMonth]}<br/><span className="text-[9px] font-normal">Rp Juta</span>
                            </th>
                            <th colSpan={finalReportRealisasiPenjualan.weeks.length} className="px-2 py-2 border border-white bg-[#1D63A8] bg-clip-padding align-middle">MINGGUAN</th>
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[100px] bg-clip-padding align-middle">
                              REAL S/D<br/>{finalReportRealisasiPenjualan.fullMonthNames[finalReportRealisasiPenjualan.latestMonth]}<br/><span className="text-[9px] font-normal">Rp Juta</span>
                            </th>
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[90px] bg-clip-padding align-middle">
                              TGT 2026<br/><span className="text-[9px] font-normal">Rp Juta</span>
                            </th>
                            <th rowSpan={2} className="px-2 py-3 border border-white bg-[#1D63A8] min-w-[80px] bg-clip-padding align-middle">
                              VS TGT 2026 (%)<br/><span className="text-[9px] font-normal">%</span>
                            </th>
                          </tr>
                          <tr>
                            {finalReportRealisasiPenjualan.weeks.map(w => (
                              <th key={w} className="px-2 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                                {w.replace('W_', '')} {finalReportRealisasiPenjualan.fullMonthNames[finalReportRealisasiPenjualan.latestMonth]}<br/><span className="text-[9px] font-normal">Rp Juta</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-[#DDEBF7]">
                          {(['SPB', 'SPP', 'UP', 'CDC'] as const).map((group, gIdx) => {
                            const groupData = finalReportRealisasiPenjualan.finalData[group] || {};
                            const gudangList = Object.keys(groupData).sort((a, b) => {
                              const ordA = WAREHOUSE_METADATA[a]?.order ?? 999;
                              const ordB = WAREHOUSE_METADATA[b]?.order ?? 999;
                              if (ordA !== ordB) return ordA - ordB;
                              return a.localeCompare(b);
                            });
                            if (gudangList.length === 0) return null;

                            return (
                              <React.Fragment key={group}>
                                {/* Group Header Row */}
                                <tr className="bg-[#1D63A8] text-white font-bold">
                                  <td className="px-2 py-1 border border-white text-center bg-[#1D63A8] bg-clip-padding">{String.fromCharCode(65 + gIdx)}</td>
                                  <td className="px-2 py-1 border border-white text-center bg-[#1D63A8] bg-clip-padding"></td>
                                  <td colSpan={1 + finalReportRealisasiPenjualan.pastMonths.length + 1 + finalReportRealisasiPenjualan.weeks.length + 1 + 2} className="px-4 py-1 border border-white bg-[#1D63A8] bg-clip-padding">
                                    {group === 'UP' ? 'UNIT PENGOLAHAN' : group}
                                  </td>
                                </tr>

                                {/* Gudang Rows */}
                                {gudangList.map((gudang, idx) => {
                                  const meta = WAREHOUSE_METADATA[gudang];
                                  const rowNum = meta?.order || (idx + 1);
                                  const rmVal = meta?.rm || '-';

                                  const renderValueCell = (itemType: 'PRODUK' | 'JASA', isTotal = false) => (bucket: string) => {
                                    let val = 0;
                                    if (bucket === `M_${finalReportRealisasiPenjualan.latestMonth}`) {
                                      val = finalReportRealisasiPenjualan.weeks.reduce((sum, w) => sum + (groupData[gudang]?.[itemType]?.[w] || 0), 0);
                                    } else if (bucket === 'REAL_SD') {
                                      const pastSum = finalReportRealisasiPenjualan.pastMonths.reduce((sum, m) => sum + (groupData[gudang]?.[itemType]?.[`M_${m}`] || 0), 0);
                                      const activeMonthSum = finalReportRealisasiPenjualan.weeks.reduce((sum, w) => sum + (groupData[gudang]?.[itemType]?.[w] || 0), 0);
                                      val = pastSum + activeMonthSum;
                                    } else {
                                      val = groupData[gudang]?.[itemType]?.[bucket] || 0;
                                    }
                                    const rounded = Math.round(val);
                                    return (
                                      <td key={bucket} className={`px-2 py-1.5 border border-white text-right bg-clip-padding ${isTotal ? 'font-bold bg-[#1D63A8]/20' : ''}`}>
                                        {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  };

                                  const prodPastSum = finalReportRealisasiPenjualan.pastMonths.reduce((sum, m) => sum + (groupData[gudang]?.['PRODUK']?.[`M_${m}`] || 0), 0);
                                  const prodActiveSum = finalReportRealisasiPenjualan.weeks.reduce((sum, w) => sum + (groupData[gudang]?.['PRODUK']?.[w] || 0), 0);
                                  const prodRealSd = prodPastSum + prodActiveSum;
                                  const prodTgt = TARGET_REALISASI_PENJUALAN_2026_DATA[gudang]?.PRODUK ?? 0;
                                  const prodVsTgtPct = prodTgt > 0 ? `${Math.round((prodRealSd / prodTgt) * 100)}%` : "0%";

                                  const jasaPastSum = finalReportRealisasiPenjualan.pastMonths.reduce((sum, m) => sum + (groupData[gudang]?.['JASA']?.[`M_${m}`] || 0), 0);
                                  const jasaActiveSum = finalReportRealisasiPenjualan.weeks.reduce((sum, w) => sum + (groupData[gudang]?.['JASA']?.[w] || 0), 0);
                                  const jasaRealSd = jasaPastSum + jasaActiveSum;
                                  const jasaTgt = TARGET_REALISASI_PENJUALAN_2026_DATA[gudang]?.JASA ?? 0;
                                  const jasaVsTgtPct = jasaTgt > 0 ? `${Math.round((jasaRealSd / jasaTgt) * 100)}%` : "0%";

                                  return (
                                    <React.Fragment key={gudang}>
                                      <tr className="bg-[#DDEBF7] font-bold">
                                        <td className="px-2 py-1 border border-white text-center bg-clip-padding">{rowNum}</td>
                                        <td className="px-2 py-1 border border-white text-center font-bold bg-clip-padding">{rmVal}</td>
                                        <td className="px-4 py-1 border border-white font-bold bg-clip-padding">{gudang}</td>
                                        {finalReportRealisasiPenjualan.pastMonths.map(m => (
                                          <td key={m} className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        ))}
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        {finalReportRealisasiPenjualan.weeks.map(w => (
                                          <td key={w} className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        ))}
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                      </tr>
                                      <tr className="hover:bg-[#c1d9f0] transition-colors text-gray-700">
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-4 py-1 border border-white pl-8 bg-clip-padding font-medium">PRODUK</td>
                                        {finalReportRealisasiPenjualan.pastMonths.map(m => renderValueCell('PRODUK')(`M_${m}`))}
                                        {renderValueCell('PRODUK')(`M_${finalReportRealisasiPenjualan.latestMonth}`)}
                                        {finalReportRealisasiPenjualan.weeks.map(w => renderValueCell('PRODUK')(w))}
                                        {renderValueCell('PRODUK', true)('REAL_SD')}
                                        <td className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                          {prodTgt > 0 ? prodTgt.toLocaleString('id-ID') : "-"}
                                        </td>
                                        <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                          {prodVsTgtPct}
                                        </td>
                                      </tr>
                                      <tr className="hover:bg-[#c1d9f0] transition-colors text-gray-700">
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-2 py-1 border border-white bg-clip-padding"></td>
                                        <td className="px-4 py-1 border border-white pl-8 bg-clip-padding font-medium">JASA</td>
                                        {finalReportRealisasiPenjualan.pastMonths.map(m => renderValueCell('JASA')(`M_${m}`))}
                                        {renderValueCell('JASA')(`M_${finalReportRealisasiPenjualan.latestMonth}`)}
                                        {finalReportRealisasiPenjualan.weeks.map(w => renderValueCell('JASA')(w))}
                                        {renderValueCell('JASA', true)('REAL_SD')}
                                        <td className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                          {jasaTgt > 0 ? jasaTgt.toLocaleString('id-ID') : "-"}
                                        </td>
                                        <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                          {jasaVsTgtPct}
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-[#DDEBF7] font-bold border-t-2 border-white">
                          {(() => {
                            const renderTotalCell = (val: any, isTotal = false) => {
                              const rounded = Math.round(val || 0);
                              return (
                                <td key={Math.random()} className={`px-2 py-1.5 border border-white text-right bg-clip-padding ${isTotal ? 'font-bold bg-[#1D63A8]/20' : ''}`}>
                                  {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                                </td>
                              );
                            };
                            
                            const rowDefs = [
                              { label: 'TOTAL PRODUK SPB', key: 'TOTAL PRODUK SPB' },
                              { label: 'TOTAL JASA SPB', key: 'TOTAL JASA SPB' },
                              { label: 'TOTAL PRODUK SPP', key: 'TOTAL PRODUK SPP' },
                              { label: 'TOTAL JASA SPP', key: 'TOTAL JASA SPP' },
                              { label: 'TOTAL PRODUK UP', key: 'TOTAL PRODUK UP' },
                              { label: 'TOTAL JASA UP', key: 'TOTAL JASA UP' },
                              { label: 'TOTAL PRODUK CDC', key: 'TOTAL PRODUK CDC' },
                              { label: 'TOTAL JASA CDC', key: 'TOTAL JASA CDC' },
                              { label: 'TOTAL PRODUK', key: 'TOTAL PRODUK', bg: 'bg-[#1D63A8] text-white font-bold' },
                              { label: 'TOTAL JASA', key: 'TOTAL JASA', bg: 'bg-[#1D63A8] text-white font-bold' },
                              { label: 'GRAND TOTAL', key: 'GRAND TOTAL', bg: 'bg-[#154674] text-white font-bold text-xs' }
                            ];

                            return rowDefs.map(row => {
                              const realSd = finalReportRealisasiPenjualan.finalTotals[row.key]?.['REAL_SD'] || 0;
                              const tgtVal = TARGET_REALISASI_PENJUALAN_2026_TOTALS[row.key] || 0;
                              const vsTgtPct = tgtVal > 0 && realSd > 0 ? `${Math.round((realSd / tgtVal) * 100)}%` : (tgtVal > 0 ? "0%" : "-");

                              return (
                                <tr key={row.label} className={row.bg || 'hover:bg-[#c1d9f0]'}>
                                  <td colSpan={3} className="px-4 py-1.5 border border-white bg-clip-padding">{row.label}</td>
                                  {finalReportRealisasiPenjualan.pastMonths.map(m => {
                                    const val = finalReportRealisasiPenjualan.finalTotals[row.key]?.[`M_${m}`] || 0;
                                    return renderTotalCell(val);
                                  })}
                                  {renderTotalCell(finalReportRealisasiPenjualan.finalTotals[row.key]?.[`M_${finalReportRealisasiPenjualan.latestMonth}`])}
                                  {finalReportRealisasiPenjualan.weeks.map(w => {
                                    const val = finalReportRealisasiPenjualan.finalTotals[row.key]?.[w] || 0;
                                    return renderTotalCell(val);
                                  })}
                                  {renderTotalCell(realSd, true)}
                                  <td className="px-2 py-1.5 border border-white text-right font-medium bg-clip-padding">
                                    {tgtVal > 0 ? tgtVal.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="px-2 py-1.5 border border-white text-right font-bold bg-clip-padding">
                                    {vsTgtPct}
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              )
            )}

            {activeTab === 'preview-ppt' && (() => {
              const rawSlides = [
                { title: "Progress Operasional", component: <SlideProgressOperasional finalReportRealisasiPengadaan={finalReportRealisasiPengadaan} finalReportHargaPembelian={finalReportHargaPembelian} finalReportRealisasiPenjualan={salesData.length > 0 ? finalReportRealisasiPenjualan : null} stokHariIni={stokHariIni} /> },
                { title: "Monitoring Utilitas RMU & CDC", component: <SlideMonitoringUtilitas /> },
                { title: "Monitoring Utilitas RMU SPP", component: <SlideMonitoringUtilitasRMUSPP /> },
                { title: "Monitoring Utilitas RMU SPB", component: <SlideMonitoringUtilitasRMUSPB /> },
                { title: "Realisasi PSO & Makloon", component: <SlideRealisasiPSOMakloon /> },
                { title: "Kuantum Penjualan UB Industri", component: <SlideKuantumPenjualanUB /> },
                { title: "Realisasi Pengadaan Gabah & Beras (Nasional)", component: <SlideRealisasiPengadaanGabahBeras finalReportPengadaanUB={finalReportPengadaanUB} /> },
                { title: "Realisasi Rekapitulasi Pengadaan Gabah dan Beras", component: <SlideRealisasiPengadaanGabahBerasBawah finalReportRealisasiPengadaan={finalReportRealisasiPengadaan} /> },
                { title: "Realisasi Rekapitulasi Pengadaan Gabah dan Beras (UP & CDC)", component: <SlideRealisasiPengadaanGabahBerasBawahPart2 finalReportRealisasiPengadaan={finalReportRealisasiPengadaan} /> },
                { title: "Penyerapan GKP SPP", component: <SlidePenyerapanGKP report4PenyerapanData={report4PenyerapanData} persediaanSPP={persediaanSPP} finalReportHargaPembelian={finalReportHargaPembelian} /> },
                { title: "Realisasi Rekapitulasi Harga Pembelian (SPB & SPP)", component: <SlideRealisasiHargaGabahBerasAtas finalReportHargaPembelian={finalReportHargaPembelian} /> },
                { title: "Realisasi Rekapitulasi Harga Pembelian (UP & CDC)", component: <SlideRealisasiHargaGabahBerasBawah finalReportHargaPembelian={finalReportHargaPembelian} /> },
                { 
                  title: "Update Persediaan Komoditi", 
                  component: (
                    <SlideUpdatePersediaan 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Realisasi Operasional Regional", 
                  component: (
                    <SlideRealisasiOperasionalRegional 
                      finalReportRealisasiPengadaan={finalReportRealisasiPengadaan}
                      finalReportRealisasiPenjualan={finalReportRealisasiPenjualan}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP GKG", 
                  component: (
                    <SlideNilaiHPPGKG 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Beras Bahan Baku", 
                  component: (
                    <SlideNilaiHPPBeras 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Beras Jadi (Part 1)", 
                  component: (
                    <SlideNilaiHPPBerasJadi 
                      pageIndex={0}
                      totalPages={2}
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Beras Jadi (Part 2)", 
                  component: (
                    <SlideNilaiHPPBerasJadi 
                      pageIndex={1}
                      totalPages={2}
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Persediaan Hasil Samping (Part 1)", 
                  component: (
                    <SlidePersediaanHasilSampingUB 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Persediaan Hasil Samping (Part 2)", 
                  component: (
                    <SlidePersediaanHasilSampingUB2 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Kemasan (Part 1)", 
                  component: (
                    <SlideNilaiHPPKemasan 
                      pageIndex={0} 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Kemasan (Part 2)", 
                  component: (
                    <SlideNilaiHPPKemasan 
                      pageIndex={1} 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Kemasan (Part 3)", 
                  component: (
                    <SlideNilaiHPPKemasan 
                      pageIndex={2} 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Kemasan (Part 4)", 
                  component: (
                    <SlideNilaiHPPKemasan 
                      pageIndex={3} 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Kemasan (Part 5)", 
                  component: (
                    <SlideNilaiHPPKemasan 
                      pageIndex={4} 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Nilai HPP Kemasan (Part 6)", 
                  component: (
                    <SlideNilaiHPPKemasan 
                      pageIndex={5} 
                      inventoryData={inventoryData}
                      inventoryColumns={inventoryColumns}
                      inventoryFileName={inventoryFileName}
                      latestDayStr={finalReportPengadaanUB?.latestDayStr}
                    />
                  ) 
                },
                { 
                  title: "Realisasi Penjualan (Nasional & SPB)", 
                  component: <SlideRealisasiPenjualanAtas finalReportRealisasiPenjualan={finalReportRealisasiPenjualan} /> 
                },
                { 
                  title: "Realisasi Penjualan (SPP, UP & CDC)", 
                  component: <SlideRealisasiPenjualanBawah finalReportRealisasiPenjualan={finalReportRealisasiPenjualan} /> 
                },
              ];

              const allSlides = rawSlides.map((s, idx) => ({
                id: idx + 1,
                ...s
              }));

              const scrollToSlide = (idx: number) => {
                const el = document.getElementById(`slide-card-${idx + 1}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
              };

              return (
                <div className="p-6 space-y-6">
                  {/* Top Header Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="bg-[#1D63A8] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                          <Layers size={13} /> {allSlides.length} Slide Presentation Deck
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                          enabledSlideIds.length === allSlides.length
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : enabledSlideIds.length === 0
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-blue-50 text-[#1D63A8] border-blue-300'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${enabledSlideIds.length > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {enabledSlideIds.length} dari {allSlides.length} Slide Terpilih untuk Export
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                          16:9 HD Ready
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-gray-900">Preview PowerPoint Slide Deck</h3>
                      <p className="text-xs text-gray-500">Pratinjau visual {allSlides.length} slide presentasi operasional harian. Anda dapat memilih slide mana saja yang aktif (ON/OFF) sebelum diekspor ke PowerPoint (.pptx).</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                      {/* Button to open Slide Selector Modal */}
                      <button
                        type="button"
                        onClick={() => setIsSlideManagerOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-300 shadow-sm transition-all hover:border-[#1D63A8] hover:text-[#1D63A8] active:scale-95"
                        title="Buka daftar centang semua slide untuk memilih halaman export sekaligus"
                      >
                        <Sliders size={15} />
                        <span>Pilih Halaman Slide ({enabledSlideIds.length}/{allSlides.length})</span>
                      </button>

                      {/* Export to PPT Button */}
                      <button
                        onClick={exportToPPT}
                        disabled={isExporting || enabledSlideIds.length === 0}
                        className="flex items-center gap-2 bg-[#1D63A8] hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                        title={enabledSlideIds.length === 0 ? "Pilih minimal 1 slide untuk diekspor" : `Ekspor ${enabledSlideIds.length} slide aktif ke PowerPoint`}
                      >
                        {isExporting ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            <span>Mengekspor ({enabledSlideIds.length} Slide)...</span>
                          </>
                        ) : (
                          <>
                            <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                            <span>Export {enabledSlideIds.length} Slide ke PPT (.pptx)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Navigation & Selection Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600">Lompat ke Slide:</span>
                        <select 
                          value={currentPptSlideIdx}
                          onChange={(e) => {
                            const idx = parseInt(e.target.value);
                            setCurrentPptSlideIdx(idx);
                            scrollToSlide(idx);
                          }}
                          className="text-xs font-semibold bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-gray-800 focus:ring-2 focus:ring-[#1D63A8] focus:outline-none shadow-sm cursor-pointer"
                        >
                          {allSlides.map((s, idx) => (
                            <option key={s.id} value={idx}>
                              {enabledSlideIds.includes(s.id) ? '✓' : '✕'} Slide {s.id}: {s.title} {enabledSlideIds.includes(s.id) ? '(ON)' : '(OFF)'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="h-5 w-[1px] bg-gray-300 hidden sm:block" />

                      {/* Quick Select Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={selectAllSlides}
                          className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 shadow-sm transition-colors active:scale-95 flex items-center gap-1"
                          title="Aktifkan semua slide untuk export"
                        >
                          <CheckCircle2 size={13} /> Pilih Semua ({allSlides.length})
                        </button>
                        <button
                          type="button"
                          onClick={deselectAllSlides}
                          className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-rose-50 text-rose-600 rounded-lg border border-rose-200 shadow-sm transition-colors active:scale-95 flex items-center gap-1"
                          title="Nonaktifkan semua slide"
                        >
                          <X size={13} /> Batal Semua
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSlideManagerOpen(true)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-[#1D63A8] rounded-lg border border-blue-200 shadow-sm transition-colors active:scale-95 flex items-center gap-1"
                          title="Buka daftar checklist slide"
                        >
                          <Sliders size={13} /> Kelola Halaman
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPopOutOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1D63A8] hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95 hover:shadow"
                        title="Tampilkan Full Screen Pop Out untuk slide aktif"
                      >
                        <Maximize2 size={15} /> Full Screen
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const prevIdx = Math.max(0, currentPptSlideIdx - 1);
                          setCurrentPptSlideIdx(prevIdx);
                          scrollToSlide(prevIdx);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg border border-gray-300 shadow-sm transition-colors active:scale-95"
                      >
                        <ChevronLeft size={16} /> Slide Sebelumnya
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = Math.min(allSlides.length - 1, currentPptSlideIdx + 1);
                          setCurrentPptSlideIdx(nextIdx);
                          scrollToSlide(nextIdx);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg border border-gray-300 shadow-sm transition-colors active:scale-95"
                      >
                        Slide Berikutnya <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Slides Presentation Filmstrip Container with id="ppt-slider-container" */}
                  <div 
                    id="ppt-slider-container" 
                    onScroll={(e) => {
                      const container = e.currentTarget;
                      const slideTotalWidth = 1280 + 32;
                      const approxIdx = Math.round(container.scrollLeft / slideTotalWidth);
                      if (approxIdx >= 0 && approxIdx < allSlides.length && approxIdx !== currentPptSlideIdx) {
                        setCurrentPptSlideIdx(approxIdx);
                      }
                    }}
                    className="flex flex-row gap-8 w-full pb-8 overflow-x-auto snap-x snap-mandatory px-2 items-start scroll-smooth"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {allSlides.map((slide) => {
                      const isEnabled = enabledSlideIds.includes(slide.id);
                      return (
                        <div 
                          key={slide.id} 
                          id={`slide-card-${slide.id}`} 
                          className={`shrink-0 snap-center flex flex-col gap-2.5 transition-all duration-200 ${
                            !isEnabled ? 'opacity-55' : ''
                          }`}
                        >
                          {/* Top Card Bar - with prominent ON/OFF toggle beside slide info */}
                          <div className={`flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border shadow-sm text-xs font-bold transition-all ${
                            isEnabled 
                              ? 'border-gray-200 text-gray-700' 
                              : 'border-rose-200 bg-rose-50/20 text-gray-500'
                          }`}>
                            {/* Left: Slide tag & Title */}
                            <div className="flex items-center gap-2.5">
                              <span className={`px-2.5 py-1 rounded-md text-[11px] font-black shadow-sm transition-colors ${
                                isEnabled ? 'bg-[#1D63A8] text-white' : 'bg-gray-400 text-white'
                              }`}>
                                Slide {slide.id}
                              </span>
                              <span className={`font-bold text-sm ${isEnabled ? 'text-gray-900' : 'text-gray-500 line-through decoration-rose-400'}`}>
                                {slide.title}
                              </span>
                            </div>

                            {/* Right: ON/OFF Export Switch + 1280x720 Tag + Pop Out */}
                            <div className="flex items-center gap-3">
                              {/* Dedicated ON/OFF Toggle Switch directly beside the slide */}
                              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                                <span className="text-xs font-semibold text-gray-500">Status Export:</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSlideEnabled(slide.id);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95 cursor-pointer ${
                                    isEnabled 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 ring-1 ring-emerald-400/30' 
                                      : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200 hover:text-gray-700'
                                  }`}
                                  title={isEnabled ? "Klik untuk mematikan (lewati slide ini saat export PPT)" : "Klik untuk mengaktifkan (sertakan slide ini saat export PPT)"}
                                >
                                  <span className={`w-2 h-2 rounded-full transition-colors ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                                  <span className="w-8 text-center">{isEnabled ? 'ON' : 'OFF'}</span>
                                  {/* Switch pill graphic */}
                                  <div className={`w-7 h-4 rounded-full p-0.5 flex items-center transition-all ${
                                    isEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'
                                  }`}>
                                    <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                                  </div>
                                </button>
                              </div>

                              <span className="text-[10px] bg-blue-50 text-[#1D63A8] font-bold px-2 py-1 rounded border border-blue-200">
                                1280 × 720
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentPptSlideIdx(slide.id - 1);
                                  setIsPopOutOpen(true);
                                }}
                                className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-[#1D63A8] rounded-lg transition-colors border border-gray-200"
                                title="Pop Out Full Screen Slide Ini"
                              >
                                <Maximize2 size={14} />
                              </button>
                            </div>
                          </div>
                          
                          {/* Slide Canvas Wrapper */}
                          <div 
                            id={`slide-canvas-wrapper-${slide.id}`}
                            className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200 bg-white relative"
                          >
                            {slide.component}

                            {/* Inactive Overlay with Quick Reactivation Button */}
                            {!isEnabled && (
                              <div 
                                onClick={() => toggleSlideEnabled(slide.id)}
                                className="absolute inset-0 bg-slate-900/35 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-900/45 group"
                                title="Klik untuk mengaktifkan kembali slide ini"
                              >
                                <div className="bg-white/95 text-gray-800 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs border border-gray-200 group-hover:scale-105 transition-transform">
                                  <div className="w-7 h-4 rounded-full p-0.5 bg-gray-300 flex items-center justify-start">
                                    <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                                  </div>
                                  <span className="text-gray-700">Slide ini dinonaktifkan (Dilewati saat Export)</span>
                                  <span className="bg-[#1D63A8] text-white text-[11px] px-2.5 py-1 rounded-lg ml-1 shadow-sm group-hover:bg-blue-800 transition-colors">
                                    Klik untuk Aktifkan (ON)
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pop Out Full Screen Modal */}
                  {isPopOutOpen && (
                    <div 
                      className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-3 select-none"
                    >
                      {/* Top Bar */}
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg shrink-0">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#1D63A8] text-white px-2.5 py-0.5 rounded-md text-xs font-black shadow-sm">
                            Slide {allSlides[currentPptSlideIdx]?.id} / {allSlides.length}
                          </span>
                          <span className="text-white font-bold text-sm tracking-wide">
                            {allSlides[currentPptSlideIdx]?.title}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded border border-slate-700 hidden sm:inline-block">
                            1280 × 720 (16:9 HD)
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {/* Toggle ON/OFF inside Pop Out */}
                          <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/90 rounded-lg border border-slate-700">
                            <span className="text-[11px] text-slate-300 font-semibold">Export:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const curSlide = allSlides[currentPptSlideIdx];
                                if (curSlide) toggleSlideEnabled(curSlide.id);
                              }}
                              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all border ${
                                enabledSlideIds.includes(allSlides[currentPptSlideIdx]?.id)
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-700/50 text-slate-400 border-slate-600'
                              }`}
                              title="Toggle status ekspor slide ini"
                            >
                              <span>{enabledSlideIds.includes(allSlides[currentPptSlideIdx]?.id) ? 'ON' : 'OFF'}</span>
                              <div className={`w-6 h-3.5 rounded-full p-0.5 flex items-center transition-colors ${
                                enabledSlideIds.includes(allSlides[currentPptSlideIdx]?.id) ? 'bg-emerald-500 justify-end' : 'bg-slate-600 justify-start'
                              }`}>
                                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                              </div>
                            </button>
                          </div>

                          {/* Slide dropdown selector inside Pop Out */}
                          <select
                            value={currentPptSlideIdx}
                            onChange={(e) => {
                              const newIdx = parseInt(e.target.value);
                              setCurrentPptSlideIdx(newIdx);
                              scrollToSlide(newIdx);
                            }}
                            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                          >
                            {allSlides.map((s, idx) => (
                              <option key={s.id} value={idx}>
                                {enabledSlideIds.includes(s.id) ? '✓' : '✕'} Slide {s.id}: {s.title}
                              </option>
                            ))}
                          </select>

                          {/* Prev / Next buttons inside Pop Out */}
                          <button
                            type="button"
                            disabled={currentPptSlideIdx === 0}
                            onClick={() => {
                              const prevIdx = Math.max(0, currentPptSlideIdx - 1);
                              setCurrentPptSlideIdx(prevIdx);
                              scrollToSlide(prevIdx);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg border border-slate-700 transition-colors"
                            title="Slide Sebelumnya (Panah Kiri)"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            type="button"
                            disabled={currentPptSlideIdx === allSlides.length - 1}
                            onClick={() => {
                              const nextIdx = Math.min(allSlides.length - 1, currentPptSlideIdx + 1);
                              setCurrentPptSlideIdx(nextIdx);
                              scrollToSlide(nextIdx);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg border border-slate-700 transition-colors"
                            title="Slide Berikutnya (Panah Kanan)"
                          >
                            <ChevronRight size={18} />
                          </button>

                          {/* Native Fullscreen toggle */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen().catch(() => {});
                              } else {
                                document.exitFullscreen().catch(() => {});
                              }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold transition-colors"
                            title="Toggle Browser Fullscreen"
                          >
                            <Maximize2 size={14} /> Fullscreen
                          </button>

                          {/* Close Pop Out Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsPopOutOpen(false);
                              scrollToSlide(currentPptSlideIdx);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 ml-1"
                            title="Tutup Pop Out (Esc)"
                          >
                            <X size={16} /> Tutup
                          </button>
                        </div>
                      </div>

                      {/* Middle Canvas: Auto-scaled Slide */}
                      <div className="flex-1 flex items-center justify-center relative overflow-hidden my-1">
                        <div 
                          className="relative flex items-center justify-center"
                          style={{
                            width: `${1280 * popOutScale}px`,
                            height: `${720 * popOutScale}px`,
                          }}
                        >
                          <div
                            style={{
                              width: '1280px',
                              height: '720px',
                              transform: `scale(${popOutScale})`,
                              transformOrigin: 'top left',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                            }}
                            className="rounded-xl overflow-hidden shadow-2xl bg-white border border-slate-700"
                          >
                            {allSlides[currentPptSlideIdx]?.component}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Hint */}
                      <div className="flex items-center justify-between px-4 py-1 text-[11px] text-slate-400 bg-slate-900/60 rounded-lg border border-slate-800/80 shrink-0">
                        <span>Gunakan tombol <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono text-[10px]">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono text-[10px]">→</kbd> untuk navigasi slide</span>
                        <span>Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono text-[10px]">Esc</kbd> untuk keluar dari Pop Out</span>
                      </div>
                    </div>
                  )}

                  {/* Slide Selection Manager Modal */}
                  {isSlideManagerOpen && (
                    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-[#1D63A8] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Sliders size={12} /> Seleksi Halaman Slide
                              </span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                enabledSlideIds.length > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-rose-50 text-rose-700 border-rose-300'
                              }`}>
                                {enabledSlideIds.length} dari {allSlides.length} Slide Terpilih
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Pilih Halaman untuk Export PowerPoint (.pptx)</h3>
                            <p className="text-xs text-gray-500">Centang slide yang ingin disertakan ke dalam file presentasi PowerPoint.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsSlideManagerOpen(false)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        {/* Quick Filter Toolbar */}
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={selectAllSlides}
                              className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-300 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                            >
                              <CheckCircle2 size={14} /> Pilih Semua ({allSlides.length})
                            </button>
                            <button
                              type="button"
                              onClick={deselectAllSlides}
                              className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-rose-50 text-rose-600 rounded-lg border border-rose-300 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                            >
                              <X size={14} /> Batal Pilih Semua
                            </button>
                          </div>

                          <div className="text-xs text-gray-500 font-medium">
                            Klik pada kartu slide di bawah untuk mengaktifkan / menonaktifkan
                          </div>
                        </div>

                        {/* Slide Checklist Grid */}
                        <div className="p-6 overflow-y-auto max-h-[55vh]">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {allSlides.map((slide) => {
                              const isChecked = enabledSlideIds.includes(slide.id);
                              return (
                                <div
                                  key={slide.id}
                                  onClick={() => toggleSlideEnabled(slide.id)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                                    isChecked
                                      ? 'bg-blue-50/40 border-[#1D63A8]/40 shadow-sm hover:border-[#1D63A8]'
                                      : 'bg-gray-50/50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:border-gray-300'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}} // handled by parent div
                                    className="mt-0.5 rounded text-[#1D63A8] focus:ring-[#1D63A8] w-4 h-4 cursor-pointer pointer-events-none"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                                        isChecked ? 'bg-[#1D63A8] text-white' : 'bg-gray-300 text-gray-600'
                                      }`}>
                                        Slide {slide.id}
                                      </span>
                                    </div>
                                    <p className={`text-xs font-bold leading-tight line-clamp-2 ${
                                      isChecked ? 'text-gray-900' : 'text-gray-500'
                                    }`}>
                                      {slide.title}
                                    </p>
                                  </div>
                                  <div className="shrink-0 pt-0.5">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                      isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {isChecked ? 'ON' : 'OFF'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Total terpilih: <span className="font-bold text-gray-900">{enabledSlideIds.length}</span> slide
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsSlideManagerOpen(false)}
                              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-300 shadow-sm transition-colors"
                            >
                              Selesai
                            </button>
                            <button
                              type="button"
                              disabled={enabledSlideIds.length === 0 || isExporting}
                              onClick={() => {
                                setIsSlideManagerOpen(false);
                                exportToPPT();
                              }}
                              className="px-4 py-2 bg-[#1D63A8] hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Download size={14} /> Export {enabledSlideIds.length} Slide ke PPT
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

          </div>
        </div>
      )}
    </div>
  );
}
