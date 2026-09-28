import React from 'react';
import Image from 'next/image';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export default function SlideMonitoringUtilitasRMUSPB() {
  const data = [
    { id: 1, name: 'SPP DKI Jakarta', r2025: 4817, target: 3403, makloon: null, mo: 2964528, ton: 2965, util: 87, vs: 62 },
    { id: 2, name: 'SPB Indramayu', r2025: 2230, target: 3397, makloon: null, mo: 2792370, ton: 2792, util: 82, vs: 125 },
    { id: 3, name: 'SPB Sukoharjo', r2025: 2051, target: 3400, makloon: null, mo: 4036170, ton: 4036, util: 119, vs: 197 },
    { id: 4, name: 'SPB Sidoarjo', r2025: 1387, target: 3400, makloon: null, mo: 2107315, ton: 2107, util: 62, vs: 152 },
    { id: 5, name: 'SPB Lombok Timur', r2025: 1291, target: 3400, makloon: null, mo: 1625175, ton: 1625, util: 48, vs: 126 },
    { id: 6, name: 'SPB Makassar', r2025: 2741, target: 3400, makloon: null, mo: 4442850, ton: 4443, util: 131, vs: 162 },
    { id: 7, name: 'SPB Sidrap', r2025: 666, target: 3250, makloon: null, mo: 1473200, ton: 1473, util: 45, vs: 221 },
  ];

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-8 py-5 font-sans text-gray-800">
      
      {/* Header Logos */}
      <div className="flex justify-between items-start mb-4 mt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center">
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight">
            MONITORING UTILITAS INFRASTRUKTUR
            <br />
            (Rice Milling Unit - SPB)
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      {/* Main Table */}
      <div className="w-[90%] mx-auto mb-4 mt-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0070C0] text-white text-[11px] text-center font-bold">
              <th rowSpan={2} className="border border-white px-[3px] py-2 w-10">NO</th>
              <th rowSpan={2} className="border border-white px-[3px] py-2 w-48 text-left">INFRASTRUKTUR</th>
              <th className="border border-white px-[3px] py-2">REALISASI<br/>PENGOLAHAN<br/>(TON)</th>
              <th className="border border-white px-[3px] py-2">TARGET<br/>UTILITAS sd<br/>31 DESEMBER<br/>2026 (TON)</th>
              <th colSpan={2} className="border border-white px-[3px] py-2">REALISASI UTILITAS<br/>SAMPAI 23 JULI 2026 (KG)</th>
              <th className="border border-white px-[3px] py-2">REALISASI<br/>PRODUK &<br/>JASA (TON)<br/>SAMPAI 23<br/>JULI 2026</th>
              <th className="border border-white px-[3px] py-2">%<br/>REALISASI<br/>UTILITAS<br/>RMU</th>
              <th className="border border-white px-[3px] py-2">%<br/>REALISASI<br/>SETARA<br/>BERAS</th>
            </tr>
            <tr className="bg-[#0070C0] text-white text-[11px] text-center font-bold">
              <th className="border border-white px-[3px] py-2">2025</th>
              <th className="border border-white px-[3px] py-2">BERAS</th>
              <th className="border border-white px-[3px] py-2">MAKLOON</th>
              <th className="border border-white px-[3px] py-2">BERAS (MO)</th>
              <th className="border border-white px-[3px] py-2">BERAS</th>
              <th className="border border-white px-[3px] py-2">S/D 23 JULI<br/>2026</th>
              <th className="border border-white px-[3px] py-2">2025</th>
            </tr>
          </thead>
          <tbody className="bg-[#EAF1F8] text-[13px]">
            {data.map((row) => (
              <tr key={row.id}>
                <td className="border border-white px-[3px] py-1.5 text-center">{row.id}</td>
                <td className="border border-white px-[3px] py-1.5">{row.name.replace('SPP', 'SPB')}</td>
                <td className="border border-white px-[3px] py-1.5 text-right">{row.r2025.toLocaleString('id-ID')}</td>
                <td className="border border-white px-[3px] py-1.5 text-right">{row.target.toLocaleString('id-ID')}</td>
                <td className="border border-white px-[3px] py-1.5 text-center">-</td>
                <td className="border border-white px-[3px] py-1.5 text-right">{row.mo.toLocaleString('id-ID')}</td>
                <td className="border border-white px-[3px] py-1.5 text-right">{row.ton.toLocaleString('id-ID')}</td>
                <td className="border border-white px-[3px] py-1.5 text-right">{row.util}%</td>
                <td className="border border-white px-[3px] py-1.5 text-right">{row.vs}%</td>
              </tr>
            ))}
            <tr className="bg-[#0070C0] text-white font-bold text-[13px]">
              <td colSpan={2} className="border border-white px-[3px] py-1.5 text-center">TOTAL SPB</td>
              <td className="border border-white px-[3px] py-1.5 text-right">15.183</td>
              <td className="border border-white px-[3px] py-1.5 text-right">23.650</td>
              <td className="border border-white px-[3px] py-1.5 text-center">-</td>
              <td className="border border-white px-[3px] py-1.5 text-right">19.441.608</td>
              <td className="border border-white px-[3px] py-1.5 text-right">19.442</td>
              <td className="border border-white px-[3px] py-1.5 text-right">82%</td>
              <td className="border border-white px-[3px] py-1.5 text-right">128%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="w-[85%] mx-auto border-2 border-dashed border-[#F2C94C] rounded-2xl px-6 py-4 bg-[#FEFBF3] shadow-sm mt-4">
        <ul className="space-y-4 text-[16px] text-black">
          <li className="flex items-start gap-3">
            <span className="font-bold text-lg leading-tight mt-0.5">&#10003;</span>
            <p>
              Realisasi <strong>RMU SPB s/d 23 Juli 2026</strong> sebesar <strong>19.442 ton</strong> atau senilai <strong>82% dari target utilitas tahun 2026</strong>
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-lg leading-tight mt-0.5">&#10003;</span>
            <p>
              Utilisasi SPB <strong>berasal dari kegiatan produksi, olah, reproses dan rebagging, baik untuk kebutuhan PSO maupun komersial</strong>
            </p>
          </li>
        </ul>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
