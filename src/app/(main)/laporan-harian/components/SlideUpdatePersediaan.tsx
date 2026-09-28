import React, { useMemo } from 'react';
import { normalizeGudangName, getInventoryRealQty } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export interface SlideUpdatePersediaanProps {
  inventoryData?: any[];
  inventoryColumns?: string[];
  inventoryFileName?: string | null;
  latestDayStr?: string;
}

interface InfraDef {
  no: string;
  rm: string;
  key: string;
  displayName: string;
  group: 'SPB' | 'SPP' | 'UP';
}

const INFRASTRUCTURES: InfraDef[] = [
  // Group A: SPB (1-7)
  { no: '1', rm: 'I', key: 'SPB JAKARTA', displayName: 'SPB DKI JAKARTA', group: 'SPB' },
  { no: '2', rm: 'I', key: 'SPB INDRAMAYU', displayName: 'SPB INDRAMAYU', group: 'SPB' },
  { no: '3', rm: 'II', key: 'SPB SUKOHARJO', displayName: 'SPB SUKOHARJO', group: 'SPB' },
  { no: '4', rm: 'II', key: 'SPB SIDOARJO', displayName: 'SPB SIDOARJO', group: 'SPB' },
  { no: '5', rm: 'II', key: 'SPB LOMBOK TIMUR', displayName: 'SPB LOMBOK TIMUR', group: 'SPB' },
  { no: '6', rm: 'III', key: 'SPB SIDRAP', displayName: 'SPB SIDRAP', group: 'SPB' },
  { no: '7', rm: 'III', key: 'SPB MAKASSAR', displayName: 'SPB MAKASSAR', group: 'SPB' },

  // Group B: SPP (8-17)
  { no: '8', rm: 'I', key: 'SPP SUBANG', displayName: 'SPP SUBANG', group: 'SPP' },
  { no: '9', rm: 'I', key: 'SPP KARAWANG', displayName: 'SPP KARAWANG', group: 'SPP' },
  { no: '10', rm: 'I', key: 'SPP LAMPUNG', displayName: 'SPP LAMPUNG', group: 'SPP' },
  { no: '11', rm: 'II', key: 'SPP KENDAL', displayName: 'SPP KENDAL', group: 'SPP' },
  { no: '12', rm: 'II', key: 'SPP SRAGEN', displayName: 'SPP SRAGEN', group: 'SPP' },
  { no: '13', rm: 'II', key: 'SPP MAGETAN', displayName: 'SPP MAGETAN', group: 'SPP' },
  { no: '14', rm: 'II', key: 'SPP BOJONEGORO', displayName: 'SPP BOJONEGORO', group: 'SPP' },
  { no: '15', rm: 'II', key: 'SPP JEMBER', displayName: 'SPP JEMBER', group: 'SPP' },
  { no: '16', rm: 'II', key: 'SPP BANYUWANGI', displayName: 'SPP BANYUWANGI', group: 'SPP' },
  { no: '17', rm: 'II', key: 'SPP SUMBAWA', displayName: 'SPP SUMBAWA', group: 'SPP' },

  // Group C: UP (18-22)
  { no: '18', rm: 'II', key: 'UP BANTUL', displayName: 'UP BANTUL', group: 'UP' },
  { no: '19', rm: 'II', key: 'UP CANDIREJO', displayName: 'UP CANDIREJO', group: 'UP' },
  { no: '20', rm: 'II', key: 'UP MOJOLABAN', displayName: 'UP MOJOLABAN', group: 'UP' },
  { no: '21', rm: 'III', key: 'UP LANCIRANG', displayName: 'UP LANCIRANG', group: 'UP' },
  { no: '22', rm: 'III', key: 'UP ANABANUA', displayName: 'UP ANNABANUA', group: 'UP' },
];

