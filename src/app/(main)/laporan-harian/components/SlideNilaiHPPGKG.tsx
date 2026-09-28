import React, { useMemo } from 'react';
import { normalizeGudangName, WAREHOUSE_METADATA } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export interface SlideNilaiHPPGKGProps {
  inventoryData?: any[];
  inventoryColumns?: string[];
  inventoryFileName?: string | null;
  latestDayStr?: string;
}

interface ProductItem {
  sku: string;
  qty: number;
  val: number;
  hpp: number;
}

interface CompanyGroup {
  company: string;
  products: ProductItem[];
}

const BASELINE_GROUPS: CompanyGroup[] = [
  // --- RM I ---
  {
    company: 'SPP SUBANG',
    products: [
      { sku: '[A0050007A] GABAH GKG 14% POLOS CURAH UBI KOM DN', qty: 1497247, val: 13757526808, hpp: 9189 },
      { sku: '[A0050017A] GABAH GKG 14% IR42 POLOS CURAH UBI KOM DN', qty: 13205, val: 125763481, hpp: 9524 },
    ]
  },
  {
    company: 'SPP KARAWANG',
    products: [
      { sku: '[A0050007A] GABAH GKG 14% POLOS CURAH UBI KOM DN', qty: 2234363, val: 20530558073, hpp: 9189 },
    ]
  },
  {
    company: 'SPP LAMPUNG',
    products: [
      { sku: '[A0050007A] GABAH GKG 14% POLOS CURAH UBI KOM DN', qty: 238440, val: 2190916943, hpp: 9189 },
    ]
  },

  // --- RM II ---
  {
    company: 'SPP KENDAL',
    products: [
      { sku: '[A0050015A] GABAH GKG KA 14% HK 4% POLOS CURAH UBI KOM DN', qty: 357354, val: 3189037813, hpp: 8924 },
      { sku: '[A0050042A] GABAH GKG 14% HK 3% MT II POLOS CURAH UBI KOM DN', qty: 414394, val: 3729916431, hpp: 9001 },
      { sku: '[A0050045A] GABAH GKG 14% MT I POLOS CURAH UBI KOM DN', qty: 126658, val: 1118723369, hpp: 8833 },
      { sku: '[A0050046A] GABAH GKG 14% MT II POLOS CURAH UBI KOM DN', qty: 346468, val: 3174835523, hpp: 9163 },
    ]
  },
  {
    company: 'SPP SRAGEN',
    products: [
      { sku: '[A0050045A] GABAH GKG 14% MT I POLOS CURAH UBI KOM DN', qty: 156044, val: 1378283833, hpp: 8833 },
      { sku: '[A0050046A] GABAH GKG 14% MT II POLOS CURAH UBI KOM DN', qty: 280552, val: 2570825726, hpp: 9163 },
    ]
  },
  {
    company: 'SPP MAGETAN',
    products: [
      { sku: '[A0050014A] GABAH GKG KA 14% HK 3% POLOS CURAH UBI KOM DN', qty: 0, val: 0, hpp: 0 },
      { sku: '[A0050041A] GABAH GKG 14% HK 3% MT I POLOS CURAH UBI KOM DN', qty: 37364, val: 317851893, hpp: 8507 },
      { sku: '[A0050042A] GABAH GKG 14% HK 3% MT II POLOS CURAH UBI KOM DN', qty: 41033, val: 369330009, hpp: 9001 },
    ]
  },
  {
    company: 'SPP BOJONEGORO',
    products: [
      { sku: '[A0050015A] GABAH GKG KA 14% HK 4% POLOS CURAH UBI KOM DN', qty: 92594, val: 826308745, hpp: 8924 },
      { sku: '[A0050042A] GABAH GKG 14% HK 3% MT II POLOS CURAH UBI KOM DN', qty: 32508, val: 292596792, hpp: 9001 },
    ]
  },
  {
    company: 'SPP JEMBER',
    products: [
      { sku: '[A0050015A] GABAH GKG KA 14% HK 4% POLOS CURAH UBI KOM DN', qty: 154410, val: 1377959267, hpp: 8924 },
      { sku: '[A0050045A] GABAH GKG 14% MT I POLOS CURAH UBI KOM DN', qty: 4245, val: 37494910, hpp: 8833 },
      { sku: '[A0050046A] GABAH GKG 14% MT II POLOS CURAH UBI KOM DN', qty: 792, val: 7260560, hpp: 9163 },
    ]
  },
  {
    company: 'SPP BANYUWANGI',
    products: [
      { sku: '[A0050007A] GABAH GKG 14% POLOS CURAH UBI KOM DN', qty: 420208, val: 3982297345, hpp: 9477 },
      { sku: '[A0050046A] GABAH GKG 14% MT II POLOS CURAH UBI KOM DN', qty: 4460, val: 40870409, hpp: 9163 },
    ]
  },
  {
    company: 'SPP SUMBAWA',
    products: [
      { sku: '[A0050007A] GABAH GKG 14% POLOS CURAH UBI KOM DN', qty: 1655653, val: 14028296843, hpp: 8473 },
    ]
  },

  // --- UP ---
  {
    company: 'UP CANDIREJO',
    products: [
      { sku: '[A0050007A] GABAH GKG 14% POLOS CURAH UBI KOM DN', qty: 17411, val: 165003351, hpp: 9477 },
    ]
  },
  {
    company: 'UP LANCIRANG',
    products: [
      { sku: '[A0050046A] GABAH GKG 14% MT II POLOS CURAH UBI KOM DN', qty: 76480, val: 684211494, hpp: 8946 },
    ]
  },
];

