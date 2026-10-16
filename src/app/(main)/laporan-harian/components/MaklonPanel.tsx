'use client';

import MaklonFinalTable from './MaklonFinalTable';
import React, { useRef, useState } from 'react';
import { CheckCircle2, Layers, Plus } from 'lucide-react';
import { classifyMaklon, MAKLON_ACTIVITIES, MAKLON_REVIEW, MaklonRow, MaklonSummary } from './maklon';

export function MaklonSlot({ fileName, count, onUpload, onClear, expanded = false }: { fileName: string | null; count: number; onUpload: (file: File) => void; onClear: () => void; expanded?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  return <div className={`order-last ${expanded ? 'bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group hover:border-violet-600' : `p-3.5 rounded-xl border transition-all ${fileName ? 'bg-violet-50/40 border-violet-200' : 'bg-gray-50/50 border-gray-200 border-dashed hover:border-violet-600 hover:bg-violet-50/30 cursor-pointer group'}`}`} onClick={() => { if (!fileName) input.current?.click(); }} onDragOver={e => { if (!fileName) e.preventDefault(); }} onDrop={e => { e.preventDefault(); if (!fileName && e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]); }}>
    <input ref={input} aria-label="Upload Data Maklon" type="file" accept=".xlsx,.xls" className="hidden" onClick={e => e.stopPropagation()} onChange={e => { const file = e.target.files?.[0]; if (file) onUpload(file); e.target.value = ''; }} />
    {expanded ? <><div><div className="flex items-center justify-between mb-4"><div className="w-10 h-10 bg-violet-100 text-violet-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner"><Layers size={20} /></div><span className="text-xs font-bold uppercase tracking-wider text-gray-400">SLOT 4</span></div><h4 className="text-base font-bold text-gray-900 mb-6">4. Data Maklon</h4></div><button type="button" onClick={e => { e.stopPropagation(); input.current?.click(); }} className="w-full py-2.5 px-4 bg-violet-50 hover:bg-violet-700 text-violet-700 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-violet-200 hover:border-transparent"><Plus size={14} />Upload File Maklon</button></> : <>
      <div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-2"><Layers size={16} className={fileName ? 'text-violet-700' : 'text-gray-400 group-hover:text-violet-700 transition-colors'} /><span className="text-xs font-bold text-gray-900">4. Data Maklon</span></div>{fileName ? <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full"><CheckCircle2 size={11} />Terisi</span> : <span className="text-[10px] font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Belum Ada</span>}</div>
      {fileName ? <div className="space-y-1"><p className="text-xs font-semibold text-gray-800 truncate" title={fileName}>{fileName}</p><p className="text-[11px] text-gray-500"><span className="font-bold text-gray-700">{count.toLocaleString('id-ID')}</span> baris data</p><div className="flex gap-2 pt-1.5"><button type="button" onClick={e => { e.stopPropagation(); input.current?.click(); }} className="text-[11px] font-semibold text-violet-700 hover:underline">Ganti File</button><span className="text-gray-300">|</span><button type="button" onClick={e => { e.stopPropagation(); onClear(); }} className="text-[11px] font-semibold text-red-500 hover:underline">Hapus</button></div></div> : <div className="pt-1 flex items-center justify-between"><p className="text-xs text-gray-400 italic">Belum diupload</p><span className="text-xs font-bold text-violet-700 group-hover:underline flex items-center gap-1"><Plus size={12} />Upload</span></div>}
    </>}
  </div>;
}

