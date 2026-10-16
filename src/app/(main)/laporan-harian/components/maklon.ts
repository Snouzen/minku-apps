import { normalizeGudangName, WAREHOUSE_METADATA, HISTORICAL_MAKLON_NILAI_JULI_2026, HISTORICAL_MAKLON_JULI_2026 } from './historicalData2026';

export const MAKLON_ACTIVITIES = ['Rebagging', 'Reproses', 'Drying', 'Mixing'] as const;
export const MAKLON_SUMMARY_ACTIVITIES = ['Olah GKP–Beras HGL', 'Reproses', 'Mixing', 'Rebagging', 'Pengeringan Jagung', 'Drying'] as const;
export const MAKLON_REVIEW = 'Perlu ditinjau';
export type MaklonActivity = typeof MAKLON_ACTIVITIES[number];
export type MaklonRow = Record<string, unknown>;
export type MaklonDecision = { activity: string; source: string; checkReference: boolean };

export function maklonField(row: MaklonRow, name: string): unknown {
  const key = Object.keys(row).find(k => k.trim().toLowerCase() === name.toLowerCase());
  return key === undefined ? undefined : row[key];
}

export function maklonNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const text = String(value ?? '').trim().replace(/\s/g, '');
  if (!text) return 0;
  // ERP numeric cells are preferred; also accept decimal-comma and grouped text.
  const comma = text.lastIndexOf(',');
  const dot = text.lastIndexOf('.');
  let normalized = text;
  if (comma >= 0 && dot >= 0) normalized = comma > dot ? text.replace(/\./g, '').replace(',', '.') : text.replace(/,/g, '');
  else if (comma >= 0) normalized = /^-?\d{1,3}(,\d{3})+$/.test(text) ? text.replace(/,/g, '') : text.replace(',', '.');
  const result = Number(normalized);
  return Number.isFinite(result) ? result : 0;
}

export function maklonMatches(value: unknown): MaklonActivity[] {
  const text = String(value ?? '');
  return MAKLON_ACTIVITIES.filter(activity => new RegExp(activity === 'Rebagging' ? '\\brebag(?:ging)?\\b' : `\\b${activity}\\b`, 'i').test(text));
}

export function classifyMaklon(row: MaklonRow, manual?: string): MaklonDecision {
  if (manual !== undefined) return { activity: manual, source: 'Manual', checkReference: false };
  const existing = String(maklonField(row, 'kegiatan') ?? '').trim();
  if (existing) return { activity: existing, source: 'Existing', checkReference: false };
  const sol = maklonMatches(maklonField(row, 'Sol'));
  if (sol.length) return { activity: sol.length === 1 ? sol[0] : MAKLON_REVIEW, source: 'SOL', checkReference: false };
  const reference = maklonMatches(maklonField(row, 'Customer Reference'));
  if (maklonNumber(maklonField(row, 'Unit Price')) === 150) {
    return { activity: 'Rebagging', source: 'Harga 150', checkReference: reference.some(a => a !== 'Rebagging') };
  }
  return { activity: reference.length === 1 ? reference[0] : MAKLON_REVIEW, source: reference.length ? 'Customer Reference' : 'Tidak cocok', checkReference: false };
}

export function isMaklonFile(headers: string[], rows: MaklonRow[]): boolean {
  const names = headers.map(h => h.trim().toLowerCase());
  // Require the Maklon product signature, not just headers shared with Sales.
  const signature = (row: MaklonRow) => /\bmaklo+n\b|\bMKLN\d*/i.test(String(maklonField(row, 'Product') ?? '') + ' ' + String(maklonField(row, 'Sol') ?? ''));
  return ['sol', 'unit price', 'so quantity'].every(h => names.includes(h)) && rows.some(signature) && rows.every(row => signature(row) || /^PENDAPATAN JASA (REPROSES|PENGEMASAN) BERAS$/i.test(String(maklonField(row, 'Product') ?? '').trim()));
}

