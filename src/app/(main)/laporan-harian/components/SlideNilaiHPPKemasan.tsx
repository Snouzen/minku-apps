import React, { useMemo } from 'react';
import rawBaselineData from '../data/nilaiHPPKemasan.json';
import { normalizeGudangName, WAREHOUSE_METADATA } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export interface SlideNilaiHPPKemasanProps {
  pageIndex?: number;
  inventoryData?: any[];
  inventoryColumns?: string[];
  inventoryFileName?: string | null;
  latestDayStr?: string;
}

interface KemasanItem {
  lokasi: string;
  produk: string;
  jumlah: string | number;
  nilai: string | number;
  harga: string | number;
  isTotal?: boolean;
}

const TOTAL_PAGES = 6;

export default function SlideNilaiHPPKemasan({
  pageIndex = 0,
  inventoryData,
  inventoryColumns,
  inventoryFileName,
  latestDayStr
}: SlideNilaiHPPKemasanProps) {

  // Dynamic Date Extraction
  const displayDate = useMemo(() => {
    const IndoMonthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // 1. Try date columns from inventoryData
    if (inventoryData && inventoryData.length > 0 && inventoryColumns && inventoryColumns.length > 0) {
      const dateCol = inventoryColumns.find(c => {
        const s = c.toLowerCase();
        return (
          s.includes('date') ||
          s.includes('tanggal') ||
          s.includes('tgl') ||
          s.includes('period') ||
          s.includes('posting') ||
          s.includes('valuation')
        );
      });

      if (dateCol) {
        let maxD = new Date(0);
        inventoryData.forEach(row => {
          const val = row[dateCol];
          if (!val) return;
          const d = new Date(val);
          if (!isNaN(d.getTime()) && d.getTime() > maxD.getTime() && d.getFullYear() >= 2024) {
            maxD = d;
          }
        });
        if (maxD.getTime() > 0) {
          return `${maxD.getDate()} ${IndoMonthNames[maxD.getMonth()]} ${maxD.getFullYear()}`;
        }
      }
    }

    // 2. Try parsing from inventoryFileName
    if (inventoryFileName) {
      const dateMatch = inventoryFileName.match(/(\d{1,2})[\s\-_]+([A-Za-z]+|\d{1,2})[\s\-_]+(\d{4})/);
      if (dateMatch) {
        const day = parseInt(dateMatch[1]);
        const mPart = dateMatch[2];
        const yr = parseInt(dateMatch[3]);
        let mIdx = -1;
        if (/^\d+$/.test(mPart)) {
          mIdx = parseInt(mPart) - 1;
        } else {
          mIdx = IndoMonthNames.findIndex(mn => mn.toLowerCase().startsWith(mPart.toLowerCase().slice(0, 3)));
        }
        if (mIdx >= 0 && mIdx < 12 && yr >= 2024) {
          return `${day} ${IndoMonthNames[mIdx]} ${yr}`;
        }
      }
    }

    // 3. Fallback to latestDayStr from Pengadaan (e.g. "08 September 2026")
    if (latestDayStr) {
      return latestDayStr;
    }

    return "31 Juli 2026";
  }, [inventoryData, inventoryColumns, inventoryFileName, latestDayStr]);

  // Warehouse Sort Rank: RM I -> RM II -> RM III -> UP
  const getWarehouseSortKey = (name: string): number => {
    const norm = normalizeGudangName(name);
    const meta = WAREHOUSE_METADATA[norm];
    const group = meta?.group || (norm.startsWith('UP') ? 'UP' : (norm.startsWith('SPP') ? 'SPP' : (norm.startsWith('SPB') ? 'SPB' : 'OTHER')));
    const rm = meta?.rm || (group === 'UP' ? 'II' : 'II');
    const order = meta?.order ?? 999;

    // Group UP comes after all SPB/SPP RM I, RM II, RM III
    if (group === 'UP') {
      return 4000 + order;
    }
    if (rm === 'I') {
      return 1000 + order;
    }
    if (rm === 'II') {
      return 2000 + order;
    }
    if (rm === 'III') {
      return 3000 + order;
    }
    return 5000 + order;
  };

  const isDynamic = !!(inventoryData && inventoryData.length > 0);

  // Dynamic Calculation for Kemasan from inventoryData (Slot 2)
  const dynamicData = useMemo(() => {
    if (!isDynamic || !inventoryData) return null;

    const companyCol = (inventoryColumns || []).find(c => 
      c.toLowerCase().includes('company') || 
      c.toLowerCase().includes('gudang') || 
      c.toLowerCase().includes('lokasi')
    ) || 'Company';

    const catCol = (inventoryColumns || []).find(c => 
      c.toLowerCase().includes('category') || 
      c.toLowerCase().includes('kategori')
    ) || 'Product Category';

    const prodCol = (inventoryColumns || []).find(c => 
      c.toLowerCase() === 'product' || 
      c.toLowerCase().includes('produk')
    ) || 'Product';

    const qtyCol = (inventoryColumns || []).find(c => 
      c.toLowerCase().includes('remaining') || 
      c.toLowerCase().includes('qty') || 
      c.toLowerCase().includes('kuantum')
    ) || 'Remaining Qty';

    const valCol = (inventoryColumns || []).find(c => 
      c.toLowerCase().includes('total value') || 
      c.toLowerCase().includes('remaining value') || 
      c.toLowerCase().includes('nilai') || 
      c.toLowerCase().includes('nominal')
    ) || 'Total Value';

    const matchesKemasan = (cat: string, prod: string): boolean => {
      const c = (cat || '').toUpperCase();
      const p = (prod || '').toUpperCase();

      if (
        c.includes('SPARE PART') ||
        c.includes('JASA') ||
        c.includes('EXPENSE') ||
        c.includes('GKG') ||
        c.includes('GKP') ||
        c.includes('BERAS')
      ) {
        return false;
      }

      return (
        c.includes('KEMASAN') ||
        p.startsWith('[O') ||
        p.startsWith('[D') ||
        p.includes('KARPLAS') ||
        p.includes('KEMASAN') ||
        p.includes('PLASTIK PRINTING') ||
        p.includes('KARUNG')
      );
    };

    const grouped: Record<string, Record<string, { qty: number; value: number }>> = {};

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany) return;

      const cat = (row[catCol]?.toString() || '').toUpperCase();
      const prod = (row[prodCol]?.toString() || '').trim();
      if (!prod) return;

      if (!matchesKemasan(cat, prod)) return;

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

      if (qty <= 0 && val <= 0) return;

      if (!grouped[normCompany]) {
        grouped[normCompany] = {};
      }
      if (!grouped[normCompany][prod]) {
        grouped[normCompany][prod] = { qty: 0, value: 0 };
      }
      grouped[normCompany][prod].qty += qty;
      grouped[normCompany][prod].value += val;
    });

    const sortedCompanies = Object.keys(grouped).sort((a, b) => {
      const rankA = getWarehouseSortKey(a);
      const rankB = getWarehouseSortKey(b);
      if (rankA !== rankB) return rankA - rankB;
      return a.localeCompare(b);
    });

    let totalQty = 0;
    let totalValue = 0;
    const rows: KemasanItem[] = [];

    sortedCompanies.forEach(company => {
      const prodMap = grouped[company] || {};
      const prodKeys = Object.keys(prodMap).sort();

      prodKeys.forEach(pName => {
        const item = prodMap[pName];
        if (item.qty > 0 || item.value > 0) {
          totalQty += item.qty;
          totalValue += item.value;
          const harga = item.qty > 0 ? Math.round(item.value / item.qty) : 0;
          rows.push({
            lokasi: company,
            produk: pName,
            jumlah: Math.round(item.qty).toLocaleString('id-ID'),
            nilai: Math.round(item.value).toLocaleString('id-ID'),
            harga: harga > 0 ? harga.toLocaleString('id-ID') : '-'
          });
        }
      });
    });

    return { rows, totalQty, totalValue };
  }, [isDynamic, inventoryData, inventoryColumns]);

  // All Items (either dynamic or baseline)
  const { allItems, totalQty, totalValue } = useMemo(() => {
    if (dynamicData && dynamicData.rows.length > 0) {
      return {
        allItems: dynamicData.rows,
        totalQty: dynamicData.totalQty,
        totalValue: dynamicData.totalValue
      };
    }

    // Baseline fallback - sort by RM I -> RM II -> RM III -> UP
    const rawItems = (rawBaselineData as any[]).filter(r => !r.isTotal);
    let bQty = 0;
    let bVal = 0;

    const sortedRawItems = rawItems.slice().sort((a, b) => {
      const keyA = getWarehouseSortKey(a.lokasi || '');
      const keyB = getWarehouseSortKey(b.lokasi || '');
      if (keyA !== keyB) return keyA - keyB;
      return (a.produk || '').localeCompare(b.produk || '');
    });

    const cleanItems: KemasanItem[] = sortedRawItems.map(r => {
      const q = parseFloat((r.jumlah || '0').toString().replace(/,/g, ''));
      const v = parseFloat((r.nilai || '0').toString().replace(/,/g, ''));
      if (!isNaN(q)) bQty += q;
      if (!isNaN(v)) bVal += v;
      return {
        lokasi: normalizeGudangName(r.lokasi || ''),
        produk: r.produk || '',
        jumlah: r.jumlah || '-',
        nilai: r.nilai || '-',
        harga: r.harga || '-'
      };
    });

    return {
      allItems: cleanItems,
      totalQty: bQty,
      totalValue: bVal
    };
  }, [dynamicData]);

  // Fair partitioning across TOTAL_PAGES (6 slides)
  const pages = useMemo(() => {
    const N = allItems.length;
    if (N === 0) return [[]];

    const base = Math.floor(N / TOTAL_PAGES);
    const rem = N % TOTAL_PAGES;

    const p: KemasanItem[][] = [];
    let start = 0;
    for (let i = 0; i < TOTAL_PAGES; i++) {
      const count = base + (i < rem ? 1 : 0);
      p.push(allItems.slice(start, start + count));
      start += count;
    }

    // Append TOTAL row to the very last page
    const grandAvgHarga = totalQty > 0 ? Math.round(totalValue / totalQty) : 0;
    const totalRow: KemasanItem = {
      lokasi: 'TOTAL',
      produk: '',
      jumlah: totalQty.toLocaleString('id-ID'),
      nilai: totalValue.toLocaleString('id-ID'),
      harga: grandAvgHarga > 0 ? grandAvgHarga.toLocaleString('id-ID') : '-',
      isTotal: true
    };

    if (p[TOTAL_PAGES - 1]) {
      p[TOTAL_PAGES - 1].push(totalRow);
    }

    return p;
  }, [allItems, totalQty, totalValue]);

  const activePageData = pages[pageIndex] || pages[0] || [];

  const renderCell = (val: string | number | undefined, isRp: boolean = false) => {
    if (val === undefined || val === null || val === '') return null;
    if (val === '-' || val === '#DIV/0!') return <span className="text-center w-full block">-</span>;
    if (isRp) {
      return (
        <div className="flex justify-between w-full">
          <span>Rp</span>
          <span>{val}</span>
        </div>
      );
    }
    return val;
  };

  const renderTable = (pageData: KemasanItem[]) => (
    <table className="w-full border-collapse border border-gray-400 text-[7px] leading-tight">
      <thead>
        <tr className="bg-[#0070c0] text-white font-bold text-center text-[7.5px]">
          <th className="border border-white py-0.5 px-1.5 w-36 uppercase text-left">LOKASI</th>
          <th className="border border-white py-0.5 px-1.5 uppercase text-left">PRODUK</th>
          <th className="border border-white py-0.5 px-1.5 w-24 uppercase text-right">
            JUMLAH<br/><span className="text-[6px] font-normal">(Lembar)</span>
          </th>
          <th className="border border-white py-0.5 px-1.5 w-32 uppercase text-right">
            NILAI PERSEDIAAN<br/><span className="text-[6px] font-normal">(Rp)</span>
          </th>
          <th className="border border-white py-0.5 px-1.5 w-24 uppercase text-right">
            HARGA<br/><span className="text-[6px] font-normal">(Rp/Lembar)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((row, i) => {
          if (row.isTotal) {
            return (
              <tr key={`total-${i}`} className="bg-[#0070c0] text-white font-bold text-center text-[7.5px]">
                <td colSpan={2} className="border border-white py-0.5 px-1.5 text-center uppercase tracking-wider">
                  TOTAL
                </td>
                <td className="border border-white py-0.5 px-1.5 text-right font-bold">{row.jumlah}</td>
                <td className="border border-white py-0.5 px-1.5 text-right font-bold">
                  {renderCell(row.nilai, true)}
                </td>
                <td className="border border-white py-0.5 px-1.5 text-right font-bold">
                  {renderCell(row.harga, true)}
                </td>
              </tr>
            );
          }

          // Show location on the first row of each page, or whenever location changes
          const showLokasi = i === 0 || row.lokasi !== pageData[i - 1]?.lokasi;

          return (
            <tr key={`row-${i}`} className="bg-white text-black hover:bg-blue-50/50 transition-colors">
              <td className="border border-gray-400 py-[0.5px] px-1.5 text-left font-bold uppercase truncate max-w-[140px] align-top">
                {showLokasi ? row.lokasi : ''}
              </td>
              <td className="border border-gray-400 py-[0.5px] px-1.5 text-left truncate max-w-[500px]">
                {row.produk}
              </td>
              <td className="border border-gray-400 py-[0.5px] px-1.5 text-right font-medium">
                {renderCell(row.jumlah)}
              </td>
              <td className="border border-gray-400 py-[0.5px] px-1.5 text-right">
                {renderCell(row.nilai, true)}
              </td>
              <td className="border border-gray-400 py-[0.5px] px-1.5 text-right font-semibold">
                {renderCell(row.harga, true)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col justify-between px-8 py-4 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center pt-0.5">
          <h1 className="text-[26px] font-black text-black tracking-tight leading-tight uppercase">
            NILAI HPP KEMASAN PER INFRASTRUKTUR
          </h1>
          <h2 className="text-[16px] font-bold text-[#356598] mt-0.5">{displayDate}</h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      {/* Main Table Area */}
      <div className="w-full flex-1 flex flex-col justify-start my-auto pt-2 px-1">
        {renderTable(activePageData)}
      </div>

      {/* Bottom Notes */}
      <div className="w-full text-[11px] italic text-black font-bold flex justify-between items-end">
        <div>
          <p>*Data diperoleh dari laporan tarikan system ERP</p>
          <p>** Update Persediaan per Tanggal {displayDate}</p>
        </div>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}

