import React from 'react';
import Image from 'next/image';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export default function SlideRealisasiPSOMakloon() {
  const psoData = [
    { id: 1, kanwil: 'KANWIL LAMPUNG', mitra: 'SPP LAMPUNG', po: 392750, s28: 392750, t29: null, s29: 392750 },
    { id: 2, kanwil: 'KANWIL JABAR', mitra: 'SPP SUBANG', po: 50000, s28: 50000, t29: null, s29: 50000 },
    { id: 3, kanwil: 'KANWIL JATENG', mitra: 'SPP KENDAL', po: 419500, s28: 419500, t29: null, s29: 419500 },
    { id: 4, kanwil: '', mitra: 'SPP SRAGEN', po: 507350, s28: 464350, t29: null, s29: 464350 },
    { id: 5, kanwil: '', mitra: 'SPB SUKOHARJO', po: 20000, s28: 20000, t29: null, s29: 20000 },
    { id: 6, kanwil: '', mitra: 'UP MOJOLABAN', po: 10000, s28: 10000, t29: null, s29: 10000 },
    { id: 7, kanwil: 'KANWIL DIYOGYAKRTA', mitra: 'UP BANTUL', po: 128650, s28: 128650, t29: null, s29: 128650 },
    { id: 8, kanwil: 'KANWIL JATIM', mitra: 'SPP BANYUWANGI', po: 375400, s28: 375400, t29: null, s29: 375400 },
    { id: 9, kanwil: '', mitra: 'SPP BOJONEGORO', po: 9250, s28: 9250, t29: null, s29: 9250 },
    { id: 10, kanwil: '', mitra: 'SPP MAGETAN', po: 260000, s28: 260000, t29: null, s29: 260000 },
    { id: 11, kanwil: '', mitra: 'SPP JEMBER', po: 1116050, s28: 1036050, t29: null, s29: 1036050 },
    { id: 12, kanwil: '', mitra: 'UP CANDIREJO', po: 563700, s28: 563700, t29: null, s29: 563700 },
    { id: 13, kanwil: 'KANWIL NTB', mitra: 'SPP SUMBAWA', po: 34700, s28: 34700, t29: null, s29: 34700 },
    { id: 14, kanwil: '', mitra: 'SPP LOMBOK TIMUR', po: 15000, s28: 15000, t29: null, s29: 15000 },
  ];

  const makloonData = [
    { id: 1, lokasi: 'SPP Bojonegoro', kanwil: 'Kancab Bojonegoro', gabah: 3078828, tarif: 645, nilai: 1985844060 },
    { id: 2, lokasi: 'SPP Jember', kanwil: 'Kancab Jember dan Probolinggo', gabah: 6182620, tarif: 645, nilai: 3987789900 },
    { id: 3, lokasi: 'SPP Karawang', kanwil: 'Kancab Karawang, Bogor dan Cianjur', gabah: 3307918, tarif: 645, nilai: 2133607110 },
    { id: 4, lokasi: 'SPP Kendal', kanwil: 'Kancab Semarang', gabah: 4131104, tarif: 645, nilai: 2664562080 },
    { id: 5, lokasi: 'SPP Lampung', kanwil: 'Kanwil Lampung', gabah: 3497260, tarif: 645, nilai: 2255732700 },
    { id: 6, lokasi: 'SPP Magetan', kanwil: 'Kancab Madiun dan Ponorogo', gabah: 4176410, tarif: 645, nilai: 2693784450 },
    { id: 7, lokasi: 'SPP Sragen', kanwil: 'Kancab Surakarta', gabah: 3265569, tarif: 645, nilai: 2106292005 },
    { id: 8, lokasi: 'SPP Subang', kanwil: 'Kancab Subang dan Bandung', gabah: 2093615, tarif: 645, nilai: 1350381675 },
    { id: 9, lokasi: 'UP Bantul', kanwil: 'Kanwil Yogyakarta', gabah: 719569, tarif: 645, nilai: 464122005 },
    { id: 10, lokasi: 'UP Mojolaban', kanwil: 'Kancab Surakarta', gabah: 596800, tarif: 645, nilai: 384936000 },
    { id: 11, lokasi: 'UP Candirejo', kanwil: 'Kancab Kediri', gabah: 670981, tarif: 645, nilai: 432782745 },
    { id: 12, lokasi: 'SPP Sumbawa', kanwil: 'Kancab Bima dan Sumbawa', gabah: 3832444, tarif: 645, nilai: 2471926380 },
    { id: 13, lokasi: 'SPP Banyuwangi', kanwil: 'Kancab Banyuwangi dan Bondowoso', gabah: 3369266, tarif: 645, nilai: 2173176570 },
    { id: 14, lokasi: 'UP Lancirang', kanwil: 'Kancab Pare Pare', gabah: 491459, tarif: 645, nilai: 316991055 },
  ];

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col px-8 py-4 font-sans text-gray-800">
      
      {/* Header Logos */}
      <div className="flex justify-between items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        <div className="text-center pt-1">
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight">
            REALISASI PENJUALAN PSO DAN MAKLOON
            <br />
            UB INDUSTRI
          </h1>
          <h2 className="text-[18px] font-bold text-[#548279] mt-1 underline decoration-2 underline-offset-4">29 Desember 2025</h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
      </div>

      <div className="flex w-full mt-3 gap-5">
        
        {/* LEFT COLUMN */}
        <div className="w-1/2 flex flex-col">
          <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">REALISASI PENJUALAN PSO UB INDUSTRI</h3>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-[#1f73b7] text-white text-[7.5px] text-center font-bold">
                <th rowSpan={2} className="border border-white p-1">No</th>
                <th rowSpan={2} className="border border-white p-1">Kanwil</th>
                <th rowSpan={2} className="border border-white p-1">Mitra Pengadaan/Infrastruktur UB Industri</th>
                <th rowSpan={2} className="border border-white p-1">Kuantum PO (Kg)<br/>s/d 29 Desember<br/>2025</th>
                <th colSpan={3} className="border border-white p-1">Kuantum Realisasi Penjualan PSO (Kg)</th>
              </tr>
              <tr className="bg-[#1f73b7] text-white text-[7.5px] text-center font-bold">
                <th className="border border-white p-1">Total s/d 28<br/>Desember 2025</th>
                <th className="border border-white p-1">29-Dec-25</th>
                <th className="border border-white p-1">Total s/d 29<br/>Desember 2025</th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              {psoData.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? "bg-[#d9e6f3]" : "bg-white"}>
                  <td className="border border-gray-300 p-1 text-center">{row.id}</td>
                  <td className="border border-gray-300 p-1">{row.kanwil}</td>
                  <td className="border border-gray-300 p-1">{row.mitra}</td>
                  <td className="border border-gray-300 p-1 text-right">{row.po.toLocaleString('id-ID')}</td>
                  <td className="border border-gray-300 p-1 text-right">{row.s28.toLocaleString('id-ID')}</td>
                  <td className="border border-gray-300 p-1 text-center">{row.t29 ? row.t29 : ''}</td>
                  <td className="border border-gray-300 p-1 text-right">{row.s29.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              <tr className="bg-[#1f73b7] text-white font-bold text-[10px]">
                <td colSpan={3} className="border border-white p-1 text-center">TOTAL</td>
                <td className="border border-white p-1 text-right">3.902.350</td>
                <td className="border border-white p-1 text-right">3.779.350</td>
                <td className="border border-white p-1 text-center">-</td>
                <td className="border border-white p-1 text-right">3.779.350</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-2 text-[10px] space-y-0.5 text-black italic">
            <p>* Update per tanggal 29 Desember 2025</p>
            <p>* Sumber: Dashboard ERP</p>
            <p>* Terdapat PO yang telah Expired di SPP Jember dengan Kuantum sebesar 80.000 Kg</p>
            <p>* Terdapat PO yang telah Expired di SPP Sragen dengan Kuantum sebesar 43.000 Kg</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-1/2 flex flex-col">
          <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">MAKLOON UB INDUSTRI</h3>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-[#1f73b7] text-white text-[7.5px] text-center font-bold">
                <th rowSpan={2} className="border border-white p-1">NO</th>
                <th rowSpan={2} className="border border-white p-1">LOKASI</th>
                <th rowSpan={2} className="border border-white p-1">Kanwil/KC</th>
                <th rowSpan={2} className="border border-white p-1">Kuantum gabah (kg)</th>
                <th className="border border-white p-1">Tarif</th>
                <th className="border border-white p-1">Nilai</th>
              </tr>
              <tr className="bg-[#1f73b7] text-white text-[7.5px] text-center font-bold">
                <th className="border border-white p-1">Rp/Kg</th>
                <th className="border border-white p-1">Rp</th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              {makloonData.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? "bg-[#d9e6f3]" : "bg-white"}>
                  <td className="border border-gray-300 p-1 text-center">{row.id}</td>
                  <td className="border border-gray-300 p-1">{row.lokasi}</td>
                  <td className="border border-gray-300 p-1">{row.kanwil}</td>
                  <td className="border border-gray-300 p-1 text-right">{row.gabah.toLocaleString('id-ID')}</td>
                  <td className="border border-gray-300 p-1 text-right">{row.tarif}</td>
                  <td className="border border-gray-300 p-1 text-right">{row.nilai.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              <tr className="bg-[#1f73b7] text-white font-bold text-[10px]">
                <td colSpan={3} className="border border-white p-1 text-center">TOTAL</td>
                <td className="border border-white p-1 text-right">39.413.843</td>
                <td className="border border-white p-1 text-right">645</td>
                <td className="border border-white p-1 text-right">25.421.928.735</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-2 text-[10px] space-y-0.5 text-black italic">
            <p>* Update per tanggal 6 Agustus 2025 pukul 09.00 WIB</p>
            <p>* Sumber: https://bit.ly/realisasipso2025_ubi</p>
          </div>
        </div>

      </div>

      <SlideFooterBrandWave />
    </div>
  );
}
