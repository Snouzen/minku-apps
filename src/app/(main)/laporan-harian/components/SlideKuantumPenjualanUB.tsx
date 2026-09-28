import React from 'react';
import SlideFooterBrandWave from './SlideFooterBrandWave';

export interface KuantumPenjualanRow {
  name: string;
  group: 'SPP' | 'SPB' | 'UP' | 'CDC';
  beras: number;
  gabah: number;
  hasilSamping: number;
  jasa: number;
}

export const BASELINE_KUANTUM_PENJUALAN: KuantumPenjualanRow[] = [
  // SPP (10 units)
  { name: 'SPP BANYUWANGI', group: 'SPP', beras: 2448836, gabah: 0, hasilSamping: 813635, jasa: 2334850 },
  { name: 'SPP BOJONEGORO', group: 'SPP', beras: 2677733, gabah: 0, hasilSamping: 706354, jasa: 669890 },
  { name: 'SPP JEMBER', group: 'SPP', beras: 4117150, gabah: 0, hasilSamping: 904117, jasa: 1439900 },
  { name: 'SPP KARAWANG', group: 'SPP', beras: 5669992, gabah: 0, hasilSamping: 994460, jasa: 491987 },
  { name: 'SPP KENDAL', group: 'SPP', beras: 4616410, gabah: 0, hasilSamping: 1140035, jasa: 0 },
  { name: 'SPP LAMPUNG', group: 'SPP', beras: 3380593, gabah: 0, hasilSamping: 681160, jasa: 0 },
  { name: 'SPP MAGETAN', group: 'SPP', beras: 4450099, gabah: 0, hasilSamping: 991603, jasa: 922474 },
  { name: 'SPP SRAGEN', group: 'SPP', beras: 4664518, gabah: 0, hasilSamping: 1866115, jasa: 0 },
  { name: 'SPP SUBANG', group: 'SPP', beras: 5413470, gabah: 0, hasilSamping: 1117190, jasa: 703641 },
  { name: 'SPP SUMBAWA', group: 'SPP', beras: 2246660, gabah: 0, hasilSamping: 421250, jasa: 861082 },

  // SPB (7 units)
  { name: 'SPB DKI JAKARTA', group: 'SPB', beras: 3163752, gabah: 0, hasilSamping: 508927, jasa: 640000 },
  { name: 'SPB INDRAMAYU', group: 'SPB', beras: 3248505, gabah: 0, hasilSamping: 330772, jasa: 0 },
  { name: 'SPB LOMBOK TIMUR', group: 'SPB', beras: 1706180, gabah: 0, hasilSamping: 272278, jasa: 453150 },
  { name: 'SPB MAKASSAR', group: 'SPB', beras: 4333587, gabah: 0, hasilSamping: 625364, jasa: 12000 },
  { name: 'SPB SIDOARJO', group: 'SPB', beras: 2479131, gabah: 0, hasilSamping: 425783, jasa: 433020 },
  { name: 'SPB SIDRAP', group: 'SPB', beras: 1698839, gabah: 0, hasilSamping: 274673, jasa: 0 },
  { name: 'SPB SUKOHARJO', group: 'SPB', beras: 4249284, gabah: 0, hasilSamping: 933282, jasa: 330000 },

  // UP (5 units)
  { name: 'UP ANNABANUA', group: 'UP', beras: 401000, gabah: 0, hasilSamping: 30900, jasa: 0 },
  { name: 'UP BANTUL', group: 'UP', beras: 573550, gabah: 0, hasilSamping: 27850, jasa: 365040 },
  { name: 'UP CANDIREJO', group: 'UP', beras: 527182, gabah: 30511, hasilSamping: 20053, jasa: 634672 },
  { name: 'UP LANCIRANG', group: 'UP', beras: 334100, gabah: 0, hasilSamping: 42915, jasa: 0 },
  { name: 'UP MOJOLABAN', group: 'UP', beras: 936550, gabah: 135000, hasilSamping: 33630, jasa: 380000 },

  // CDC (2 units)
  { name: 'CDC BOLAANG MONGONDOW', group: 'CDC', beras: 0, gabah: 0, hasilSamping: 0, jasa: 250680 },
  { name: 'CDC DOMPU', group: 'CDC', beras: 0, gabah: 0, hasilSamping: 0, jasa: 84940 },
];

interface SlideKuantumPenjualanUBProps {
  customData?: KuantumPenjualanRow[];
  dateStr?: string;
  updatePersediaanDateStr?: string;
}

