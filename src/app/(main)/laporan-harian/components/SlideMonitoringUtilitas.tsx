import React from 'react';
import Image from 'next/image';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export default function SlideMonitoringUtilitas() {
  const data = [
    { id: 1, name: 'SPP Subang', r2025: 10980, target: 9500, makloon: null, mo: 6102289, ton: 6102, util: 64, vs: 56 },
    { id: 2, name: 'SPP Karawang', r2025: 12862, target: 10500, makloon: null, mo: 6186731, ton: 6187, util: 59, vs: 48 },
    { id: 3, name: 'SPP Lampung', r2025: 6795, target: 7500, makloon: null, mo: 4635730, ton: 4636, util: 62, vs: 68 },
    { id: 4, name: 'SPP Kendal', r2025: 7039, target: 7000, makloon: null, mo: 4421850, ton: 4422, util: 63, vs: 63 },
    { id: 5, name: 'SPP Sragen', r2025: 4739, target: 6200, makloon: null, mo: 3672040, ton: 3672, util: 59, vs: 77 },
    { id: 6, name: 'SPP Bojonegoro', r2025: 5888, target: 6500, makloon: null, mo: 2804210, ton: 2804, util: 43, vs: 48 },
    { id: 7, name: 'SPP Jember', r2025: 6387, target: 6500, makloon: null, mo: 4473750, ton: 4474, util: 69, vs: 70 },
    { id: 8, name: 'SPP Banyuwangi', r2025: 4254, target: 6700, makloon: null, mo: 3789670, ton: 3790, util: 57, vs: 89 },
    { id: 9, name: 'SPP Magetan', r2025: 8826, target: 7000, makloon: null, mo: 4859920, ton: 4860, util: 69, vs: 55 },
    { id: 10, name: 'SPP Sumbawa', r2025: 7523, target: 7700, makloon: null, mo: 4764790, ton: 4765, util: 62, vs: 63 },
  ];

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-8 py-5 font-sans text-gray-800">
      
      {/* Header Logos */}
      <div className="flex justify-between items-start mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center">
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight">
            MONITORING UTILITAS INFRASTRUKTUR
            <br />
            (Dryer)
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      {/* Main Table */}
      <div className="w-[95%] mx-auto mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0070C0] text-white text-[10px] text-center font-bold">
              <th rowSpan={2} className="border border-white px-[2px] py-1 w-8">NO</th>
              <th rowSpan={2} className="border border-white px-[2px] py-1 w-40 text-left">INFRASTRUKTUR</th>
              <th className="border border-white px-[2px] py-1">REALISASI<br/>PENYERAPAN<br/>(TON)</th>
              <th rowSpan={2} className="border border-white px-[2px] py-1">TARGET UTILITAS<br/>PENGERINGAN<br/>SAMPAI TANGGAL<br/>31 DESEMBER<br/>2026 (TON)</th>
              <th colSpan={2} className="border border-white px-[2px] py-1">REALISASI PENGERINGAN<br/>PER TANGGAL 23 JULI<br/>2026 (KG)</th>
              <th rowSpan={2} className="border border-white px-[2px] py-1">REALISASI<br/>PENGERINGAN<br/>PER TANGGAL<br/>23 JULI 2026<br/>(TON)</th>
              <th className="border border-white px-[2px] py-1">% UTILISASI<br/>REALISASI<br/>DRYER</th>
              <th className="border border-white px-[2px] py-1">% REALISASI</th>
            </tr>
            <tr className="bg-[#0070C0] text-white text-[10px] text-center font-bold">
              <th className="border border-white px-[2px] py-1">2025</th>
              <th className="border border-white px-[2px] py-1">MAKLOON</th>
              <th className="border border-white px-[2px] py-1">MO</th>
              <th className="border border-white px-[2px] py-1">S/D 23 JULI<br/>2026</th>
              <th className="border border-white px-[2px] py-1">VS 2025</th>
            </tr>
          </thead>
          <tbody className="bg-[#EAF1F8] text-[12px]">
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
            <tr className="bg-[#0070C0] text-white font-bold text-[12px]">
              <td colSpan={2} className="border border-white px-[3px] py-1 text-center">Jumlah</td>
              <td className="border border-white px-[3px] py-1 text-right">75.292</td>
              <td className="border border-white px-[3px] py-1 text-right">75.100</td>
              <td className="border border-white px-[3px] py-1 text-center">-</td>
              <td className="border border-white px-[3px] py-1 text-right">45.710.980</td>
              <td className="border border-white px-[3px] py-1 text-right">45.711</td>
              <td className="border border-white px-[3px] py-1 text-right">61%</td>
              <td className="border border-white px-[3px] py-1 text-right">61%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="w-[90%] mx-auto border-2 border-dashed border-[#F2C94C] rounded-2xl px-6 py-4 bg-[#FEFBF3] shadow-sm">
        <ul className="space-y-3 text-[14px] text-black">
          <li className="flex items-start gap-3">
            <span className="font-bold text-base leading-tight mt-0.5">&#10003;</span>
            <p>
              Penyerapan dilakukan <u>setiap hari</u> dimasa panen di luar kebutuhan <i>maintenance, pembersihan,</i> dan <u>perbaikan</u>.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-base leading-tight mt-0.5">&#10003;</span>
            <p>
              Utilitas <strong>pengeringan GKP s/d 23 Juli 2026</strong> sebesar <strong>45.711 ton</strong> atau <strong>senilai 61% dari target utilitas tahun 2026</strong>
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-base leading-tight mt-0.5">&#10003;</span>
            <p>
              Terdapat tantangan mundurnya masa panen dan <i>downtime</i> pabrik dikarenakan kebutuhan <i>maintenance</i>, pembersihan, perbaikan dan ketersediaan suku cadang.
            </p>
          </li>
        </ul>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
