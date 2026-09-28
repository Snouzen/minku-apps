import React from 'react';
import Image from 'next/image';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export default function SlideMonitoringUtilitasRMUSPP() {
  const data = [
    { id: 1, name: 'SPP Subang', r2025: 8047, target: 9175, makloon: null, mo: 6454456, ton: 6454, util: 70, vs: 80 },
    { id: 2, name: 'SPP Karawang', r2025: 9463, target: 9625, makloon: null, mo: 5266055, ton: 5266, util: 55, vs: 80 },
    { id: 3, name: 'SPP Lampung', r2025: 6563, target: 6875, makloon: null, mo: 5162571, ton: 5163, util: 75, vs: 68 },
    { id: 4, name: 'SPP Kendal', r2025: 7563, target: 6750, makloon: null, mo: 5612436, ton: 5612, util: 83, vs: 101 },
    { id: 5, name: 'SPP Sragen', r2025: 5564, target: 6470, makloon: null, mo: 7484981, ton: 7485, util: 116, vs: 166 },
    { id: 6, name: 'SPP Bojonegoro', r2025: 4497, target: 6525, makloon: null, mo: 4240891, ton: 4241, util: 65, vs: 54 },
    { id: 7, name: 'SPP Jeber', r2025: 7817, target: 6525, makloon: null, mo: 4878626, ton: 4879, util: 75, vs: 88 },
    { id: 8, name: 'SPP Banyuwangi', r2025: 5561, target: 6595, makloon: null, mo: 3832479, ton: 3832, util: 58, vs: 51 },
    { id: 9, name: 'SPP Magetan', r2025: 7584, target: 6670, makloon: null, mo: 6870231, ton: 6870, util: 103, vs: 119 },
    { id: 10, name: 'SPP Sumbawa', r2025: 5797, target: 6915, makloon: null, mo: 3647291, ton: 3647, util: 53, vs: 5 },
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
            (Rice Milling Unit - SPP)
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      {/* Main Table */}
      <div className="w-[90%] mx-auto mb-4 mt-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0070C0] text-white text-[10px] text-center font-bold">
              <th rowSpan={2} className="border border-white px-[2px] py-1 w-8">NO</th>
              <th rowSpan={2} className="border border-white px-[2px] py-1 w-40 text-left">INFRASTRUKTUR</th>
              <th className="border border-white px-[2px] py-1">REALISASI<br/>PENGOLAHAN<br/>(TON)</th>
              <th className="border border-white px-[2px] py-1">TARGET<br/>UTILITAS sd<br/>31 DESEMBER<br/>2026 (TON)</th>
              <th colSpan={2} className="border border-white px-[2px] py-1">REALISASI UTILITAS<br/>SAMPAI 23 JULI 2026 (KG)</th>
              <th className="border border-white px-[2px] py-1">REALISASI<br/>PRODUK &<br/>JASA (TON)<br/>SAMPAI 23<br/>JULI 2026</th>
              <th className="border border-white px-[2px] py-1">%<br/>REALISASI<br/>UTILITAS<br/>RMU</th>
              <th className="border border-white px-[2px] py-1">%<br/>REALISASI<br/>SETARA<br/>BERAS</th>
            </tr>
            <tr className="bg-[#0070C0] text-white text-[10px] text-center font-bold">
              <th className="border border-white px-[2px] py-1">2025</th>
              <th className="border border-white px-[2px] py-1">BERAS</th>
              <th className="border border-white px-[2px] py-1">MAKLOON</th>
              <th className="border border-white px-[2px] py-1">BERAS (MO)</th>
              <th className="border border-white px-[2px] py-1">BERAS</th>
              <th className="border border-white px-[2px] py-1">S/D 23 JULI<br/>2026</th>
              <th className="border border-white px-[2px] py-1">2025</th>
            </tr>
          </thead>
          <tbody className="bg-[#EAF1F8] text-[13px]">
            {data.map((row) => (
              <tr key={row.id}>
                <td className="border border-white px-[3px] py-1 text-center">{row.id}</td>
                <td className="border border-white px-[3px] py-1">{row.name}</td>
                <td className="border border-white px-[3px] py-1 text-right">{row.r2025.toLocaleString('id-ID')}</td>
                <td className="border border-white px-[3px] py-1 text-right">{row.target.toLocaleString('id-ID')}</td>
                <td className="border border-white px-[3px] py-1 text-center">-</td>
                <td className="border border-white px-[3px] py-1 text-right">{row.mo.toLocaleString('id-ID')}</td>
                <td className="border border-white px-[3px] py-1 text-right">{row.ton.toLocaleString('id-ID')}</td>
                <td className="border border-white px-[3px] py-1 text-right">{row.util}%</td>
                <td className="border border-white px-[3px] py-1 text-right">{row.vs}%</td>
              </tr>
            ))}
            <tr className="bg-[#0070C0] text-white font-bold text-[13px]">
              <td colSpan={2} className="border border-white px-[3px] py-1.5 text-center">TOTAL SPP</td>
              <td className="border border-white px-[3px] py-1.5 text-right">68.457</td>
              <td className="border border-white px-[3px] py-1.5 text-right">72.125</td>
              <td className="border border-white px-[3px] py-1.5 text-center">-</td>
              <td className="border border-white px-[3px] py-1.5 text-right">53.450.016</td>
              <td className="border border-white px-[3px] py-1.5 text-right">53.450</td>
              <td className="border border-white px-[3px] py-1.5 text-right">74%</td>
              <td className="border border-white px-[3px] py-1.5 text-right">78%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="w-[85%] mx-auto border-2 border-dashed border-[#F2C94C] rounded-2xl px-6 py-5 bg-[#FEFBF3] shadow-sm mt-4">
        <ul className="space-y-4 text-[16px] text-black">
          <li className="flex items-start gap-3">
            <span className="font-bold text-lg leading-tight mt-0.5">&#10003;</span>
            <p>
              Realisasi <strong>RMU SPP s/d 23 Juli 2026</strong> sebesar <strong>53.450 ton</strong> atau senilai <strong>74% dari target utilitas tahun 2026</strong>
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-lg leading-tight mt-0.5">&#10003;</span>
            <p>
              Utilisasi SPP utamanya <strong>berasal dari kegiatan produksi beras.</strong>
            </p>
          </li>
        </ul>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