export type MaklonSummaryRow = { company: string; quantities: Record<typeof MAKLON_SUMMARY_ACTIVITIES[number], number>; values: Record<typeof MAKLON_SUMMARY_ACTIVITIES[number], number>; reviewQty: number; reviewValue: number; value: number };
export type MaklonSummary = { rows: MaklonSummaryRow[]; total: MaklonSummaryRow; reviewCount: number; date: string; count: number; excludedCount: number };

function maklonDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'number') return new Date(Math.round((value - 25569) * 86400000));
  const text = String(value ?? '').trim();
  const dmy = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  const date = dmy ? new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])) : new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function summarizeMaklon(rows: MaklonRow[], overrides: Record<number, string>): MaklonSummary {
  const empty = (company: string): MaklonSummaryRow => ({ company, quantities: { 'Olah GKP–Beras HGL': 0, 'Pengeringan Jagung': 0, Rebagging: 0, Reproses: 0, Drying: 0, Mixing: 0 }, values: Object.fromEntries(MAKLON_SUMMARY_ACTIVITIES.map(a => [a, 0])) as MaklonSummaryRow['values'], reviewQty: 0, reviewValue: 0, value: 0 });
  const grouped = new Map<string, MaklonSummaryRow>();
  const total = empty('TOTAL');
  Object.entries(HISTORICAL_MAKLON_JULI_2026).forEach(([company, values]) => {
    const item = empty(company);
    values.forEach((value, index) => {
      const activity = MAKLON_SUMMARY_ACTIVITIES[index];
      item.quantities[activity] = value;
      total.quantities[activity] += value;
    });
    (HISTORICAL_MAKLON_NILAI_JULI_2026[company] ?? []).forEach((value, index) => {
      const activity = MAKLON_SUMMARY_ACTIVITIES[index];
      item.values[activity] = value;
      total.values[activity] += value;
      item.value += value;
      total.value += value;
    });
    grouped.set(company, item);
  });
  let excludedCount = 0;
  let reviewCount = 0;
  let latest: Date | null = null;
  rows.forEach((row, index) => {
    const date = maklonDate(maklonField(row, 'So Date'));
    // The fixed historical period must not be counted twice. Invalid/out-of-year
    // dates stay visible in raw data but are explicitly excluded from the recap.
    if (!date || date.getFullYear() !== 2026 || date.getMonth() < 7) { excludedCount++; return; }
    let company = normalizeGudangName(String(maklonField(row, 'Company') ?? 'Tanpa lokasi'));
    // Maklon-only aliases; shared report warehouse normalization is unchanged.
    if (company === 'SPJ BOLAANG MONGONDOW' || company === 'SPJ BOLMONG') company = 'CDC BOLMONG';
    if (company === 'SPJ DOMPU') company = 'CDC DOMPU';
    const item = grouped.get(company) ?? empty(company);
    grouped.set(company, item);
    const decision = classifyMaklon(row, overrides[index]);
    const activity = MAKLON_ACTIVITIES.find(a => a.toLowerCase() === decision.activity.toLowerCase()) ?? (decision.activity.toLowerCase() === 'rebag' ? 'Rebagging' : undefined);
    const qty = maklonNumber(maklonField(row, 'So Quantity'));
    const value = maklonNumber(maklonField(row, 'Value Penjualan'));
    if (activity) { item.quantities[activity] += qty; total.quantities[activity] += qty; item.values[activity] += value; total.values[activity] += value; }
    else { item.reviewQty += qty; total.reviewQty += qty; item.reviewValue += value; total.reviewValue += value; reviewCount++; }
    item.value += value;
    total.value += value;
    if (date && (!latest || date > latest)) latest = date;
  });
  return { rows: [...grouped.values()].sort((a, b) => (WAREHOUSE_METADATA[a.company]?.order ?? 999) - (WAREHOUSE_METADATA[b.company]?.order ?? 999) || a.company.localeCompare(b.company)), total, reviewCount, count: rows.length, excludedCount, date: latest ? (latest as Date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }) : '31 Juli 2026' };
}
