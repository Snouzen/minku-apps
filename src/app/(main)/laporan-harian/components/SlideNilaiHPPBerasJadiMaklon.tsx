import React, { useMemo } from 'react';
import { normalizeGudangName, WAREHOUSE_METADATA, getInventoryRealQty } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export interface SlideNilaiHPPBerasJadiMaklonProps {
  pageIndex?: number;
  totalPages?: number;
  inventoryData?: any[];
  inventoryColumns?: string[];
  inventoryFileName?: string | null;
  latestDayStr?: string;
}

interface TableRowItem {
  loc: string;
  sku: string;
  qty: string;
  val: string;
  hpp: string;
}

interface GroupedRow {
  company: string;
  items: TableRowItem[];
}

const BASELINE_DATA: TableRowItem[] = [
  { loc: 'SPP BOJONEGORO', sku: '[B0020042A] BERAS PREMIUM PREMIUM 15% MAKLON 50 KG UBI KOM DN', qty: '25,000', val: '362,500,000', hpp: '14,500' },
  { loc: 'SPP KARAWANG', sku: '[B0020045A] BERAS PREMIUM PREMIUM 15% MAKLON 50 KG UBI KOM DN', qty: '40,000', val: '584,000,000', hpp: '14,600' },
  { loc: 'SPP KENDAL', sku: '[B0010025A] BERAS MEDIUM MEDIUM 20% MAKLON 50 KG UBI KOM DN', qty: '30,000', val: '390,000,000', hpp: '13,000' },
  { loc: 'SPP SRAGEN', sku: '[B0020042A] BERAS PREMIUM PREMIUM 15% MAKLON 50 KG UBI KOM DN', qty: '35,000', val: '507,500,000', hpp: '14,500' },
  { loc: 'SPB SIDOARJO', sku: '[B0020042A] BERAS PREMIUM PREMIUM 15% MAKLON 50 KG UBI KOM DN', qty: '50,000', val: '725,000,000', hpp: '14,500' },
  { loc: 'UP MOJOLABAN', sku: '[B0010025A] BERAS MEDIUM MEDIUM 20% MAKLON 50 KG UBI KOM DN', qty: '20,000', val: '260,000,000', hpp: '13,000' },
];

