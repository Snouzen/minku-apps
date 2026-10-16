"use client";

import React, { useState, useRef, useMemo } from "react";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Trash2, 
  Download, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  Layers,
  Calendar,
  DollarSign,
  Package
} from "lucide-react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function BahanRagabClient() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sheet1" | "sheet2">("sheet1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper parse numbers
  const parseNumber = (val: any): number => {
    if (val === null || val === undefined) return 0;
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    let s = val.toString().trim();
    if (!s || s === "-") return 0;
    s = s.replace(/Rp\s?/gi, "").trim();
    if (s.includes(",") && s.includes(".")) {
      if (s.indexOf(".") < s.indexOf(",")) {
        s = s.replace(/\./g, "").replace(",", ".");
      } else {
        s = s.replace(/,/g, "");
      }
    } else if (s.includes(",")) {
      s = s.replace(/,/g, ".");
    }
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  // Helper: Parse Excel Buffer
  const parseExcelBuffer = (arrayBuffer: ArrayBuffer): { headers: string[]; rows: any[] } => {
    const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!jsonData || jsonData.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = (jsonData[0] as string[]).map((h) => (h ? h.toString().trim() : ""));
    const rows = jsonData.slice(1).map((row: any) => {
      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });

    return { headers, rows };
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      Swal.fire("Format Tidak Sesuai", `File ${file.name} harus berekstensi .xlsx atau .xls`, "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const { headers, rows } = parseExcelBuffer(buffer);

        if (rows.length === 0) {
          Swal.fire("File Kosong", `File ${file.name} tidak memiliki data baris.`, "warning");
          return;
        }

        setFileName(file.name);
        setColumns(headers);
        setData(rows);
        setCurrentPage(1);

        Swal.fire({
          icon: "success",
          title: "File Berhasil Dimuat",
          html: `<b>${file.name}</b><br/>Berhasil memuat <b>${rows.length.toLocaleString("id-ID")}</b> baris data.`,
          timer: 2500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error reading file:", err);
        Swal.fire("Gagal Membaca File", "Terjadi kesalahan saat memproses data Excel.", "error");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleResetData = () => {
    Swal.fire({
      title: "Bersihkan Data?",
      text: "Data yang sedang dimuat akan dihapus dari sesi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Bersihkan",
      cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        setData([]);
        setColumns([]);
        setFileName(null);
        setCurrentPage(1);
        if (fileInputRef.current) fileInputRef.current.value = "";
        Swal.fire("Data Dibersihkan", "Slot data Bahan Ragab telah dikosongkan.", "info");
      }
    });
  };

  // Detected column mapping
  const colMap = useMemo(() => {
    const companyCol = columns.find((c) => {
      const s = c.toLowerCase();
      return s.includes("company") || s.includes("gudang") || s.includes("lokasi") || s.includes("perusahaan");
    }) || columns[1] || "Company";

    const totalCol = columns.find((c) => {
      const s = c.toLowerCase();
      return s === "total" || s.includes("amount") || s.includes("nominal") || s.includes("nilai");
    }) || columns.find((c) => c.toLowerCase().includes("total"));

    const dateCol = columns.find((c) => {
      const s = c.toLowerCase();
      return s.includes("order date") || s.includes("tanggal") || s.includes("date") || s.includes("tgl");
    });

    const qtyCol = columns.find((c) => {
      const s = c.toLowerCase();
      return s.includes("qty") || s.includes("kuantum") || s.includes("jumlah");
    });

    const productCol = columns.find((c) => {
      const s = c.toLowerCase();
      return s === "product" || s.includes("produk") || s.includes("item");
    });

    return { companyCol, totalCol, dateCol, qtyCol, productCol };
  }, [columns]);

  // KPI Calculations
  const kpis = useMemo(() => {
    if (data.length === 0) {
      return { totalRows: 0, totalNominal: 0, totalQtyTon: 0, dateRange: "-" };
    }

    let sumNominal = 0;
    let sumQty = 0;
    let minD: Date | null = null;
    let maxD: Date | null = null;

    data.forEach((row) => {
      if (colMap.totalCol && row[colMap.totalCol]) {
        sumNominal += parseNumber(row[colMap.totalCol]);
      }
      if (colMap.qtyCol && row[colMap.qtyCol]) {
        sumQty += parseNumber(row[colMap.qtyCol]);
      }
      if (colMap.dateCol && row[colMap.dateCol]) {
        const val = row[colMap.dateCol];
        let d: Date | null = null;
        if (val instanceof Date) d = val;
        else if (typeof val === "string") {
          const parsed = Date.parse(val);
          if (!isNaN(parsed)) d = new Date(parsed);
        }
        if (d && !isNaN(d.getTime())) {
          if (!minD || d < minD) minD = d;
          if (!maxD || d > maxD) maxD = d;
        }
      }
    });

    const formatDateStr = (d: Date | null) => {
      if (!d) return "-";
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    };

    const dateRange = minD && maxD ? `${formatDateStr(minD)} s.d. ${formatDateStr(maxD)}` : "-";

    return {
      totalRows: data.length,
      totalNominal: sumNominal,
      totalQtyTon: sumQty > 0 ? sumQty / 1000 : 0,
      dateRange,
    };
  }, [data, colMap]);

  // Aggregation for Sheet 2: Ringkasan Eksekutif per Company / Unit
  const executiveSummary = useMemo(() => {
    if (data.length === 0) return [];

    const map: Record<string, { company: string; count: number; totalNominal: number; totalQty: number }> = {};

    data.forEach((row) => {
      const comp = (row[colMap.companyCol] || "Lain-lain").toString().trim();
      if (!map[comp]) {
        map[comp] = { company: comp, count: 0, totalNominal: 0, totalQty: 0 };
      }
      map[comp].count += 1;
      if (colMap.totalCol) map[comp].totalNominal += parseNumber(row[colMap.totalCol]);
      if (colMap.qtyCol) map[comp].totalQty += parseNumber(row[colMap.qtyCol]);
    });

    return Object.values(map).sort((a, b) => b.totalNominal - a.totalNominal);
  }, [data, colMap]);

  // Filtered rows for Sheet 1
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return val.toString().toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm]);

  // Pagination for Sheet 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

  // Export to Excel with 2 Sheets
  const handleExportExcel = () => {
    if (data.length === 0) {
      Swal.fire("Data Kosong", "Belum ada data untuk diekspor ke Excel.", "info");
      return;
    }

    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Rekapitulasi Bahan Ragab (Detail Rows)
      const ws1 = XLSX.utils.json_to_sheet(data);

      // Sheet 2: Ringkasan Eksekutif (Aggregated by Company / Unit)
      const summaryRows = executiveSummary.map((item, idx) => ({
        "No": idx + 1,
        "Infrastruktur / Unit": item.company,
        "Total Transaksi (PO)": item.count,
        "Total Kuantum (Kg)": item.totalQty > 0 ? Math.round(item.totalQty) : "-",
        "Total Nilai (Rp)": item.totalNominal,
        "Rata-rata Nilai per PO (Rp)": item.count > 0 ? Math.round(item.totalNominal / item.count) : 0,
      }));

      // Add Grand Total row to Sheet 2
      const totalSummaryCount = executiveSummary.reduce((acc, curr) => acc + curr.count, 0);
      const totalSummaryNominal = executiveSummary.reduce((acc, curr) => acc + curr.totalNominal, 0);
      const totalSummaryQty = executiveSummary.reduce((acc, curr) => acc + curr.totalQty, 0);

      summaryRows.push({
        "No": "" as any,
        "Infrastruktur / Unit": "GRAND TOTAL",
        "Total Transaksi (PO)": totalSummaryCount,
        "Total Kuantum (Kg)": totalSummaryQty > 0 ? Math.round(totalSummaryQty) : ("-" as any),
        "Total Nilai (Rp)": totalSummaryNominal,
        "Rata-rata Nilai per PO (Rp)": totalSummaryCount > 0 ? Math.round(totalSummaryNominal / totalSummaryCount) : 0,
      });

      const ws2 = XLSX.utils.json_to_sheet(summaryRows);

      // Auto-size columns for both sheets
      const autoFit = (ws: XLSX.WorkSheet, json: any[]) => {
        if (!json || json.length === 0) return;
        const keys = Object.keys(json[0]);
        ws["!cols"] = keys.map((key) => {
          let maxLen = key.length;
          json.forEach((r) => {
            const val = r[key] ? r[key].toString() : "";
            if (val.length > maxLen) maxLen = val.length;
          });
          return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
        });
      };

      autoFit(ws1, data);
      autoFit(ws2, summaryRows);

      // Append 2 sheets
      XLSX.utils.book_append_sheet(wb, ws1, "Rekapitulasi Bahan Ragab");
      XLSX.utils.book_append_sheet(wb, ws2, "Ringkasan Eksekutif");

      // Generate filename with date
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const outputName = `Bahan_Ragab_UBI_${dateStr}.xlsx`;

      XLSX.writeFile(wb, outputName);

      Swal.fire({
        icon: "success",
        title: "Export Berhasil!",
        html: `File Excel <b>${outputName}</b> berhasil diunduh dengan <b>2 Sheet</b>:<br/>1. Rekapitulasi Bahan Ragab<br/>2. Ringkasan Eksekutif`,
      });
    } catch (err) {
      console.error("Export error:", err);
      Swal.fire("Export Gagal", "Terjadi kesalahan saat mengekspor file Excel.", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Banner & File Upload Dropzone */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="text-[#1D63A8]" size={22} />
              Upload Data Bahan Ragab
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Unggah file tarikan data ERP (Excel) untuk mengolah rekapitulasi data Rapat Gabungan UBI.
            </p>
          </div>

          {fileName && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportExcel}
                className="bg-[#1D63A8] hover:bg-[#154d85] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Download size={15} />
                Export ke Excel (2 Sheet)
              </button>
              <button
                onClick={handleResetData}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 size={15} />
                Bersihkan
              </button>
            </div>
          )}
        </div>

        {/* Dropzone */}
        {!fileName ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-[#1D63A8] bg-blue-50/50 scale-[0.99]"
                : "border-gray-300 hover:border-[#1D63A8] hover:bg-gray-50/60"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              accept=".xlsx,.xls"
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 text-[#1D63A8] flex items-center justify-center">
              <UploadCloud size={28} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">
              Klik untuk pilih file atau seret file ke sini
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Mendukung format Microsoft Excel (<b>.xlsx</b>, <b>.xls</b>)
            </p>
            <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-medium">
              1 Slot Upload Data Tarikan ERP
            </span>
          </div>
        ) : (
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1D63A8] text-white flex items-center justify-center shrink-0">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 leading-tight">{fileName}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {data.length.toLocaleString("id-ID")} baris data terdeteksi • {columns.length} kolom
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[#1D63A8] hover:underline px-2 py-1"
              >
                Ganti File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                accept=".xlsx,.xls"
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards when data is loaded */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1D63A8] flex items-center justify-center shrink-0">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total Baris Data</p>
              <h4 className="text-lg font-black text-gray-900 tabular-nums">
                {kpis.totalRows.toLocaleString("id-ID")}
              </h4>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total Nilai Nominal</p>
              <h4 className="text-lg font-black text-gray-900 tabular-nums">
                Rp {kpis.totalNominal.toLocaleString("id-ID")}
              </h4>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Estimasi Kuantum</p>
              <h4 className="text-lg font-black text-gray-900 tabular-nums">
                {kpis.totalQtyTon > 0 ? `${kpis.totalQtyTon.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Ton` : "-"}
              </h4>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Rentang Tanggal</p>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">
                {kpis.dateRange}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {data.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Sheet Switcher Tabs & Search Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab("sheet1");
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "sheet1"
                    ? "bg-white text-[#1D63A8] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileSpreadsheet size={14} />
                Sheet 1: Rekapitulasi Bahan Ragab
              </button>
              <button
                onClick={() => {
                  setActiveTab("sheet2");
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "sheet2"
                    ? "bg-white text-[#1D63A8] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 size={14} />
                Sheet 2: Ringkasan Eksekutif
              </button>
            </div>

            {/* Search Box */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari data..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-[#1D63A8] focus:bg-white transition-all"
                />
              </div>

              {activeTab === "sheet1" && (
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-gray-50 border border-gray-200 text-xs rounded-xl px-2.5 py-1.5 text-gray-700 focus:outline-hidden"
                >
                  <option value={10}>10 baris</option>
                  <option value={15}>15 baris</option>
                  <option value={25}>25 baris</option>
                  <option value={50}>50 baris</option>
                  <option value={100}>100 baris</option>
                </select>
              )}
            </div>
          </div>

          {/* Tab 1: Sheet 1 (Detail Raw Rows) */}
          {activeTab === "sheet1" && (
            <div>
              <div className="overflow-x-auto max-h-[560px]">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#1D63A8] text-white sticky top-0 z-10 font-bold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 border border-[#154d85] text-center w-12">No</th>
                      {columns.map((col, idx) => (
                        <th key={idx} className="py-2.5 px-3 border border-[#154d85] whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2 px-3 border border-gray-200 text-center text-gray-500 font-medium tabular-nums">
                            {(currentPage - 1) * rowsPerPage + rIdx + 1}
                          </td>
                          {columns.map((col, cIdx) => {
                            const val = row[col];
                            const displayVal = val !== undefined && val !== null ? val.toString() : "-";
                            // Check if numeric column for right alignment
                            const isNumeric = typeof val === "number" || (!isNaN(Number(val)) && val !== "");
                            return (
                              <td
                                key={cIdx}
                                className={`py-2 px-3 border border-gray-200 whitespace-nowrap text-gray-800 ${
                                  isNumeric && (col.toLowerCase().includes("total") || col.toLowerCase().includes("qty") || col.toLowerCase().includes("price"))
                                    ? "text-right tabular-nums font-mono"
                                    : "text-left"
                                }`}
                              >
                                {displayVal}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length + 1} className="py-8 text-center text-gray-400">
                          Tidak ada data yang cocok dengan pencarian &quot;{searchTerm}&quot;
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                <span>
                  Menampilkan {(currentPage - 1) * rowsPerPage + 1} -{" "}
                  {Math.min(currentPage * rowsPerPage, filteredData.length)} dari {filteredData.length.toLocaleString("id-ID")} baris data
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 font-semibold text-gray-700">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Sheet 2 (Ringkasan Eksekutif) */}
          {activeTab === "sheet2" && (
            <div className="p-4">
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#1D63A8] text-white font-bold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 border border-[#154d85] text-center w-12">No</th>
                      <th className="py-2.5 px-3 border border-[#154d85]">Infrastruktur / Unit</th>
                      <th className="py-2.5 px-3 border border-[#154d85] text-right">Total Transaksi (PO)</th>
                      <th className="py-2.5 px-3 border border-[#154d85] text-right">Total Kuantum (Kg)</th>
                      <th className="py-2.5 px-3 border border-[#154d85] text-right">Total Nilai (Rp)</th>
                      <th className="py-2.5 px-3 border border-[#154d85] text-right">Rata-rata Nilai per PO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {executiveSummary.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-2.5 px-3 border border-gray-200 text-center text-gray-500 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 border border-gray-200 font-semibold text-gray-900">
                          {item.company}
                        </td>
                        <td className="py-2.5 px-3 border border-gray-200 text-right tabular-nums text-gray-800">
                          {item.count.toLocaleString("id-ID")}
                        </td>
                        <td className="py-2.5 px-3 border border-gray-200 text-right tabular-nums font-mono text-gray-800">
                          {item.totalQty > 0 ? item.totalQty.toLocaleString("id-ID") : "-"}
                        </td>
                        <td className="py-2.5 px-3 border border-gray-200 text-right tabular-nums font-mono font-semibold text-[#1D63A8]">
                          Rp {item.totalNominal.toLocaleString("id-ID")}
                        </td>
                        <td className="py-2.5 px-3 border border-gray-200 text-right tabular-nums font-mono text-gray-700">
                          Rp {Math.round(item.totalNominal / item.count).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#e8f1fb] font-bold text-gray-900">
                    <tr>
                      <td colSpan={2} className="py-2.5 px-3 border border-gray-300 text-center uppercase tracking-wide">
                        GRAND TOTAL
                      </td>
                      <td className="py-2.5 px-3 border border-gray-300 text-right tabular-nums">
                        {executiveSummary.reduce((acc, curr) => acc + curr.count, 0).toLocaleString("id-ID")}
                      </td>
                      <td className="py-2.5 px-3 border border-gray-300 text-right tabular-nums font-mono">
                        {executiveSummary.reduce((acc, curr) => acc + curr.totalQty, 0) > 0
                          ? executiveSummary.reduce((acc, curr) => acc + curr.totalQty, 0).toLocaleString("id-ID")
                          : "-"}
                      </td>
                      <td className="py-2.5 px-3 border border-gray-300 text-right tabular-nums font-mono text-[#1D63A8]">
                        Rp {executiveSummary.reduce((acc, curr) => acc + curr.totalNominal, 0).toLocaleString("id-ID")}
                      </td>
                      <td className="py-2.5 px-3 border border-gray-300 text-right tabular-nums font-mono">
                        Rp{" "}
                        {executiveSummary.reduce((acc, curr) => acc + curr.count, 0) > 0
                          ? Math.round(
                              executiveSummary.reduce((acc, curr) => acc + curr.totalNominal, 0) /
                                executiveSummary.reduce((acc, curr) => acc + curr.count, 0)
                            ).toLocaleString("id-ID")
                          : 0}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
            <FileSpreadsheet size={32} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Belum Ada Data Bahan Ragab yang Diunggah</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 leading-relaxed">
            Silakan unggah file Excel data tarikan ERP pada dropzone di atas untuk melihat preview rekapitulasi data dan mengunduh format Excel dengan 2 sheet.
          </p>
        </div>
      )}
    </div>
  );
}
