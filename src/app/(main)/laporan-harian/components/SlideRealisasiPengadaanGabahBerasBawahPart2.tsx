import React from 'react';
import data from '../data/realisasiGabahBerasBawahPart2.json';
import { WAREHOUSE_METADATA, TARGET_2026_DATA, TARGET_2026_TOTALS } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export default function SlideRealisasiPengadaanGabahBerasBawahPart2({ finalReportRealisasiPengadaan }: { finalReportRealisasiPengadaan?: any }) {
  const renderCell = (val: string | undefined) => {
    if (val === undefined) return null;
    if (val === '-') return <span className="text-center w-full block">-</span>;
    return val;
  };

  const renderVal = (num: number, isBold = false) => {
    if (!num || num === 0) return <span className="text-center w-full block">-</span>;
    return <span className={isBold ? "font-bold" : ""}>{num.toLocaleString('id-ID')}</span>;
  };

  const renderPct = (pct: string) => {
    if (!pct || pct === '-' || pct === '0%') return <span className="text-center w-full block">-</span>;
    return <span className="font-bold">{pct}</span>;
  };

  const isDynamic = !!finalReportRealisasiPengadaan;

  const pastMonths: number[] = isDynamic ? finalReportRealisasiPengadaan.pastMonths : [0, 1, 2, 3, 4, 5, 6];
  const monthNames: string[] = isDynamic ? finalReportRealisasiPengadaan.monthNames : ["JAN", "FEB", "MARET", "APRIL", "MEI", "JUNI", "JULI"];
  const weeks: string[] = isDynamic ? finalReportRealisasiPengadaan.weeks : ["W_1-5", "W_6-12", "W_13-19", "W_20-26", "W_27-31"];
  const latestMonth: number = isDynamic ? finalReportRealisasiPengadaan.latestMonth : 6;
  const latestMonthName = isDynamic ? (monthNames[latestMonth] || "JULI") : "JULI";
  const finalData = isDynamic ? finalReportRealisasiPengadaan.finalData : null;
  const finalTotals = isDynamic ? finalReportRealisasiPengadaan.finalTotals : null;

  const summaryRowDefs = [
    { label: 'TOTAL BERAS SPB', key: 'TOTAL BERAS SPB', isGrand: false },
    { label: 'TOTAL BERAS SPP', key: 'TOTAL BERAS SPP', isGrand: false },
    { label: 'TOTAL GABAH SPP', key: 'TOTAL GABAH SPP', isGrand: false },
    { label: 'TOTAL GABAH UP', key: 'TOTAL GABAH UP', isGrand: false },
    { label: 'TOTAL BERAS UP', key: 'TOTAL BERAS UP', isGrand: false },
    { label: 'TOTAL JAGUNG', key: 'TOTAL JAGUNG', isGrand: false },
    { label: 'JUMLAH BERAS', key: 'JUMLAH BERAS', isGrand: true },
    { label: 'JUMLAH GABAH', key: 'JUMLAH GABAH', isGrand: true },
    { label: 'JUMLAH JAGUNG', key: 'TOTAL JAGUNG', isGrand: true }
  ];

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-5 pt-4 pb-3 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-center mt-2.5 mb-3 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center max-w-xl mx-auto pt-2">
          <h1 className="text-[21px] font-black text-black tracking-tight leading-snug uppercase font-sans">
            REALISASI REKAPITULASI<br />PENGADAAN GABAH DAN BERAS
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center px-[2px]">
        <table className="w-full border-collapse border border-white text-[8px] leading-tight">
          <thead>
            <tr className="bg-[#0070c0] text-white font-bold text-center">
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-6">No</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-6">RM</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[3px] w-32">LOKASI</th>
              {pastMonths.map(m => (
                <th key={m} className="border border-white py-[2px] px-[2px] w-12">{monthNames[m]}</th>
              ))}
              <th colSpan={weeks.length} className="border border-white py-[2px] px-[2px]">MINGGUAN</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-14">REAL S/D<br/>{latestMonthName}</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-14">TARGET<br/>2026</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-14">VS TGT<br/>2026 (%)</th>
            </tr>
            <tr className="bg-[#0070c0] text-white font-bold text-center">
              {pastMonths.map(m => (
                <th key={m} className="border border-white py-[2px] px-[2px]">TON</th>
              ))}
              {weeks.map(w => (
                <th key={w} className="border border-white py-[2px] px-[2px] w-14 whitespace-nowrap">
                  {w.replace('W_', '')} {latestMonthName}<br/>TON
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isDynamic ? (
              <>
                {['UP', 'CDC'].map((group) => {
                  const groupData = finalData?.[group] || {};
                  const gudangList = Object.keys(groupData).sort((a, b) => {
                    const ordA = WAREHOUSE_METADATA[a]?.order ?? (a.includes('ANABANUA') || a.includes('ANNABANUA') ? 22 : 999);
                    const ordB = WAREHOUSE_METADATA[b]?.order ?? (b.includes('ANABANUA') || b.includes('ANNABANUA') ? 22 : 999);
                    if (ordA !== ordB) return ordA - ordB;
                    return a.localeCompare(b);
                  });
                  if (gudangList.length === 0) return null;

                  const colSpanAll = 1 + pastMonths.length + weeks.length + 3;

                  return (
                    <React.Fragment key={group}>
                      {/* Group Header Row */}
                      <tr className="bg-[#0070c0] text-white font-bold text-center">
                        <td className="border border-white py-[2px] px-[2px]">{group === 'UP' ? 'C' : 'D'}</td>
                        <td className="border border-white py-[2px] px-[2px]"></td>
                        <td colSpan={colSpanAll} className="border border-white py-[2px] px-[3px] text-left">
                          {group === 'UP' ? 'UNIT PENGOLAHAN' : 'CDC'}
                        </td>
                      </tr>

                      {/* Warehouses */}
                      {gudangList.map((gudang, idx) => {
                        const meta = WAREHOUSE_METADATA[gudang] || (gudang === 'UP ANNABANUA' ? WAREHOUSE_METADATA['UP ANABANUA'] : undefined);
                        const rowNum = meta?.order || (idx + (group === 'UP' ? 18 : 23));
                        const rmVal = meta?.rm || '-';
                        const displayName = gudang === 'UP ANABANUA' ? 'UP ANNABANUA' : gudang;

                        if (group === 'CDC') {
                          const monthVals = pastMonths.map(m => {
                            if (m === latestMonth) {
                              return weeks.reduce((sum: number, w: string) => {
                                return sum + Math.round((groupData[gudang]?.['JAGUNG']?.[w] || 0) / 1000);
                              }, 0);
                            }
                            return Math.round((groupData[gudang]?.['JAGUNG']?.[`M_${m}`] || 0) / 1000);
                          });

                          const weekVals = weeks.map(w => {
                            return Math.round((groupData[gudang]?.['JAGUNG']?.[w] || 0) / 1000);
                          });

                          let totalTon = 0;
                          for (let m = 0; m <= latestMonth; m++) {
                            if (m === latestMonth) {
                              totalTon += weeks.reduce((sum: number, w: string) => sum + Math.round((groupData[gudang]?.['JAGUNG']?.[w] || 0) / 1000), 0);
                            } else {
                              totalTon += Math.round((groupData[gudang]?.['JAGUNG']?.[`M_${m}`] || 0) / 1000);
                            }
                          }

                          const targetTon = TARGET_2026_DATA[gudang]?.['JAGUNG'] || 0;
                          const vsTgtPct = targetTon > 0 && totalTon > 0 ? `${Math.round((totalTon / targetTon) * 100)}%` : "-";

                          return (
                            <React.Fragment key={gudang}>
                              <tr className="bg-[#d9e6f3] text-black">
                                <td className="border border-white py-[2px] px-[2px] text-center font-bold">{rowNum}</td>
                                <td className="border border-white py-[2px] px-[2px] text-center">{rmVal}</td>
                                <td colSpan={colSpanAll} className="border border-white py-[2px] px-[3px] text-left font-bold">{displayName}</td>
                              </tr>
                              <tr className="bg-white text-black">
                                <td className="border border-white py-[2px] px-[2px] text-center"></td>
                                <td className="border border-white py-[2px] px-[2px] text-center"></td>
                                <td className="border border-white py-[2px] px-[3px] pl-6 text-left">JAGUNG</td>
                                {monthVals.map((val, mIdx) => (
                                  <td key={`m-${mIdx}`} className="border border-white py-[2px] px-[2px] text-right">{renderVal(val)}</td>
                                ))}
                                {weekVals.map((val, wIdx) => (
                                  <td key={`w-${wIdx}`} className="border border-white py-[2px] px-[2px] text-right">{renderVal(val)}</td>
                                ))}
                                <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderVal(totalTon, true)}</td>
                                <td className="border border-white py-[2px] px-[2px] text-right">{renderVal(targetTon)}</td>
                                <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderPct(vsTgtPct)}</td>
                              </tr>
                            </React.Fragment>
                          );
                        }

                        // UP Unit (Group header + BERAS subrow + GABAH subrow)
                        const renderCommodityRow = (komoditi: 'BERAS' | 'GABAH', bgClass: string) => {
                          const monthVals = pastMonths.map(m => {
                            if (m === latestMonth) {
                              return weeks.reduce((sum: number, w: string) => {
                                return sum + Math.round((groupData[gudang]?.[komoditi]?.[w] || 0) / 1000);
                              }, 0);
                            }
                            return Math.round((groupData[gudang]?.[komoditi]?.[`M_${m}`] || 0) / 1000);
                          });

                          const weekVals = weeks.map(w => {
                            return Math.round((groupData[gudang]?.[komoditi]?.[w] || 0) / 1000);
                          });

                          let totalTon = 0;
                          for (let m = 0; m <= latestMonth; m++) {
                            if (m === latestMonth) {
                              totalTon += weeks.reduce((sum: number, w: string) => sum + Math.round((groupData[gudang]?.[komoditi]?.[w] || 0) / 1000), 0);
                            } else {
                              totalTon += Math.round((groupData[gudang]?.[komoditi]?.[`M_${m}`] || 0) / 1000);
                            }
                          }

                          const targetTon = TARGET_2026_DATA[gudang]?.[komoditi] || (gudang === 'UP ANNABANUA' ? TARGET_2026_DATA['UP ANABANUA']?.[komoditi] : 0) || 0;
                          const vsTgtPct = targetTon > 0 && totalTon > 0 ? `${Math.round((totalTon / targetTon) * 100)}%` : "-";

                          return (
                            <tr key={`${gudang}-${komoditi}`} className={`${bgClass} text-black`}>
                              <td className="border border-white py-[2px] px-[2px] text-center"></td>
                              <td className="border border-white py-[2px] px-[2px] text-center"></td>
                              <td className="border border-white py-[2px] px-[3px] pl-6 text-left">{komoditi}</td>
                              {monthVals.map((val, mIdx) => (
                                <td key={`m-${mIdx}`} className="border border-white py-[2px] px-[2px] text-right">{renderVal(val)}</td>
                              ))}
                              {weekVals.map((val, wIdx) => (
                                <td key={`w-${wIdx}`} className="border border-white py-[2px] px-[2px] text-right">{renderVal(val)}</td>
                              ))}
                              <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderVal(totalTon, true)}</td>
                              <td className="border border-white py-[2px] px-[2px] text-right">{renderVal(targetTon)}</td>
                              <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderPct(vsTgtPct)}</td>
                            </tr>
                          );
                        };

                        return (
                          <React.Fragment key={gudang}>
                            <tr className="bg-[#d9e6f3] text-black">
                              <td className="border border-white py-[2px] px-[2px] text-center font-bold">{rowNum}</td>
                              <td className="border border-white py-[2px] px-[2px] text-center">{rmVal}</td>
                              <td colSpan={colSpanAll} className="border border-white py-[2px] px-[3px] text-left font-bold">{displayName}</td>
                            </tr>
                            {renderCommodityRow('BERAS', 'bg-white')}
                            {renderCommodityRow('GABAH', 'bg-[#d9e6f3]')}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })}

                {/* Summary Rows */}
                {summaryRowDefs.map((row) => {
                  const monthVals = pastMonths.map(m => finalTotals?.[row.key]?.[`M_${m}`] || 0);
                  const weekVals = weeks.map(w => finalTotals?.[row.key]?.[w] || 0);
                  let totalTon = 0;
                  for (let m = 0; m <= latestMonth; m++) {
                    if (m === latestMonth) {
                      totalTon += weeks.reduce((sum: number, w: string) => sum + (finalTotals?.[row.key]?.[w] || 0), 0);
                    } else {
                      totalTon += (finalTotals?.[row.key]?.[`M_${m}`] || 0);
                    }
                  }
                  const targetTon = TARGET_2026_TOTALS[row.label] || TARGET_2026_TOTALS[row.key] || (row.label === 'JUMLAH JAGUNG' ? TARGET_2026_TOTALS['TOTAL JAGUNG'] : 0) || 0;
                  const vsTgtPct = targetTon > 0 && totalTon > 0 ? `${Math.round((totalTon / targetTon) * 100)}%` : "-";
                  const bgRow = row.isGrand ? "bg-[#0070c0] text-white font-bold" : "bg-[#d9e6f3] text-black font-bold";

                  return (
                    <tr key={row.label} className={bgRow}>
                      <td colSpan={3} className="border border-white py-[2px] px-[3px] text-left">{row.label}</td>
                      {monthVals.map((val, mIdx) => (
                        <td key={`m-${mIdx}`} className="border border-white py-[2px] px-[2px] text-right">{renderVal(val, row.isGrand)}</td>
                      ))}
                      {weekVals.map((val, wIdx) => (
                        <td key={`w-${wIdx}`} className="border border-white py-[2px] px-[2px] text-right">{renderVal(val, row.isGrand)}</td>
                      ))}
                      <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderVal(totalTon, true)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderVal(targetTon, row.isGrand)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderPct(vsTgtPct)}</td>
                    </tr>
                  );
                })}
              </>
            ) : (
              data.map((row, i) => {
                if (row.type === 'header') {
                  return (
                    <tr key={`header-${i}`} className="bg-[#0070c0] text-white font-bold text-center">
                      <td className="border border-white py-[2px] px-[2px]">{row.group}</td>
                      <td className="border border-white py-[2px] px-[2px]"></td>
                      <td colSpan={16} className="border border-white py-[2px] px-[3px] text-left">{row.title}</td>
                    </tr>
                  );
                }

                if (row.type === 'spp_group') {
                  return (
                    <tr key={`spp-group-${i}`} className="bg-[#d9e6f3] text-black">
                      <td className="border border-white py-[2px] px-[2px] text-center font-bold">{row.no}</td>
                      <td className="border border-white py-[2px] px-[2px] text-center">{row.rm}</td>
                      <td colSpan={16} className="border border-white py-[2px] px-[3px] text-left font-bold">{row.loc}</td>
                    </tr>
                  );
                }
                
                if (row.type === 'total_row') {
                  return (
                    <tr key={`total-row-${i}`} className="bg-[#d9e6f3] text-black font-bold">
                      <td colSpan={3} className="border border-white py-[2px] px-[3px] text-left">{row.loc}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jan)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.feb)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.mar)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.apr)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.mei)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jun)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jul)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w1)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w2)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w3)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w4)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w5)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.real)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.tgt)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.vs)}</td>
                    </tr>
                  );
                }
                
                if (row.type === 'grand_total') {
                  return (
                    <tr key={`grand-total-${i}`} className="bg-[#0070c0] text-white font-bold">
                      <td colSpan={3} className="border border-white py-[2px] px-[3px] text-left">{row.loc}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jan)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.feb)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.mar)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.apr)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.mei)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jun)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jul)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w1)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w2)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w3)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w4)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w5)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.real)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.tgt)}</td>
                      <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.vs)}</td>
                    </tr>
                  );
                }

                let bgRow = i % 2 === 0 ? "bg-[#e8f1fa]" : "bg-white";
                if (row.type === 'spp_sub') {
                   bgRow = row.loc === 'BERAS' || row.loc === 'JAGUNG' ? "bg-white" : "bg-[#d9e6f3]"; 
                }

                return (
                  <tr key={`row-${i}`} className={`${bgRow} text-black`}>
                    <td className="border border-white py-[2px] px-[2px] text-center">{row.no || ''}</td>
                    <td className="border border-white py-[2px] px-[2px] text-center">{row.rm || ''}</td>
                    <td className={`border border-white py-[2px] px-[3px] ${row.type === 'spp_sub' ? 'pl-6' : ''}`}>
                      {row.loc}
                    </td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jan)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.feb)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.mar)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.apr)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.mei)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jun)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.jul)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w1)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w2)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w3)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w4)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.w5)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderCell(row.real)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right">{renderCell(row.tgt)}</td>
                    <td className="border border-white py-[2px] px-[2px] text-right font-bold">{renderCell(row.vs)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="w-[98%] mx-auto mt-2 mb-1 text-[11px] italic text-black font-bold shrink-0">
        <p>*Data berdasarkan laporan tarikan system ERP</p>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