export default function SlideNilaiHPPBerasJadiMaklon({
  pageIndex = 0,
  totalPages = 1,
  inventoryData,
  inventoryColumns,
  inventoryFileName,
  latestDayStr,
}: SlideNilaiHPPBerasJadiMaklonProps) {
  // Dynamic Date Extraction
  const displayDate = useMemo(() => {
    const IndoMonthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

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

    if (latestDayStr) {
      return latestDayStr;
    }

    return "31 Juli 2026";
  }, [inventoryData, inventoryColumns, inventoryFileName, latestDayStr]);

  const getWarehouseSortKey = (gudang: string): number => {
    const meta = WAREHOUSE_METADATA[gudang];
    const group = meta?.group || (gudang.startsWith('UP') ? 'UP' : (gudang.startsWith('SPP') ? 'SPP' : (gudang.startsWith('SPB') ? 'SPB' : 'OTHER')));
    const rm = meta?.rm || (group === 'UP' ? 'II' : 'II');
    const order = meta?.order ?? 999;

    if (group === 'UP') return 4000 + order;
    if (rm === 'I') return 1000 + order;
    if (rm === 'II') return 2000 + order;
    if (rm === 'III') return 3000 + order;
    return 5000 + order;
  };

  const isDynamic = Boolean(inventoryData && inventoryData.length > 0);

  // Dynamic Data Calculation for Beras Jadi Maklon
  const dynamicResult = useMemo(() => {
    if (!isDynamic || !inventoryData || !inventoryColumns) return null;

    const companyCol = inventoryColumns.find(c => 
      c.toLowerCase().includes('company') || 
      c.toLowerCase().includes('gudang') || 
      c.toLowerCase().includes('lokasi')
    ) || 'Company';

    const catCol = inventoryColumns.find(c => 
      c.toLowerCase().includes('category') || 
      c.toLowerCase().includes('kategori')
    ) || 'Product Category';

    const prodCol = inventoryColumns.find(c => 
      c.toLowerCase() === 'product' || 
      c.toLowerCase().includes('produk')
    ) || 'Product';

    const qtyCol = inventoryColumns.find(c => 
      c.toLowerCase().includes('remaining') || 
      c.toLowerCase().includes('qty') || 
      c.toLowerCase().includes('kuantum')
    ) || 'Remaining Qty';

    const valCol = inventoryColumns.find(c => 
      c.toLowerCase().includes('total value') || 
      c.toLowerCase().includes('remaining value') || 
      c.toLowerCase().includes('nilai') || 
      c.toLowerCase().includes('nominal')
    ) || 'Total Value';

    const matchesBerasJadiMaklon = (cat: string, prod: string): boolean => {
      const c = (cat || '').toUpperCase().trim();
      const p = (prod || '').toUpperCase().trim();

      // Exclude non-commodity
      if (
        c.includes('SPARE PART') || 
        c.includes('KEMASAN') || 
        c.includes('JASA') || 
        c.includes('EXPENSE') || 
        p.startsWith('[D') || 
        p.startsWith('[E')
      ) {
        return false;
      }

      // Strictly exclude WIP (handled in Beras WIP Maklon)
      if (c.includes('WIP') || p.includes('WIP')) {
        return false;
      }

      // Strictly exclude Bahan Baku
      if (c.includes('BAHAN BAKU') || p.includes('BAHAN BAKU')) {
        return false;
      }

      // Strictly exclude Gabah & Jagung
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

      // 1. Direct match on Product Category 'Beras Jadi Maklon' / 'Beras Jadi Makloon'
      if (
        c === 'BERAS JADI MAKLON' ||
        c === 'BERAS JADI MAKLOON' ||
        c.includes('BERAS JADI MAKLON') ||
        c.includes('BERAS JADI MAKLOON') ||
        c.includes('JADI MAKLON') ||
        c.includes('JADI MAKLOON')
      ) {
        return true;
      }

      // 2. Both contains Maklon and is Beras Jadi (or finished rice SKU)
      const isMaklon = c.includes('MAKLON') || c.includes('MAKLOON') || p.includes('MAKLON') || p.includes('MAKLOON');
      const isBerasJadi = c.includes('BERAS JADI') || c.includes('BERAS') || p.includes('BERAS JADI') || p.startsWith('[B00') || p.startsWith('[A001') || p.startsWith('[A002');

      if (isMaklon && isBerasJadi) {
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

      if (!matchesBerasJadiMaklon(cat, prod)) return;

      const qty = getInventoryRealQty(row, inventoryColumns);

      let rawVal = row[valCol];
      if (typeof rawVal === 'string') rawVal = parseFloat(rawVal.replace(/,/g, ''));
      const val = typeof rawVal === 'number' && !isNaN(rawVal) ? rawVal : 0;

      if (qty <= 0 && val <= 0) return;

      if (!grouped[normCompany]) grouped[normCompany] = {};
      if (!grouped[normCompany][prod]) grouped[normCompany][prod] = { qty: 0, value: 0 };
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

    sortedCompanies.forEach(company => {
      const prodMap = grouped[company] || {};
      const prodKeys = Object.keys(prodMap).sort();

      prodKeys.forEach((pName) => {
        const item = prodMap[pName];
        if (item.qty > 0 || item.value > 0) {
          totalQty += item.qty;
          totalValue += item.value;
          const hpp = item.qty > 0 ? Math.round(item.value / item.qty) : 0;
          rows.push({
            loc: company,
            sku: pName,
            qty: Math.round(item.qty).toLocaleString('en-US'),
            val: item.value > 0 ? Math.round(item.value).toLocaleString('en-US') : '-',
            hpp: hpp > 0 ? hpp.toLocaleString('en-US') : '-'
          });
        }
      });
    });

    if (rows.length === 0) return null;

    const grandHpp = totalQty > 0 ? Math.round(totalValue / totalQty) : 0;

    return {
      rows,
      totalQty: Math.round(totalQty).toLocaleString('en-US'),
      totalValue: Math.round(totalValue).toLocaleString('en-US'),
      grandHpp: grandHpp > 0 ? grandHpp.toLocaleString('en-US') : '-'
    };
  }, [isDynamic, inventoryData, inventoryColumns]);

  const allRows: TableRowItem[] = dynamicResult ? dynamicResult.rows : BASELINE_DATA;
  const totalQtyDisplay = dynamicResult ? dynamicResult.totalQty : '200,000';
  const totalValueDisplay = dynamicResult ? dynamicResult.totalValue : '2,829,000,000';
  const grandHppDisplay = dynamicResult ? dynamicResult.grandHpp : '14,145';

  const totalPagesCount = totalPages || 1;
  const isLastPage = (pageIndex || 0) === totalPagesCount - 1;

  // Partition allRows evenly across totalPagesCount
  const pageRows = useMemo(() => {
    if (totalPagesCount <= 1) return allRows;
    const n = allRows.length;
    if (n === 0) return [];
    const base = Math.floor(n / totalPagesCount);
    const rem = n % totalPagesCount;

    const idx = pageIndex || 0;
    let start = 0;
    if (idx < rem) {
      start = idx * (base + 1);
    } else {
      start = rem * (base + 1) + (idx - rem) * base;
    }
    const count = idx < rem ? base + 1 : base;
    return allRows.slice(start, start + count);
  }, [allRows, pageIndex, totalPagesCount]);

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

  const rowCount = pageRows.length;
  const { tableFontSize, headerFontSize, rowPadding, headerPadding } = useMemo(() => {
    if (rowCount <= 15) {
      return {
        tableFontSize: 'text-[11.5px]',
        headerFontSize: 'text-[12px]',
        rowPadding: 'py-[3px] px-[3.5px]',
        headerPadding: 'py-[2px] px-[3.5px]'
      };
    }
    if (rowCount <= 25) {
      return {
        tableFontSize: 'text-[10.5px]',
        headerFontSize: 'text-[11px]',
        rowPadding: 'py-[2px] px-[3px]',
        headerPadding: 'py-[1.5px] px-[3px]'
      };
    }
    if (rowCount <= 35) {
      return {
        tableFontSize: 'text-[9.5px]',
        headerFontSize: 'text-[10px]',
        rowPadding: 'py-[1px] px-[2.5px]',
        headerPadding: 'py-[1px] px-[2.5px]'
      };
    }
    if (rowCount <= 45) {
      return {
        tableFontSize: 'text-[8.5px]',
        headerFontSize: 'text-[9px]',
        rowPadding: 'py-[0.4px] px-[2px]',
        headerPadding: 'py-[0.8px] px-[2px]'
      };
    }
    return {
      tableFontSize: 'text-[7.5px]',
      headerFontSize: 'text-[8px]',
      rowPadding: 'py-[0.2px] px-[2px]',
      headerPadding: 'py-[0.5px] px-[2px]'
    };
  }, [rowCount]);

  const CurrencyCell = ({ val }: { val: string }) => {
    if (val === '-') {
      return (
        <div className="flex justify-between w-full">
          <span>Rp</span>
          <span>-</span>
        </div>
      );
    }
    return (
      <div className="flex justify-between w-full">
        <span>Rp</span>
        <span>{val}</span>
      </div>
    );
  };

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-4 py-2 font-sans text-gray-800">
      
      {/* Header Logos */}
      <div className="flex justify-between items-start mb-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-8 object-contain" />
        <div className="text-center pt-1">
          <h1 className="text-[26px] font-black text-black tracking-tight leading-tight uppercase">
            NILAI HPP BERAS PER INFRASTRUKTUR
          </h1>
          <h2 className="text-[16px] font-bold text-[#548279] mt-0.5">{displayDate}</h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-8 object-contain" />
      </div>

      <div className="flex-1 w-[96%] mx-auto flex flex-col justify-center mt-1 mb-1">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="text-[14px] font-bold text-black uppercase">
            BERAS JADI MAKLON
          </h3>
        </div>
        <table className={`w-full border-collapse border border-black ${tableFontSize}`}>
          <thead>
            <tr className={`bg-[#0070c0] text-white font-bold text-center ${headerFontSize}`}>
              <th className={`border border-black ${headerPadding} w-40 text-left`}>INFRASTRUKTUR</th>
              <th className={`border border-black ${headerPadding} text-left`}>SKU</th>
              <th className={`border border-black ${headerPadding} w-28 text-right`}>KUANTUM (KG)</th>
              <th className={`border border-black ${headerPadding} w-36 text-right`}>NILAI PERSEDIAAN</th>
              <th className={`border border-black ${headerPadding} w-24 text-right`}>HPP</th>
            </tr>
          </thead>
          <tbody>
            {pageGroups.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                {group.items.map((row, rIdx) => (
                  <tr key={`${group.company}-${row.sku}-${rIdx}`} className="bg-white text-black">
                    {rIdx === 0 && (
                      <td 
                        rowSpan={group.items.length} 
                        className={`border border-black ${rowPadding} font-bold align-middle bg-white text-black text-left leading-tight`}
                      >
                        {group.company}
                      </td>
                    )}
                    <td className={`border border-black ${rowPadding} text-left leading-tight`}>{row.sku}</td>
                    <td className={`border border-black ${rowPadding} text-right leading-tight`}>{row.qty}</td>
                    <td className={`border border-black ${rowPadding} text-right leading-tight`}>
                      <CurrencyCell val={row.val} />
                    </td>
                    <td className={`border border-black ${rowPadding} text-right leading-tight`}>
                      <CurrencyCell val={row.hpp} />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {isLastPage && (
              <tr className={`bg-[#0070c0] text-white font-bold ${headerFontSize}`}>
                <td colSpan={2} className={`border border-black ${headerPadding} text-center uppercase`}>TOTAL</td>
                <td className={`border border-black ${headerPadding} text-right`}>{totalQtyDisplay}</td>
                <td className={`border border-black ${headerPadding} text-right`}>
                  <div className="flex justify-between w-full">
                    <span>Rp</span>
                    <span>{totalValueDisplay}</span>
                  </div>
                </td>
                <td className={`border border-black ${headerPadding} text-right`}>
                  <CurrencyCell val={grandHppDisplay} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-[96%] mx-auto mt-0 text-[10px] italic text-black font-bold">
        <p>*Data diperoleh dari laporan tarikan system ERP</p>
        <p>** Update Persediaan per Tanggal {displayDate}</p>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
