import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { DATA_PENYERAPAN_2025 } from './historicalData2026';
import SlideFooterBrandWave from './SlideFooterBrandWave';

interface SlidePenyerapanGKPProps {
  report4PenyerapanData?: any;
  persediaanSPP?: Record<string, { gkpTon: number; gkgTon: number }>;
  finalReportHargaPembelian?: any;
}

export default function SlidePenyerapanGKP({ 
  report4PenyerapanData, 
  persediaanSPP,
  finalReportHargaPembelian 
}: SlidePenyerapanGKPProps) {
  // Baseline Data (31 Juli 2026 Fallback)
  const BASELINE_SPP_DATA = [
    { no: 1, name: 'SPP SUBANG', shortName: 'SUBANG', k: 6282, h: 7890, pGKP: 180, pGKG: 1510 },
    { no: 2, name: 'SPP KARAWANG', shortName: 'KARAWANG', k: 6219, h: 7734, pGKP: 32, pGKG: 2234 },
    { no: 3, name: 'SPP LAMPUNG', shortName: 'LAMPUNG', k: 4689, h: 7307, pGKP: 53, pGKG: 238 },
    { no: 4, name: 'SPP KENDAL', shortName: 'KENDAL', k: 5081, h: 7426, pGKP: 17, pGKG: 1245 },
    { no: 5, name: 'SPP SRAGEN', shortName: 'SRAGEN', k: 3672, h: 7623, pGKP: 0, pGKG: 437 },
    { no: 6, name: 'SPP MAGETAN', shortName: 'MAGETAN', k: 4860, h: 7207, pGKP: 0, pGKG: 78 },
    { no: 7, name: 'SPP BOJONEGORO', shortName: 'BOJONEGORO', k: 2804, h: 7319, pGKP: 0, pGKG: 125 },
    { no: 8, name: 'SPP JEMBER', shortName: 'JEMBER', k: 4460, h: 7429, pGKP: 0, pGKG: 159 },
    { no: 9, name: 'SPP BANYUWANGI', shortName: 'BANYUWANGI', k: 3865, h: 7445, pGKP: 0, pGKG: 425 },
    { no: 10, name: 'SPP SUMBAWA', shortName: 'SUMBAWA', k: 5145, h: 6907, pGKP: 51, pGKG: 1656 },
  ];

  // Historical GKP prices for UB Industri (Jan - Jul strictly hardcoded)
  const GABAH_HISTORICAL_PRICES: Record<number, number> = {
    0: 7111, // Jan
    1: 7371, // Feb
    2: 7213, // Mar
    3: 7386, // Apr
    4: 7749, // May
    5: 7935, // Jun
    6: 7890, // Jul
  };

  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Dynamic monthly chart data
  const lineChartData = monthNamesShort.map((mName, mIdx) => {
    // Jan - Jul (0 - 6): hardcoded baseline
    if (mIdx <= 6) {
      return {
        name: mName,
        hg: GABAH_HISTORICAL_PRICES[mIdx],
        hpp: 6500,
      };
    }

    // Dynamic calculation for Aug (7) onwards
    let dynPrice: number | null = null;
    if (finalReportHargaPembelian) {
      const p = finalReportHargaPembelian.finalTotals?.['TOTAL GABAH SPP']?.[`M_${mIdx}`]
             || finalReportHargaPembelian.finalTotals?.['JUMLAH GABAH']?.[`M_${mIdx}`];
      if (typeof p === 'number' && p > 0) {
        dynPrice = Math.round(p);
      }
    }

    if (!dynPrice && report4PenyerapanData && report4PenyerapanData.latestMonth === mIdx) {
      if (report4PenyerapanData.grandHarga > 0) {
        dynPrice = Math.round(report4PenyerapanData.grandHarga);
      }
    }

    return {
      name: mName,
      hg: dynPrice,
      hpp: dynPrice !== null ? 6500 : null,
    };
  });

  const sppList = [
    'SPP SUBANG', 'SPP KARAWANG', 'SPP LAMPUNG', 'SPP KENDAL',
    'SPP SRAGEN', 'SPP MAGETAN', 'SPP BOJONEGORO', 'SPP JEMBER',
    'SPP BANYUWANGI', 'SPP SUMBAWA'
  ];

  const isDynamic = !!(report4PenyerapanData && report4PenyerapanData.grouped && Object.keys(report4PenyerapanData.grouped).length > 0);

  const dateHeader = isDynamic 
    ? `1 JAN - ${report4PenyerapanData.latestDateFormatted.toUpperCase()}`
    : '1 Januari - 31 Juli 2026';

  const updateNote = isDynamic
    ? `*Update per ${report4PenyerapanData.latestDateFormatted}`
    : '*Update per 31 Juli 2026';

  // Sourced directly from Report 4 Tab Penyerapan (Table 3 Ringkasan Penyerapan & Persediaan SPP)
  const tableRows = sppList.map((gudang, idx) => {
    const shortName = gudang.replace('SPP ', '');
    if (isDynamic) {
      const item = report4PenyerapanData.grouped[gudang];
      const tonPenyerapan = item?.totalQty > 0 ? Math.round(item.totalQty / 1000) : 0;
      const hargaRata = item?.harga > 0 ? item.harga : 0;
      const gkpTon = persediaanSPP?.[gudang]?.gkpTon ? Math.round(persediaanSPP[gudang].gkpTon) : 0;
      const gkgTon = persediaanSPP?.[gudang]?.gkgTon ? Math.round(persediaanSPP[gudang].gkgTon) : 0;
      return {
        no: idx + 1,
        name: gudang,
        shortName,
        tonPenyerapan,
        hargaRata,
        gkpTon,
        gkgTon,
      };
    } else {
      const b = BASELINE_SPP_DATA[idx];
      return {
        no: b.no,
        name: b.name,
        shortName: b.shortName,
        tonPenyerapan: b.k,
        hargaRata: b.h,
        gkpTon: b.pGKP,
        gkgTon: b.pGKG,
      };
    }
  });

  const totalTonPenyerapan = (isDynamic && report4PenyerapanData?.grandTotalQty > 0)
    ? Math.round(report4PenyerapanData.grandTotalQty / 1000)
    : tableRows.reduce((acc, r) => acc + r.tonPenyerapan, 0);
  const grandHarga = isDynamic 
    ? (report4PenyerapanData.grandHarga || 0)
    : 7448;
  const totalGkpTon = tableRows.reduce((acc, r) => acc + r.gkpTon, 0);
  const totalGkgTon = tableRows.reduce((acc, r) => acc + r.gkgTon, 0);

  // Sourced directly from Report 4 Tab Penyerapan (Table 2 Perbandingan 2026 vs 2025)
  const chartData = tableRows.map((r) => {
    const d2025 = DATA_PENYERAPAN_2025[r.name] || { ton: 0, rp: 0 };
    return {
      name: r.shortName,
      tonase2026: r.tonPenyerapan,
      tonase2025: d2025.ton,
      harga2026: r.hargaRata,
      harga2025: d2025.rp,
    };
  });

  const maxTon = Math.max(...chartData.map(d => Math.max(d.tonase2026 || 0, d.tonase2025 || 0)), 10000);
  const yLeftMax = Math.max(12000, Math.ceil((maxTon * 1.25) / 1000) * 1000);

  // Custom Bar & Line Label Renderers for Crisp Formatting
  const renderBar2026Label = (props: any) => {
    const { x, y, width, value } = props;
    if (!value || value <= 0) return null;
    return (
      <text x={x + width / 2} y={y - 3} fill="#1D63A8" textAnchor="middle" fontSize={7.5} fontWeight="bold">
        {value.toLocaleString('id-ID')}
      </text>
    );
  };

  const renderBar2025Label = (props: any) => {
    const { x, y, width, value } = props;
    if (!value || value <= 0) return null;
    return (
      <text x={x + width / 2} y={y - 3} fill="#C55A11" textAnchor="middle" fontSize={7.5} fontWeight="bold">
        {value.toLocaleString('id-ID')}
      </text>
    );
  };

  const renderLine2026Label = (props: any) => {
    const { x, y, value } = props;
    if (!value || value <= 0) return null;
    return (
      <text x={x} y={y - 6} fill="#4b5563" textAnchor="middle" fontSize={7.5} fontWeight="bold">
        {value.toLocaleString('id-ID')}
      </text>
    );
  };

  const renderLine2025Label = (props: any) => {
    const { x, y, value } = props;
    if (!value || value <= 0) return null;
    return (
      <text x={x} y={y + 12} fill="#b45309" textAnchor="middle" fontSize={7.5} fontWeight="bold">
        {value.toLocaleString('id-ID')}
      </text>
    );
  };

  const renderBlueLineLabel = (props: any) => {
    const { x, y, value } = props;
    if (!value || value <= 0) return null;
    return (
      <text x={x} y={y - 7} fill="#1f2937" textAnchor="middle" fontSize={8.5} fontWeight="bold">
        {value.toLocaleString('id-ID')}
      </text>
    );
  };

  const renderOrangeLineLabel = (props: any) => {
    const { x, y, value } = props;
    if (!value || value <= 0) return null;
    return (
      <text x={x} y={y + 15} fill="#1f2937" textAnchor="middle" fontSize={8.5} fontWeight="bold">
        {value.toLocaleString('id-ID')}
      </text>
    );
  };

  return (
    <div className="w-[1280px] h-[720px] bg-[#fdfdfd] border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-6 py-4 font-sans text-gray-800">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-start mb-2 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center pt-1">
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight uppercase font-sans">
            PENYERAPAN GKP SPP UB INDUSTRI TAHUN 2026
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      {/* TOP SECTION: 2 Columns (Table 1 on Left, Combo Chart on Right) */}
      <div className="flex gap-5 w-full items-start shrink-0">
        
        {/* Left: Table 1 (Ringkasan Penyerapan & Persediaan SPP) */}
        <div className="w-1/2">
          <table className="w-full border-collapse border border-white text-[9.5px] leading-tight shadow-sm">
            <thead>
              <tr className="bg-[#1D63A8] text-white text-center font-bold">
                <th colSpan={6} className="border border-white py-1 px-2 text-[11px] tracking-wide uppercase">
                  {dateHeader}
                </th>
              </tr>
              <tr className="bg-[#2B75BA] text-white text-center font-bold">
                <th rowSpan={2} className="border border-white py-1 px-1.5 w-7">No</th>
                <th rowSpan={2} className="border border-white py-1 px-2 text-left min-w-[110px]">Lokasi</th>
                <th colSpan={2} className="border border-white py-0.5 px-2">Penyerapan</th>
                <th colSpan={2} className="border border-white py-0.5 px-2">Persediaan</th>
              </tr>
              <tr className="bg-[#2B75BA] text-white text-center font-semibold text-[8.5px]">
                <th className="border border-white py-0.5 px-1.5 whitespace-nowrap">Kuantum<br/>Penyerapan (Ton)</th>
                <th className="border border-white py-0.5 px-1.5 whitespace-nowrap">Harga Rata-<br/>Rata (Rp)</th>
                <th className="border border-white py-0.5 px-1.5 whitespace-nowrap">Persediaan<br/>GKP (TON)</th>
                <th className="border border-white py-0.5 px-1.5 whitespace-nowrap">Persediaan<br/>GKG (TON)</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, idx) => {
                const bgRow = idx % 2 === 0 ? "bg-[#e8f1fa]" : "bg-white";
                return (
                  <tr key={r.no} className={`${bgRow} text-black hover:bg-blue-100/50 transition-colors`}>
                    <td className="border border-white py-[2.5px] px-1 text-center font-medium">{r.no}</td>
                    <td className="border border-white py-[2.5px] px-2 font-medium">{r.name}</td>
                    <td className="border border-white py-[2.5px] px-2 text-right">{r.tonPenyerapan > 0 ? r.tonPenyerapan.toLocaleString('id-ID') : "-"}</td>
                    <td className="border border-white py-[2.5px] px-2 text-right font-medium">{r.hargaRata > 0 ? r.hargaRata.toLocaleString('id-ID') : "-"}</td>
                    <td className="border border-white py-[2.5px] px-2 text-right">{r.gkpTon > 0 ? r.gkpTon.toLocaleString('id-ID') : "-"}</td>
                    <td className="border border-white py-[2.5px] px-2 text-right">{r.gkgTon > 0 ? r.gkgTon.toLocaleString('id-ID') : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#1D63A8] text-white font-bold">
                <td colSpan={2} className="border border-white py-1 px-2 text-center">TOTAL</td>
                <td className="border border-white py-1 px-2 text-right">{totalTonPenyerapan.toLocaleString('id-ID')}</td>
                <td className="border border-white py-1 px-2 text-right">{grandHarga > 0 ? grandHarga.toLocaleString('id-ID') : "-"}</td>
                <td className="border border-white py-1 px-2 text-right">{totalGkpTon > 0 ? totalGkpTon.toLocaleString('id-ID') : "-"}</td>
                <td className="border border-white py-1 px-2 text-right">{totalGkgTon > 0 ? totalGkgTon.toLocaleString('id-ID') : "-"}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Right: Combo Chart (Perbandingan Realisasi Pengadaan Gabah) + updateNote */}
        <div className="w-1/2 flex flex-col">
          <div className="w-full h-[275px] bg-white border border-gray-200 rounded-lg p-2.5 flex flex-col shadow-sm">
            <h3 className="text-center font-bold text-[13px] text-gray-900 mb-0.5 tracking-tight">
              Perbandingan Realisasi Pengadaan Gabah
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 18, right: 20, left: -5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 7.5, fill: '#374151', fontWeight: 600 }} 
                    interval={0} 
                    axisLine={{ stroke: '#d1d5db' }} 
                    tickLine={false} 
                    tickMargin={4} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    domain={[0, yLeftMax]} 
                    tick={{ fontSize: 8, fill: '#6b7280' }} 
                    axisLine={false} 
                    tickLine={false} 
                    width={36}
                    tickFormatter={(v) => v.toLocaleString('id-ID')}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    domain={[5000, 8500]} 
                    tick={{ fontSize: 8, fill: '#6b7280' }} 
                    axisLine={false} 
                    tickLine={false} 
                    width={36}
                    tickFormatter={(v) => v.toLocaleString('id-ID')}
                  />
                  <Tooltip 
                    formatter={(val: any, name: any) => {
                      const num = typeof val === 'number' ? val : 0;
                      if (name.includes('Harga')) {
                        return [`Rp ${num.toLocaleString('id-ID')}`, name];
                      }
                      return [`${num.toLocaleString('id-ID')} Ton`, name];
                    }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    wrapperStyle={{ fontSize: '9.5px', paddingTop: '4px' }} 
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="tonase2026" 
                    name="Tonase 2026" 
                    fill="#2F5597" 
                    barSize={14} 
                    label={renderBar2026Label} 
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="tonase2025" 
                    name="Tonase 2025" 
                    fill="#ED7D31" 
                    barSize={14} 
                    label={renderBar2025Label} 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="harga2026" 
                    name="Harga 2026" 
                    stroke="#7F7F7F" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#7F7F7F', stroke: '#fff', strokeWidth: 1 }} 
                    label={renderLine2026Label} 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="harga2025" 
                    name="Harga 2025" 
                    stroke="#FFC000" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#FFC000', stroke: '#fff', strokeWidth: 1 }} 
                    label={renderLine2025Label} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-right italic font-bold text-[11px] text-gray-700 pr-1 mt-1">
            {updateNote}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Centered Line Chart "Rata Rata Pembelian Gabah" */}
      <div className="w-full flex justify-center mt-2.5 min-h-0 flex-1">
        <div className="w-[78%] h-[270px] bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col">
          <h3 className="text-center font-bold text-[13.5px] text-gray-900 mb-1 tracking-tight">
            Rata Rata Pembelian Gabah
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 9.5, fill: '#374151', fontWeight: 500 }} 
                  axisLine={{ stroke: '#d1d5db' }} 
                  tickLine={false} 
                />
                <YAxis 
                  domain={[5000, 8500]} 
                  ticks={[5000, 5900, 6800, 7700, 8500]} 
                  tick={{ fontSize: 9, fill: '#6b7280' }} 
                  axisLine={false} 
                  tickLine={false} 
                  width={42} 
                  tickFormatter={(v) => v.toLocaleString('id-ID')} 
                />
                <Tooltip 
                  formatter={(val: any, name: any) => {
                    const num = typeof val === 'number' ? val : 0;
                    return [`Rp ${num.toLocaleString('id-ID')}`, name];
                  }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  wrapperStyle={{ fontSize: '10.5px', paddingTop: '6px', fontWeight: 600 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="hpp" 
                  name="HPP Bapanas" 
                  stroke="#ED7D31" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#fff', stroke: '#ED7D31', strokeWidth: 2 }} 
                  label={renderOrangeLineLabel} 
                />
                <Line 
                  type="monotone" 
                  dataKey="hg" 
                  name="UB Industri" 
                  stroke="#2E75B6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#fff', stroke: '#2E75B6', strokeWidth: 2 }} 
                  label={renderBlueLineLabel} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
