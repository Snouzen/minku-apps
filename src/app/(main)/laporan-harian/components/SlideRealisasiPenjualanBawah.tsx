import React from 'react';
import data from '../data/realisasiPenjualanBawah.json';
import { WAREHOUSE_METADATA, TARGET_REALISASI_PENJUALAN_2026_DATA, TARGET_REALISASI_PENJUALAN_2026_TOTALS } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

interface SlideRealisasiPenjualanBawahProps {
  finalReportRealisasiPenjualan?: any;
}

export default function SlideRealisasiPenjualanBawah({ finalReportRealisasiPenjualan }: SlideRealisasiPenjualanBawahProps) {
  const renderCell = (val: string | undefined) => {
    if (val === undefined) return null;
    if (val === '-') return <span className="text-center w-full block">-</span>;
    return val;
  };

  const renderVal = (val: number, isBold = false) => {
    const rounded = Math.round(val || 0);
    if (rounded === 0) return <span className="text-center w-full block">-</span>;
    return <span className={isBold ? "font-bold" : ""}>{rounded.toLocaleString('id-ID')}</span>;
  };

  const renderTgt = (val: number) => {
    if (!val || val === 0) return <span className="text-center w-full block">-</span>;
    return val.toLocaleString('id-ID');
  };

  const renderPct = (realSd: number, tgt: number) => {
    if (tgt > 0 && realSd > 0) {
      return <span className="font-bold">{Math.round((realSd / tgt) * 100)}%</span>;
    }
    if (tgt > 0) {
      return <span className="font-bold">0%</span>;
    }
    return <span className="text-center w-full block font-bold">0%</span>;
  };

  const isDynamic = !!(finalReportRealisasiPenjualan && finalReportRealisasiPenjualan.finalData);

  const pastMonths: number[] = isDynamic
    ? finalReportRealisasiPenjualan.pastMonths
    : [0, 1, 2, 3, 4, 5];
  const latestMonth: number = isDynamic
    ? finalReportRealisasiPenjualan.latestMonth
    : 6;
  const monthNames: string[] = isDynamic
    ? finalReportRealisasiPenjualan.monthNames
    : ["JAN", "FEB", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGT", "SEPT", "OKT", "NOV", "DES"];
  const weeks: string[] = isDynamic
    ? finalReportRealisasiPenjualan.weeks
    : ["W_1-5", "W_6-12", "W_13-19", "W_20-26", "W_27-31"];
  const finalData = isDynamic
    ? finalReportRealisasiPenjualan.finalData
    : null;
  const finalTotals = isDynamic
    ? finalReportRealisasiPenjualan.finalTotals
    : null;
  const latestMonthName = isDynamic
    ? (monthNames[latestMonth] || "JULI")
    : "JULI";

  const colSpanAll = pastMonths.length + weeks.length + 5;

  const footerRowDefs = [
    { label: 'TOTAL PRODUK SPB', key: 'TOTAL PRODUK SPB', bg: 'bg-[#d9e6f3] text-black font-bold' },
    { label: 'TOTAL JASA SPB', key: 'TOTAL JASA SPB', bg: 'bg-[#d9e6f3] text-black font-bold' },
    { label: 'TOTAL PRODUK SPP', key: 'TOTAL PRODUK SPP', bg: 'bg-[#d9e6f3] text-black font-bold' },
    { label: 'TOTAL JASA SPP', key: 'TOTAL JASA SPP', bg: 'bg-[#d9e6f3] text-black font-bold' },
    { label: 'TOTAL PRODUK UP', key: 'TOTAL PRODUK UP', bg: 'bg-[#d9e6f3] text-black font-bold' },
    { label: 'TOTAL JASA UP', key: 'TOTAL JASA UP', bg: 'bg-[#d9e6f3] text-black font-bold' },
    { label: 'TOTAL PRODUK CDC', key: 'TOTAL PRODUK CDC', bg: 'bg-[#d9e6f3] text-black font-bold' },
    { label: 'TOTAL JASA CDC', key: 'TOTAL JASA CDC', bg: 'bg-[#d9e6f3] text-black font-bold' },
    { label: 'TOTAL PRODUK', key: 'TOTAL PRODUK', bg: 'bg-[#0070c0] text-white font-bold' },
    { label: 'TOTAL JASA', key: 'TOTAL JASA', bg: 'bg-[#0070c0] text-white font-bold' },
    { label: 'GRAND TOTAL', key: 'GRAND TOTAL', bg: 'bg-[#154674] text-white font-bold text-[9.5px]' }
  ];

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-4 pt-2 pb-1.5 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-center mb-2 mt-1 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-8 object-contain" />
        <div className="text-center">
          <h1 className="text-[20px] font-black text-black tracking-tight leading-tight uppercase">
            REALISASI PENJUALAN PRODUK DAN JASA
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-8 object-contain" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center px-[2px] overflow-hidden">
        <table className="w-full border-collapse border border-white text-[9px] leading-tight">
          <thead>
            <tr className="bg-[#0070c0] text-white font-bold text-center">
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-6">No</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-6">RM</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-32">LOKASI</th>
              {pastMonths.map(m => (
                <th key={m} className="border border-white py-[2px] px-[2px] w-12">{monthNames[m]}</th>
              ))}
              <th className="border border-white py-[2px] px-[2px] w-12">{latestMonthName}</th>
              <th colSpan={weeks.length} className="border border-white py-[2px] px-[2px]">MINGGUAN</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-14">REAL S/D<br/>{latestMonthName}</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-14">TGT 2026</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-14">VS TGT<br/>2026<br/>(%)</th>
            </tr>
            <tr className="bg-[#0070c0] text-white font-bold text-center">
              {pastMonths.map(m => (
                <th key={m} className="border border-white py-[2px] px-[2px]">(Rp Juta)</th>
              ))}
              <th className="border border-white py-[2px]">(Rp Juta)</th>
              {weeks.map(w => (
                <th key={w} className="border border-white py-[2px] px-[2px] w-12 whitespace-nowrap">
                  {w.replace('W_', '')} {latestMonthName}<br/>(Rp Juta)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!isDynamic ? (
              data.map((row: any, i: number) => {
                if (row.type === 'header') {
                  return (
                    <tr key={`header-${i}`} className="bg-[#0070c0] text-white font-bold text-center">
                      <td className="border border-white py-[1.5px] px-[2px]">{row.group}</td>
                      <td className="border border-white py-[1.5px] px-[2px]"></td>
                      <td colSpan={16} className="border border-white py-[1.5px] px-[3px] text-left">{row.title}</td>
                    </tr>
                  );
                }

                if (row.type === 'spp_group') {
                  return (
                    <tr key={`spp-group-${i}`} className="bg-[#d9e6f3] text-black">
                      <td className="border border-white py-[1.5px] px-[2px] text-center font-bold">{row.no}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-center">{row.rm}</td>
                      <td colSpan={16} className="border border-white py-[1.5px] px-[3px] text-left font-bold">{row.loc}</td>
                    </tr>
                  );
                }
                
                if (row.type === 'total_row') {
                  return (
                    <tr key={`total-row-${i}`} className="bg-[#d9e6f3] text-black font-bold">
                      <td colSpan={3} className="border border-white py-[1.5px] px-[3px] text-left">{row.loc}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jan)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.feb)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.mar)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.apr)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.mei)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jun)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jul)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w1)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w2)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w3)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w4)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w5)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right font-bold">{renderCell(row.real)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.tgt)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right font-bold">{renderCell(row.vs)}</td>
                    </tr>
                  );
                }
                
                if (row.type === 'grand_total') {
                  return (
                    <tr key={`grand-total-${i}`} className="bg-[#0070c0] text-white font-bold">
                      <td colSpan={3} className="border border-white py-[1.5px] px-[3px] text-left">{row.loc}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jan)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.feb)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.mar)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.apr)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.mei)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jun)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jul)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w1)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w2)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w3)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w4)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w5)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.real)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.tgt)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.vs)}</td>
                    </tr>
                  );
                }

                let bgRow = i % 2 === 0 ? "bg-[#e8f1fa]" : "bg-white";
                if (row.type === 'spp_sub') {
                   bgRow = row.loc === 'PRODUK' ? "bg-white" : "bg-[#d9e6f3]"; 
                }

                return (
                  <tr key={`row-${i}`} className={`${bgRow} text-black`}>
                    <td className="border border-white py-[1.5px] px-[2px] text-center">{row.no || ''}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-center">{row.rm || ''}</td>
                    <td className={`border border-white py-[1.5px] px-[3px] ${row.type === 'spp_sub' ? 'pl-6' : ''}`}>
                      {row.loc}
                    </td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jan)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.feb)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.mar)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.apr)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.mei)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jun)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.jul)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w1)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w2)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w3)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w4)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.w5)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right font-bold">{renderCell(row.real)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right">{renderCell(row.tgt)}</td>
                    <td className="border border-white py-[1.5px] px-[2px] text-right font-bold">{renderCell(row.vs)}</td>
                  </tr>
                );
              })
            ) : (
              <>
                {/* 1. Group C (UP) and Group D (CDC) */}
                {(['UP', 'CDC'] as const).map((group) => {
                  const groupData = finalData?.[group] || {};
                  const gudangList = Object.keys(groupData).sort((a, b) => {
                    const ordA = WAREHOUSE_METADATA[a]?.order ?? (a.includes('ANABANUA') ? 22 : a.includes('BOLMONG') || a.includes('MONGONDOW') ? 24 : 999);
                    const ordB = WAREHOUSE_METADATA[b]?.order ?? (b.includes('ANABANUA') ? 22 : b.includes('BOLMONG') || b.includes('MONGONDOW') ? 24 : 999);
                    if (ordA !== ordB) return ordA - ordB;
                    return a.localeCompare(b);
                  });
                  if (gudangList.length === 0) return null;

                  return (
                    <React.Fragment key={group}>
                      {/* Group Header Row */}
                      <tr className="bg-[#0070c0] text-white font-bold text-center">
                        <td className="border border-white py-[1.5px] px-[2px]">{group === 'UP' ? 'C' : 'D'}</td>
                        <td className="border border-white py-[1.5px] px-[2px]"></td>
                        <td colSpan={colSpanAll} className="border border-white py-[1.5px] px-[3px] text-left">
                          {group === 'UP' ? 'UNIT PENGOLAHAN' : 'CDC'}
                        </td>
                      </tr>

                      {/* Warehouses */}
                      {gudangList.map((gudang, idx) => {
                        const meta = WAREHOUSE_METADATA[gudang] 
                          || (gudang.includes('ANABANUA') ? WAREHOUSE_METADATA['UP ANABANUA'] : undefined)
                          || (gudang.includes('BOLMONG') || gudang.includes('MONGONDOW') ? WAREHOUSE_METADATA['CDC BOLMONG'] : undefined);
                        const rowNum = meta?.order || (idx + (group === 'UP' ? 18 : 23));
                        const rmVal = meta?.rm || (group === 'UP' ? (idx < 3 ? 'II' : 'III') : 'III');
                        const locName = gudang === 'UP ANABANUA' ? 'UP ANNABANUA' : (gudang === 'CDC BOLMONG' ? 'CDC BOLAANG MONGONDOW' : gudang);

                        const renderSubRow = (itemType: 'PRODUK' | 'JASA', bgClass: string) => {
                          const pastVals = pastMonths.map(m => groupData[gudang]?.[itemType]?.[`M_${m}`] || 0);
                          const activeMonthVal = weeks.reduce((sum: number, w: string) => sum + (groupData[gudang]?.[itemType]?.[w] || 0), 0);
                          const weekVals = weeks.map(w => groupData[gudang]?.[itemType]?.[w] || 0);
                          const pastSum = pastVals.reduce((sum: number, v: number) => sum + v, 0);
                          const realSd = pastSum + activeMonthVal;
                          const targetVal = TARGET_REALISASI_PENJUALAN_2026_DATA[gudang]?.[itemType]
                            ?? (gudang.includes('ANABANUA') ? TARGET_REALISASI_PENJUALAN_2026_DATA['UP ANABANUA']?.[itemType] : undefined)
                            ?? (gudang.includes('BOLMONG') || gudang.includes('MONGONDOW') ? TARGET_REALISASI_PENJUALAN_2026_DATA['CDC BOLMONG']?.[itemType] : undefined)
                            ?? 0;

                          return (
                            <tr key={`${gudang}-${itemType}`} className={`${bgClass} text-black`}>
                              <td className="border border-white py-[1.5px] px-[2px] text-center"></td>
                              <td className="border border-white py-[1.5px] px-[2px] text-center"></td>
                              <td className="border border-white py-[1.5px] px-[3px] pl-6 text-left">{itemType}</td>
                              {pastVals.map((val, mIdx) => (
                                <td key={`past-${mIdx}`} className="border border-white py-[1.5px] px-[2px] text-right">{renderVal(val)}</td>
                              ))}
                              <td className="border border-white py-[1.5px] px-[2px] text-right">{renderVal(activeMonthVal)}</td>
                              {weekVals.map((val, wIdx) => (
                                <td key={`week-${wIdx}`} className="border border-white py-[1.5px] px-[2px] text-right">{renderVal(val)}</td>
                              ))}
                              <td className="border border-white py-[1.5px] px-[2px] text-right font-bold">{renderVal(realSd, true)}</td>
                              <td className="border border-white py-[1.5px] px-[2px] text-right">{renderTgt(targetVal)}</td>
                              <td className="border border-white py-[1.5px] px-[2px] text-right font-bold">{renderPct(realSd, targetVal)}</td>
                            </tr>
                          );
                        };

                        return (
                          <React.Fragment key={gudang}>
                            {/* Gudang Header Row */}
                            <tr className="bg-[#d9e6f3] text-black">
                              <td className="border border-white py-[1.5px] px-[2px] text-center font-bold">{rowNum}</td>
                              <td className="border border-white py-[1.5px] px-[2px] text-center">{rmVal}</td>
                              <td colSpan={colSpanAll} className="border border-white py-[1.5px] px-[3px] text-left font-bold">{locName}</td>
                            </tr>
                            {/* PRODUK Subrow (bg-white) */}
                            {renderSubRow('PRODUK', 'bg-white')}
                            {/* JASA Subrow (bg-[#d9e6f3]) */}
                            {renderSubRow('JASA', 'bg-[#d9e6f3]')}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })}

                {/* 2. Summary Footers (Total Rows & Grand Total) */}
                {footerRowDefs.map(row => {
                  const pastVals = pastMonths.map(m => finalTotals?.[row.key]?.[`M_${m}`] || 0);
                  const activeMonthVal = finalTotals?.[row.key]?.[`M_${latestMonth}`] || 0;
                  const weekVals = weeks.map(w => finalTotals?.[row.key]?.[w] || 0);
                  const realSd = finalTotals?.[row.key]?.['REAL_SD'] || 0;
                  const tgtVal = TARGET_REALISASI_PENJUALAN_2026_TOTALS[row.key] || 0;

                  return (
                    <tr key={row.label} className={row.bg}>
                      <td colSpan={3} className="border border-white py-[1.5px] px-[3px] text-left">{row.label}</td>
                      {pastVals.map((val, mIdx) => (
                        <td key={`past-${mIdx}`} className="border border-white py-[1.5px] px-[2px] text-right">{renderVal(val)}</td>
                      ))}
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderVal(activeMonthVal)}</td>
                      {weekVals.map((val, wIdx) => (
                        <td key={`week-${wIdx}`} className="border border-white py-[1.5px] px-[2px] text-right">{renderVal(val)}</td>
                      ))}
                      <td className="border border-white py-[1.5px] px-[2px] text-right font-bold">{renderVal(realSd, true)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right">{renderTgt(tgtVal)}</td>
                      <td className="border border-white py-[1.5px] px-[2px] text-right font-bold">{renderPct(realSd, tgtVal)}</td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-[98%] mx-auto mt-auto mb-1 text-[9.5px] italic text-black font-bold shrink-0">
        <p>*Data berdasarkan laporan tarikan system ERP</p>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