export default function SlideKuantumPenjualanUB({
  customData,
  dateStr = '08 September 2026',
  updatePersediaanDateStr = '07 September 2026'
}: SlideKuantumPenjualanUBProps) {
  const rows = customData && customData.length > 0 ? customData : BASELINE_KUANTUM_PENJUALAN;

  const totalBeras = rows.reduce((acc, r) => acc + (r.beras || 0), 0);
  const totalGabah = rows.reduce((acc, r) => acc + (r.gabah || 0), 0);
  const totalHasilSamping = rows.reduce((acc, r) => acc + (r.hasilSamping || 0), 0);
  const totalJasa = rows.reduce((acc, r) => acc + (r.jasa || 0), 0);

  const formatNum = (val: number) => {
    if (!val || val === 0) return '-';
    return val.toLocaleString('id-ID');
  };

  return (
    <div className="w-[1280px] h-[720px] bg-white border border-gray-300 shadow-xl relative overflow-hidden flex flex-col justify-between px-10 pt-4 pb-3 font-sans text-gray-800 select-none">
      
      {/* Header Logos & Title */}
      <div className="flex justify-between items-start mb-1 shrink-0">
        {/* Bulog Logo */}
        <div className="w-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-bulog-2.png" alt="Bulog" className="h-10 object-contain" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center pt-0.5">
          <h1 className="text-[26px] font-black text-black tracking-tight leading-tight uppercase font-sans">
            KUANTUM PENJUALAN UB INDUSTRI
          </h1>
          <h2 className="text-[17px] font-bold text-[#2e75b6] mt-0.5">
            {dateStr}
          </h2>
        </div>

        {/* UB Industri Logo */}
        <div className="w-48 flex justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-ub-2.png" alt="UB Industri" className="h-10 object-contain" />
        </div>
      </div>

      {/* Center Table Container */}
      <div className="flex-1 flex items-center justify-center my-1">
        <div className="w-[780px] shadow-sm">
          <table className="w-full border-collapse border border-black text-[9.5px]">
            <thead>
              {/* Level 1 Header */}
              <tr className="bg-[#0070c0] text-white font-bold">
                <th 
                  rowSpan={2} 
                  className="border border-black py-1 px-3 text-center align-middle w-56 font-bold tracking-wide"
                >
                  Infrastruktur
                </th>
                <th 
                  colSpan={4} 
                  className="border border-black py-0.5 px-2 text-center align-middle font-bold tracking-wide"
                >
                  Kuantum Penjualan (Kg)
                </th>
              </tr>

              {/* Level 2 Header */}
              <tr className="bg-[#0070c0] text-white font-bold">
                <th className="border border-black py-1 px-2 text-center w-28 font-bold">
                  Beras
                </th>
                <th className="border border-black py-1 px-2 text-center w-24 font-bold">
                  Gabah (GKG)
                </th>
                <th className="border border-black py-1 px-2 text-center w-28 font-bold">
                  Hasil Samping
                </th>
                <th className="border border-black py-1 px-2 text-center w-28 font-bold">
                  Jasa
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => (
                <tr 
                  key={idx} 
                  className="bg-white hover:bg-blue-50/40 transition-colors"
                >
                  <td className="border border-black px-2 py-[2.2px] text-left font-semibold text-gray-900 whitespace-nowrap">
                    {r.name}
                  </td>
                  <td className="border border-black px-2 py-[2.2px] text-right text-gray-900 font-medium tabular-nums">
                    {formatNum(r.beras)}
                  </td>
                  <td className="border border-black px-2 py-[2.2px] text-right text-gray-900 font-medium tabular-nums">
                    {formatNum(r.gabah)}
                  </td>
                  <td className="border border-black px-2 py-[2.2px] text-right text-gray-900 font-medium tabular-nums">
                    {formatNum(r.hasilSamping)}
                  </td>
                  <td className="border border-black px-2 py-[2.2px] text-right text-gray-900 font-medium tabular-nums">
                    {formatNum(r.jasa)}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-[#0070c0] text-white font-black text-[10px]">
                <td className="border border-black px-2 py-1 text-center font-black uppercase tracking-wider">
                  TOTAL
                </td>
                <td className="border border-black px-2 py-1 text-right font-black tabular-nums">
                  {formatNum(totalBeras)}
                </td>
                <td className="border border-black px-2 py-1 text-right font-black tabular-nums">
                  {formatNum(totalGabah)}
                </td>
                <td className="border border-black px-2 py-1 text-right font-black tabular-nums">
                  {formatNum(totalHasilSamping)}
                </td>
                <td className="border border-black px-2 py-1 text-right font-black tabular-nums">
                  {formatNum(totalJasa)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bottom Footer Area */}
      <div className="flex justify-between items-end shrink-0 pt-1 relative min-h-[36px]">
        {/* Footnotes */}
        <div className="text-[9.5px] italic font-bold text-gray-800 leading-tight">
          <p>*Data diperoleh dari laporan tarikan system ERP</p>
          <p>** Update Persediaan per Tanggal {updatePersediaanDateStr}</p>
        </div>

        {/* Decorative Wave & Slogan: Passion In Every Grain */}
        <SlideFooterBrandWave />
      </div>

    </div>
  );
}
