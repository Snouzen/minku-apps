import React, { useMemo } from 'react';
import { 
  TARGET_2026_RM, 
  TARGET_2026_TOTALS, 
  TARGET_REALISASI_PENJUALAN_2026_TOTALS, 
  WAREHOUSE_METADATA 
} from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export interface SlideRealisasiOperasionalRegionalProps {
  finalReportRealisasiPengadaan?: any;
  finalReportRealisasiPenjualan?: any;
}

const TARGET_PENJUALAN_RM: Record<string, { PRODUK: number; JASA: number; SUBTOTAL: number }> = {
  'RM I': { PRODUK: 229519, JASA: 1320, SUBTOTAL: 230839 },
  'RM II': { PRODUK: 350659, JASA: 10152, SUBTOTAL: 360811 },
  'RM III': { PRODUK: 174212, JASA: 14769, SUBTOTAL: 188982 },
};

export default function SlideRealisasiOperasionalRegional({
  finalReportRealisasiPengadaan,
  finalReportRealisasiPenjualan
}: SlideRealisasiOperasionalRegionalProps) {

  const renderVal = (num: number | null | undefined, isBold = false) => {
    if (num === null || num === undefined || num === 0) return <span className="text-center w-full block">-</span>;
    return <span className={isBold ? "font-bold" : ""}>{Math.round(num).toLocaleString('en-US')}</span>;
  };

  // --- TABLE 1: PENGADAAN (from Report 1 Tab R. Pengadaan UB) ---
  const isPengadaanDynamic = !!(finalReportRealisasiPengadaan && finalReportRealisasiPengadaan.rmData);

  const pPastMonths: number[] = isPengadaanDynamic
    ? finalReportRealisasiPengadaan.pastMonths
    : [0, 1, 2, 3, 4, 5, 6];
  const pLatestMonth: number = isPengadaanDynamic
    ? finalReportRealisasiPengadaan.latestMonth
    : 6;
  const pMonthNames: string[] = isPengadaanDynamic
    ? finalReportRealisasiPengadaan.monthNames
    : ["JAN", "FEB", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGT", "SEPT", "OKT", "NOV", "DES"];
  const pFullMonthNames: string[] = isPengadaanDynamic
    ? finalReportRealisasiPengadaan.fullMonthNames
    : ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
  const pWeeks: string[] = isPengadaanDynamic
    ? finalReportRealisasiPengadaan.weeks
    : ["W_1-5", "W_6-12", "W_13-19", "W_20-26", "W_27-31"];
  const pRmData = isPengadaanDynamic
    ? finalReportRealisasiPengadaan.rmData
    : null;
  const pFinalTotals = isPengadaanDynamic
    ? finalReportRealisasiPengadaan.finalTotals
    : null;

  const pLatestFullMonthName = pFullMonthNames[pLatestMonth] || "JULI";
  const pColSpanAll = pPastMonths.length + pWeeks.length + 3;

  const rmList = [
    { no: 1, rm: 'RM I' },
    { no: 2, rm: 'RM II' },
    { no: 3, rm: 'RM III' },
  ];
  const pKomoditiList = ['GABAH', 'BERAS', 'JAGUNG'];

  const footerPengadaanDefs = [
    { label: 'JUMLAH BERAS', key: 'JUMLAH BERAS', target: TARGET_2026_TOTALS['JUMLAH BERAS'] || 37130 },
    { label: 'JUMLAH GABAH', key: 'JUMLAH GABAH', target: TARGET_2026_TOTALS['JUMLAH GABAH'] || 77290 },
    { label: 'JUMLAH JAGUNG', key: 'TOTAL JAGUNG', target: TARGET_2026_TOTALS['TOTAL JAGUNG'] || 2700 },
  ];

  // Baseline Fallback Pengadaan Data
  const baselinePengadaan = [
    { type: 'header', no: '1', lokasi: 'RM I' },
    { type: 'row', no: '', lokasi: 'GABAH', jan: '552', feb: '1,903', mar: '3,108', apr: '4,167', mei: '2,824', jun: '3,380', jul: '1,255', w1: '208', w2: '79', w3: '19', w4: '-', w5: '85', real: '17,190', tgt: '27,500', vs: '63%' },
    { type: 'row', no: '', lokasi: 'BERAS', jan: '555', feb: '715', mar: '180', apr: '879', mei: '528', jun: '436', jul: '683', w1: '182', w2: '201', w3: '178', w4: '84', w5: '39', real: '3,975', tgt: '9,100', vs: '44%' },
    { type: 'row', no: '', lokasi: 'JAGUNG', jan: '-', feb: '-', mar: '-', apr: '-', mei: '-', jun: '-', jul: '-', w1: '-', w2: '-', w3: '-', w4: '-', w5: '-', real: '-', tgt: '-', vs: '-' },
    { type: 'header', no: '2', lokasi: 'RM II' },
    { type: 'row', no: '', lokasi: 'GABAH', jan: '625', feb: '8,434', mar: '11,537', apr: '5,774', mei: '1,127', jun: '1,432', jul: '2,092', w1: '232', w2: '586', w3: '842', w4: '266', w5: '166', real: '31,021', tgt: '49,230', vs: '63%' },
    { type: 'row', no: '', lokasi: 'BERAS', jan: '979', feb: '1,810', mar: '1,434', apr: '2,082', mei: '1,289', jun: '2,915', jul: '4,307', w1: '574', w2: '850', w3: '937', w4: '1,095', w5: '850', real: '14,827', tgt: '19,080', vs: '78%' },
    { type: 'row', no: '', lokasi: 'JAGUNG', jan: '-', feb: '-', mar: '-', apr: '-', mei: '-', jun: '-', jul: '-', w1: '-', w2: '-', w3: '-', w4: '-', w5: '-', real: '-', tgt: '1,350', vs: '-' },
    { type: 'header', no: '3', lokasi: 'RM III' },
    { type: 'row', no: '', lokasi: 'GABAH', jan: '-', feb: '58', mar: '143', apr: '56', mei: '-', jun: '19', jul: '358', w1: '-', w2: '29', w3: '89', w4: '179', w5: '61', real: '633', tgt: '560', vs: '113%' },
    { type: 'row', no: '', lokasi: 'BERAS', jan: '10', feb: '1,857', mar: '885', apr: '441', mei: '351', jun: '463', jul: '788', w1: '62', w2: '218', w3: '195', w4: '172', w5: '150', real: '4,816', tgt: '8,950', vs: '54%' },
    { type: 'row', no: '', lokasi: 'JAGUNG', jan: '-', feb: '-', mar: '-', apr: '-', mei: '-', jun: '-', jul: '-', w1: '-', w2: '-', w3: '-', w4: '-', w5: '-', real: '-', tgt: '1,350', vs: '-' },
    { type: 'footer', no: '', lokasi: 'JUMLAH BERAS', jan: '1,544', feb: '4,382', mar: '2,499', apr: '3,401', mei: '2,168', jun: '3,814', jul: '5,789', w1: '818', w2: '1,279', w3: '1,310', w4: '1,342', w5: '1,039', real: '23,617', tgt: '37,130', vs: '64%' },
    { type: 'footer', no: '', lokasi: 'JUMLAH GABAH', jan: '1,177', feb: '10,395', mar: '14,788', apr: '9,987', mei: '3,951', jun: '4,841', jul: '3,704', w1: '441', w2: '694', w3: '950', w4: '444', w5: '312', real: '48,844', tgt: '77,290', vs: '63%' },
    { type: 'footer', no: '', lokasi: 'JUMLAH JAGUNG', jan: '-', feb: '-', mar: '-', apr: '-', mei: '-', jun: '-', jul: '-', w1: '-', w2: '-', w3: '-', w4: '-', w5: '-', real: '-', tgt: '2,700', vs: '0%' },
  ];

  // --- TABLE 2: PENJUALAN (from Report 6 Realisasi Penjualan) ---
  const isPenjualanDynamic = !!(finalReportRealisasiPenjualan && finalReportRealisasiPenjualan.finalData);

  const sPastMonths: number[] = isPenjualanDynamic
    ? finalReportRealisasiPenjualan.pastMonths
    : [0, 1, 2, 3, 4, 5, 6];
  const sLatestMonth: number = isPenjualanDynamic
    ? finalReportRealisasiPenjualan.latestMonth
    : 6;
  const sMonthNames: string[] = isPenjualanDynamic
    ? finalReportRealisasiPenjualan.monthNames
    : ["JAN", "FEB", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGT", "SEPT", "OKT", "NOV", "DES"];
  const sFullMonthNames: string[] = isPenjualanDynamic
    ? finalReportRealisasiPenjualan.fullMonthNames
    : ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
  const sWeeks: string[] = isPenjualanDynamic
    ? finalReportRealisasiPenjualan.weeks
    : ["W_1-5", "W_6-12", "W_13-19", "W_20-26", "W_27-31"];
  const sFinalTotals = isPenjualanDynamic
    ? finalReportRealisasiPenjualan.finalTotals
    : null;

  const sLatestFullMonthName = sFullMonthNames[sLatestMonth] || "JULI";
  const sColSpanAll = sPastMonths.length + sWeeks.length + 3;

  // Aggregate Sales by RM dynamically
  const sRmData = useMemo(() => {
    if (!isPenjualanDynamic) return null;

    const { finalData } = finalReportRealisasiPenjualan;
    const rmMap: Record<string, {
      PRODUK: Record<string, number>;
      JASA: Record<string, number>;
    }> = {
      'RM I': { PRODUK: {}, JASA: {} },
      'RM II': { PRODUK: {}, JASA: {} },
      'RM III': { PRODUK: {}, JASA: {} },
    };

    ['RM I', 'RM II', 'RM III'].forEach(rm => {
      sPastMonths.forEach((m: number) => {
        rmMap[rm].PRODUK[`M_${m}`] = 0;
        rmMap[rm].JASA[`M_${m}`] = 0;
      });
      sWeeks.forEach((w: string) => {
        rmMap[rm].PRODUK[w] = 0;
        rmMap[rm].JASA[w] = 0;
      });
      rmMap[rm].PRODUK[`M_${sLatestMonth}`] = 0;
      rmMap[rm].JASA[`M_${sLatestMonth}`] = 0;
    });

    ['SPB', 'SPP', 'UP', 'CDC'].forEach(grp => {
      const gData = finalData[grp] || {};
      Object.keys(gData).forEach(gudang => {
        const rawRm = WAREHOUSE_METADATA[gudang]?.rm;
        if (!rawRm) return;
        const rm = rawRm.startsWith('RM') ? rawRm : `RM ${rawRm}`;
        if (!rmMap[rm]) return;

        const prodObj = gData[gudang]?.PRODUK || {};
        const jasaObj = gData[gudang]?.JASA || {};

        sPastMonths.forEach((m: number) => {
          const k = `M_${m}`;
          rmMap[rm].PRODUK[k] += (prodObj[k] || 0);
          rmMap[rm].JASA[k] += (jasaObj[k] || 0);
        });

        sWeeks.forEach((w: string) => {
          rmMap[rm].PRODUK[w] += (prodObj[w] || 0);
          rmMap[rm].JASA[w] += (jasaObj[w] || 0);
        });

        const curProdActive = sWeeks.reduce((sum: number, w: string) => sum + (prodObj[w] || 0), 0);
        const curJasaActive = sWeeks.reduce((sum: number, w: string) => sum + (jasaObj[w] || 0), 0);
        rmMap[rm].PRODUK[`M_${sLatestMonth}`] += curProdActive;
        rmMap[rm].JASA[`M_${sLatestMonth}`] += curJasaActive;
      });
    });

    return rmMap;
  }, [isPenjualanDynamic, finalReportRealisasiPenjualan, sPastMonths, sWeeks, sLatestMonth]);

  // Baseline Fallback Penjualan Data
  const baselinePenjualan = [
    { type: 'header', no: '1', lokasi: 'RM I' },
    { type: 'row', no: '', lokasi: 'PRODUK', jan: '36,663', feb: '38,240', mar: '39,894', apr: '39,789', mei: '33,432', jun: '33,477', jul: '32,438', w1: '387', w2: '8,584', w3: '7,856', w4: '6,901', w5: '8,709', real: '253,932', tgt: '229,519', vs: '111%' },
    { type: 'row', no: '', lokasi: 'JASA', jan: '-', feb: '-', mar: '-', apr: '325', mei: '-', jun: '393', jul: '105', w1: '17', w2: '16', w3: '16', w4: '16', w5: '41', real: '823', tgt: '1,320', vs: '62%' },
    { type: 'subtotal', no: '', lokasi: 'SUBTOTAL', jan: '36,663', feb: '38,240', mar: '39,894', apr: '40,114', mei: '33,432', jun: '33,870', jul: '32,543', w1: '404', w2: '8,600', w3: '7,872', w4: '6,917', w5: '8,750', real: '254,755', tgt: '230,839', vs: '110%' },
    { type: 'header', no: '2', lokasi: 'RM II' },
    { type: 'row', no: '', lokasi: 'PRODUK', jan: '36,248', feb: '49,560', mar: '64,256', apr: '95,866', mei: '67,005', jun: '77,156', jul: '94,385', w1: '9,526', w2: '13,951', w3: '22,696', w4: '31,600', w5: '16,611', real: '484,477', tgt: '350,659', vs: '138%' },
    { type: 'row', no: '', lokasi: 'JASA', jan: '-', feb: '467', mar: '163', apr: '296', mei: '221', jun: '383', jul: '1,379', w1: '-', w2: '12', w3: '187', w4: '269', w5: '822', real: '2,910', tgt: '10,152', vs: '29%' },
    { type: 'subtotal', no: '', lokasi: 'SUBTOTAL', jan: '36,248', feb: '50,027', mar: '64,420', apr: '96,162', mei: '67,226', jun: '77,539', jul: '95,764', w1: '9,526', w2: '13,963', w3: '22,883', w4: '31,870', w5: '17,432', real: '487,387', tgt: '360,811', vs: '135%' },
    { type: 'header', no: '3', lokasi: 'RM III' },
    { type: 'row', no: '', lokasi: 'PRODUK', jan: '4,627', feb: '12,411', mar: '10,852', apr: '6,195', mei: '14,530', jun: '13,232', jul: '26,066', w1: '3,685', w2: '5,163', w3: '5,868', w4: '4,850', w5: '6,500', real: '87,913', tgt: '174,212', vs: '50%' },
    { type: 'row', no: '', lokasi: 'JASA', jan: '-', feb: '36', mar: '35', apr: '43', mei: '-', jun: '-', jul: '3', w1: '-', w2: '-', w3: '-', w4: '3', w5: '-', real: '82', tgt: '14,769', vs: '1%' },
    { type: 'subtotal', no: '', lokasi: 'SUBTOTAL', jan: '4,627', feb: '12,411', mar: '10,888', apr: '6,238', mei: '14,530', jun: '13,232', jul: '26,069', w1: '3,685', w2: '5,163', w3: '5,868', w4: '4,853', w5: '6,500', real: '87,995', tgt: '188,982', vs: '47%' },
    { type: 'footer_produk', no: '', lokasi: 'TOTAL PRODUK', jan: '77,539', feb: '100,210', mar: '115,002', apr: '141,850', mei: '114,967', jun: '123,864', jul: '152,889', w1: '13,598', w2: '27,698', w3: '36,623', w4: '43,640', w5: '32,683', real: '826,321', tgt: '754,390', vs: '110%' },
    { type: 'footer_jasa', no: '', lokasi: 'TOTAL JASA', jan: '-', feb: '467', mar: '199', apr: '664', mei: '221', jun: '777', jul: '1,487', w1: '17', w2: '28', w3: '-', w4: '-', w5: '-', real: '3,816', tgt: '26,241', vs: '15%' },
    { type: 'footer_total', no: '', lokasi: 'TOTAL KESELURUHAN', jan: '77,539', feb: '100,678', mar: '115,201', apr: '142,514', mei: '115,188', jun: '124,641', jul: '154,376', w1: '13,615', w2: '27,726', w3: '36,623', w4: '43,640', w5: '32,683', real: '830,137', tgt: '780,631', vs: '106%' },
  ];

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-6 pt-2 pb-1 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-center mt-0.5 mb-1 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-8.5 object-contain" />
        <div className="text-center pt-0.5">
          <h1 className="text-[24px] font-black text-black tracking-tight leading-tight uppercase font-sans">
            REALISASI OPERASIONAL PER REGIONAL
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-8.5 object-contain" />
      </div>

      <div className="flex-1 w-full flex flex-col justify-start mt-0.5 gap-1">
        
        {/* TABLE 1: REALISASI PENGADAAN (Report 1 Tab R. Pengadaan UB) */}
        <div className="w-full">
          <h2 className="text-[13px] font-bold text-black mb-0.5 ml-1 uppercase">REALISASI PENGADAAN</h2>
          <table className="w-full border-collapse border border-white text-[8.5px] leading-tight">
            <thead>
              <tr className="bg-[#0070c0] text-white font-bold text-center">
                <th rowSpan={2} className="border border-white py-[1.2px] px-[2px] w-5">NO</th>
                <th rowSpan={2} className="border border-white py-[1.2px] px-[2px] w-24">LOKASI</th>
                {pPastMonths.map(m => (
                  <th key={m} className="border border-white py-[1.2px] px-[2px] w-10">{pMonthNames[m]}</th>
                ))}
                <th colSpan={pWeeks.length} className="border border-white py-[1.2px] px-[2px]">MINGGUAN</th>
                <th className="border border-white py-[1.2px] px-[2px] w-14">REAL S.D<br/>{pLatestFullMonthName}</th>
                <th className="border border-white py-[1.2px] px-[2px] w-14">TARGET<br/>2026</th>
                <th className="border border-white py-[1.2px] px-[2px] w-12">VS TGT<br/>2026 (%)</th>
              </tr>
              <tr className="bg-[#0070c0] text-white font-bold text-center">
                {pPastMonths.map(m => (
                  <th key={m} className="border border-white py-[0.5px] px-[2px]">TON</th>
                ))}
                {pWeeks.map(w => (
                  <th key={w} className="border border-white py-[0.5px] px-[2px] whitespace-nowrap">
                    {w.replace('W_', '')} {pLatestFullMonthName}<br/>TON
                  </th>
                ))}
                <th className="border border-white py-[0.5px] px-[2px]">TON</th>
                <th className="border border-white py-[0.5px] px-[2px]">TON</th>
                <th className="border border-white py-[0.5px] px-[2px]">%</th>
              </tr>
            </thead>
            <tbody>
              {!isPengadaanDynamic ? (
                // Fallback to static baseline
                baselinePengadaan.map((row, idx) => {
                  const isFooter = row.type === 'footer';
                  const isHeader = row.type === 'header';
                  const bg = isFooter ? 'bg-[#0070c0] text-white font-bold' : (isHeader ? 'bg-[#d9e6f3] font-bold text-black' : 'bg-[#e6edf4] text-black');
                  return (
                    <tr key={idx} className={bg}>
                      <td className="border border-white px-[2px] py-[1.2px] text-center">{row.no}</td>
                      <td className={`border border-white px-[2px] py-[1.2px] ${!isHeader && !isFooter ? 'pl-4' : ''}`}>{row.lokasi}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.jan}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.feb}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.mar}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.apr}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.mei}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.jun}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.jul}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w1}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w2}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w3}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w4}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w5}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">{row.real}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.tgt}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">{row.vs}</td>
                    </tr>
                  );
                })
              ) : (
                // Dynamic Data from Report 1 Tab R. Pengadaan UB
                <>
                  {rmList.map(rmItem => (
                    <React.Fragment key={rmItem.rm}>
                      {/* RM Header Row */}
                      <tr className="bg-[#d9e6f3] font-bold text-black">
                        <td className="border border-white px-[2px] py-[1.2px] text-center">{rmItem.no}</td>
                        <td colSpan={pColSpanAll + 1} className="border border-white px-[2px] py-[1.2px] text-left font-bold">
                          {rmItem.rm}
                        </td>
                      </tr>

                      {/* Komoditi Subrows */}
                      {pKomoditiList.map(kom => {
                        const dataDict = pRmData?.[rmItem.rm]?.[kom] || {};
                        let totalSdTon = 0;
                        for (let m = 0; m <= pLatestMonth; m++) {
                          totalSdTon += dataDict[`M_${m}`] || 0;
                        }
                        const targetTon = TARGET_2026_RM[rmItem.rm]?.[kom] || 0;
                        const vsTgtPct = targetTon > 0 && totalSdTon > 0 ? `${Math.round((totalSdTon / targetTon) * 100)}%` : "-";

                        return (
                          <tr key={kom} className="bg-[#e6edf4] text-black">
                            <td className="border border-white px-[2px] py-[1.2px] text-center"></td>
                            <td className="border border-white px-[2px] py-[1.2px] pl-4 font-medium">{kom}</td>
                            {pPastMonths.map(m => (
                              <td key={m} className="border border-white px-[2px] py-[1.2px] text-right">
                                {renderVal(dataDict[`M_${m}`])}
                              </td>
                            ))}
                            {pWeeks.map(w => (
                              <td key={w} className="border border-white px-[2px] py-[1.2px] text-right">
                                {renderVal(dataDict[w])}
                              </td>
                            ))}
                            <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                              {renderVal(totalSdTon, true)}
                            </td>
                            <td className="border border-white px-[2px] py-[1.2px] text-right">
                              {renderVal(targetTon)}
                            </td>
                            <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                              {vsTgtPct}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}

                  {/* Summary Footers */}
                  {footerPengadaanDefs.map(row => {
                    let totalSdTon = 0;
                    for (let m = 0; m <= pLatestMonth; m++) {
                      totalSdTon += pFinalTotals?.[row.key]?.[`M_${m}`] || 0;
                    }
                    const vsTgtPct = row.target > 0 && totalSdTon > 0 ? `${Math.round((totalSdTon / row.target) * 100)}%` : "-";

                    return (
                      <tr key={row.label} className="bg-[#0070c0] text-white font-bold">
                        <td colSpan={2} className="border border-white px-[2px] py-[1.2px] text-left">{row.label}</td>
                        {pPastMonths.map(m => (
                          <td key={m} className="border border-white px-[2px] py-[1.2px] text-right">
                            {renderVal(pFinalTotals?.[row.key]?.[`M_${m}`])}
                          </td>
                        ))}
                        {pWeeks.map(w => (
                          <td key={w} className="border border-white px-[2px] py-[1.2px] text-right">
                            {renderVal(pFinalTotals?.[row.key]?.[w])}
                          </td>
                        ))}
                        <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                          {renderVal(totalSdTon, true)}
                        </td>
                        <td className="border border-white px-[2px] py-[1.2px] text-right">
                          {renderVal(row.target)}
                        </td>
                        <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                          {vsTgtPct}
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE 2: REALISASI PENJUALAN (from Report 6 Realisasi Penjualan) */}
        <div className="w-full mt-0.5">
          <h2 className="text-[13px] font-bold text-black mb-0.5 ml-1 uppercase">REALISASI PENJUALAN</h2>
          <table className="w-full border-collapse border border-white text-[8.5px] leading-tight">
            <thead>
              <tr className="bg-[#70ad47] text-white font-bold text-center">
                <th rowSpan={2} className="border border-white py-[1.2px] px-[2px] w-5">NO</th>
                <th rowSpan={2} className="border border-white py-[1.2px] px-[2px] w-24">LOKASI</th>
                {sPastMonths.map(m => (
                  <th key={m} className="border border-white py-[1.2px] px-[2px] w-10">{sMonthNames[m]}</th>
                ))}
                <th colSpan={sWeeks.length} className="border border-white py-[1.2px] px-[2px]">MINGGUAN</th>
                <th className="border border-white py-[1.2px] px-[2px] w-14">REAL S.D<br/>{sLatestFullMonthName}</th>
                <th className="border border-white py-[1.2px] px-[2px] w-14">TARGET<br/>2026</th>
                <th className="border border-white py-[1.2px] px-[2px] w-12">%</th>
              </tr>
              <tr className="bg-[#70ad47] text-white font-bold text-center">
                {sPastMonths.map(m => (
                  <th key={m} className="border border-white py-[0.5px] px-[2px] italic font-normal">(Rp Juta)</th>
                ))}
                {sWeeks.map(w => (
                  <th key={w} className="border border-white py-[0.5px] px-[2px] italic font-normal whitespace-nowrap">
                    {w.replace('W_', '')} {sLatestFullMonthName}<br/>(Rp Juta)
                  </th>
                ))}
                <th className="border border-white py-[0.5px] px-[2px] italic font-normal">(Rp Juta)</th>
                <th className="border border-white py-[0.5px] px-[2px] italic font-normal">(Rp Juta)</th>
                <th className="border border-white py-[0.5px] px-[2px] italic font-normal">%</th>
              </tr>
            </thead>
            <tbody>
              {!isPenjualanDynamic ? (
                // Fallback to static baseline
                baselinePenjualan.map((row, idx) => {
                  let bg = 'bg-[#f2f2f2] text-black';
                  if (row.type === 'header') {
                    bg = 'bg-[#ffffff] font-bold text-black';
                  } else if (row.type === 'subtotal') {
                    bg = 'bg-[#f2f2f2] text-black font-bold';
                  } else if (row.type.startsWith('footer')) {
                    bg = 'bg-[#70ad47] text-white font-bold';
                  }

                  return (
                    <tr key={idx} className={bg}>
                      <td className="border border-white px-[2px] py-[1.2px] text-center">{row.no}</td>
                      <td className={`border border-white px-[2px] py-[1.2px] ${row.type === 'row' ? 'pl-4' : ''}`}>{row.lokasi}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.jan}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.feb}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.mar}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.apr}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.mei}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.jun}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.jul}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w1}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w2}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w3}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w4}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.w5}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">{row.real}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right">{row.tgt}</td>
                      <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">{row.vs}</td>
                    </tr>
                  );
                })
              ) : (
                // Dynamic Data from Report 6 Realisasi Penjualan
                <>
                  {rmList.map(rmItem => {
                    const prodDict = sRmData?.[rmItem.rm]?.PRODUK || {};
                    const jasaDict = sRmData?.[rmItem.rm]?.JASA || {};
                    const rmTarget = TARGET_PENJUALAN_RM[rmItem.rm] || { PRODUK: 0, JASA: 0, SUBTOTAL: 0 };

                    let prodSd = 0;
                    let jasaSd = 0;
                    for (let m = 0; m <= sLatestMonth; m++) {
                      prodSd += prodDict[`M_${m}`] || 0;
                      jasaSd += jasaDict[`M_${m}`] || 0;
                    }
                    const subtotalSd = prodSd + jasaSd;

                    const prodVsPct = rmTarget.PRODUK > 0 && prodSd > 0 ? `${Math.round((prodSd / rmTarget.PRODUK) * 100)}%` : "-";
                    const jasaVsPct = rmTarget.JASA > 0 && jasaSd > 0 ? `${Math.round((jasaSd / rmTarget.JASA) * 100)}%` : "-";
                    const subVsPct = rmTarget.SUBTOTAL > 0 && subtotalSd > 0 ? `${Math.round((subtotalSd / rmTarget.SUBTOTAL) * 100)}%` : "-";

                    return (
                      <React.Fragment key={rmItem.rm}>
                        {/* RM Header */}
                        <tr className="bg-[#ffffff] font-bold text-black">
                          <td className="border border-white px-[2px] py-[1.2px] text-center">{rmItem.no}</td>
                          <td colSpan={sColSpanAll + 1} className="border border-white px-[2px] py-[1.2px] text-left font-bold">
                            {rmItem.rm}
                          </td>
                        </tr>

                        {/* Subrow: PRODUK */}
                        <tr className="bg-[#f2f2f2] text-black">
                          <td className="border border-white px-[2px] py-[1.2px] text-center"></td>
                          <td className="border border-white px-[2px] py-[1.2px] pl-4 font-medium">PRODUK</td>
                          {sPastMonths.map(m => (
                            <td key={m} className="border border-white px-[2px] py-[1.2px] text-right">
                              {renderVal(prodDict[`M_${m}`])}
                            </td>
                          ))}
                          {sWeeks.map(w => (
                            <td key={w} className="border border-white px-[2px] py-[1.2px] text-right">
                              {renderVal(prodDict[w])}
                            </td>
                          ))}
                          <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                            {renderVal(prodSd, true)}
                          </td>
                          <td className="border border-white px-[2px] py-[1.2px] text-right">
                            {renderVal(rmTarget.PRODUK)}
                          </td>
                          <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                            {prodVsPct}
                          </td>
                        </tr>

                        {/* Subrow: JASA */}
                        <tr className="bg-[#f2f2f2] text-black">
                          <td className="border border-white px-[2px] py-[1.2px] text-center"></td>
                          <td className="border border-white px-[2px] py-[1.2px] pl-4 font-medium">JASA</td>
                          {sPastMonths.map(m => (
                            <td key={m} className="border border-white px-[2px] py-[1.2px] text-right">
                              {renderVal(jasaDict[`M_${m}`])}
                            </td>
                          ))}
                          {sWeeks.map(w => (
                            <td key={w} className="border border-white px-[2px] py-[1.2px] text-right">
                              {renderVal(jasaDict[w])}
                            </td>
                          ))}
                          <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                            {renderVal(jasaSd, true)}
                          </td>
                          <td className="border border-white px-[2px] py-[1.2px] text-right">
                            {renderVal(rmTarget.JASA)}
                          </td>
                          <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                            {jasaVsPct}
                          </td>
                        </tr>

                        {/* Subrow: SUBTOTAL */}
                        <tr className="bg-[#e8f2e6] font-bold text-black">
                          <td className="border border-white px-[2px] py-[1.2px] text-center"></td>
                          <td className="border border-white px-[2px] py-[1.2px] pl-4 font-bold">SUBTOTAL</td>
                          {sPastMonths.map(m => (
                            <td key={m} className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                              {renderVal((prodDict[`M_${m}`] || 0) + (jasaDict[`M_${m}`] || 0))}
                            </td>
                          ))}
                          {sWeeks.map(w => (
                            <td key={w} className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                              {renderVal((prodDict[w] || 0) + (jasaDict[w] || 0))}
                            </td>
                          ))}
                          <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                            {renderVal(subtotalSd, true)}
                          </td>
                          <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                            {renderVal(rmTarget.SUBTOTAL)}
                          </td>
                          <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                            {subVsPct}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}

                  {/* Penjualan Summary Footers */}
                  {[
                    { label: 'TOTAL PRODUK', key: 'TOTAL PRODUK', target: TARGET_REALISASI_PENJUALAN_2026_TOTALS['TOTAL PRODUK'] || 754390 },
                    { label: 'TOTAL JASA', key: 'TOTAL JASA', target: TARGET_REALISASI_PENJUALAN_2026_TOTALS['TOTAL JASA'] || 26241 },
                    { label: 'TOTAL KESELURUHAN', key: 'GRAND TOTAL', target: TARGET_REALISASI_PENJUALAN_2026_TOTALS['GRAND TOTAL'] || 780631 },
                  ].map(row => {
                    let totalSd = 0;
                    for (let m = 0; m <= sLatestMonth; m++) {
                      totalSd += sFinalTotals?.[row.key]?.[`M_${m}`] || 0;
                    }
                    const vsPct = row.target > 0 && totalSd > 0 ? `${Math.round((totalSd / row.target) * 100)}%` : "-";

                    return (
                      <tr key={row.label} className="bg-[#70ad47] text-white font-bold">
                        <td colSpan={2} className="border border-white px-[2px] py-[1.2px] text-left">{row.label}</td>
                        {sPastMonths.map(m => (
                          <td key={m} className="border border-white px-[2px] py-[1.2px] text-right">
                            {renderVal(sFinalTotals?.[row.key]?.[`M_${m}`])}
                          </td>
                        ))}
                        {sWeeks.map(w => (
                          <td key={w} className="border border-white px-[2px] py-[1.2px] text-right">
                            {renderVal(sFinalTotals?.[row.key]?.[w])}
                          </td>
                        ))}
                        <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                          {renderVal(totalSd, true)}
                        </td>
                        <td className="border border-white px-[2px] py-[1.2px] text-right">
                          {renderVal(row.target)}
                        </td>
                        <td className="border border-white px-[2px] py-[1.2px] text-right font-bold">
                          {vsPct}
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>

      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
