import React, { useMemo } from 'react';
import baselineData from '../data/persediaanHasilSampingUB2.json';
import { normalizeGudangName } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export interface SlidePersediaanHasilSampingUB2Props {
  inventoryData?: any[];
  inventoryColumns?: string[];
  inventoryFileName?: string | null;
  latestDayStr?: string;
}

interface SampingRowItem {
  infra: string;
  sku: string;
  qty: string | number;
  nilai: string | number;
  hpp: string | number;
  isTotal?: boolean;
}

export default function SlidePersediaanHasilSampingUB2({
  inventoryData,
  inventoryColumns,
  inventoryFileName,
  latestDayStr
}: SlidePersediaanHasilSampingUB2Props) {

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

  // Warehouse Sort Rank: SPP (A-Z) -> SPB (A-Z) -> UP (A-Z) -> CDC (A-Z)
  const getWarehouseSortRank = (name: string): number => {
    const norm = normalizeGudangName(name);
    if (norm.startsWith('SPP')) return 1000;
    if (norm.startsWith('SPB')) return 2000;
    if (norm.startsWith('UP')) return 3000;
    if (norm.startsWith('CDC')) return 4000;
    return 5000;
  };

  const isDynamic = !!(inventoryData && inventoryData.length > 0);

  // Dynamic Calculation for Butir Reject and Menir from inventoryData
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

    const extractRowsForFilter = (matchFn: (prod: string, cat: string) => boolean): SampingRowItem[] => {
      const grouped: Record<string, Record<string, { qty: number; value: number }>> = {};

      inventoryData.forEach(row => {
        const rawCompany = row[companyCol]?.toString() || '';
        const normCompany = normalizeGudangName(rawCompany);
        if (!normCompany) return;

        const cat = (row[catCol]?.toString() || '').toUpperCase();
        const prod = (row[prodCol]?.toString() || '').trim().toUpperCase();
        if (!prod) return;

        // Exclude non-commodities & packaging
        if (
          cat.includes('SPARE PART') ||
          cat.includes('KEMASAN') ||
          cat.includes('JASA') ||
          cat.includes('EXPENSE') ||
          prod.startsWith('[D') ||
          prod.startsWith('[E') ||
          prod.includes('KARPLAS') ||
          prod.includes('KARUNG')
        ) {
          return;
        }

        // Must match criteria
        if (!matchFn(prod, cat)) {
          return;
        }

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
        const originalProdName = (row[prodCol]?.toString() || '').trim();
        if (!grouped[normCompany][originalProdName]) {
          grouped[normCompany][originalProdName] = { qty: 0, value: 0 };
        }
        grouped[normCompany][originalProdName].qty += qty;
        grouped[normCompany][originalProdName].value += val;
      });

      const sortedCompanies = Object.keys(grouped).sort((a, b) => {
        const rankA = getWarehouseSortRank(a);
        const rankB = getWarehouseSortRank(b);
        if (rankA !== rankB) return rankA - rankB;
        return a.localeCompare(b);
      });

      let totalQty = 0;
      let totalValue = 0;
      const rows: SampingRowItem[] = [];

      sortedCompanies.forEach(company => {
        const prodMap = grouped[company] || {};
        const prodKeys = Object.keys(prodMap).sort();

        prodKeys.forEach((pName, pIdx) => {
          const item = prodMap[pName];
          if (item.qty > 0 || item.value > 0) {
            totalQty += item.qty;
            totalValue += item.value;
            const hpp = item.qty > 0 ? Math.round(item.value / item.qty) : 0;
            rows.push({
              infra: pIdx === 0 ? company : '',
              sku: pName,
              qty: Math.round(item.qty).toLocaleString('id-ID'),
              nilai: Math.round(item.value).toLocaleString('id-ID'),
              hpp: hpp > 0 ? hpp.toLocaleString('id-ID') : '-'
            });
          }
        });
      });

      const grandHpp = totalQty > 0 ? Math.round(totalValue / totalQty) : 0;

      rows.push({
        infra: 'TOTAL',
        sku: '',
        qty: totalQty.toLocaleString('id-ID'),
        nilai: totalValue.toLocaleString('id-ID'),
        hpp: grandHpp > 0 ? grandHpp.toLocaleString('id-ID') : '-',
        isTotal: true
      });

      return rows;
    };

    // Filter for Butir Reject / Butir Rijek / Butir Kuning Rusak
    const butirReject = extractRowsForFilter((prod, cat) => {
      return (
        prod.includes('BUTIR RIJEK') ||
        prod.includes('BUTIR REJECT') ||
        prod.includes('BUTIR KUNING') ||
        prod.includes('KUNING/RUSAK') ||
        prod.includes('RIJEK') ||
        prod.includes('REJECT') ||
        prod.startsWith('[C030') ||
        cat.includes('BUTIR RIJEK') ||
        cat.includes('BUTIR REJECT') ||
        cat.includes('BUTIR KUNING')
      );
    });

    // Filter for Menir
    const menir = extractRowsForFilter((prod, cat) => {
      return (
        prod.includes('MENIR') ||
        prod.startsWith('[C024') ||
        cat.includes('MENIR')
      );
    });

    return { butirReject, menir };
  }, [isDynamic, inventoryData, inventoryColumns]);

  const butirRejectData = useMemo(() => {
    if (dynamicData && dynamicData.butirReject.length > 1) {
      return dynamicData.butirReject;
    }
    return baselineData.butirKuningRusak as SampingRowItem[];
  }, [dynamicData]);

  const menirData = useMemo(() => {
    if (dynamicData && dynamicData.menir.length > 1) {
      return dynamicData.menir;
    }
    return baselineData.menir as SampingRowItem[];
  }, [dynamicData]);

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

  const maxRowCount = Math.max(butirRejectData.length, menirData.length);
  const isCompact = maxRowCount <= 10;

  const tableFontSize = isCompact ? 'text-[9.5px]' : 'text-[8px]';
  const headerFontSize = isCompact ? 'text-[10px]' : 'text-[8.5px]';
  const headerPadding = isCompact ? 'py-[3.5px] px-2' : 'py-[2px] px-1.5';
  const cellPadding = isCompact ? 'py-[3px] px-2' : 'py-[1.5px] px-1.5';
  const middleGap = isCompact ? 'gap-10' : 'gap-5';
  const labelFontSize = isCompact ? 'text-[22px]' : 'text-[18px]';
  const labelWidth = isCompact ? 'w-40' : 'w-36';

  const renderTable = (tableData: SampingRowItem[]) => (
    <table className={`w-full border-collapse border border-gray-400 ${tableFontSize} leading-snug`}>
      <thead>
        <tr className={`bg-[#0070c0] text-white font-bold text-center ${headerFontSize}`}>
          <th className={`border border-white ${headerPadding} w-44 text-left uppercase`}>INFRASTRUKTUR</th>
          <th className={`border border-white ${headerPadding} text-left uppercase`}>SKU</th>
          <th className={`border border-white ${headerPadding} w-24 text-right uppercase`}>KUANTUM (KG)</th>
          <th className={`border border-white ${headerPadding} w-32 text-right uppercase`}>NILAI PERSEDIAAN</th>
          <th className={`border border-white ${headerPadding} w-24 text-right uppercase`}>HPP</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, i) => {
          if (row.isTotal) {
            return (
              <tr key={`total-${i}`} className={`bg-[#0070c0] text-white font-bold text-center ${headerFontSize}`}>
                <td colSpan={2} className={`border border-white ${headerPadding} text-center uppercase tracking-wider`}>
                  TOTAL
                </td>
                <td className={`border border-white ${headerPadding} text-right font-bold`}>{row.qty}</td>
                <td className={`border border-white ${headerPadding} text-right font-bold`}>
                  {renderCell(row.nilai, true)}
                </td>
                <td className={`border border-white ${headerPadding} text-right font-bold`}>
                  {renderCell(row.hpp, true)}
                </td>
              </tr>
            );
          }

          return (
            <tr key={`row-${i}`} className="bg-white text-black hover:bg-blue-50/50 transition-colors">
              <td className={`border border-gray-400 ${cellPadding} text-left font-bold uppercase truncate max-w-[150px]`}>
                {row.infra}
              </td>
              <td className={`border border-gray-400 ${cellPadding} text-left truncate max-w-[440px]`}>
                {row.sku}
              </td>
              <td className={`border border-gray-400 ${cellPadding} text-right font-medium`}>
                {renderCell(row.qty)}
              </td>
              <td className={`border border-gray-400 ${cellPadding} text-right`}>
                {renderCell(row.nilai, true)}
              </td>
              <td className={`border border-gray-400 ${cellPadding} text-right font-semibold`}>
                {renderCell(row.hpp, true)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col justify-between px-8 py-5 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center pt-0.5">
          <h1 className="text-[26px] font-black text-black tracking-tight leading-tight uppercase">
            PERSEDIAAN HASIL SAMPING UB INDUSTRI
          </h1>
          <h2 className="text-[16px] font-bold text-[#356598] mt-0.5">{displayDate}</h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      {/* Main Content Area: 2 Side-by-side rows (BUTIR REJECT on top, MENIR on bottom) */}
      <div className={`w-full flex flex-col justify-center ${middleGap} my-auto px-2`}>
        
        {/* Row BUTIR REJECT */}
        <div className="flex w-full items-center gap-4">
          <div className={`${labelWidth} flex items-center justify-center ${labelFontSize} font-black text-black tracking-wider uppercase select-none text-center leading-tight`}>
            BUTIR REJECT
          </div>
          <div className="flex-1">
            {renderTable(butirRejectData)}
          </div>
        </div>

        {/* Row MENIR */}
        <div className="flex w-full items-center gap-4">
          <div className={`${labelWidth} flex items-center justify-center ${labelFontSize} font-black text-black tracking-wider uppercase select-none text-center leading-tight`}>
            MENIR
          </div>
          <div className="flex-1">
            {renderTable(menirData)}
          </div>
        </div>

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