const BASELINE_DATA: Record<string, { gabah: number; beras: number; kemasan: number; hasil: number }> = {
  'SPB JAKARTA': { gabah: 0, beras: 244, kemasan: 356578, hasil: 0 },
  'SPB INDRAMAYU': { gabah: 0, beras: 113, kemasan: 418524, hasil: 8715 },
  'SPB SUKOHARJO': { gabah: 0, beras: 387, kemasan: 431314, hasil: 58130 },
  'SPB SIDOARJO': { gabah: 0, beras: 402, kemasan: 613286, hasil: 3840 },
  'SPB LOMBOK TIMUR': { gabah: 0, beras: 36, kemasan: 328574, hasil: 44265 },
  'SPB SIDRAP': { gabah: 0, beras: 380, kemasan: 269624, hasil: 32337 },
  'SPB MAKASSAR': { gabah: 0, beras: 191, kemasan: 1398512, hasil: 14189 },

  'SPP SUBANG': { gabah: 1880, beras: 1, kemasan: 683055, hasil: 18780 },
  'SPP KARAWANG': { gabah: 2266, beras: 21, kemasan: 563976, hasil: 61580 },
  'SPP LAMPUNG': { gabah: 282, beras: 6, kemasan: 644723, hasil: 4610 },
  'SPP KENDAL': { gabah: 1262, beras: 265, kemasan: 260766, hasil: 66660 },
  'SPP SRAGEN': { gabah: 437, beras: 600, kemasan: 118976, hasil: 26179 },
  'SPP MAGETAN': { gabah: 78, beras: 180, kemasan: 237216, hasil: 35470 },
  'SPP BOJONEGORO': { gabah: 126, beras: 230, kemasan: 202386, hasil: 14084 },
  'SPP JEMBER': { gabah: 159, beras: 227, kemasan: 207810, hasil: 0 },
  'SPP BANYUWANGI': { gabah: 425, beras: 20, kemasan: 290320, hasil: 0 },
  'SPP SUMBAWA': { gabah: 1707, beras: 52, kemasan: 211930, hasil: 12050 },

  'UP BANTUL': { gabah: 0, beras: 47, kemasan: 19997, hasil: 0 },
  'UP CANDIREJO': { gabah: 17, beras: 72, kemasan: 11989, hasil: 0 },
  'UP MOJOLABAN': { gabah: 0, beras: 844, kemasan: 24826, hasil: 8130 },
  'UP LANCIRANG': { gabah: 137, beras: 130, kemasan: 6541, hasil: 0 },
  'UP ANABANUA': { gabah: 0, beras: 0, kemasan: 18931, hasil: 0 },
};

const BASELINE_GROUPS = {
  SPB: { gabah: 0, beras: 1752, kemasan: 3819412, hasil: 162476 },
  SPP: { gabah: 8442, beras: 1602, kemasan: 3421158, hasil: 239413 },
  UP: { gabah: 155, beras: 1093, kemasan: 82284, hasil: 8130 },
  TOTAL: { gabah: 8596, beras: 4447, kemasan: 7322854, hasil: 410019 }
};

