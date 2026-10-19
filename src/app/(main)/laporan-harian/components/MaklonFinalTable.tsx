import React from 'react';
import { MaklonSummary } from './maklon';

const COLUMNS = ['Drying', 'Mixing', 'Rebagging', 'Reproses', 'Olah GKP–Beras HGL', 'Pengeringan Jagung'] as const;
const ORDER = ['SPB JAKARTA', 'SPB INDRAMAYU', 'SPB SUKOHARJO', 'SPB SIDOARJO', 'SPB MAKASSAR', 'SPB SIDRAP', 'SPB LOMBOK TIMUR', 'SPP LAMPUNG', 'SPP KARAWANG', 'SPP SUBANG', 'SPP SRAGEN', 'SPP KENDAL', 'SPP BOJONEGORO', 'SPP MAGETAN', 'SPP JEMBER', 'SPP BANYUWANGI', 'SPP SUMBAWA', 'UP MOJOLABAN', 'UP BANTUL', 'UP CANDIREJO', 'UP ANABANUA', 'UP LANCIRANG', 'CDC BOLMONG', 'CDC DOMPU'];
function name(company: string) {
  if (company === 'CDC BOLMONG') return 'SPJ Bolaang Mongondow';
  if (company === 'CDC DOMPU') return 'SPJ Dompu';
  return company.split(' ').map((word, i) => i ? word.charAt(0) + word.slice(1).toLowerCase() : word).join(' ');
}

// One presentation component for the Final Report tab and PPT Slide 5.
export default function MaklonFinalTable({ summary, compact = false }: { summary: MaklonSummary; compact?: boolean }) {
  const format = (value: number, decimals = 0) => value === 0 ? '-' : value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: 2 });
  const notes = [
    'Kuantitas dan nilai kumulatif: baseline Januari–Juli + upload Agustus–aktual (So Quantity dan Value Penjualan). Nilai baseline: nominal invoice belum termasuk PPN.',
    ...(summary.reviewCount > 0 ? [`${summary.reviewCount} baris perlu ditinjau (${format(summary.total.reviewQty)} So Quantity; nilai Rp ${format(summary.total.reviewValue)}), belum masuk enam kolom kegiatan. Koreksi di Raw Data.`] : []),
    ...(summary.excludedCount > 0 ? [`${summary.excludedCount} baris di luar periode / tanggal tidak valid tidak masuk rekap.`] : []),
  ];
  const rank = (company: string) => { const index = ORDER.indexOf(company); return index < 0 ? 999 : index; };
  const rows = [...summary.rows].sort((a, b) => rank(a.company) - rank(b.company) || a.company.localeCompare(b.company));
  return <div className="text-black">
    <table style={compact ? { fontSize: 9, lineHeight: '11px' } : undefined} className={`w-full border-separate border-spacing-0 bg-white text-black ${compact ? 'text-[11px] leading-[12px]' : 'relative min-w-[1500px] text-[11px] [&_th]:border-white [&_th]:bg-[#1D63A8] [&_th]:bg-clip-padding [&_th]:px-3 [&_th]:py-2 [&_td]:border-gray-200 [&_td]:bg-clip-padding [&_td]:px-3 [&_td]:py-2'}`}>
      <caption className={compact ? 'py-1 text-center font-semibold text-black' : 'bg-gray-50 px-4 py-3 text-left font-semibold text-black'}>S/D {summary.date}</caption>
      <thead className={compact ? 'sticky top-0 z-10 text-black' : 'sticky top-0 z-20 bg-[#1D63A8] font-semibold text-center text-white shadow-md'} style={compact ? { backgroundColor: '#00B0E0' } : undefined}>
        <tr><th rowSpan={3} className="border-l border-t border-r border-b border-black p-1">No</th><th rowSpan={3} className="border-t border-r border-b border-black p-1">Infrastruktur</th><th colSpan={12} className="border-t border-r border-b border-black p-1">Kegiatan</th></tr>
        <tr>{COLUMNS.map(label => <th key={label} colSpan={2} className="border-r border-b border-black p-1">{label}</th>)}</tr>
        <tr>{COLUMNS.map(activity => <React.Fragment key={activity}><th className="border-r border-b border-black p-1">Kuantitas</th><th className="border-r border-b border-black p-1">Nilai (Rp)</th></React.Fragment>)}</tr>
      </thead>
      <tbody>{rows.map((row, index) => <tr key={row.company} className={compact ? undefined : 'odd:bg-white even:bg-gray-50/50 hover:bg-blue-50/50 transition-colors'}>
        <td className="border-l border-r border-b border-black px-1 py-0.5 text-center">{index + 1}</td><td className="border-r border-b border-black px-1 py-0.5 text-left">{name(row.company)}</td>
        {COLUMNS.map((activity, i) => <React.Fragment key={activity}><td className="border-r border-b border-black px-1 py-0.5 text-right whitespace-nowrap">{format(row.quantities[activity], i < 4 ? 2 : 0)}</td><td className="border-r border-b border-black px-1 py-0.5 text-right whitespace-nowrap">{format(row.values[activity])}</td></React.Fragment>)}
      </tr>)}</tbody>
      <tfoot className={compact ? 'font-bold text-black' : 'bg-blue-100 font-bold text-black'} style={compact ? { backgroundColor: '#00B0E0' } : undefined}><tr><td colSpan={2} className="border-l border-r border-b border-black p-1 text-center">Total</td>{COLUMNS.map(activity => <React.Fragment key={activity}><td className="border-r border-b border-black p-1 text-right whitespace-nowrap">{format(summary.total.quantities[activity])}</td><td className="border-r border-b border-black p-1 text-right whitespace-nowrap">{format(summary.total.values[activity])}</td></React.Fragment>)}</tr></tfoot>
    </table>
    {compact ? (
      // SVG text keeps each note on its own baseline in Chromium and foreignObject export.
      <svg data-maklon-notes="true" width="100%" height={notes.length * 18 + 12}
        viewBox={`0 0 1214 ${notes.length * 18 + 12}`} role="img" aria-label={notes.join(' ')}
        style={{ display: 'block', marginTop: 10, overflow: 'visible' }}>
        {notes.map((note, index) => <text key={note} x={0} y={14 + index * 18}
          fontFamily="Arial, sans-serif" fontSize={9} fill={index === 0 ? '#000000' : '#78350f'}>{note}</text>)}
      </svg>
    ) : notes.map((note, index) => <p key={note} className={index === 0 ? 'mt-2 text-sm text-black' : 'mt-2 text-sm text-amber-900'}>{note}</p>)}
  </div>;
}
