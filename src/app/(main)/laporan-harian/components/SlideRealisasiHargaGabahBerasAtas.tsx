import React from 'react';
import data from '../data/realisasiHargaGabahBerasAtas.json';
import { WAREHOUSE_METADATA, HISTORICAL_HARGA_PEMBELIAN_2026_DATA } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

interface SlideRealisasiHargaGabahBerasAtasProps {
  finalReportHargaPembelian?: any;
}

export default function SlideRealisasiHargaGabahBerasAtas({ finalReportHargaPembelian }: SlideRealisasiHargaGabahBerasAtasProps) {
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

  const latestMonthName = monthNames[latestMonth] || "JULI";
  const latestFullMonthName = fullMonthNames[latestMonth] || "JULI";

  const colSpanAll = pastMonths.length + weeks.length + 3;

  const SPB_GUDANGS = [
    'SPB JAKARTA',
    'SPB INDRAMAYU',
    'SPB SUKOHARJO',
    'SPB SIDOARJO',
    'SPB LOMBOK TIMUR',
    'SPB SIDRAP',
    'SPB MAKASSAR'
  ];

  const SPP_GUDANGS = [
    'SPP SUBANG',
    'SPP KARAWANG',
    'SPP LAMPUNG',
    'SPP KENDAL',
    'SPP SRAGEN',
    'SPP MAGETAN',
    'SPP BOJONEGORO',
    'SPP JEMBER',
    'SPP BANYUWANGI',
    'SPP SUMBAWA'
  ];

  const getPriceVal = (gudangKey: string, komoditi: string, bucket: string) => {
    const groupKey = gudangKey.startsWith('SPB') ? 'SPB' : 'SPP';
    const cleanKey = gudangKey.replace('SPB DKI JAKARTA', 'SPB JAKARTA');
    const v = finalData?.[groupKey]?.[cleanKey]?.[komoditi]?.[bucket]
           ?? finalData?.[groupKey]?.[gudangKey]?.[komoditi]?.[bucket];
    if (typeof v === 'number' && v > 0) return Math.round(v);
    if (bucket.startsWith('M_')) {
      const histVal = HISTORICAL_HARGA_PEMBELIAN_2026_DATA[cleanKey]?.[komoditi]?.[bucket]
                   ?? HISTORICAL_HARGA_PEMBELIAN_2026_DATA[gudangKey]?.[komoditi]?.[bucket];
      if (typeof histVal === 'number' && histVal > 0) return Math.round(histVal);
    }
    return null;
  };

  const getRealSdVal = (gudangKey: string, komoditi: string) => {
    return getPriceVal(gudangKey, komoditi, 'REAL_SD') 
        || getPriceVal(gudangKey, komoditi, `M_${latestMonth}`);
  };

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-4 pt-2 pb-1 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-center mt-1 mb-2 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-8 object-contain" />
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-[18px] font-black text-black tracking-tight leading-tight uppercase font-sans">
            REALISASI REKAPITULASI<br />HARGA PEMBELIAN GABAH DAN BERAS
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-8 object-contain" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-start px-[2px] mt-3.5 overflow-hidden">
        <table className="w-full border-collapse border border-white text-[8.5px] leading-tight">
          <thead>
            <tr className="bg-[#0070c0] text-white font-bold text-center">
              <th rowSpan={2} className="border border-white py-[1.2px] px-[2px] w-6">No</th>
              <th rowSpan={2} className="border border-white py-[1.2px] px-[2px] w-6">RM</th>
              <th rowSpan={2} className="border border-white py-[1.2px] px-[3px] w-32">LOKASI</th>
              {pastMonths.map(m => (
                <th key={m} className="border border-white py-[1.2px] px-[2px] w-12">{monthNames[m]}</th>
              ))}
              <th className="border border-white py-[1.2px] px-[2px] w-12">{latestMonthName}</th>
              <th colSpan={weeks.length} className="border border-white py-[1.2px] px-[2px]">MINGGUAN</th>
              <th rowSpan={2} className="border border-white py-[1.2px] px-[2px] w-14">REAL S/D<br/>{latestFullMonthName}</th>
            </tr>
            <tr className="bg-[#0070c0] text-white font-bold text-center">
              {pastMonths.map(m => (
                <th key={m} className="border border-white py-[1.2px] px-[2px]">Rp/KG</th>
              ))}
              <th className="border border-white py-[1.2px] px-[2px]">Rp/KG</th>
              {weeks.map(w => (
                <th key={w} className="border border-white py-[1.2px] px-[2px] w-14 whitespace-nowrap">
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
                      <td className="border border-white py-[0.7px] px-[2px]">{row.group}</td>
                      <td className="border border-white py-[0.7px] px-[2px]"></td>
                      <td colSpan={colSpanAll} className="border border-white py-[0.7px] px-[3px] text-left">{row.title}</td>
                    </tr>
                  );
                }

                if (row.type === 'spp_group') {
                  return (
                    <tr key={`spp-group-${i}`} className="bg-[#d9e6f3] text-black">
                      <td className="border border-white py-[0.7px] px-[2px] text-center font-bold">{row.no}</td>
                      <td className="border border-white py-[0.7px] px-[2px] text-center">{row.rm}</td>
                      <td colSpan={colSpanAll} className="border border-white py-[0.7px] px-[3px] text-left font-bold">{row.loc}</td>
                    </tr>
                  );
                }

                let bgRow = i % 2 === 0 ? "bg-[#e8f1fa]" : "bg-white";
                if (row.type === 'spp_sub') {
                   bgRow = row.loc === 'BERAS' ? "bg-white" : "bg-[#d9e6f3]"; 
                }

                return (
                  <tr key={`row-${i}`} className={`${bgRow} text-black`}>
                    <td className="border border-white py-[0.7px] px-[2px] text-center">{row.no || ''}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-center">{row.rm || ''}</td>
                    <td className={`border border-white py-[0.7px] px-[3px] ${row.type === 'spp_sub' ? 'pl-6' : ''}`}>
                      {row.loc}
                    </td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.jan)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.feb)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.mar)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.apr)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.mei)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.jun)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.jul)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.w1)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.w2)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.w3)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.w4)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right">{renderCell(row.w5)}</td>
                    <td className="border border-white py-[0.7px] px-[2px] text-right font-bold">{renderCell(row.real)}</td>
                  </tr>
                );
              })
            ) : (
              // Dynamic rendering for SPB and SPP
              <>
                {/* Group A: SPB */}
                <tr className="bg-[#0070c0] text-white font-bold text-center">
                  <td className="border border-white py-[0.7px] px-[2px]">A</td>
                  <td className="border border-white py-[0.7px] px-[2px]"></td>
                  <td colSpan={colSpanAll} className="border border-white py-[0.7px] px-[3px] text-left">
                    SPB
                  </td>
                </tr>

                {SPB_GUDANGS.map((gudang, idx) => {
                  const meta = WAREHOUSE_METADATA[gudang];
                  const rowNum = meta?.order || (idx + 1);
                  const rmVal = meta?.rm || '-';
                  const locName = gudang === 'SPB JAKARTA' ? 'SPB DKI JAKARTA' : gudang;
                  const bgRow = idx % 2 === 0 ? "bg-[#e8f1fa]" : "bg-white";

                  return (
                    <tr key={gudang} className={`${bgRow} text-black`}>
                      <td className="border border-white py-[0.7px] px-[2px] text-center">{rowNum}</td>
                      <td className="border border-white py-[0.7px] px-[2px] text-center">{rmVal}</td>
                      <td className="border border-white py-[0.7px] px-[3px] text-left font-medium">{locName}</td>
                      {pastMonths.map(m => (
                        <td key={`m-${m}`} className="border border-white py-[0.7px] px-[2px] text-right">
                          {renderVal(getPriceVal(gudang, 'BERAS', `M_${m}`))}
                        </td>
                      ))}
                      <td className="border border-white py-[0.7px] px-[2px] text-right">
                        {renderVal(getPriceVal(gudang, 'BERAS', `M_${latestMonth}`))}
                      </td>
                      {weeks.map(w => (
                        <td key={`w-${w}`} className="border border-white py-[0.7px] px-[2px] text-right">
                          {renderVal(getPriceVal(gudang, 'BERAS', w))}
                        </td>
                      ))}
                      <td className="border border-white py-[0.7px] px-[2px] text-right font-bold">
                        {renderVal(getRealSdVal(gudang, 'BERAS'), true)}
                      </td>
                    </tr>
                  );
                })}

                {/* Group B: SPP */}
                <tr className="bg-[#0070c0] text-white font-bold text-center">
                  <td className="border border-white py-[0.7px] px-[2px]">B</td>
                  <td className="border border-white py-[0.7px] px-[2px]"></td>
                  <td colSpan={colSpanAll} className="border border-white py-[0.7px] px-[3px] text-left">
                    SPP
                  </td>
                </tr>

                {SPP_GUDANGS.map((gudang, idx) => {
                  const meta = WAREHOUSE_METADATA[gudang];
                  const rowNum = meta?.order || (idx + 8);
                  const rmVal = meta?.rm || '-';

                  return (
                    <React.Fragment key={gudang}>
                      {/* SPP Warehouse Header */}
                      <tr className="bg-[#d9e6f3] text-black">
                        <td className="border border-white py-[0.7px] px-[2px] text-center font-bold">{rowNum}</td>
                        <td className="border border-white py-[0.7px] px-[2px] text-center">{rmVal}</td>
                        <td colSpan={colSpanAll} className="border border-white py-[0.7px] px-[3px] text-left font-bold">
                          {gudang}
                        </td>
                      </tr>

                      {/* SPP Subrow: BERAS */}
                      <tr className="bg-white text-black">
                        <td className="border border-white py-[0.7px] px-[2px] text-center"></td>
                        <td className="border border-white py-[0.7px] px-[2px] text-center"></td>
                        <td className="border border-white py-[0.7px] px-[3px] text-left pl-6 font-medium">BERAS</td>
                        {pastMonths.map(m => (
                          <td key={`m-beras-${m}`} className="border border-white py-[0.7px] px-[2px] text-right">
                            {renderVal(getPriceVal(gudang, 'BERAS', `M_${m}`))}
                          </td>
                        ))}
                        <td className="border border-white py-[0.7px] px-[2px] text-right">
                          {renderVal(getPriceVal(gudang, 'BERAS', `M_${latestMonth}`))}
                        </td>
                        {weeks.map(w => (
                          <td key={`w-beras-${w}`} className="border border-white py-[0.7px] px-[2px] text-right">
                            {renderVal(getPriceVal(gudang, 'BERAS', w))}
                          </td>
                        ))}
                        <td className="border border-white py-[0.7px] px-[2px] text-right font-bold">
                          {renderVal(getRealSdVal(gudang, 'BERAS'), true)}
                        </td>
                      </tr>

                      {/* SPP Subrow: GABAH */}
                      <tr className="bg-[#d9e6f3] text-black">
                        <td className="border border-white py-[0.7px] px-[2px] text-center"></td>
                        <td className="border border-white py-[0.7px] px-[2px] text-center"></td>
                        <td className="border border-white py-[0.7px] px-[3px] text-left pl-6 font-medium">GABAH</td>
                        {pastMonths.map(m => (
                          <td key={`m-gabah-${m}`} className="border border-white py-[0.7px] px-[2px] text-right">
                            {renderVal(getPriceVal(gudang, 'GABAH', `M_${m}`))}
                          </td>
                        ))}
                        <td className="border border-white py-[0.7px] px-[2px] text-right">
                          {renderVal(getPriceVal(gudang, 'GABAH', `M_${latestMonth}`))}
                        </td>
                        {weeks.map(w => (
                          <td key={`w-gabah-${w}`} className="border border-white py-[0.7px] px-[2px] text-right">
                            {renderVal(getPriceVal(gudang, 'GABAH', w))}
                          </td>
                        ))}
                        <td className="border border-white py-[0.7px] px-[2px] text-right font-bold">
                          {renderVal(getRealSdVal(gudang, 'GABAH'), true)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-[98%] mx-auto mt-1 mb-1 text-[9.5px] italic text-black font-bold shrink-0">
        <p>*Data berdasarkan laporan tarikan system ERP</p>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