const parseDateHelper = (val: any): Date | null => {
  if (!val) return null;
  if (typeof val === 'number') {
    const days = Math.floor(val);
    const ms = Math.round((days - 25569) * 86400 * 1000);
    const d = new Date(ms);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  if (val instanceof Date && !isNaN(val.getTime())) {
    if (val.getUTCHours() === 0 && val.getUTCMinutes() === 0 && val.getUTCSeconds() === 0) {
      return new Date(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate());
    }
    const wib = new Date(val.getTime() + 7 * 3600 * 1000 + 60000);
    return new Date(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate());
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;

    const ymd = trimmed.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
    if (ymd) {
      return new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
    }
    const dmy = trimmed.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
    if (dmy) {
      const p1 = parseInt(dmy[1]);
      const p2 = parseInt(dmy[2]);
      let yr = parseInt(dmy[3]);
      if (yr < 100) yr += 2000;
      if (p2 > 12 && p1 <= 12) {
        return new Date(yr, p1 - 1, p2);
      }
      return new Date(yr, p2 - 1, p1);
    }
  }
  return null;
};

export default function SlideUpdatePersediaan({
  inventoryData,
  inventoryColumns,
  inventoryFileName,
  latestDayStr
}: SlideUpdatePersediaanProps) {

  const renderCell = (num: number) => {
    if (!num || num === 0) return <span className="text-center w-full block">-</span>;
    return num.toLocaleString('en-US');
  };

  // Dynamic Date Extraction from Excel
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
          s.includes('valuation') ||
          s.includes('as of')
        );
      });

      if (dateCol) {
        let maxDate: Date | null = null;
        for (const row of inventoryData) {
          const d = parseDateHelper(row[dateCol]);
          if (d && (!maxDate || d > maxDate)) {
            maxDate = d;
          }
        }
        if (maxDate && maxDate.getFullYear() >= 2020) {
          return `${maxDate.getDate()} ${IndoMonthNames[maxDate.getMonth()]} ${maxDate.getFullYear()}`;
        }
      }
    }

    // 2. Try date from inventoryFileName
    if (inventoryFileName) {
      const indoMonthMap: Record<string, number> = {
        januari: 0, jan: 0, februari: 1, feb: 1, maret: 2, mar: 2, april: 3, apr: 3, mei: 4, may: 4,
        juni: 5, jun: 5, juli: 6, jul: 6, agustus: 7, agt: 7, ags: 7, august: 7,
        september: 8, sep: 8, sept: 8, oktober: 9, okt: 9, oct: 9, november: 10, nov: 10, desember: 11, des: 11, dec: 11
      };

      const nameMatch = inventoryFileName.match(/(\d{1,2})[\s_\-\.]+([a-zA-Z]+)[\s_\-\.]+(\d{4})/);
      if (nameMatch) {
        const day = parseInt(nameMatch[1], 10);
        const mStr = nameMatch[2].toLowerCase();
        const yr = parseInt(nameMatch[3], 10);
        if (indoMonthMap[mStr] !== undefined && yr >= 2020) {
          return `${day} ${IndoMonthNames[indoMonthMap[mStr]]} ${yr}`;
        }
      }

      const ymdMatch = inventoryFileName.match(/(\d{4})[\-_](\d{1,2})[\-_](\d{1,2})/);
      if (ymdMatch) {
        const yr = parseInt(ymdMatch[1], 10);
        const mo = parseInt(ymdMatch[2], 10) - 1;
        const day = parseInt(ymdMatch[3], 10);
        if (mo >= 0 && mo <= 11 && yr >= 2020) {
          return `${day} ${IndoMonthNames[mo]} ${yr}`;
        }
      }

      const dmyMatch = inventoryFileName.match(/(\d{1,2})[\-_](\d{1,2})[\-_](\d{4})/);
      if (dmyMatch) {
        const day = parseInt(dmyMatch[1], 10);
        const mo = parseInt(dmyMatch[2], 10) - 1;
        const yr = parseInt(dmyMatch[3], 10);
        if (mo >= 0 && mo <= 11 && yr >= 2020) {
          return `${day} ${IndoMonthNames[mo]} ${yr}`;
        }
      }
    }

    // 3. Try latestDayStr from PO dataset if available
    if (latestDayStr) {
      return latestDayStr;
    }

    // 4. Default baseline date
    return "31 Juli 2026";
  }, [inventoryData, inventoryColumns, inventoryFileName, latestDayStr]);

  // Calculate Table Data dynamically from inventoryData
  const tableData = useMemo(() => {
    if (!inventoryData || inventoryData.length === 0 || !inventoryColumns || inventoryColumns.length === 0) {
      return {
        isDynamic: false,
        rows: INFRASTRUCTURES.map(inf => ({
          ...inf,
          ...BASELINE_DATA[inf.key]
        })),
        spbTotals: BASELINE_GROUPS.SPB,
        sppTotals: BASELINE_GROUPS.SPP,
        upTotals: BASELINE_GROUPS.UP,
        grandTotals: BASELINE_GROUPS.TOTAL
      };
    }

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

    const matchInfraKey = (rawCompany: string): string | null => {
      const norm = normalizeGudangName(rawCompany);
      if (norm === 'UP ANNABANUA') return 'UP ANABANUA';
      if (norm === 'SPB DKI JAKARTA' || norm === 'SPB DKI') return 'SPB JAKARTA';
      const found = INFRASTRUCTURES.find(i => i.key === norm || i.displayName === norm);
      return found ? found.key : null;
    };

    const accum: Record<string, { gabahKg: number; berasKg: number; kemasanPack: number; hasilSampingKg: number }> = {};
    INFRASTRUCTURES.forEach(inf => {
      accum[inf.key] = { gabahKg: 0, berasKg: 0, kemasanPack: 0, hasilSampingKg: 0 };
    });

    inventoryData.forEach(row => {
      const rawCompany = row[companyCol]?.toString() || '';
      const key = matchInfraKey(rawCompany);
      if (!key || !accum[key]) return;

      const cat = (row[catCol] || '').toString().toUpperCase().trim();
      const prod = (row[prodCol] || '').toString().toUpperCase().trim();

      // Exclude Non-Commodities (Spare parts, barang pelengkap, jasa, biaya, sewa)
      if (
        cat.includes('SPARE PART') ||
        cat.includes('PELENGKAP') ||
        cat.includes('JASA') ||
        cat.includes('BIAYA') ||
        cat.includes('SEWA')
      ) {
        return;
      }

      let rawQty = row[qtyCol];
      if (typeof rawQty === 'string') {
        rawQty = parseFloat(rawQty.replace(/,/g, ''));
      }
      const qty = typeof rawQty === 'number' && !isNaN(rawQty) ? rawQty : 0;
      if (qty <= 0) return;

      // 1. Kemasan Check (Must precede Beras so packaging mentioning rice/beras is classified as Kemasan!)
      const isKemasan = (
        cat.includes('KEMASAN') ||
        prod.startsWith('[D') ||
        prod.includes('KARPLAS') ||
        prod.includes('KEMASAN') ||
        prod.includes('INNER') ||
        prod.includes('OUTER') ||
        prod.includes('BENANG')
      );

      if (isKemasan) {
        accum[key].kemasanPack += qty;
        return;
      }

      // 2. Hasil Samping Check
      const isHasilSamping = (
        cat.includes('PRODUK SAMPINGAN') ||
        cat.includes('SAMPINGAN') ||
        cat.includes('HASIL SAMPING') ||
        prod.startsWith('[C') ||
        prod.includes('BROKEN') ||
        prod.includes('MENIR') ||
        prod.includes('BEKATUL') ||
        prod.includes('DEDAK') ||
        prod.includes('SEKAM') ||
        prod.includes('BUTIR RIJEK') ||
        prod.includes('KATAUT') ||
        prod.includes('SEKAM BAKAR')
      );

      if (isHasilSamping) {
        accum[key].hasilSampingKg += qty;
        return;
      }

      // 3. Gabah Check (GKP + GKG)
      const isGabah = (
        cat.includes('GKG') ||
        cat.includes('GKP') ||
        cat.includes('GABAH') ||
        prod.includes('GKG') ||
        prod.includes('GKP') ||
        prod.includes('GABAH') ||
        prod.startsWith('[A005')
      );

      if (isGabah) {
        accum[key].gabahKg += qty;
        return;
      }

      // 4. Beras Check (Beras Bahan Baku + Beras Jadi)
      const isBeras = (
        (cat === 'BERAS BAHAN BAKU' || cat.includes('BAHAN BAKU') || prod.startsWith('[A004') || (prod.includes('BERAS BAHAN BAKU') && !prod.includes('WIP'))) ||
        ((cat === 'BERAS JADI' || cat.includes('BERAS PREMIUM') || cat.includes('BERAS MEDIUM') || prod.startsWith('[B00')) && !cat.includes('BAHAN BAKU') && !prod.includes('BAHAN BAKU'))
      ) && !cat.includes('WIP') && !cat.includes('MAKLON') && !cat.includes('SAMPINGAN') && !cat.includes('KEMASAN');

      if (isBeras) {
        accum[key].berasKg += getInventoryRealQty(row, inventoryColumns);
        return;
      }
    });

    const rows = INFRASTRUCTURES.map(inf => {
      const d = accum[inf.key];
      return {
        ...inf,
        gabah: d.gabahKg > 0 ? Math.round(d.gabahKg / 1000) : 0,
        beras: d.berasKg > 0 ? Math.round(d.berasKg / 1000) : 0,
        kemasan: d.kemasanPack > 0 ? Math.round(d.kemasanPack) : 0,
        hasil: d.hasilSampingKg > 0 ? Math.round(d.hasilSampingKg) : 0,
      };
    });

    // Compute Group Totals
    const spbRows = rows.filter(r => r.group === 'SPB');
    const sppRows = rows.filter(r => r.group === 'SPP');
    const upRows = rows.filter(r => r.group === 'UP');

    const sumGroup = (items: typeof rows) => ({
      gabah: items.reduce((s, r) => s + r.gabah, 0),
      beras: items.reduce((s, r) => s + r.beras, 0),
      kemasan: items.reduce((s, r) => s + r.kemasan, 0),
      hasil: items.reduce((s, r) => s + r.hasil, 0),
    });

    const spbTotals = sumGroup(spbRows);
    const sppTotals = sumGroup(sppRows);
    const upTotals = sumGroup(upRows);

    const grandTotals = {
      gabah: spbTotals.gabah + sppTotals.gabah + upTotals.gabah,
      beras: spbTotals.beras + sppTotals.beras + upTotals.beras,
      kemasan: spbTotals.kemasan + sppTotals.kemasan + upTotals.kemasan,
      hasil: spbTotals.hasil + sppTotals.hasil + upTotals.hasil,
    };

    return {
      isDynamic: true,
      rows,
      spbTotals,
      sppTotals,
      upTotals,
      grandTotals
    };
  }, [inventoryData, inventoryColumns]);

  const { rows, spbTotals, sppTotals, upTotals, grandTotals } = tableData;
  const spbRows = rows.filter(r => r.group === 'SPB');
  const sppRows = rows.filter(r => r.group === 'SPP');
  const upRows = rows.filter(r => r.group === 'UP');

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-6 pt-2 pb-1 font-sans text-gray-800">
      
      {/* Header Logos */}
      <div className="flex justify-between items-center mt-1 mb-1.5 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-9 object-contain" />
        <div className="text-center pt-0.5">
          <h1 className="text-[25px] font-black text-black tracking-tight leading-tight uppercase font-sans">
            UPDATE PERSEDIAAN UB INDUSTRI
          </h1>
          <h2 className="text-[16.5px] font-bold text-[#548279] mt-0.5">{displayDate}</h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-9 object-contain" />
      </div>

      <div className="w-[85%] mx-auto flex-1 flex flex-col justify-start mt-1.5 overflow-hidden">
        <table className="w-full border-collapse border border-white text-[11px] leading-tight">
          <thead>
            <tr className="bg-[#0070c0] text-white font-bold">
              <th rowSpan={2} className="border border-white py-[1.5px] px-[3px] w-10 text-center">NO</th>
              <th rowSpan={2} className="border border-white py-[1.5px] px-[3px] w-10 text-center">RM</th>
              <th rowSpan={2} className="border border-white py-[1.5px] px-[3px] w-64 text-center">LOKASI</th>
              <th className="border border-white py-[1.5px] px-[3px] text-center w-28">GABAH</th>
              <th className="border border-white py-[1.5px] px-[3px] text-center w-28">BERAS</th>
              <th className="border border-white py-[1.5px] px-[3px] text-center w-36">KEMASAN</th>
              <th className="border border-white py-[1.5px] px-[3px] text-center w-36">HASIL SAMPING</th>
            </tr>
            <tr className="bg-[#0070c0] text-white font-bold">
              <th className="border border-white py-[1.5px] px-[3px] text-center">TON</th>
              <th className="border border-white py-[1.5px] px-[3px] text-center">TON</th>
              <th className="border border-white py-[1.5px] px-[3px] text-center">PACK</th>
              <th className="border border-white py-[1.5px] px-[3px] text-center">KG</th>
            </tr>
          </thead>
          <tbody>
            {/* Group A: SPB */}
            <tr className="bg-[#0070c0] text-white font-bold">
              <td className="border border-white px-[3px] py-[1.2px] text-center">A</td>
              <td className="border border-white px-[3px] py-[1.2px] text-center"></td>
              <td className="border border-white px-[3px] py-[1.2px]">SPB</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(spbTotals.gabah)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(spbTotals.beras)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(spbTotals.kemasan)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(spbTotals.hasil)}</td>
            </tr>
            {spbRows.map((row) => (
              <tr key={row.key} className="bg-[#e6edf4] text-black">
                <td className="border border-white px-[3px] py-[1.2px] text-center">{row.no}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-center">{row.rm}</td>
                <td className="border border-white px-[3px] py-[1.2px]">{row.displayName}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.gabah)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.beras)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.kemasan)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.hasil)}</td>
              </tr>
            ))}

            {/* Group B: SPP */}
            <tr className="bg-[#0070c0] text-white font-bold">
              <td className="border border-white px-[3px] py-[1.2px] text-center">B</td>
              <td className="border border-white px-[3px] py-[1.2px] text-center"></td>
              <td className="border border-white px-[3px] py-[1.2px]">SPP</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(sppTotals.gabah)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(sppTotals.beras)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(sppTotals.kemasan)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(sppTotals.hasil)}</td>
            </tr>
            {sppRows.map((row) => (
              <tr key={row.key} className="bg-[#e6edf4] text-black">
                <td className="border border-white px-[3px] py-[1.2px] text-center">{row.no}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-center">{row.rm}</td>
                <td className="border border-white px-[3px] py-[1.2px]">{row.displayName}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.gabah)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.beras)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.kemasan)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.hasil)}</td>
              </tr>
            ))}

            {/* Group C: UNIT PENGOLAHAN */}
            <tr className="bg-[#0070c0] text-white font-bold">
              <td className="border border-white px-[3px] py-[1.2px] text-center">C</td>
              <td className="border border-white px-[3px] py-[1.2px] text-center"></td>
              <td className="border border-white px-[3px] py-[1.2px]">UNIT PENGOLAHAN</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(upTotals.gabah)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(upTotals.beras)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(upTotals.kemasan)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(upTotals.hasil)}</td>
            </tr>
            {upRows.map((row) => (
              <tr key={row.key} className="bg-[#e6edf4] text-black">
                <td className="border border-white px-[3px] py-[1.2px] text-center">{row.no}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-center">{row.rm}</td>
                <td className="border border-white px-[3px] py-[1.2px]">{row.displayName}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.gabah)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.beras)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.kemasan)}</td>
                <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(row.hasil)}</td>
              </tr>
            ))}

            {/* Footers */}
            <tr className="bg-[#d9e6f3] text-black font-bold">
              <td colSpan={2} className="border border-white px-[3px] py-[1.2px]"></td>
              <td className="border border-white px-[3px] py-[1.2px]">TOTAL RTR</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(spbTotals.gabah)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(spbTotals.beras)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(spbTotals.kemasan)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(spbTotals.hasil)}</td>
            </tr>
            <tr className="bg-[#d9e6f3] text-black font-bold">
              <td colSpan={2} className="border border-white px-[3px] py-[1.2px]"></td>
              <td className="border border-white px-[3px] py-[1.2px]">TOTAL SPP</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(sppTotals.gabah)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(sppTotals.beras)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(sppTotals.kemasan)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(sppTotals.hasil)}</td>
            </tr>
            <tr className="bg-[#d9e6f3] text-black font-bold">
              <td colSpan={2} className="border border-white px-[3px] py-[1.2px]"></td>
              <td className="border border-white px-[3px] py-[1.2px]">TOTAL UP</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(upTotals.gabah)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(upTotals.beras)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(upTotals.kemasan)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(upTotals.hasil)}</td>
            </tr>
            <tr className="bg-[#0070c0] text-white font-bold">
              <td colSpan={2} className="border border-white px-[3px] py-[1.2px]"></td>
              <td className="border border-white px-[3px] py-[1.2px]">TOTAL</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(grandTotals.gabah)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(grandTotals.beras)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(grandTotals.kemasan)}</td>
              <td className="border border-white px-[3px] py-[1.2px] text-right">{renderCell(grandTotals.hasil)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-[85%] mx-auto mt-1 mb-1 text-[11px] italic text-black font-bold shrink-0">
        <p>*Data diperoleh dari laporan tarikan system ERP</p>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