export default function SlideNilaiHPPGKG({
  inventoryData,
  inventoryColumns,
  inventoryFileName,
  latestDayStr
}: SlideNilaiHPPGKGProps) {

  // Dynamic Date Extraction from inventoryData or fileName or latestDayStr
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

  // Dynamic calculation for GKG from inventoryData (Report 5 Tab HPP standards)
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

    const matchesGKG = (cat: string, prod: string): boolean => {
      const c = (cat || '').toUpperCase();
      const p = (prod || '').toUpperCase();
      if (c.includes('SPARE PART') || c.includes('KEMASAN') || c.includes('JASA') || c.includes('EXPENSE') || p.startsWith('[D') || p.startsWith('[E')) {
        return false;
      }
      return (
        c.includes('GKG') ||
        c.includes('GABAH KERING GILING') ||
        p.includes('GKG') ||
        p.includes('GABAH KERING GILING')
      );
    };

    const grouped: Record<string, Record<string, { qty: number; value: number }>> = {};

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const normCompany = normalizeGudangName(rawCompany);
      if (!normCompany) return;

      const cat = (row[catCol]?.toString() || '');
      const prod = (row[prodCol]?.toString() || '').trim();
      if (!prod) return;

      if (!matchesGKG(cat, prod)) return;

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
      const keyA = getWarehouseSortKey(a);
      const keyB = getWarehouseSortKey(b);
      if (keyA !== keyB) return keyA - keyB;
      return a.localeCompare(b);
    });

    let totalQty = 0;
    let totalValue = 0;

    const companyGroups: CompanyGroup[] = [];

    sortedCompanies.forEach(company => {
      const prodMap = grouped[company] || {};
      const prodKeys = Object.keys(prodMap).sort();

      const products: ProductItem[] = [];

      prodKeys.forEach(pName => {
        const item = prodMap[pName];
        if (item.qty > 0 || item.value > 0) {
          totalQty += item.qty;
          totalValue += item.value;
          products.push({
            sku: pName,
            qty: Math.round(item.qty),
            val: Math.round(item.value),
            hpp: item.qty > 0 ? Math.round(item.value / item.qty) : 0
          });
        }
      });

      if (products.length > 0) {
        companyGroups.push({ company, products });
      }
    });

    const grandHpp = totalQty > 0 ? Math.round(totalValue / totalQty) : 0;

    return {
      companyGroups,
      totalQty: Math.round(totalQty),
      totalValue: Math.round(totalValue),
      grandHpp
    };
  }, [isDynamic, inventoryData, inventoryColumns]);

  // Use dynamic data if available, otherwise use baseline sorted RM I -> RM II -> RM III -> UP
  const activeGroups: CompanyGroup[] = useMemo(() => {
    if (dynamicData && dynamicData.companyGroups.length > 0) {
      return dynamicData.companyGroups;
    }
    return BASELINE_GROUPS;
  }, [dynamicData]);

  const totalQty = useMemo(() => {
    if (dynamicData) return dynamicData.totalQty;
    return activeGroups.reduce((acc, g) => acc + g.products.reduce((pAcc, p) => pAcc + p.qty, 0), 0);
  }, [dynamicData, activeGroups]);

  const totalValue = useMemo(() => {
    if (dynamicData) return dynamicData.totalValue;
    return activeGroups.reduce((acc, g) => acc + g.products.reduce((pAcc, p) => pAcc + p.val, 0), 0);
  }, [dynamicData, activeGroups]);

  const grandHpp = useMemo(() => {
    if (dynamicData) return dynamicData.grandHpp;
    return totalQty > 0 ? Math.round(totalValue / totalQty) : 0;
  }, [dynamicData, totalQty, totalValue]);

  // Dynamic font size and row padding based on row count to ensure perfect fit without empty space
  const totalRowCount = useMemo(() => {
    return activeGroups.reduce((acc, g) => acc + g.products.length, 0);
  }, [activeGroups]);

  const { tableFontSize, headerFontSize, rowPadding, headerPadding } = useMemo(() => {
    if (totalRowCount <= 15) {
      return {
        tableFontSize: 'text-[12.5px]',
        headerFontSize: 'text-[13px]',
        rowPadding: 'py-[6.5px] px-3',
        headerPadding: 'py-2 px-3'
      };
    }
    if (totalRowCount <= 20) {
      return {
        tableFontSize: 'text-[11.5px]',
        headerFontSize: 'text-[12px]',
        rowPadding: 'py-[4.5px] px-2.5',
        headerPadding: 'py-1.5 px-2.5'
      };
    }
    return {
      tableFontSize: 'text-[10px]',
      headerFontSize: 'text-[10.5px]',
      rowPadding: 'py-[2px] px-2',
      headerPadding: 'py-1 px-2'
    };
  }, [totalRowCount]);

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
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col justify-between px-8 py-5 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center pt-0.5">
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight uppercase">
            NILAI HPP GKG PER INFRASTRUKTUR
          </h1>
          <h2 className="text-[17px] font-bold text-[#548279] mt-0.5">{displayDate}</h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      {/* Main Table Container */}
      <div className="w-full my-auto flex flex-col justify-center">
        <table className={`w-full border-collapse border border-black ${tableFontSize} leading-snug`}>
          <thead>
            <tr className={`bg-[#0070c0] text-white font-bold text-center ${headerFontSize}`}>
              <th className={`border border-black ${headerPadding} w-48 text-left uppercase`}>INFRASTRUKTUR</th>
              <th className={`border border-black ${headerPadding} text-left uppercase`}>SKU</th>
              <th className={`border border-black ${headerPadding} w-36 text-right uppercase`}>KUANTUM (KG)</th>
              <th className={`border border-black ${headerPadding} w-52 text-right uppercase`}>NILAI PERSEDIAAN</th>
              <th className={`border border-black ${headerPadding} w-32 text-right uppercase`}>HPP</th>
            </tr>
          </thead>
          <tbody>
            {activeGroups.map(group => {
              return group.products.map((row, pIdx) => (
                <tr key={`${group.company}-${row.sku}-${pIdx}`} className="bg-white text-black hover:bg-blue-50 transition-colors">
                  {pIdx === 0 && (
                    <td 
                      rowSpan={group.products.length} 
                      className={`border border-black ${rowPadding} font-bold align-middle bg-white text-black`}
                    >
                      {group.company}
                    </td>
                  )}
                  <td className={`border border-black ${rowPadding} text-left`}>{row.sku}</td>
                  <td className={`border border-black ${rowPadding} text-right font-medium`}>
                    {row.qty > 0 ? row.qty.toLocaleString('id-ID') : "-"}
                  </td>
                  <td className={`border border-black ${rowPadding} text-right`}>
                    <CurrencyCell val={row.val} />
                  </td>
                  <td className={`border border-black ${rowPadding} text-right font-semibold`}>
                    <CurrencyCell val={row.hpp} />
                  </td>
                </tr>
              ));
            })}

            {/* Total Row */}
            <tr className={`bg-[#0070c0] text-white font-bold ${headerFontSize}`}>
              <td colSpan={2} className={`border border-black ${headerPadding} text-center uppercase tracking-wider`}>TOTAL</td>
              <td className={`border border-black ${headerPadding} text-right`}>
                {totalQty > 0 ? totalQty.toLocaleString('id-ID') : "-"}
              </td>
              <td className={`border border-black ${headerPadding} text-right`}>
                <CurrencyCell val={totalValue} />
              </td>
              <td className={`border border-black ${headerPadding} text-right`}>
                <CurrencyCell val={grandHpp} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Notes */}
      <div className="w-full text-[12px] italic text-black font-bold flex justify-between items-end">
        <div>
          <p>*Data diperoleh dari laporan tarikan system ERP</p>
          <p>** Update Persediaan per Tanggal {displayDate}</p>
        </div>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
