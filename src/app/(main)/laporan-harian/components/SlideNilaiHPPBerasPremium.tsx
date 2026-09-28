import React, { useMemo } from 'react';
import historicalData from '../data/hppBerasPremium.json';
import { normalizeGudangName, WAREHOUSE_METADATA, getInventoryRealQty } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export interface SlideNilaiHPPBerasPremiumProps {
  pageIndex?: number;
  inventoryData?: any[];
  inventoryColumns?: string[];
  inventoryFileName?: string | null;
  latestDayStr?: string;
}

interface TableRowItem {
  no: number;
  loc: string;
  sku: string;
  qty: number;
  val: number;
  hpp: number;
}

interface GroupedRow {
  company: string;
  items: TableRowItem[];
}

const TOTAL_PAGES = 5;

export default function SlideNilaiHPPBerasPremium({
  pageIndex = 0,
  inventoryData,
  inventoryColumns,
  inventoryFileName,
  latestDayStr
}: SlideNilaiHPPBerasPremiumProps) {

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

  // Determine warehouse sort rank: RM I -> RM II -> RM III -> UP
  const getWarehouseSortKey = (gudang: string): number => {
    const meta = WAREHOUSE_METADATA[gudang];
    const group = meta?.group || (gudang.startsWith('UP') ? 'UP' : (gudang.startsWith('SPP') ? 'SPP' : (gudang.startsWith('SPB') ? 'SPB' : 'OTHER')));
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

  // Dynamic calculation for Beras Premium from inventoryData
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

    const matchesBerasPremium = (cat: string, prod: string): boolean => {
      const c = (cat || '').toUpperCase();
      const p = (prod || '').toUpperCase();

      // Exclude non-commodity & other categories
      if (
        c.includes('SPARE PART') ||
        c.includes('KEMASAN') ||
        c.includes('JASA') ||
        c.includes('EXPENSE') ||
        p.startsWith('[D') ||
        p.startsWith('[E') ||
        p.includes('KARPLAS') ||
        p.includes('KARUNG')
      ) {
        return false;
      }

      // Exclude Gabah & Jagung
      if (
        c.includes('GABAH') ||
        p.includes('GABAH') ||
        c.includes('GKG') ||
        p.includes('GKG') ||
        c.includes('GKP') ||
        p.includes('GKP') ||
        c.includes('JAGUNG') ||
        p.includes('JAGUNG')
      ) {
        return false;
      }

      // Exclude pure Bahan Baku (unless SKU specifically says Premium)
      if (
        (c.includes('BAHAN BAKU') || p.includes('BAHAN BAKU') || p.includes('PECAH KULIT') || p.includes('BPK') || p.includes('ASALAN')) &&
        !c.includes('PREMIUM') && !p.includes('PREMIUM')
      ) {
        return false;
      }

      // Must match Premium
      if (
        c.includes('PREMIUM') ||
        p.includes('PREMIUM') ||
        p.startsWith('[B002') ||
        p.startsWith('[A002')
      ) {
        return true;
      }

      return false;
    };

    const grouped: Record<string, Record<string, { qty: number; value: number }>> = {};

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany) return;

      const cat = (row[catCol]?.toString() || '');
      const prod = (row[prodCol]?.toString() || '').trim();
      if (!prod) return;

      if (!matchesBerasPremium(cat, prod)) return;

      const qty = getInventoryRealQty(row, inventoryColumns);

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
      const keyA = getWarehouseSortKey(a);
      const keyB = getWarehouseSortKey(b);
      if (keyA !== keyB) return keyA - keyB;
      return a.localeCompare(b);
    });

    let totalQty = 0;
    let totalValue = 0;
    const rows: TableRowItem[] = [];
    let rowIdx = 1;

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
            no: rowIdx++,
            loc: company,
            sku: pName,
            qty: Math.round(item.qty),
            val: Math.round(item.value),
            hpp
          });
        }
      });
    });

    const grandHpp = totalQty > 0 ? Math.round(totalValue / totalQty) : 0;

    return {
      rows,
      totalQty: Math.round(totalQty),
      totalValue: Math.round(totalValue),
      grandHpp
    };
  }, [isDynamic, inventoryData, inventoryColumns]);

  // Baseline rows re-ordered by RM I -> RM II -> RM III -> UP
  const baselineRows = useMemo(() => {
    let currentLoc = "";
    const byLoc: Record<string, Array<{ sku: string; qty: number; val: number; hpp: number }>> = {};

    (historicalData as any[]).forEach(row => {
      if (row.loc) {
        currentLoc = normalizeGudangName(row.loc);
      }
      if (!byLoc[currentLoc]) {
        byLoc[currentLoc] = [];
      }
      const rawQty = typeof row.qty === 'string' ? parseFloat(row.qty.replace(/,/g, '')) : (row.qty || 0);
      const rawVal = typeof row.val === 'string' ? parseFloat(row.val.replace(/,/g, '')) : (row.val || 0);
      const rawHpp = typeof row.hpp === 'string' ? parseFloat(row.hpp.replace(/,/g, '')) : (row.hpp || 0);
      byLoc[currentLoc].push({
        sku: row.sku,
        qty: Math.round(rawQty),
        val: Math.round(rawVal),
        hpp: Math.round(rawHpp)
      });
    });

    const sortedCompanies = Object.keys(byLoc).sort((a, b) => {
      const keyA = getWarehouseSortKey(a);
      const keyB = getWarehouseSortKey(b);
      if (keyA !== keyB) return keyA - keyB;
      return a.localeCompare(b);
    });

    const rows: TableRowItem[] = [];
    let rowIdx = 1;
    let totalQty = 0;
    let totalValue = 0;

    sortedCompanies.forEach(company => {
      const list = byLoc[company];
      list.forEach((item, pIdx) => {
        totalQty += item.qty;
        totalValue += item.val;
        rows.push({
          no: rowIdx++,
          loc: company,
          sku: item.sku,
          qty: item.qty,
          val: item.val,
          hpp: item.hpp
        });
      });
    });

    const grandHpp = totalQty > 0 ? Math.round(totalValue / totalQty) : 0;

    return {
      rows,
      totalQty,
      totalValue,
      grandHpp
    };
  }, []);

  const allRows = useMemo(() => {
    if (dynamicData && dynamicData.rows.length > 0) {
      return dynamicData.rows;
    }
    return baselineRows.rows;
  }, [dynamicData, baselineRows]);

  const totalQty = useMemo(() => {
    if (dynamicData && dynamicData.rows.length > 0) return dynamicData.totalQty;
    return baselineRows.totalQty;
  }, [dynamicData, baselineRows]);

  const totalValue = useMemo(() => {
    if (dynamicData && dynamicData.rows.length > 0) return dynamicData.totalValue;
    return baselineRows.totalValue;
  }, [dynamicData, baselineRows]);

  const grandHpp = useMemo(() => {
    if (dynamicData && dynamicData.rows.length > 0) return dynamicData.grandHpp;
    return baselineRows.grandHpp;
  }, [dynamicData, baselineRows]);

  const totalPages = TOTAL_PAGES;
  const isLastPage = pageIndex === totalPages - 1;

  // Partition allRows evenly across TOTAL_PAGES so every page is guaranteed to get rows
  const pageRows = useMemo(() => {
    const n = allRows.length;
    if (n === 0) return [];
    const base = Math.floor(n / TOTAL_PAGES);
    const rem = n % TOTAL_PAGES;

    let start = 0;
    if (pageIndex < rem) {
      start = pageIndex * (base + 1);
    } else {
      start = rem * (base + 1) + (pageIndex - rem) * base;
    }
    const count = pageIndex < rem ? base + 1 : base;
    return allRows.slice(start, start + count);
  }, [allRows, pageIndex]);

  // Group consecutive rows with same company on this page for clean rowSpan merging
  const pageGroups = useMemo<GroupedRow[]>(() => {
    const groups: GroupedRow[] = [];
    let currentGroup: GroupedRow | null = null;

    pageRows.forEach(row => {
      if (!currentGroup || currentGroup.company !== row.loc) {
        currentGroup = {
          company: row.loc,
          items: [row]
        };
        groups.push(currentGroup);
      } else {
        currentGroup.items.push(row);
      }
    });

    return groups;
  }, [pageRows]);

  const CurrencyCell = ({ val }: { val: number | string | null | undefined }) => {
    if (val === '-' || val === 0 || val === null || val === undefined) {
      return (
        <div className="flex justify-between w-full">
          <span>Rp</span>
          <span>-</span>
        </div>
      );
    }
    const displayVal = typeof val === 'number' ? Math.round(val).toLocaleString('id-ID') : val;
    return (
      <div className="flex justify-between w-full">
        <span>Rp</span>
        <span>{displayVal}</span>
      </div>
    );
  };

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col justify-between px-8 py-4 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center pt-0.5">
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight uppercase">
            NILAI HPP BERAS PER INFRASTRUKTUR
          </h1>
          <h2 className="text-[17px] font-bold text-[#548279] mt-0.5">{displayDate}</h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      {/* Main Table Container */}
      <div className="w-full my-auto flex flex-col justify-center">
        {/* Sub-header text with page indicator */}
        <div className="flex justify-between items-center mb-1 ml-0.5">
          <h3 className="text-[15px] font-bold text-black uppercase">BERAS PREMIUM</h3>
          <span className="text-[12px] font-bold text-[#0070c0] mr-0.5">
            Halaman {pageIndex + 1} dari {totalPages}
          </span>
        </div>
        
        {(pageRows.length > 0 || isLastPage) ? (
          <table className="w-full border-collapse border border-black text-[10px] leading-snug">
            <thead>
              <tr className="bg-[#0070c0] text-white font-bold text-center text-[10.5px]">
                <th className="border border-black py-1 px-2.5 w-48 text-left uppercase">INFRASTRUKTUR</th>
                <th className="border border-black py-1 px-2.5 text-left uppercase">SKU</th>
                <th className="border border-black py-1 px-2.5 w-36 text-right uppercase">KUANTUM (KG)</th>
                <th className="border border-black py-1 px-2.5 w-52 text-right uppercase">NILAI PERSEDIAAN</th>
                <th className="border border-black py-1 px-2.5 w-32 text-right uppercase">HPP</th>
              </tr>
            </thead>
            <tbody>
              {pageGroups.map(group => {
                return group.items.map((row, pIdx) => (
                  <tr key={`${group.company}-${row.sku}-${pIdx}`} className="bg-white text-black hover:bg-blue-50 transition-colors">
                    {pIdx === 0 && (
                      <td 
                        rowSpan={group.items.length} 
                        className="border border-black py-[2px] px-2.5 font-bold align-middle bg-white text-black text-left"
                      >
                        {group.company}
                      </td>
                    )}
                    <td className="border border-black py-[2px] px-2.5 text-left">{row.sku}</td>
                    <td className="border border-black py-[2px] px-2.5 text-right font-medium">
                      {row.qty > 0 ? row.qty.toLocaleString('id-ID') : "-"}
                    </td>
                    <td className="border border-black py-[2px] px-2.5 text-right">
                      <CurrencyCell val={row.val} />
                    </td>
                    <td className="border border-black py-[2px] px-2.5 text-right font-semibold">
                      <CurrencyCell val={row.hpp} />
                    </td>
                  </tr>
                ));
              })}

              {/* Total Row (displayed on the final page of data) */}
              {isLastPage && (
                <tr className="bg-[#0070c0] text-white font-bold text-[10.5px]">
                  <td colSpan={2} className="border border-black py-1 px-2.5 text-center uppercase tracking-wider">
                    TOTAL
                  </td>
                  <td className="border border-black py-1 px-2.5 text-right">
                    {totalQty > 0 ? totalQty.toLocaleString('id-ID') : "-"}
                  </td>
                  <td className="border border-black py-1 px-2.5 text-right">
                    <CurrencyCell val={totalValue} />
                  </td>
                  <td className="border border-black py-1 px-2.5 text-right">
                    <CurrencyCell val={grandHpp} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-400 font-medium italic text-[14px]">
              Seluruh data Beras Premium telah ditampilkan pada bagian sebelumnya.
            </p>
          </div>
        )}

      </div>

      {/* Bottom Notes */}
      <div className="w-full text-[11px] italic text-black font-bold flex justify-between items-end mt-2">
        <div>
          <p>*Data diperoleh dari laporan tarikan system ERP</p>
          <p>** Update Persediaan per Tanggal {displayDate}</p>
        </div>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
