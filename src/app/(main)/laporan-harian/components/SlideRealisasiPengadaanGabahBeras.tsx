import React from 'react';
import Image from 'next/image';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export default function SlideRealisasiPengadaanGabahBeras({ finalReportPengadaanUB }: { finalReportPengadaanUB?: any }) {
  const defaultData = [
    { no: 1, name: 'SPP SUBANG', tg: '9.500', tb: '1.100', tj: '-', r30g: '6.243', r30b: '-', r30j: '-', r31g: '39', r31b: '-', r31j: '-', rTg: '6.282', rTb: '-', rTj: '-', pcG: '66%', pcB: '0%', pcJ: '-', hgJul: '8.152', hgReal: '7.890', hbJul: '-', hbReal: '-', hjJul: '-', hjReal: '-' },
    { no: 2, name: 'SPP KARAWANG', tg: '10.500', tb: '700', tj: '-', r30g: '6.219', r30b: '-', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '6.219', rTb: '-', rTj: '-', pcG: '59%', pcB: '0%', pcJ: '-', hgJul: '7.852', hgReal: '7.734', hbJul: '-', hbReal: '-', hjJul: '-', hjReal: '-' },
    { no: 3, name: 'SPP LAMPUNG', tg: '7.500', tb: '500', tj: '-', r30g: '4.689', r30b: '36', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '4.689', rTb: '36', rTj: '-', pcG: '63%', pcB: '7%', pcJ: '-', hgJul: '7.981', hgReal: '7.307', hbJul: '-', hbReal: '12.966', hjJul: '-', hjReal: '-' },
    { no: 4, name: 'SPP KENDAL', tg: '7.000', tb: '800', tj: '-', r30g: '5.074', r30b: '942', r30j: '-', r31g: '17', r31b: '38', r31j: '-', rTg: '5.091', rTb: '980', rTj: '-', pcG: '73%', pcB: '123%', pcJ: '-', hgJul: '7.940', hgReal: '7.429', hbJul: '13.485', hbReal: '12.938', hjJul: '-', hjReal: '-' },
    { no: 5, name: 'SPP SRAGEN', tg: '6.200', tb: '1.200', tj: '-', r30g: '3.732', r30b: '2.145', r30j: '-', r31g: '-', r31b: '10', r31j: '-', rTg: '3.732', rTb: '2.155', rTj: '-', pcG: '60%', pcB: '180%', pcJ: '-', hgJul: '-', hgReal: '7.642', hbJul: '12.990', hbReal: '12.905', hjJul: '-', hjReal: '-' },
    { no: 6, name: 'SPP MAGETAN', tg: '7.000', tb: '720', tj: '-', r30g: '4.860', r30b: '1.141', r30j: '-', r31g: '-', r31b: '20', r31j: '-', rTg: '4.860', rTb: '1.161', rTj: '-', pcG: '69%', pcB: '161%', pcJ: '-', hgJul: '-', hgReal: '7.207', hbJul: '12.520', hbReal: '12.382', hjJul: '-', hjReal: '-' },
    { no: 7, name: 'SPP BOJONEGORO', tg: '6.500', tb: '1.000', tj: '-', r30g: '2.871', r30b: '386', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '2.871', rTb: '386', rTj: '-', pcG: '44%', pcB: '39%', pcJ: '-', hgJul: '-', hgReal: '7.348', hbJul: '12.799', hbReal: '12.671', hjJul: '-', hjReal: '-' },
    { no: 8, name: 'SPP JEMBER', tg: '6.500', tb: '1.000', tj: '-', r30g: '4.460', r30b: '1.357', r30j: '-', r31g: '-', r31b: '20', r31j: '-', rTg: '4.460', rTb: '1.377', rTj: '-', pcG: '69%', pcB: '138%', pcJ: '-', hgJul: '8.034', hgReal: '7.429', hbJul: '12.459', hbReal: '12.190', hjJul: '-', hjReal: '-' },
    { no: 9, name: 'SPP BANYUWANGI', tg: '6.700', tb: '900', tj: '-', r30g: '3.905', r30b: '110', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '3.905', rTb: '110', rTj: '-', pcG: '58%', pcB: '12%', pcJ: '-', hgJul: '7.995', hgReal: '7.455', hbJul: '-', hbReal: '12.591', hjJul: '-', hjReal: '-' },
    { no: 10, name: 'SPP SUMBAWA', tg: '7.700', tb: '370', tj: '-', r30g: '5.123', r30b: '-', r30j: '-', r31g: '22', r31b: '-', r31j: '-', rTg: '5.145', rTb: '-', rTj: '-', pcG: '67%', pcB: '0%', pcJ: '-', hgJul: '7.212', hgReal: '6.907', hbJul: '-', hbReal: '-', hjJul: '-', hjReal: '-' },
    { no: 11, name: 'SPB DKI JAKARTA', tg: '-', tb: '3.403', tj: '-', r30g: '-', r30b: '1.589', r30j: '-', r31g: '-', r31b: '6', r31j: '-', rTg: '-', rTb: '1.595', rTj: '-', pcG: '-', pcB: '47%', pcJ: '-', hgJul: '-', hgReal: '-', hbJul: '12.950', hbReal: '12.881', hjJul: '-', hjReal: '-' },
    { no: 12, name: 'SPB INDRAMAYU', tg: '-', tb: '3.397', tj: '-', r30g: '-', r30b: '2.344', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '-', rTb: '2.344', rTj: '-', pcG: '-', pcB: '69%', pcJ: '-', hgJul: '-', hgReal: '-', hbJul: '13.469', hbReal: '13.262', hjJul: '-', hjReal: '-' },
    { no: 13, name: 'SPB SUKOHARJO', tg: '-', tb: '3.400', tj: '-', r30g: '-', r30b: '2.967', r30j: '-', r31g: '-', r31b: '17', r31j: '-', rTg: '-', rTb: '2.984', rTj: '-', pcG: '-', pcB: '88%', pcJ: '-', hgJul: '-', hgReal: '-', hbJul: '12.473', hbReal: '12.571', hjJul: '-', hjReal: '-' },
    { no: 14, name: 'SPB SIDOARJO', tg: '-', tb: '3.400', tj: '-', r30g: '-', r30b: '1.524', r30j: '-', r31g: '-', r31b: '52', r31j: '-', rTg: '-', rTb: '1.576', rTj: '-', pcG: '-', pcB: '46%', pcJ: '-', hgJul: '-', hgReal: '-', hbJul: '13.447', hbReal: '13.159', hjJul: '-', hjReal: '-' },
    { no: 15, name: 'SPB LOMBOK TIMUR', tg: '-', tb: '3.400', tj: '-', r30g: '-', r30b: '1.012', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '-', rTb: '1.012', rTj: '-', pcG: '-', pcB: '30%', pcJ: '-', hgJul: '-', hgReal: '-', hbJul: '12.550', hbReal: '12.500', hjJul: '-', hjReal: '-' },
    { no: 16, name: 'SPB SIDRAP', tg: '-', tb: '3.250', tj: '-', r30g: '-', r30b: '1.498', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '-', rTb: '1.498', rTj: '-', pcG: '-', pcB: '46%', pcJ: '-', hgJul: '-', hgReal: '-', hbJul: '12.697', hbReal: '12.686', hjJul: '-', hjReal: '-' },
    { no: 17, name: 'SPB MAKASSAR', tg: '-', tb: '3.400', tj: '-', r30g: '-', r30b: '1.977', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '-', rTb: '1.977', rTj: '-', pcG: '-', pcB: '58%', pcJ: '-', hgJul: '-', hgReal: '-', hbJul: '12.674', hbReal: '12.729', hjJul: '-', hjReal: '-' },
    { no: 18, name: 'UP BANTUL', tg: '870', tb: '770', tj: '-', r30g: '490', r30b: '565', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '490', rTb: '565', rTj: '-', pcG: '56%', pcB: '73%', pcJ: '-', hgJul: '-', hgReal: '7.126', hbJul: '12.703', hbReal: '12.803', hjJul: '-', hjReal: '-' },
    { no: 19, name: 'UP CANDIREJO', tg: '280', tb: '1.150', tj: '-', r30g: '95', r30b: '519', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '95', rTb: '519', rTj: '-', pcG: '34%', pcB: '45%', pcJ: '-', hgJul: '-', hgReal: '6.972', hbJul: '12.120', hbReal: '12.343', hjJul: '-', hjReal: '-' },
    { no: 20, name: 'UP MOJOLABAN', tg: '460', tb: '970', tj: '-', r30g: '371', r30b: '1.972', r30j: '-', r31g: '-', r31b: '30', r31j: '-', rTg: '371', rTb: '2.003', rTj: '-', pcG: '77%', pcB: '206%', pcJ: '-', hgJul: '-', hgReal: '7.459', hbJul: '12.306', hbReal: '12.532', hjJul: '-', hjReal: '-' },
    { no: 21, name: 'UP LANCIRANG', tg: '280', tb: '1.150', tj: '-', r30g: '377', r30b: '526', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '377', rTb: '526', rTj: '-', pcG: '135%', pcB: '46%', pcJ: '-', hgJul: '7.488', hgReal: '7.489', hbJul: '-', hbReal: '12.471', hjJul: '-', hjReal: '-' },
    { no: 22, name: 'UP ANRABANUA', tg: '280', tb: '1.150', tj: '-', r30g: '256', r30b: '815', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '256', rTb: '815', rTj: '-', pcG: '71%', pcB: '-', pcJ: '-', hgJul: '-', hgReal: '7.441', hbJul: '-', hbReal: '12.363', hjJul: '-', hjReal: '-' },
    { no: 23, name: 'CDC DOMPU', tg: '-', tb: '-', tj: '1.350', r30g: '-', r30b: '-', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '-', rTb: '-', rTj: '-', pcG: '-', pcB: '-', pcJ: '0%', hgJul: '-', hgReal: '-', hbJul: '-', hbReal: '-', hjJul: '-', hjReal: '-' },
    { no: 24, name: 'CDC BOLAANG MONGONDOW', tg: '-', tb: '-', tj: '1.350', r30g: '-', r30b: '-', r30j: '-', r31g: '-', r31b: '-', r31j: '-', rTg: '-', rTb: '-', rTj: '-', pcG: '-', pcB: '-', pcJ: '0%', hgJul: '-', hgReal: '-', hbJul: '-', hbReal: '-', hjJul: '-', hjReal: '-' },
  ];

  const latestDayStr = finalReportPengadaanUB?.latestDayStr || "31 Juli 2026";
  const prevDayStr = finalReportPengadaanUB?.prevDayStr || "s.d 30 Juli 2026";
  const activeMonthName = finalReportPengadaanUB?.activeMonthName || "Juli";

  const rows = finalReportPengadaanUB?.rows
    ? finalReportPengadaanUB.rows.map((r: any) => ({
        no: r.no,
        name: r.displayName,
        tg: r.target.gabah > 0 ? r.target.gabah.toLocaleString('id-ID') : "-",
        tb: r.target.beras > 0 ? r.target.beras.toLocaleString('id-ID') : "-",
        tj: r.target.jagung > 0 ? r.target.jagung.toLocaleString('id-ID') : "-",
        r30g: r.realPrev.gabah > 0 ? r.realPrev.gabah.toLocaleString('id-ID') : "-",
        r30b: r.realPrev.beras > 0 ? r.realPrev.beras.toLocaleString('id-ID') : "-",
        r30j: r.realPrev.jagung > 0 ? r.realPrev.jagung.toLocaleString('id-ID') : "-",
        r31g: r.realLatest.gabah > 0 ? r.realLatest.gabah.toLocaleString('id-ID') : "-",
        r31b: r.realLatest.beras > 0 ? r.realLatest.beras.toLocaleString('id-ID') : "-",
        r31j: r.realLatest.jagung > 0 ? r.realLatest.jagung.toLocaleString('id-ID') : "-",
        rTg: r.realTotal.gabah > 0 ? r.realTotal.gabah.toLocaleString('id-ID') : "-",
        rTb: r.realTotal.beras > 0 ? r.realTotal.beras.toLocaleString('id-ID') : "-",
        rTj: r.realTotal.jagung > 0 ? r.realTotal.jagung.toLocaleString('id-ID') : "-",
        pcG: r.target.gabah > 0 ? `${r.percentage.gabah}%` : "-",
        pcB: r.target.beras > 0 ? `${r.percentage.beras}%` : "-",
        pcJ: r.target.jagung > 0 ? `${r.percentage.jagung}%` : "-",
        hgJul: r.priceGabah.agt > 0 ? r.priceGabah.agt.toLocaleString('id-ID') : "-",
        hgReal: r.priceGabah.sd > 0 ? r.priceGabah.sd.toLocaleString('id-ID') : "-",
        hbJul: r.priceBeras.agt > 0 ? r.priceBeras.agt.toLocaleString('id-ID') : "-",
        hbReal: r.priceBeras.sd > 0 ? r.priceBeras.sd.toLocaleString('id-ID') : "-",
        hjJul: r.priceJagung.agt > 0 ? r.priceJagung.agt.toLocaleString('id-ID') : "-",
        hjReal: r.priceJagung.sd > 0 ? r.priceJagung.sd.toLocaleString('id-ID') : "-",
      }))
    : defaultData;

  const grandTotals = finalReportPengadaanUB?.grandTotals
    ? {
        tg: finalReportPengadaanUB.grandTotals.target.gabah > 0 ? finalReportPengadaanUB.grandTotals.target.gabah.toLocaleString('id-ID') : "-",
        tb: finalReportPengadaanUB.grandTotals.target.beras > 0 ? finalReportPengadaanUB.grandTotals.target.beras.toLocaleString('id-ID') : "-",
        tj: finalReportPengadaanUB.grandTotals.target.jagung > 0 ? finalReportPengadaanUB.grandTotals.target.jagung.toLocaleString('id-ID') : "-",
        r30g: finalReportPengadaanUB.grandTotals.realPrev.gabah > 0 ? finalReportPengadaanUB.grandTotals.realPrev.gabah.toLocaleString('id-ID') : "-",
        r30b: finalReportPengadaanUB.grandTotals.realPrev.beras > 0 ? finalReportPengadaanUB.grandTotals.realPrev.beras.toLocaleString('id-ID') : "-",
        r30j: finalReportPengadaanUB.grandTotals.realPrev.jagung > 0 ? finalReportPengadaanUB.grandTotals.realPrev.jagung.toLocaleString('id-ID') : "-",
        r31g: finalReportPengadaanUB.grandTotals.realLatest.gabah > 0 ? finalReportPengadaanUB.grandTotals.realLatest.gabah.toLocaleString('id-ID') : "-",
        r31b: finalReportPengadaanUB.grandTotals.realLatest.beras > 0 ? finalReportPengadaanUB.grandTotals.realLatest.beras.toLocaleString('id-ID') : "-",
        r31j: finalReportPengadaanUB.grandTotals.realLatest.jagung > 0 ? finalReportPengadaanUB.grandTotals.realLatest.jagung.toLocaleString('id-ID') : "-",
        rTg: finalReportPengadaanUB.grandTotals.realTotal.gabah > 0 ? finalReportPengadaanUB.grandTotals.realTotal.gabah.toLocaleString('id-ID') : "-",
        rTb: finalReportPengadaanUB.grandTotals.realTotal.beras > 0 ? finalReportPengadaanUB.grandTotals.realTotal.beras.toLocaleString('id-ID') : "-",
        rTj: finalReportPengadaanUB.grandTotals.realTotal.jagung > 0 ? finalReportPengadaanUB.grandTotals.realTotal.jagung.toLocaleString('id-ID') : "-",
        pcG: `${finalReportPengadaanUB.grandTotals.percentage.gabah}%`,
        pcB: `${finalReportPengadaanUB.grandTotals.percentage.beras}%`,
        pcJ: `${finalReportPengadaanUB.grandTotals.percentage.jagung}%`,
        hgJul: finalReportPengadaanUB.grandTotals.priceGabah.agt > 0 ? finalReportPengadaanUB.grandTotals.priceGabah.agt.toLocaleString('id-ID') : "-",
        hgReal: finalReportPengadaanUB.grandTotals.priceGabah.sd > 0 ? finalReportPengadaanUB.grandTotals.priceGabah.sd.toLocaleString('id-ID') : "-",
        hbJul: finalReportPengadaanUB.grandTotals.priceBeras.agt > 0 ? finalReportPengadaanUB.grandTotals.priceBeras.agt.toLocaleString('id-ID') : "-",
        hbReal: finalReportPengadaanUB.grandTotals.priceBeras.sd > 0 ? finalReportPengadaanUB.grandTotals.priceBeras.sd.toLocaleString('id-ID') : "-",
        hjJul: finalReportPengadaanUB.grandTotals.priceJagung.agt > 0 ? finalReportPengadaanUB.grandTotals.priceJagung.agt.toLocaleString('id-ID') : "-",
        hjReal: finalReportPengadaanUB.grandTotals.priceJagung.sd > 0 ? finalReportPengadaanUB.grandTotals.priceJagung.sd.toLocaleString('id-ID') : "-",
      }
    : {
        tg: '77.290',
        tb: '37.130',
        tj: '2.700',
        r30g: '48.765',
        r30b: '23.424',
        r30j: '-',
        r31g: '78',
        r31b: '193',
        r31j: '-',
        rTg: '48.844',
        rTb: '23.617',
        rTj: '-',
        pcG: '63%',
        pcB: '64%',
        pcJ: '0%',
        hgJul: '7.871',
        hgReal: '7.449',
        hbJul: '12.874',
        hbReal: '12.722',
        hjJul: '-',
        hjReal: '-',
      };

  const tdClass = "border border-gray-400 px-[2.5px] py-[2px] whitespace-nowrap text-right";
  const bgEven = "bg-[#d9e6f3]";
  const bgOdd = "bg-white";

  const renderCell = (val: string, prefix = "") => {
    if (val === '-') return <span className="text-center w-full block">-</span>;
    if (prefix) {
      return (
        <div className="flex justify-between w-full">
          <span>{prefix}</span>
          <span>{val}</span>
        </div>
      );
    }
    return val;
  };

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-4 py-2 font-sans text-gray-800">
      
      {/* Header Logos */}
      <div className="flex justify-between items-start mb-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-9 object-contain" />
        <div className="text-center pt-1">
          <h1 className="text-[24px] font-black text-black tracking-tight leading-tight">
            REALISASI PENGADAAN GABAH DAN BERAS UB
            <br />
            INDUSTRI
          </h1>
          <h2 className="text-[16px] font-bold text-[#548279] mt-0.5">{latestDayStr}</h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-9 object-contain" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-[#0070c0] text-white text-[8px] text-center font-bold">
              <th rowSpan={3} className="border border-white py-[2px] px-[1px] w-6">NO</th>
              <th rowSpan={3} className="border border-white py-[2px] px-[2px] w-28">Infrastruktur</th>
              <th colSpan={3} className="border border-white py-[2px] px-[1px]">Target 2026</th>
              <th colSpan={9} className="border border-white py-[2px] px-[1px]">Realisasi (ton)</th>
              <th colSpan={3} className="border border-white py-[2px] px-[1px]">Persentase Pencapaian (%)</th>
              <th colSpan={2} className="border border-white py-[2px] px-[1px]">Harga Rata-rata Gabah<br/>(Rp/kg)</th>
              <th colSpan={2} className="border border-white py-[2px] px-[1px]">Harga Rata-rata Beras (Rp/kg)</th>
              <th colSpan={2} className="border border-white py-[2px] px-[1px]">Harga Rata-rata<br/>Jagung (Rp/kg)</th>
            </tr>
            <tr className="bg-[#0070c0] text-white text-[8px] text-center font-bold">
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-12">Gabah</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-12">Beras</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-12">Jagung</th>
              <th colSpan={3} className="border border-white py-[2px] px-[1px] uppercase">{prevDayStr}</th>
              <th colSpan={3} className="border border-white py-[2px] px-[1px] uppercase">{latestDayStr}</th>
              <th colSpan={3} className="border border-white py-[2px] px-[1px]">Total<br/>(ton)</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-10">Gabah</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-10">Beras</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-10">Jagung</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-16 capitalize">{activeMonthName}</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-16">Real s.d.<br/>{activeMonthName}</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-16 capitalize">{activeMonthName}</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-16">Real s.d.<br/>{activeMonthName}</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-16 capitalize">{activeMonthName}</th>
              <th rowSpan={2} className="border border-white py-[2px] px-[1px] w-16">Real s.d.<br/>{activeMonthName}</th>
            </tr>
            <tr className="bg-[#0070c0] text-white text-[8px] text-center font-bold">
              <th className="border border-white py-[2px] px-[1px] w-10">Gabah</th>
              <th className="border border-white py-[2px] px-[1px] w-10">Beras</th>
              <th className="border border-white py-[2px] px-[1px] w-10">Jagung</th>
              <th className="border border-white py-[2px] px-[1px] w-10">Gabah</th>
              <th className="border border-white py-[2px] px-[1px] w-10">Beras</th>
              <th className="border border-white py-[2px] px-[1px] w-10">Jagung</th>
              <th className="border border-white py-[2px] px-[1px] w-10">Gabah</th>
              <th className="border border-white py-[2px] px-[1px] w-10">Beras</th>
              <th className="border border-white py-[2px] px-[1px] w-10">Jagung</th>
            </tr>
          </thead>
          <tbody className="text-[8px] leading-tight">
            {rows.map((row: any, i: number) => (
              <tr key={row.no} className={i % 2 === 0 ? bgEven : bgOdd}>
                <td className="border border-gray-400 px-[2px] py-[2px] text-center">{row.no}</td>
                <td className="border border-gray-400 px-[3px] py-[2px] text-left font-semibold uppercase tracking-tighter whitespace-nowrap">{row.name}</td>
                <td className={tdClass}>{renderCell(row.tg)}</td>
                <td className={tdClass}>{renderCell(row.tb)}</td>
                <td className={tdClass}>{renderCell(row.tj)}</td>
                <td className={tdClass}>{renderCell(row.r30g)}</td>
                <td className={tdClass}>{renderCell(row.r30b)}</td>
                <td className={tdClass}>{renderCell(row.r30j)}</td>
                <td className={tdClass}>{renderCell(row.r31g)}</td>
                <td className={tdClass}>{renderCell(row.r31b)}</td>
                <td className={tdClass}>{renderCell(row.r31j)}</td>
                <td className={tdClass}>{renderCell(row.rTg)}</td>
                <td className={tdClass}>{renderCell(row.rTb)}</td>
                <td className={tdClass}>{renderCell(row.rTj)}</td>
                <td className={tdClass}>{renderCell(row.pcG)}</td>
                <td className={tdClass}>{renderCell(row.pcB)}</td>
                <td className={tdClass}>{renderCell(row.pcJ)}</td>
                <td className={tdClass}>{renderCell(row.hgJul, "Rp")}</td>
                <td className={tdClass}>{renderCell(row.hgReal, "Rp")}</td>
                <td className={tdClass}>{renderCell(row.hbJul, "Rp")}</td>
                <td className={tdClass}>{renderCell(row.hbReal, "Rp")}</td>
                <td className={tdClass}>{renderCell(row.hjJul, "Rp")}</td>
                <td className={tdClass}>{renderCell(row.hjReal, "Rp")}</td>
              </tr>
            ))}
            <tr className="bg-[#0070c0] text-white font-bold text-[8.5px]">
              <td colSpan={2} className="border border-gray-400 px-[2px] py-[2.5px] text-center">GRAND TOTAL</td>
              <td className={tdClass}>{grandTotals.tg}</td>
              <td className={tdClass}>{grandTotals.tb}</td>
              <td className={tdClass}>{grandTotals.tj}</td>
              <td className={tdClass}>{grandTotals.r30g}</td>
              <td className={tdClass}>{grandTotals.r30b}</td>
              <td className={tdClass}>{grandTotals.r30j}</td>
              <td className={tdClass}>{grandTotals.r31g}</td>
              <td className={tdClass}>{grandTotals.r31b}</td>
              <td className={tdClass}>{grandTotals.r31j}</td>
              <td className={tdClass}>{grandTotals.rTg}</td>
              <td className={tdClass}>{grandTotals.rTb}</td>
              <td className={tdClass}>{grandTotals.rTj}</td>
              <td className={tdClass}>{grandTotals.pcG}</td>
              <td className={tdClass}>{grandTotals.pcB}</td>
              <td className={tdClass}>{grandTotals.pcJ}</td>
              <td className={tdClass}>{renderCell(grandTotals.hgJul, "Rp")}</td>
              <td className={tdClass}>{renderCell(grandTotals.hgReal, "Rp")}</td>
              <td className={tdClass}>{renderCell(grandTotals.hbJul, "Rp")}</td>
              <td className={tdClass}>{renderCell(grandTotals.hbReal, "Rp")}</td>
              <td className={tdClass}>{renderCell(grandTotals.hjJul, "Rp")}</td>
              <td className={tdClass}>{renderCell(grandTotals.hjReal, "Rp")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-[10.5px] space-y-0.5 text-black italic font-bold">
        <p>*Data diperoleh dari laporan tarikan system ERP</p>
        <p>** Update Pengadaan per Tanggal {latestDayStr}</p>
      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
