import React from 'react';
import SlideFooterBrandWave from './SlideFooterBrandWave';
import { MaklonSummary } from './maklon';
import MaklonFinalTable from './MaklonFinalTable';

// Slide 5 uses exactly the same final-report data and table as Data Maklon.
export default function SlideRealisasiPSOMakloon({ maklonSummary }: { maklonSummary: MaklonSummary }) {
  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-8 py-4 font-sans text-black">
      {/* Header Logos */}
      <div className="flex justify-between items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center pt-1">
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight">REALISASI MAKLON UB INDUSTRI</h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>
      {/* Single full-width Final Report table, including its dynamic SO date. */}
      <div className="w-full mt-3">
        <MaklonFinalTable summary={maklonSummary} compact />
        <p className="mt-2 text-[10px] text-black italic">* Kuantum kumulatif Januari–Juli 2026 + data ERP Agustus–aktual. Kuantum upload mengikuti So Quantity.</p>
      </div>
      <SlideFooterBrandWave />
    </div>
  );
}
