import React from 'react';
import data from '../data/realisasiHargaGabahBerasBawah.json';
import { WAREHOUSE_METADATA, HISTORICAL_HARGA_PEMBELIAN_2026_DATA } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

interface SlideRealisasiHargaGabahBerasBawahProps {
  finalReportHargaPembelian?: any;
}

export default function SlideRealisasiHargaGabahBerasBawah({ finalReportHargaPembelian }: SlideRealisasiHargaGabahBerasBawahProps) {
  const renderCell = (val: string | undefined) => {
    if (val === undefined) return null;
    if (val === '-') return <span className="text-center w-full block">-</span>;
    return val;
  };

  const renderVal = (num: number | null | undefined, isBold = false) => {
    if (!num || num === 0) return <span className="text-center w-full block">-</span>;
    return <span className={isBold ? "font-bold" : ""}>{Math.round(num).toLocaleString('id-ID')}</span>;
  };

  const isDynamic = !!(finalReportHargaPembelian && finalReportHargaPembelian.finalData);

  const pastMonths: number[] = isDynamic 
    ? finalReportHargaPembelian.pastMonths 
    : [0, 1, 2, 3, 4, 5];
  const latestMonth: number = isDynamic 
    ? finalReportHargaPembelian.latestMonth 
    : 6;
  const monthNames: string[] = isDynamic 
    ? finalReportHargaPembelian.monthNames 
    : ["JAN", "FEB", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGT", "SEPT", "OKT", "NOV", "DES"];
  const fullMonthNames: string[] = isDynamic 
    ? finalReportHargaPembelian.fullMonthNames 
    : ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
  const weeks: string[] = isDynamic 
    ? finalReportHargaPembelian.weeks 
    : ["W_1-5", "W_6-12", "W_13-19", "W_20-26", "W_27-31"];
  const finalData = isDynamic 
    ? finalReportHargaPembelian.finalData 
    : null;
  const finalTotals = isDynamic 
    ? finalReportHargaPembelian.finalTotals 
    : null;

  const latestMonthName = monthNames[latestMonth] || "JULI";
  const latestFullMonthName = fullMonthNames[latestMonth] || "JULI";

  const colSpanAll = pastMonths.length + weeks.length + 3;

  const UP_GUDANGS = [
    'UP BANTUL',
    'UP CANDIREJO',
    'UP MOJOLABAN',
    'UP LANCIRANG',
    'UP ANABANUA'
  ];

  const CDC_GUDANGS = [
    'CDC DOMPU',
    'CDC BOLMONG'
  ];

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

  const getPriceVal = (group: string, gudangKey: string, komoditi: string, bucket: string) => {
    const cleanKey = gudangKey === 'UP ANNABANUA' ? 'UP ANABANUA' : gudangKey;
    const v = finalData?.[group]?.[cleanKey]?.[komoditi]?.[bucket]
           ?? finalData?.[group]?.[gudangKey]?.[komoditi]?.[bucket];
    if (typeof v === 'number' && v > 0) return Math.round(v);
    if (bucket.startsWith('M_')) {
      const histVal = HISTORICAL_HARGA_PEMBELIAN_2026_DATA[cleanKey]?.[komoditi]?.[bucket]
                   ?? HISTORICAL_HARGA_PEMBELIAN_2026_DATA[gudangKey]?.[komoditi]?.[bucket];
      if (typeof histVal === 'number' && histVal > 0) return Math.round(histVal);
    }
    return null;
  };

  const getRealSdVal = (group: string, gudangKey: string, komoditi: string) => {
    return getPriceVal(group, gudangKey, komoditi, 'REAL_SD') 
        || getPriceVal(group, gudangKey, komoditi, `M_${latestMonth}`);
  };

  const getTotalVal = (key: string, bucket: string) => {
    const v = finalTotals?.[key]?.[bucket];
    if (typeof v === 'number' && v > 0) return Math.round(v);
    if (bucket.startsWith('M_')) {
      const histVal = HISTORICAL_HARGA_PEMBELIAN_2026_DATA['TOTALS']?.[key]?.[bucket];
      if (typeof histVal === 'number' && histVal > 0) return Math.round(histVal);
    }
    return null;
  };

  const getRealSdTotalVal = (key: string) => {
    return getTotalVal(key, 'REAL_SD') 
        || getTotalVal(key, `M_${latestMonth}`);
  };

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-5 pt-4 pb-3 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-center mt-2.5 mb-3 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center max-w-xl mx-auto pt-2">
          <h1 className="text-[21px] font-black text-black tracking-tight leading-snug uppercase font-sans">
            REALISASI REKAPITULASI<br />HARGA PEMBELIAN GABAH DAN BERAS
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
              <th className="border border-white py-[2px] px-[2px] w-12">{latestMonthName}</th>
              <th colSpan={weeks.length} className="border border-white py-[2px] px-[2px]">MINGGUAN</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[2px] w-14">REAL S/D<br/>{latestFullMonthName}</th>
            </tr>
            <tr className="bg-[#0070c0] text-white font-bold text-center">
              {pastMonths.map(m => (
                <th key={m} className="border border-white py-[2px] px-[2px]">Rp/KG</th>
              ))}
              <th className="border border-white py-[2px] px-[2px]">Rp/KG</th>
              {weeks.map(w => (
                <th key={w} className="border border-white py-[2px] px-[2px] w-14 whitespace-nowrap">
                  {w.replace('W_', '')} {latestFullMonthName}<br/>Rp/KG
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!isDynamic ? (
              // Fallback to static JSON baseline
              data.map((row: any, i: number) => {
                if (row.type === 'header') {
                  return (
                    <tr key={`header-${i}`} className="bg-[#0070c0] text-white font-bold text-center">
                      <td className="border border-white py-[1.2px] px-[2px]">{row.group}</td>
                      <td className="border border-white py-[1.2px] px-[2px]"></td>
                      <td colSpan={colSpanAll} className="border border-white py-[1.2px] px-[3px] text-left">{row.title}</td>
                    </tr>
                  );
                }

                if (row.type === 'spp_group') {
                  return (
                    <tr key={`spp-group-${i}`} className="bg-[#d9e6f3] text-black">
                      <td className="border border-white py-[1.2px] px-[2px] text-center font-bold">{row.no}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-center">{row.rm}</td>
                      <td colSpan={colSpanAll} className="border border-white py-[1.2px] px-[3px] text-left font-bold">{row.loc}</td>
                    </tr>
                  );
                }

                if (row.type === 'total_row') {
                  return (
                    <tr key={`total-row-${i}`} className="bg-[#d9e6f3] text-black font-bold">
                      <td colSpan={3} className="border border-white py-[1.2px] px-[3px] text-left">{row.loc}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jan)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.feb)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.mar)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.apr)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.mei)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jun)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jul)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w1)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w2)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w3)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w4)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w5)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right font-bold">{renderCell(row.real)}</td>
                    </tr>
                  );
                }
                
                if (row.type === 'grand_total') {
                  return (
                    <tr key={`grand-total-${i}`} className="bg-[#0070c0] text-white font-bold">
                      <td colSpan={3} className="border border-white py-[1.2px] px-[3px] text-left">{row.loc}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jan)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.feb)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.mar)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.apr)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.mei)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jun)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jul)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w1)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w2)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w3)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w4)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w5)}</td>
                      <td className="border border-white py-[1.2px] px-[2px] text-right font-bold">{renderCell(row.real)}</td>
                    </tr>
                  );
                }

                let bgRow = i % 2 === 0 ? "bg-[#e8f1fa]" : "bg-white";
                if (row.type === 'spp_sub') {
                   bgRow = row.loc === 'BERAS' ? "bg-white" : "bg-[#d9e6f3]"; 
                }

                return (
                  <tr key={`row-${i}`} className={`${bgRow} text-black`}>
                    <td className="border border-white py-[1.2px] px-[2px] text-center">{row.no || ''}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-center">{row.rm || ''}</td>
                    <td className={`border border-white py-[1.2px] px-[3px] ${row.type === 'spp_sub' ? 'pl-6' : ''}`}>
                      {row.loc}
                    </td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jan)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.feb)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.mar)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.apr)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.mei)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jun)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.jul)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w1)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w2)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w3)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w4)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right">{renderCell(row.w5)}</td>
                    <td className="border border-white py-[1.2px] px-[2px] text-right font-bold">{renderCell(row.real)}</td>
                  </tr>
                );
              })
            ) : (
              // Dynamic rendering for UP, CDC, and Summary rows
              <>
                {/* Group C: UNIT PENGOLAHAN */}
                <tr className="bg-[#0070c0] text-white font-bold text-center">
                  <td className="border border-white py-[1.2px] px-[2px]">C</td>
                  <td className="border border-white py-[1.2px] px-[2px]"></td>
                  <td colSpan={colSpanAll} className="border border-white py-[1.2px] px-[3px] text-left">
                    UNIT PENGOLAHAN
                  </td>
                </tr>

                {UP_GUDANGS.map((gudang, idx) => {
                  const meta = WAREHOUSE_METADATA[gudang] || (gudang === 'UP ANNABANUA' ? WAREHOUSE_METADATA['UP ANABANUA'] : undefined);
                  const rowNum = meta?.order || (idx + 18);
                  const rmVal = meta?.rm || 'II';
                  const displayName = gudang === 'UP ANABANUA' ? 'UP ANNABANUA' : gudang;

                  return (
                    <React.Fragment key={gudang}>
                      {/* UP Warehouse Header */}
                      <tr className="bg-[#d9e6f3] text-black">
                        <td className="border border-white py-[1.2px] px-[2px] text-center font-bold">{rowNum}</td>
                        <td className="border border-white py-[1.2px] px-[2px] text-center">{rmVal}</td>
                        <td colSpan={colSpanAll} className="border border-white py-[1.2px] px-[3px] text-left font-bold">
                          {displayName}
                        </td>
                      </tr>

                      {/* UP Subrow: BERAS */}
                      <tr className="bg-white text-black">
                        <td className="border border-white py-[1.2px] px-[2px] text-center"></td>
                        <td className="border border-white py-[1.2px] px-[2px] text-center"></td>
                        <td className="border border-white py-[1.2px] px-[3px] text-left pl-6 font-medium">BERAS</td>
                        {pastMonths.map(m => (
                          <td key={`m-beras-${m}`} className="border border-white py-[1.2px] px-[2px] text-right">
                            {renderVal(getPriceVal('UP', gudang, 'BERAS', `M_${m}`))}
                          </td>
                        ))}
                        <td className="border border-white py-[1.2px] px-[2px] text-right">
                          {renderVal(getPriceVal('UP', gudang, 'BERAS', `M_${latestMonth}`))}
                        </td>
                        {weeks.map(w => (
                          <td key={`w-beras-${w}`} className="border border-white py-[1.2px] px-[2px] text-right">
                            {renderVal(getPriceVal('UP', gudang, 'BERAS', w))}
                          </td>
                        ))}
                        <td className="border border-white py-[1.2px] px-[2px] text-right font-bold">
                          {renderVal(getRealSdVal('UP', gudang, 'BERAS'), true)}
                        </td>
                      </tr>

                      {/* UP Subrow: GABAH */}
                      <tr className="bg-[#d9e6f3] text-black">
                        <td className="border border-white py-[1.2px] px-[2px] text-center"></td>
                        <td className="border border-white py-[1.2px] px-[2px] text-center"></td>
                        <td className="border border-white py-[1.2px] px-[3px] text-left pl-6 font-medium">GABAH</td>
                        {pastMonths.map(m => (
                          <td key={`m-gabah-${m}`} className="border border-white py-[1.2px] px-[2px] text-right">
                            {renderVal(getPriceVal('UP', gudang, 'GABAH', `M_${m}`))}
                          </td>
                        ))}
                        <td className="border border-white py-[1.2px] px-[2px] text-right">
                          {renderVal(getPriceVal('UP', gudang, 'GABAH', `M_${latestMonth}`))}
                        </td>
                        {weeks.map(w => (
                          <td key={`w-gabah-${w}`} className="border border-white py-[1.2px] px-[2px] text-right">
                            {renderVal(getPriceVal('UP', gudang, 'GABAH', w))}
                          </td>
                        ))}
                        <td className="border border-white py-[1.2px] px-[2px] text-right font-bold">
                          {renderVal(getRealSdVal('UP', gudang, 'GABAH'), true)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}

                {/* Group D: CDC */}
                <tr className="bg-[#0070c0] text-white font-bold text-center">
                  <td className="border border-white py-[1.2px] px-[2px]">D</td>
                  <td className="border border-white py-[1.2px] px-[2px]"></td>
                  <td colSpan={colSpanAll} className="border border-white py-[1.2px] px-[3px] text-left">
                    CDC
                  </td>
                </tr>

                {CDC_GUDANGS.map((gudang, idx) => {
                  const meta = WAREHOUSE_METADATA[gudang];
                  const rowNum = meta?.order || (idx + 23);
                  const rmVal = meta?.rm || 'III';

                  return (
                    <React.Fragment key={gudang}>
                      {/* CDC Warehouse Header */}
                      <tr className="bg-[#d9e6f3] text-black">
                        <td className="border border-white py-[1.2px] px-[2px] text-center font-bold">{rowNum}</td>
                        <td className="border border-white py-[1.2px] px-[2px] text-center">{rmVal}</td>
                        <td colSpan={colSpanAll} className="border border-white py-[1.2px] px-[3px] text-left font-bold">
                          {gudang}
                        </td>
                      </tr>

                      {/* CDC Subrow: JAGUNG */}
                      <tr className="bg-white text-black">
                        <td className="border border-white py-[1.2px] px-[2px] text-center"></td>
                        <td className="border border-white py-[1.2px] px-[2px] text-center"></td>
                        <td className="border border-white py-[1.2px] px-[3px] text-left pl-6 font-medium">JAGUNG</td>
                        {pastMonths.map(m => (
                          <td key={`m-jagung-${m}`} className="border border-white py-[1.2px] px-[2px] text-right">
                            {renderVal(getPriceVal('CDC', gudang, 'JAGUNG', `M_${m}`))}
                          </td>
                        ))}
                        <td className="border border-white py-[1.2px] px-[2px] text-right">
                          {renderVal(getPriceVal('CDC', gudang, 'JAGUNG', `M_${latestMonth}`))}
                        </td>
                        {weeks.map(w => (
                          <td key={`w-jagung-${w}`} className="border border-white py-[1.2px] px-[2px] text-right">
                            {renderVal(getPriceVal('CDC', gudang, 'JAGUNG', w))}
                          </td>
                        ))}
                        <td className="border border-white py-[1.2px] px-[2px] text-right font-bold">
                          {renderVal(getRealSdVal('CDC', gudang, 'JAGUNG'), true)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}

                {/* Summary Rows */}
                {summaryRowDefs.map((row) => {
                  const bgRow = row.isGrand ? "bg-[#0070c0] text-white font-bold" : "bg-[#d9e6f3] text-black font-bold";

                  return (
                    <tr key={row.label} className={bgRow}>
                      <td colSpan={3} className="border border-white py-[1.2px] px-[3px] text-left">{row.label}</td>
                      {pastMonths.map(m => (
                        <td key={`m-sum-${m}`} className="border border-white py-[1.2px] px-[2px] text-right">
                          {renderVal(getTotalVal(row.key, `M_${m}`), row.isGrand)}
                        </td>
                      ))}
                      <td className="border border-white py-[1.2px] px-[2px] text-right">
                        {renderVal(getTotalVal(row.key, `M_${latestMonth}`), row.isGrand)}
                      </td>
                      {weeks.map(w => (
                        <td key={`w-sum-${w}`} className="border border-white py-[1.2px] px-[2px] text-right">
                          {renderVal(getTotalVal(row.key, w), row.isGrand)}
                        </td>
                      ))}
                      <td className="border border-white py-[1.2px] px-[2px] text-right font-bold">
                        {renderVal(getRealSdTotalVal(row.key), true)}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-[98%] mx-auto mt-auto mb-2 text-[11px] italic text-black font-bold">
        <p>*Data berdasarkan laporan tarikan system ERP</p>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
