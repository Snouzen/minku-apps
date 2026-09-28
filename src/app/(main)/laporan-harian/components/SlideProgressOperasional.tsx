import React, { useMemo } from 'react';
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { TARGET_2026_TOTALS, HISTORICAL_HARGA_PEMBELIAN_2026_DATA, TARGET_REALISASI_PENJUALAN_2026_TOTALS } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export default function SlideProgressOperasional({
  finalReportRealisasiPengadaan,
  finalReportHargaPembelian,
  finalReportRealisasiPenjualan,
  stokHariIni,
}: {
  finalReportRealisasiPengadaan?: any;
  finalReportHargaPembelian?: any;
  finalReportRealisasiPenjualan?: any;
  stokHariIni?: { gabahTon: number; berasTon: number; jagungTon: number } | null;
}) {
  const gabahTotal = stokHariIni ? stokHariIni.gabahTon : 8596;
  const berasTotal = stokHariIni ? stokHariIni.berasTon : 4447;
  const jagungTotal = stokHariIni ? stokHariIni.jagungTon : 0;

  const renderStok = (val: number, fallbackStr: string) => {
    if (stokHariIni) {
      return val > 0 ? val.toLocaleString('id-ID') : '-';
    }
    return fallbackStr;
  };

  const activeMonthName = 
    finalReportRealisasiPengadaan?.fullMonthNames?.[finalReportRealisasiPengadaan.latestMonth] ||
    finalReportRealisasiPenjualan?.fullMonthNames?.[finalReportRealisasiPenjualan.latestMonth];
  const dateSubtitle = activeMonthName ? `${activeMonthName} 2026` : '31 Juli 2026';

  const defaultDataPenjualan = [
    { name: 'JAN', val: 77539, PRODUK: 77539, JASA: 0 },
    { name: 'FEB', val: 178216, PRODUK: 177749, JASA: 467 },
    { name: 'MAR', val: 293417, PRODUK: 292751, JASA: 666 },
    { name: 'APR', val: 435931, PRODUK: 434601, JASA: 1330 },
    { name: 'MEI', val: 551119, PRODUK: 549568, JASA: 1551 },
    { name: 'JUN', val: 675760, PRODUK: 673432, JASA: 2328 },
    { name: 'JUL', val: 830137, PRODUK: 826321, JASA: 3816 },
  ];

  const dynamicDataPenjualan = useMemo(() => {
    if (!finalReportRealisasiPenjualan) return null;
    const { pastMonths, monthNames, finalTotals, latestMonth } = finalReportRealisasiPenjualan;
    let cumTotal = 0;
    let cumProduk = 0;
    let cumJasa = 0;
    const allMonths = [...pastMonths, latestMonth];
    return allMonths.map((m: number) => {
      const mVal = (finalTotals['GRAND TOTAL']?.[`M_${m}`] || 0);
      const mProduk = (finalTotals['TOTAL PRODUK']?.[`M_${m}`] || 0);
      const mJasa = (finalTotals['TOTAL JASA']?.[`M_${m}`] || 0);
      cumTotal += mVal;
      cumProduk += mProduk;
      cumJasa += mJasa;
      return {
        name: monthNames[m],
        val: cumTotal > 0 ? Math.round(cumTotal) : null,
        PRODUK: cumProduk > 0 ? Math.round(cumProduk) : null,
        JASA: cumJasa > 0 ? Math.round(cumJasa) : null,
      };
    });
  }, [finalReportRealisasiPenjualan]);

  const salesVsTgtPercent = useMemo(() => {
    if (finalReportRealisasiPenjualan) {
      const realSd = finalReportRealisasiPenjualan.finalTotals['GRAND TOTAL']?.['REAL_SD'] || 0;
      const tgt = TARGET_REALISASI_PENJUALAN_2026_TOTALS['GRAND TOTAL'] || 780631;
      if (tgt > 0 && realSd > 0) {
        return `${Math.round((realSd / tgt) * 100)} %`;
      }
    }
    return '106 %';
  }, [finalReportRealisasiPenjualan]);

  const defaultDataPengadaan = [
    { name: 'JAN', GABAH: 1177, BERAS: 1544, JAGUNG: 0 },
    { name: 'FEB', GABAH: 11572, BERAS: 5926, JAGUNG: 0 },
    { name: 'MAR', GABAH: 26360, BERAS: 8425, JAGUNG: 0 },
    { name: 'APR', GABAH: 36347, BERAS: 11826, JAGUNG: 0 },
    { name: 'MEI', GABAH: 40298, BERAS: 14014, JAGUNG: 0 },
    { name: 'JUN', GABAH: 45139, BERAS: 17828, JAGUNG: 0 },
    { name: 'JUL', GABAH: 48844, BERAS: 23617, JAGUNG: 0 },
  ];

  const dynamicDataPengadaan = useMemo(() => {
    if (!finalReportRealisasiPengadaan) return null;
    const { pastMonths, monthNames, finalTotals } = finalReportRealisasiPengadaan;
    let cumG = 0;
    let cumB = 0;
    let cumJ = 0;
    return pastMonths.map((m: number) => {
      cumG += (finalTotals['JUMLAH GABAH']?.[`M_${m}`] || 0);
      cumB += (finalTotals['JUMLAH BERAS']?.[`M_${m}`] || 0);
      cumJ += (finalTotals['TOTAL JAGUNG']?.[`M_${m}`] || 0);
      return {
        name: monthNames[m],
        GABAH: cumG,
        BERAS: cumB,
        JAGUNG: cumJ,
      };
    });
  }, [finalReportRealisasiPengadaan]);

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col p-4 font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center mt-1">
          <h1 className="text-2xl font-black text-black tracking-tight leading-none">PROGRESS OPERASIONAL</h1>
          <p className="text-[#0070C0] text-base font-bold mt-0.5">{dateSubtitle}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left Column: 3 Tables (63% width) */}
        <div className="w-[63%] flex flex-col gap-2 overflow-hidden">
          
          {/* Card: Stok Hari Ini */}
          <div>
            <h2 className="font-bold text-[11.5px] mb-1 uppercase text-gray-900 tracking-wide">STOK HARI INI</h2>
            <div className="flex gap-2">
              <div className="flex-1 flex rounded-xl overflow-hidden shadow-sm h-11">
                <div className="w-[45%] bg-[#FBE59E] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/gabah.png" alt="Gabah" className="h-9 object-contain" />
                </div>
                <div className="w-[55%] bg-[#D9A300] flex flex-col justify-center px-3">
                  <span className="text-white font-bold text-[11px] leading-tight">Gabah</span>
                  <span className="text-white font-black text-sm leading-tight">{renderStok(gabahTotal, '8.596')} Ton</span>
                </div>
              </div>
              <div className="flex-1 flex rounded-xl overflow-hidden shadow-sm h-11">
                <div className="w-[45%] bg-[#BDD7EE] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/beras.png" alt="Beras" className="h-9 object-contain" />
                </div>
                <div className="w-[55%] bg-[#2E75B6] flex flex-col justify-center px-3">
                  <span className="text-white font-bold text-[11px] leading-tight">Beras</span>
                  <span className="text-white font-black text-sm leading-tight">{renderStok(berasTotal, '4.447')} Ton</span>
                </div>
              </div>
              <div className="flex-1 flex rounded-xl overflow-hidden shadow-sm h-11">
                <div className="w-[45%] bg-[#A9D18E] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/jagung.png" alt="Jagung" className="h-9 object-contain" />
                </div>
                <div className="w-[55%] bg-[#548235] flex flex-col justify-center px-3">
                  <span className="text-white font-bold text-[11px] leading-tight">Jagung</span>
                  <span className="text-white font-black text-sm leading-tight">{renderStok(jagungTotal, '-')} Ton</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table 1: Realisasi Pengadaan (Sumber: Report 1 Tab R. Pengadaan UB - Pic 1) */}
          <div>
            <h2 className="font-bold text-[11.5px] mb-0.5 uppercase text-gray-900 tracking-wide">REALISASI PENGADAAN</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[7px] text-right border-collapse border border-blue-200">
                {finalReportRealisasiPengadaan ? (
                  <>
                    <thead>
                      <tr className="bg-[#0070C0] text-white text-[7.5px] text-center uppercase font-bold">
                        <th rowSpan={2} className="border border-white p-0.5 w-4 bg-[#0070C0]">NO</th>
                        <th rowSpan={2} className="border border-white p-0.5 w-14 bg-[#0070C0] text-left">LOKASI</th>
                        {finalReportRealisasiPengadaan.pastMonths.map((m: number) => (
                          <th key={m} rowSpan={2} className="border border-white p-0.5 bg-[#0070C0]">
                            {finalReportRealisasiPengadaan.monthNames[m]}<br/><span className="text-[5.5px] font-normal">TON</span>
                          </th>
                        ))}
                        <th colSpan={finalReportRealisasiPengadaan.weeks.length} className="border border-white p-0.5 bg-[#1D63A8]">
                          MINGGUAN
                        </th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#1D63A8] min-w-[36px]">
                          REAL S/D<br/>{finalReportRealisasiPengadaan.monthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[5.5px] font-normal">TON</span>
                        </th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#1D63A8] min-w-[34px]">
                          TARGET 2026<br/><span className="text-[5.5px] font-normal">TON</span>
                        </th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#1D63A8] min-w-[30px]">
                          VS TGT 2026 (%)<br/><span className="text-[5.5px] font-normal">%</span>
                        </th>
                      </tr>
                      <tr className="bg-[#1D63A8] text-white text-[6.5px] text-center font-normal">
                        {finalReportRealisasiPengadaan.weeks.map((w: string) => (
                          <th key={w} className="border border-white p-0.5 bg-[#1D63A8]">
                            {w.replace('W_', '')} {finalReportRealisasiPengadaan.monthNames[finalReportRealisasiPengadaan.latestMonth]}<br/><span className="text-[5.5px]">TON</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-[#DDEBF7]">
                      {(() => {
                        const ubiRows = [
                          { no: 1, label: 'GABAH', key: 'JUMLAH GABAH', target: TARGET_2026_TOTALS['JUMLAH GABAH'] || 77290 },
                          { no: 2, label: 'BERAS', key: 'JUMLAH BERAS', target: TARGET_2026_TOTALS['JUMLAH BERAS'] || 37130 },
                          { no: 3, label: 'JAGUNG', key: 'TOTAL JAGUNG', target: TARGET_2026_TOTALS['TOTAL JAGUNG'] || 2700 }
                        ];
                        return ubiRows.map(row => {
                          let totalSdTon = 0;
                          for (let m = 0; m <= finalReportRealisasiPengadaan.latestMonth; m++) {
                            totalSdTon += finalReportRealisasiPengadaan.finalTotals[row.key]?.[`M_${m}`] || 0;
                          }
                          const vsTgtPct = row.target > 0 && totalSdTon > 0 ? `${Math.round((totalSdTon / row.target) * 100)}%` : "-";

                          return (
                            <tr key={row.label} className="hover:bg-[#c1d9f0] transition-colors">
                              <td className="border border-white p-0.5 text-center">{row.no}</td>
                              <td className="border border-white p-0.5 text-left font-medium">{row.label}</td>
                              {finalReportRealisasiPengadaan.pastMonths.map((m: number) => {
                                const val = finalReportRealisasiPengadaan.finalTotals[row.key]?.[`M_${m}`] || 0;
                                return (
                                  <td key={m} className="border border-white p-0.5">
                                    {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                  </td>
                                );
                              })}
                              {finalReportRealisasiPengadaan.weeks.map((w: string) => {
                                const val = finalReportRealisasiPengadaan.finalTotals[row.key]?.[w] || 0;
                                return (
                                  <td key={w} className="border border-white p-0.5">
                                    {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                  </td>
                                );
                              })}
                              <td className="border border-white p-0.5 font-bold bg-[#1D63A8]/20">
                                {totalSdTon > 0 ? totalSdTon.toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white p-0.5 font-medium">
                                {row.target > 0 ? row.target.toLocaleString('id-ID') : "-"}
                              </td>
                              <td className="border border-white p-0.5 font-bold">
                                {vsTgtPct}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </>
                ) : (
                  // Static Fallback (Juli 2026)
                  <>
                    <thead>
                      <tr className="bg-[#0070C0] text-white text-[7.5px] text-center uppercase font-bold">
                        <th rowSpan={2} className="border border-white p-0.5 w-4 bg-[#0070C0]">NO</th>
                        <th rowSpan={2} className="border border-white p-0.5 w-14 bg-[#0070C0] text-left">LOKASI</th>
                        <th className="border border-white p-0.5">JAN</th>
                        <th className="border border-white p-0.5">FEB</th>
                        <th className="border border-white p-0.5">MARET</th>
                        <th className="border border-white p-0.5">APRIL</th>
                        <th className="border border-white p-0.5">MEI</th>
                        <th className="border border-white p-0.5">JUNI</th>
                        <th className="border border-white p-0.5">JULI</th>
                        <th colSpan={5} className="border border-white p-0.5 bg-[#1D63A8]">MINGGUAN</th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#1D63A8] min-w-[36px]">REAL S/D<br/>JULI</th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#1D63A8] min-w-[34px]">TARGET<br/>2026</th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#1D63A8] min-w-[30px]">VS TGT<br/>2026 (%)</th>
                      </tr>
                      <tr className="bg-[#1D63A8] text-white text-[6.5px] text-center font-normal">
                        <th className="border border-white p-0.5">TON</th>
                        <th className="border border-white p-0.5">TON</th>
                        <th className="border border-white p-0.5">TON</th>
                        <th className="border border-white p-0.5">TON</th>
                        <th className="border border-white p-0.5">TON</th>
                        <th className="border border-white p-0.5">TON</th>
                        <th className="border border-white p-0.5">TON</th>
                        <th className="border border-white p-0.5 bg-[#1D63A8]">1-5 JULI</th>
                        <th className="border border-white p-0.5 bg-[#1D63A8]">6-12 JULI</th>
                        <th className="border border-white p-0.5 bg-[#1D63A8]">13-19 JULI</th>
                        <th className="border border-white p-0.5 bg-[#1D63A8]">20-26 JULI</th>
                        <th className="border border-white p-0.5 bg-[#1D63A8]">27-31 JULI</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#DDEBF7]">
                      <tr>
                        <td className="border border-white p-0.5 text-center">1</td>
                        <td className="border border-white p-0.5 text-left">GABAH</td>
                        <td className="border border-white p-0.5">1.177</td>
                        <td className="border border-white p-0.5">10.395</td>
                        <td className="border border-white p-0.5">14.788</td>
                        <td className="border border-white p-0.5">9.987</td>
                        <td className="border border-white p-0.5">3.951</td>
                        <td className="border border-white p-0.5">4.841</td>
                        <td className="border border-white p-0.5">3.704</td>
                        <td className="border border-white p-0.5">763</td>
                        <td className="border border-white p-0.5">1.056</td>
                        <td className="border border-white p-0.5">950</td>
                        <td className="border border-white p-0.5">444</td>
                        <td className="border border-white p-0.5">492</td>
                        <td className="border border-white p-0.5 font-bold">48.844</td>
                        <td className="border border-white p-0.5">77.290</td>
                        <td className="border border-white p-0.5 font-bold">63%</td>
                      </tr>
                      <tr>
                        <td className="border border-white p-0.5 text-center">2</td>
                        <td className="border border-white p-0.5 text-left">BERAS</td>
                        <td className="border border-white p-0.5">1.544</td>
                        <td className="border border-white p-0.5">4.382</td>
                        <td className="border border-white p-0.5">2.499</td>
                        <td className="border border-white p-0.5">3.401</td>
                        <td className="border border-white p-0.5">2.188</td>
                        <td className="border border-white p-0.5">3.814</td>
                        <td className="border border-white p-0.5">5.789</td>
                        <td className="border border-white p-0.5">819</td>
                        <td className="border border-white p-0.5">1.279</td>
                        <td className="border border-white p-0.5">1.310</td>
                        <td className="border border-white p-0.5">1.342</td>
                        <td className="border border-white p-0.5">1.039</td>
                        <td className="border border-white p-0.5 font-bold">23.617</td>
                        <td className="border border-white p-0.5">37.130</td>
                        <td className="border border-white p-0.5 font-bold">64%</td>
                      </tr>
                      <tr>
                        <td className="border border-white p-0.5 text-center">3</td>
                        <td className="border border-white p-0.5 text-left">JAGUNG</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5 font-bold">-</td>
                        <td className="border border-white p-0.5">2.700</td>
                        <td className="border border-white p-0.5 font-bold">-</td>
                      </tr>
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>

          {/* Table 2: Rerata Penawaran Harga Papan Pembelian (Sumber: Report 2 Tab R. Harga Pembelian - Pic 2) */}
          <div>
            <h2 className="font-bold text-[11.5px] mb-0.5 uppercase text-gray-900 tracking-wide">RERATA PENAWARAN HARGA PAPAN PEMBELIAN</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[7px] text-right border-collapse border border-blue-200">
                {finalReportHargaPembelian ? (
                  <>
                    <thead className="bg-[#0070C0] text-white">
                      <tr className="text-[7.5px] text-center font-bold uppercase">
                        <th rowSpan={2} className="border border-white p-0.5 w-4 bg-[#0070C0]">NO</th>
                        <th rowSpan={2} className="border border-white p-0.5 w-14 bg-[#0070C0] text-left">LOKASI</th>
                        {finalReportHargaPembelian.pastMonths.map((m: number) => (
                          <th key={m} className="border border-white p-0.5 bg-[#0070C0] text-center">
                            {finalReportHargaPembelian.monthNames[m]}
                          </th>
                        ))}
                        <th className="border border-white p-0.5 bg-[#0070C0] text-center">
                          {finalReportHargaPembelian.monthNames[finalReportHargaPembelian.latestMonth]}
                        </th>
                        <th colSpan={finalReportHargaPembelian.weeks.length} className="border border-white p-0.5 bg-[#1D63A8] text-center">
                          MINGGUAN
                        </th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#1D63A8] min-w-[38px] text-center">
                          REAL S/D<br/>{finalReportHargaPembelian.monthNames[finalReportHargaPembelian.latestMonth]}<br/><span className="text-[5.5px] font-normal">Rp/KG</span>
                        </th>
                      </tr>
                      <tr className="text-[6.5px] text-center font-normal bg-[#0070C0]">
                        {finalReportHargaPembelian.pastMonths.map((m: number) => (
                          <th key={m} className="border border-white p-0.5 text-center font-normal">Rp/KG</th>
                        ))}
                        <th className="border border-white p-0.5 text-center font-normal">Rp/KG</th>
                        {finalReportHargaPembelian.weeks.map((w: string) => (
                          <th key={w} className="border border-white p-0.5 text-center font-normal bg-[#1D63A8]">
                            {w.replace('W_', '')} {finalReportHargaPembelian.monthNames[finalReportHargaPembelian.latestMonth]}<br/>
                            <span className="text-[5.5px]">Rp/KG</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-[#DDEBF7]">
                      {(() => {
                        const rows = [
                          { no: 1, label: 'GABAH', key: 'JUMLAH GABAH' },
                          { no: 2, label: 'BERAS', key: 'JUMLAH BERAS' },
                          { no: 3, label: 'JAGUNG', key: 'TOTAL JAGUNG' }
                        ];

                        return rows.map((r) => {
                          return (
                            <tr key={r.label} className="hover:bg-[#c1d9f0] transition-colors">
                              <td className="border border-white p-0.5 text-center">{r.no}</td>
                              <td className="border border-white p-0.5 text-left font-medium">{r.label}</td>
                              {finalReportHargaPembelian.pastMonths.map((m: number) => {
                                let val = 0;
                                try {
                                  val = finalReportHargaPembelian.finalTotals[r.key]?.[`M_${m}`] || HISTORICAL_HARGA_PEMBELIAN_2026_DATA['TOTALS']?.[r.key]?.[`M_${m}`] || 0;
                                } catch (e) {}
                                const rounded = Math.round(val || 0);
                                return (
                                  <td key={m} className="border border-white p-0.5">
                                    {rounded > 0 ? rounded.toLocaleString('id-ID') : "-"}
                                  </td>
                                );
                              })}
                              {/* Active month */}
                              {(() => {
                                const val = Math.round(finalReportHargaPembelian.finalTotals[r.key]?.[`M_${finalReportHargaPembelian.latestMonth}`] || 0);
                                return (
                                  <td className="border border-white p-0.5">
                                    {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                  </td>
                                );
                              })()}
                              {/* Weekly buckets */}
                              {finalReportHargaPembelian.weeks.map((w: string) => {
                                const val = Math.round(finalReportHargaPembelian.finalTotals[r.key]?.[w] || 0);
                                return (
                                  <td key={w} className="border border-white p-0.5">
                                    {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                  </td>
                                );
                              })}
                              {/* REAL S/D */}
                              {(() => {
                                const val = Math.round(finalReportHargaPembelian.finalTotals[r.key]?.['REAL_SD'] || 0);
                                return (
                                  <td className="border border-white p-0.5 font-bold bg-[#1D63A8]/20">
                                    {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                  </td>
                                );
                              })()}
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </>
                ) : (
                  // Static Fallback (Juli 2026)
                  <>
                    <thead className="bg-[#0070C0] text-white">
                      <tr className="text-[7.5px] text-center font-bold uppercase">
                        <th rowSpan={2} className="border border-white p-0.5 w-4 bg-[#0070C0]">NO</th>
                        <th rowSpan={2} className="border border-white p-0.5 w-14 bg-[#0070C0] text-left">LOKASI</th>
                        <th className="border border-white p-0.5 text-center">JAN</th>
                        <th className="border border-white p-0.5 text-center">FEB</th>
                        <th className="border border-white p-0.5 text-center">MAR</th>
                        <th className="border border-white p-0.5 text-center">APR</th>
                        <th className="border border-white p-0.5 text-center">MEI</th>
                        <th className="border border-white p-0.5 text-center">JUN</th>
                        <th className="border border-white p-0.5 text-center">JUL</th>
                        <th colSpan={5} className="border border-white p-0.5 bg-[#1D63A8] text-center">MINGGUAN</th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#1D63A8] min-w-[38px] text-center">REAL S/D<br/>JULI</th>
                      </tr>
                      <tr className="text-[6.5px] text-center font-normal bg-[#0070C0]">
                        <th className="border border-white p-0.5 text-center">Rp/KG</th>
                        <th className="border border-white p-0.5 text-center">Rp/KG</th>
                        <th className="border border-white p-0.5 text-center">Rp/KG</th>
                        <th className="border border-white p-0.5 text-center">Rp/KG</th>
                        <th className="border border-white p-0.5 text-center">Rp/KG</th>
                        <th className="border border-white p-0.5 text-center">Rp/KG</th>
                        <th className="border border-white p-0.5 text-center">Rp/KG</th>
                        <th className="border border-white p-0.5 text-center bg-[#1D63A8]">1-5 JULI</th>
                        <th className="border border-white p-0.5 text-center bg-[#1D63A8]">6-12 JULI</th>
                        <th className="border border-white p-0.5 text-center bg-[#1D63A8]">13-19 JULI</th>
                        <th className="border border-white p-0.5 text-center bg-[#1D63A8]">20-26 JULI</th>
                        <th className="border border-white p-0.5 text-center bg-[#1D63A8]">27-31 JULI</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#DDEBF7]">
                      <tr>
                        <td className="border border-white p-0.5 text-center">1</td>
                        <td className="border border-white p-0.5 text-left">GABAH</td>
                        <td className="border border-white p-0.5">7.111</td>
                        <td className="border border-white p-0.5">7.330</td>
                        <td className="border border-white p-0.5">7.195</td>
                        <td className="border border-white p-0.5">7.335</td>
                        <td className="border border-white p-0.5">8.597</td>
                        <td className="border border-white p-0.5">7.802</td>
                        <td className="border border-white p-0.5">7.998</td>
                        <td className="border border-white p-0.5">8.054</td>
                        <td className="border border-white p-0.5">8.278</td>
                        <td className="border border-white p-0.5">8.168</td>
                        <td className="border border-white p-0.5">8.029</td>
                        <td className="border border-white p-0.5">7.092</td>
                        <td className="border border-white p-0.5 font-bold">7.649</td>
                      </tr>
                      <tr>
                        <td className="border border-white p-0.5 text-center">2</td>
                        <td className="border border-white p-0.5 text-left">BERAS</td>
                        <td className="border border-white p-0.5">12.549</td>
                        <td className="border border-white p-0.5">15.051</td>
                        <td className="border border-white p-0.5">12.932</td>
                        <td className="border border-white p-0.5">12.587</td>
                        <td className="border border-white p-0.5">12.432</td>
                        <td className="border border-white p-0.5">12.743</td>
                        <td className="border border-white p-0.5">13.145</td>
                        <td className="border border-white p-0.5">13.524</td>
                        <td className="border border-white p-0.5">12.490</td>
                        <td className="border border-white p-0.5">13.588</td>
                        <td className="border border-white p-0.5">13.375</td>
                        <td className="border border-white p-0.5">12.875</td>
                        <td className="border border-white p-0.5 font-bold">13.170</td>
                      </tr>
                      <tr>
                        <td className="border border-white p-0.5 text-center">3</td>
                        <td className="border border-white p-0.5 text-left">JAGUNG</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5 font-bold">-</td>
                      </tr>
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>

          {/* Table 3: Realisasi Penjualan */}
          <div>
            <h2 className="font-bold text-[11.5px] mb-0.5 uppercase text-gray-900 tracking-wide">REALISASI PENJUALAN</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[7px] text-right border-collapse border border-white">
                {finalReportRealisasiPenjualan ? (
                  <>
                    <thead className="bg-[#70AD47] text-white text-center">
                      <tr className="text-[7.5px] uppercase font-bold">
                        <th rowSpan={2} className="border border-white p-0.5 w-4 bg-[#70AD47]">NO</th>
                        <th rowSpan={2} className="border border-white p-0.5 w-14 bg-[#70AD47] text-left">LOKASI</th>
                        {finalReportRealisasiPenjualan.pastMonths.map((m: number) => (
                          <th key={m} className="border border-white p-0.5 bg-[#70AD47]">
                            {finalReportRealisasiPenjualan.monthNames[m]}
                          </th>
                        ))}
                        <th className="border border-white p-0.5 bg-[#70AD47]">
                          {finalReportRealisasiPenjualan.monthNames[finalReportRealisasiPenjualan.latestMonth]}
                        </th>
                        <th colSpan={finalReportRealisasiPenjualan.weeks.length} className="border border-white p-0.5 bg-[#548235]">
                          MINGGUAN
                        </th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#548235] min-w-[36px]">
                          REAL S/D<br/>{finalReportRealisasiPenjualan.monthNames[finalReportRealisasiPenjualan.latestMonth]}<br/><span className="text-[5.5px] font-normal">Rp Juta</span>
                        </th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#548235] min-w-[34px]">
                          TARGET 2026<br/><span className="text-[5.5px] font-normal">Rp Juta</span>
                        </th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#548235] min-w-[30px]">
                          VS TGT 2026 (%)<br/><span className="text-[5.5px] font-normal">%</span>
                        </th>
                      </tr>
                      <tr className="text-[6.5px] text-center font-normal bg-[#70AD47]">
                        {finalReportRealisasiPenjualan.pastMonths.map((m: number) => (
                          <th key={m} className="border border-white p-0.5">(Rp Juta)</th>
                        ))}
                        <th className="border border-white p-0.5">(Rp Juta)</th>
                        {finalReportRealisasiPenjualan.weeks.map((w: string) => (
                          <th key={w} className="border border-white p-0.5 bg-[#548235]">
                            {w.replace('W_', '')} {finalReportRealisasiPenjualan.monthNames[finalReportRealisasiPenjualan.latestMonth]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-[#E2F0D9]">
                      {(() => {
                        const rows = [
                          { no: 1, label: 'PRODUK', key: 'TOTAL PRODUK', targetKey: 'TOTAL PRODUK' },
                          { no: 2, label: 'JASA', key: 'TOTAL JASA', targetKey: 'TOTAL JASA' },
                        ];
                        return (
                          <>
                            {rows.map(r => {
                              const realSd = Math.round(finalReportRealisasiPenjualan.finalTotals[r.key]?.['REAL_SD'] || 0);
                              const targetVal = TARGET_REALISASI_PENJUALAN_2026_TOTALS[r.targetKey] || 0;
                              const vsTgt = targetVal > 0 && realSd > 0 ? `${Math.round((realSd / targetVal) * 100)}%` : (targetVal > 0 ? "0%" : "-");
                              return (
                                <tr key={r.label} className="hover:bg-[#c9e6ba] transition-colors text-black">
                                  <td className="border border-white p-0.5 text-center">{r.no}</td>
                                  <td className="border border-white p-0.5 text-left font-medium">{r.label}</td>
                                  {finalReportRealisasiPenjualan.pastMonths.map((m: number) => {
                                    const val = Math.round(finalReportRealisasiPenjualan.finalTotals[r.key]?.[`M_${m}`] || 0);
                                    return (
                                      <td key={m} className="border border-white p-0.5">
                                        {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  })}
                                  {(() => {
                                    const val = Math.round(finalReportRealisasiPenjualan.finalTotals[r.key]?.[`M_${finalReportRealisasiPenjualan.latestMonth}`] || 0);
                                    return (
                                      <td className="border border-white p-0.5">
                                        {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  })()}
                                  {finalReportRealisasiPenjualan.weeks.map((w: string) => {
                                    const val = Math.round(finalReportRealisasiPenjualan.finalTotals[r.key]?.[w] || 0);
                                    return (
                                      <td key={w} className="border border-white p-0.5">
                                        {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  })}
                                  <td className="border border-white p-0.5 font-bold bg-[#548235]/20">
                                    {realSd > 0 ? realSd.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white p-0.5 font-medium">
                                    {targetVal > 0 ? targetVal.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white p-0.5 font-bold">
                                    {vsTgt}
                                  </td>
                                </tr>
                              );
                            })}
                            {(() => {
                              const realSdTotal = Math.round(finalReportRealisasiPenjualan.finalTotals['GRAND TOTAL']?.['REAL_SD'] || 0);
                              const targetTotal = TARGET_REALISASI_PENJUALAN_2026_TOTALS['GRAND TOTAL'] || 780631;
                              const vsTgtTotal = targetTotal > 0 && realSdTotal > 0 ? `${Math.round((realSdTotal / targetTotal) * 100)}%` : (targetTotal > 0 ? "0%" : "-");
                              return (
                                <tr className="bg-[#548235] text-white font-bold">
                                  <td colSpan={2} className="border border-white p-0.5 text-center">TOTAL</td>
                                  {finalReportRealisasiPenjualan.pastMonths.map((m: number) => {
                                    const val = Math.round(finalReportRealisasiPenjualan.finalTotals['GRAND TOTAL']?.[`M_${m}`] || 0);
                                    return (
                                      <td key={m} className="border border-white p-0.5">
                                        {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  })}
                                  {(() => {
                                    const val = Math.round(finalReportRealisasiPenjualan.finalTotals['GRAND TOTAL']?.[`M_${finalReportRealisasiPenjualan.latestMonth}`] || 0);
                                    return (
                                      <td className="border border-white p-0.5">
                                        {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  })()}
                                  {finalReportRealisasiPenjualan.weeks.map((w: string) => {
                                    const val = Math.round(finalReportRealisasiPenjualan.finalTotals['GRAND TOTAL']?.[w] || 0);
                                    return (
                                      <td key={w} className="border border-white p-0.5">
                                        {val > 0 ? val.toLocaleString('id-ID') : "-"}
                                      </td>
                                    );
                                  })}
                                  <td className="border border-white p-0.5 font-bold">
                                    {realSdTotal > 0 ? realSdTotal.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white p-0.5 font-medium">
                                    {targetTotal > 0 ? targetTotal.toLocaleString('id-ID') : "-"}
                                  </td>
                                  <td className="border border-white p-0.5 font-bold">
                                    {vsTgtTotal}
                                  </td>
                                </tr>
                              );
                            })()}
                          </>
                        );
                      })()}
                    </tbody>
                  </>
                ) : (
                  <>
                    <thead className="bg-[#70AD47] text-white text-center">
                      <tr className="text-[7.5px] uppercase font-bold">
                        <th rowSpan={2} className="border border-white p-0.5 w-4 bg-[#70AD47]">NO</th>
                        <th rowSpan={2} className="border border-white p-0.5 w-14 bg-[#70AD47] text-left">LOKASI</th>
                        <th className="border border-white p-0.5">JAN</th>
                        <th className="border border-white p-0.5">FEB</th>
                        <th className="border border-white p-0.5">MAR</th>
                        <th className="border border-white p-0.5">APR</th>
                        <th className="border border-white p-0.5">MEI</th>
                        <th className="border border-white p-0.5">JUN</th>
                        <th className="border border-white p-0.5">JUL</th>
                        <th colSpan={5} className="border border-white p-0.5 bg-[#548235]">MINGGUAN</th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#548235] min-w-[36px]">REAL S/D<br/>JULI</th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#548235] min-w-[34px]">TARGET<br/>2026</th>
                        <th rowSpan={2} className="border border-white p-0.5 bg-[#548235] min-w-[30px]">VS TGT<br/>2026<br/>(%)</th>
                      </tr>
                      <tr className="text-[6.5px] text-center font-normal bg-[#70AD47]">
                        <th className="border border-white p-0.5">(Rp Juta)</th>
                        <th className="border border-white p-0.5">(Rp Juta)</th>
                        <th className="border border-white p-0.5">(Rp Juta)</th>
                        <th className="border border-white p-0.5">(Rp Juta)</th>
                        <th className="border border-white p-0.5">(Rp Juta)</th>
                        <th className="border border-white p-0.5">(Rp Juta)</th>
                        <th className="border border-white p-0.5">(Rp Juta)</th>
                        <th className="border border-white p-0.5 bg-[#548235]">1-5 JULI</th>
                        <th className="border border-white p-0.5 bg-[#548235]">6-12 JULI</th>
                        <th className="border border-white p-0.5 bg-[#548235]">13-19 JULI</th>
                        <th className="border border-white p-0.5 bg-[#548235]">20-26 JULI</th>
                        <th className="border border-white p-0.5 bg-[#548235]">27-31 JULI</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#E2F0D9]">
                      <tr>
                        <td className="border border-white p-0.5 text-center">1</td>
                        <td className="border border-white p-0.5 text-left font-medium">PRODUK</td>
                        <td className="border border-white p-0.5">77.539</td>
                        <td className="border border-white p-0.5">100.210</td>
                        <td className="border border-white p-0.5">115.002</td>
                        <td className="border border-white p-0.5">141.850</td>
                        <td className="border border-white p-0.5">114.967</td>
                        <td className="border border-white p-0.5">123.864</td>
                        <td className="border border-white p-0.5">152.889</td>
                        <td className="border border-white p-0.5">13.598</td>
                        <td className="border border-white p-0.5">27.698</td>
                        <td className="border border-white p-0.5">16.420</td>
                        <td className="border border-white p-0.5">43.352</td>
                        <td className="border border-white p-0.5">31.821</td>
                        <td className="border border-white p-0.5 font-bold">826.321</td>
                        <td className="border border-white p-0.5">754.390</td>
                        <td className="border border-white p-0.5 font-bold">110%</td>
                      </tr>
                      <tr>
                        <td className="border border-white p-0.5 text-center">2</td>
                        <td className="border border-white p-0.5 text-left font-medium">JASA</td>
                        <td className="border border-white p-0.5">-</td>
                        <td className="border border-white p-0.5">467</td>
                        <td className="border border-white p-0.5">199</td>
                        <td className="border border-white p-0.5">664</td>
                        <td className="border border-white p-0.5">221</td>
                        <td className="border border-white p-0.5">777</td>
                        <td className="border border-white p-0.5">1.487</td>
                        <td className="border border-white p-0.5">17</td>
                        <td className="border border-white p-0.5">28</td>
                        <td className="border border-white p-0.5">203</td>
                        <td className="border border-white p-0.5">288</td>
                        <td className="border border-white p-0.5">862</td>
                        <td className="border border-white p-0.5 font-bold">3.816</td>
                        <td className="border border-white p-0.5">26.241</td>
                        <td className="border border-white p-0.5 font-bold">15%</td>
                      </tr>
                      <tr className="bg-[#548235] text-white font-bold">
                        <td className="border border-white p-0.5 text-center" colSpan={2}>TOTAL</td>
                        <td className="border border-white p-0.5">77.539</td>
                        <td className="border border-white p-0.5">100.678</td>
                        <td className="border border-white p-0.5">115.201</td>
                        <td className="border border-white p-0.5">142.514</td>
                        <td className="border border-white p-0.5">115.188</td>
                        <td className="border border-white p-0.5">124.641</td>
                        <td className="border border-white p-0.5">154.376</td>
                        <td className="border border-white p-0.5">13.615</td>
                        <td className="border border-white p-0.5">27.726</td>
                        <td className="border border-white p-0.5">16.623</td>
                        <td className="border border-white p-0.5">43.640</td>
                        <td className="border border-white p-0.5">32.683</td>
                        <td className="border border-white p-0.5">830.137</td>
                        <td className="border border-white p-0.5">780.631</td>
                        <td className="border border-white p-0.5">106%</td>
                      </tr>
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>

          {/* Footnote */}
          <div className="text-[8.5px] italic text-gray-700 space-y-0.5 mt-1 font-medium">
            <p>*Data diperoleh dari tarikan system ERP</p>
            <p>***Data penjualan produk termasuk hasil samping</p>
            <p>****Update Data Per {dateSubtitle}</p>
          </div>
        </div>

        {/* Right Column: Charts & KPI Summary (37% width) */}
        <div className="w-[37%] flex flex-col gap-2 pb-[72px] overflow-hidden">
          <p className="text-[6.5px] italic font-bold text-right -mb-2 text-gray-600">*Satuan dalam Ton</p>
          
          <div className="flex-1 bg-white border border-[#4472C4] rounded-xl flex flex-col p-2 relative min-h-[140px]">
            <h3 className="text-[8px] text-center mb-1 text-[#4472C4] font-bold">Realisasi Kumulatif Penjualan</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dynamicDataPenjualan || defaultDataPenjualan} margin={{ top: 14, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 7.5}} axisLine={{stroke: '#ccc'}} tickLine={false} />
                  <YAxis tick={{fontSize: 7.5}} axisLine={{stroke: '#ccc'}} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="PRODUK" stroke="#4472C4" strokeWidth={2.5} strokeDasharray="5 5" dot={{r: 2.5, fill: '#4472C4'}}>
                    <LabelList 
                      dataKey="PRODUK" 
                      position="top" 
                      offset={5} 
                      fill="#4472C4" 
                      fontSize={9} 
                      fontWeight="bold" 
                      formatter={(val: any) => (val && Number(val) > 0 ? Math.round(Number(val)).toLocaleString('id-ID') : '')} 
                    />
                  </Line>
                  <Line type="monotone" dataKey="JASA" stroke="#ED7D31" strokeWidth={2.5} strokeDasharray="5 5" dot={{r: 2.5, fill: '#ED7D31'}}>
                    <LabelList 
                      dataKey="JASA" 
                      position="top" 
                      offset={5} 
                      fill="#ED7D31" 
                      fontSize={9} 
                      fontWeight="bold" 
                      formatter={(val: any) => (val && Number(val) > 0 ? Math.round(Number(val)).toLocaleString('id-ID') : '')} 
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-[7.5px] font-bold mt-1 pb-0.5">
              <div className="flex items-center gap-1"><span className="w-3.5 h-1 bg-[#4472C4] block border-t-2 border-dashed border-[#4472C4]"></span> PRODUK</div>
              <div className="flex items-center gap-1"><span className="w-3.5 h-1 bg-[#ED7D31] block border-t-2 border-dashed border-[#ED7D31]"></span> JASA</div>
            </div>
          </div>

          <p className="text-[6.5px] italic font-bold text-right -mb-2 text-gray-600">*Satuan dalam Ton</p>

          <div className="flex-1 bg-white border border-[#70AD47] rounded-xl flex flex-col p-2 relative min-h-[140px]">
            <h3 className="text-[8px] text-center mb-1 text-[#70AD47] font-bold">Realisasi Komulatif Pengadaan</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dynamicDataPengadaan || defaultDataPengadaan} margin={{ top: 14, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 7.5}} axisLine={{stroke: '#ccc'}} tickLine={false} />
                  <YAxis tick={{fontSize: 7.5}} axisLine={{stroke: '#ccc'}} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="GABAH" stroke="#4472C4" strokeWidth={2.5} strokeDasharray="5 5" dot={{r: 2.5, fill: '#4472C4'}}>
                    <LabelList 
                      dataKey="GABAH" 
                      position="top" 
                      offset={5} 
                      fill="#4472C4" 
                      fontSize={9} 
                      fontWeight="bold" 
                      formatter={(val: any) => (val && Number(val) > 0 ? Math.round(Number(val)).toLocaleString('id-ID') : '')} 
                    />
                  </Line>
                  <Line type="monotone" dataKey="BERAS" stroke="#ED7D31" strokeWidth={2.5} strokeDasharray="5 5" dot={{r: 2.5, fill: '#ED7D31'}}>
                    <LabelList 
                      dataKey="BERAS" 
                      position="top" 
                      offset={5} 
                      fill="#ED7D31" 
                      fontSize={9} 
                      fontWeight="bold" 
                      formatter={(val: any) => (val && Number(val) > 0 ? Math.round(Number(val)).toLocaleString('id-ID') : '')} 
                    />
                  </Line>
                  <Line type="monotone" dataKey="JAGUNG" stroke="#FFC000" strokeWidth={2.5} strokeDasharray="5 5" dot={{r: 2.5, fill: '#FFC000'}}>
                    <LabelList 
                      dataKey="JAGUNG" 
                      position="top" 
                      offset={5} 
                      fill="#B8860B" 
                      fontSize={9} 
                      fontWeight="bold" 
                      formatter={(val: any) => (val && Number(val) > 0 ? Math.round(Number(val)).toLocaleString('id-ID') : '')} 
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-[7.5px] font-bold mt-1 pb-0.5">
              <div className="flex items-center gap-1"><span className="w-3.5 h-1 bg-[#4472C4] block border-t-2 border-dashed border-[#4472C4]"></span> GABAH</div>
              <div className="flex items-center gap-1"><span className="w-3.5 h-1 bg-[#ED7D31] block border-t-2 border-dashed border-[#ED7D31]"></span> BERAS</div>
              <div className="flex items-center gap-1"><span className="w-3.5 h-1 bg-[#FFC000] block border-t-2 border-dashed border-[#FFC000]"></span> JAGUNG</div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Center Bottom: Money Icon & Sales vs Target Card */}
      <div className="absolute left-[47%] -translate-x-1/2 bottom-2 flex items-center gap-4 z-20 select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/img/moneyslide1.png" 
          alt="Money Icon" 
          className="h-[68px] w-auto object-contain drop-shadow-sm" 
        />
        <div className="bg-[#7ca7df] border-2 border-[#2b5a94] px-7 py-2 text-center shadow-md">
          <div className="font-bold text-[15px] text-black tracking-wider uppercase leading-tight">
            SALES VS
          </div>
          <div className="font-extrabold text-[17px] text-black tracking-wider uppercase leading-tight mt-1 whitespace-nowrap">
            TARGET 2026 &nbsp;&nbsp;&nbsp;{salesVsTgtPercent}
          </div>
        </div>
      </div>

      {/* Decorative Wave & Slogan */}
      <SlideFooterBrandWave />
    </div>
  );
}