export default function MaklonPanel({ rows, columns, overrides, onEdit, summary }: { rows: MaklonRow[]; columns: string[]; overrides: Record<number, string>; onEdit: (index: number, value: string | undefined) => void; summary: MaklonSummary }) {
  const [subTab, setSubTab] = useState<'raw' | 'final'>('raw');
  const [query, setQuery] = useState('');
  const [onlyReview, setOnlyReview] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 50;
  const display = (value: unknown) => value instanceof Date ? value.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : String(value ?? '');
  const filtered = rows.map((row, index) => ({ row, index, decision: classifyMaklon(row, overrides[index]) })).filter(({ row, decision }) => (!onlyReview || decision.activity === MAKLON_REVIEW || ![...MAKLON_ACTIVITIES.map(a => a.toLowerCase()), 'rebag'].includes(decision.activity.toLowerCase())) && (!query || [...Object.values(row).map(display), decision.activity].some(v => v.toLowerCase().includes(query.toLowerCase()))));
  const currentPage = Math.min(page, Math.max(0, Math.ceil(filtered.length / pageSize) - 1));
  const dataColumns = columns.some(c => c.trim().toLowerCase() === 'kegiatan') ? columns : [...columns, 'Kegiatan'];
  if (!rows.length) return <div className="p-8 text-center text-gray-500">Upload Data Maklon di Slot 4 untuk melihat laporan.</div>;
  return <div className="space-y-5 p-5 text-black">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h3 className="text-sm font-bold text-gray-900">7. Data Maklon</h3><div className="mt-2 flex flex-wrap gap-2">{([{ id: 'raw', label: 'Raw Data' }, { id: 'final', label: 'Final Report' }] as const).map(tab => <button key={tab.id} onClick={() => setSubTab(tab.id)} aria-pressed={subTab === tab.id} className={`text-xs px-3 py-1 rounded-full font-semibold border ${subTab === tab.id ? 'bg-[#1D63A8] text-white border-[#1D63A8]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>{tab.label}</button>)}</div></div>
    {subTab === 'final' ? <div className="max-h-[600px] overflow-auto scroll-smooth overscroll-contain [transform:translateZ(0)] bg-clip-padding border border-gray-200 rounded-lg shadow-sm"><MaklonFinalTable summary={summary} /></div> : <>
    <div className="flex flex-wrap items-center gap-4"><input aria-label="Cari Data Maklon" placeholder="Cari lokasi, kegiatan, atau referensi…" className="min-w-64 rounded-lg border px-3 py-2 text-sm" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyReview} onChange={e => { setOnlyReview(e.target.checked); setPage(0); }} />Hanya perlu ditinjau</label><span className="text-xs text-gray-500">{filtered.length} dari {rows.length} baris</span></div>
    <div className="max-h-[600px] overflow-auto scroll-smooth overscroll-contain [transform:translateZ(0)] border border-gray-200 rounded-lg shadow-sm"><table className="w-full border-separate border-spacing-0 relative text-[11px]"><thead className="sticky top-0 z-20 bg-[#1D63A8] text-white font-semibold shadow-md"><tr>{dataColumns.map((c, i) => <th key={i} className="whitespace-nowrap border border-white bg-[#1D63A8] bg-clip-padding px-3 py-2 text-left">{c}</th>)}</tr></thead>
      <tbody className="text-black">{filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(({ row, index, decision }) => <tr key={index} className="odd:bg-white even:bg-gray-50/50 hover:bg-blue-50/50 transition-colors">
        {dataColumns.map((c, i) => <td key={i} className="max-w-96 whitespace-pre-wrap border-b border-r border-gray-200 bg-clip-padding px-3 py-2">{c.trim().toLowerCase() === 'kegiatan' ? <>
          <select aria-label={`Kegiatan baris ${index + 2}`} title={`Sumber: ${decision.source}${decision.checkReference ? ' — Cek referensi' : ''}`} value={decision.activity} onChange={e => onEdit(index, e.target.value)} className="rounded border bg-white p-2 text-black">
            {![...MAKLON_ACTIVITIES, MAKLON_REVIEW].includes(decision.activity) && <option value={decision.activity}>{decision.activity}</option>}
            {[...MAKLON_ACTIVITIES, MAKLON_REVIEW].map(a => <option key={a}>{a}</option>)}
          </select>{decision.source === 'Manual' && <button type="button" className="mt-1 block text-blue-700 underline" onClick={() => onEdit(index, undefined)}>Kembalikan hasil awal</button>}
        </> : display(row[c])}</td>)}
      </tr>)}</tbody></table>{filtered.length === 0 && <p className="p-4 text-gray-500">Tidak ada baris yang cocok.</p>}</div>
    <div className="flex items-center justify-end gap-3 text-sm"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Sebelumnya</button><span>{currentPage + 1} / {Math.max(1, Math.ceil(filtered.length / pageSize))}</span><button disabled={(currentPage + 1) * pageSize >= filtered.length} onClick={() => setPage(currentPage + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Berikutnya</button></div>
    </>}
  </div>;
}
