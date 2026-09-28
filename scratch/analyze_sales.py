import csv, re
from datetime import datetime

warehouses = [
  'SPB JAKARTA', 'SPB INDRAMAYU', 'SPB SUKOHARJO', 'SPB SIDOARJO', 'SPB LOMBOK TIMUR', 'SPB SIDRAP', 'SPB MAKASSAR',
  'SPP SUBANG', 'SPP KARAWANG', 'SPP LAMPUNG', 'SPP KENDAL', 'SPP SRAGEN', 'SPP MAGETAN', 'SPP BOJONEGORO', 'SPP JEMBER', 'SPP BANYUWANGI', 'SPP SUMBAWA',
  'UP BANTUL', 'UP CANDIREJO', 'UP MOJOLABAN', 'UP LANCIRANG', 'UP ANABANUA',
  'CDC DOMPU', 'CDC BOLMONG'
]

groups = {
  w: ('SPB' if w.startswith('SPB') else 'SPP' if w.startswith('SPP') else 'UP' if w.startswith('UP') else 'CDC')
  for w in warehouses
}

def normalize_gudang(name):
    clean = (name or '').upper().strip()
    clean = re.sub(r'^\d+\s*[-–]\s*', '', clean)
    clean = re.sub(r'\s+', ' ', clean)
    if clean.startswith('SPB - '): clean = clean.replace('SPB - ', 'SPB ')
    if clean.startswith('SPP - '): clean = clean.replace('SPP - ', 'SPP ')
    if clean.startswith('CDC - '): clean = clean.replace('CDC - ', 'CDC ')
    if clean.startswith('UP - '): clean = clean.replace('UP - ', 'UP ')
    if clean.startswith('UNIT PENGOLAHAN '): clean = clean.replace('UNIT PENGOLAHAN ', 'UP ')
    if clean in ('SPB DKI JAKARTA', 'SPB DKI'): clean = 'SPB JAKARTA'
    return clean

def is_jasa_type(cat, prod):
    c = (cat or '').upper().strip()
    p = (prod or '').upper().strip()
    return (
        'SERVICE' in c or 'JASA' in c or 'SEWA' in c or 'JASTASMA' in c or
        'JASA' in p or 'SERVICE' in p or p.startswith('[E0') or p.startswith('[D0')
    )

with open('scratch/sales_raw.tsv', 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f, delimiter='\t'))

dates = []
for r in rows:
    order_date = r.get('Order Date') or ''
    try:
        dt = datetime.strptime(order_date.split()[0], '%Y-%m-%d')
        dates.append(dt)
    except Exception as e:
        pass

print(f'Min date: {min(dates)}, Max date: {max(dates)}')

aug_rows = [r for r in rows if (r.get('Order Date') or '').startswith('2026-08')]
print(f'Total August rows: {len(aug_rows)}')

aug_raw = {w: {'PRODUK': 0.0, 'JASA': 0.0} for w in warehouses}
unmapped_aug = []

for r in aug_rows:
    gudang = normalize_gudang(r.get('Company'))
    if gudang not in warehouses:
        unmapped_aug.append((r.get('Company'), gudang, r.get('Total')))
        continue
    
    cat = r.get('Product Category')
    prod = r.get('Product')
    itype = 'JASA' if is_jasa_type(cat, prod) else 'PRODUK'
    total_str = (r.get('Total') or '').replace(',', '')
    val = float(total_str) if total_str else 0.0
    aug_raw[gudang][itype] += val

print(f'Unmapped August rows: {unmapped_aug}')

print('\nWarehouse by warehouse August (in Rp Juta, rounded per warehouse):')
tot_prod = 0
tot_jasa = 0
raw_tot_prod = 0.0
raw_tot_jasa = 0.0

for w in warehouses:
    p_raw = aug_raw[w]['PRODUK']
    j_raw = aug_raw[w]['JASA']
    p_val = round(p_raw / 1000000)
    j_val = round(j_raw / 1000000)
    raw_tot_prod += p_raw
    raw_tot_jasa += j_raw
    tot_prod += p_val
    tot_jasa += j_val
    if p_val > 0 or j_val > 0 or p_raw > 0 or j_raw > 0:
        print(f'{w:20}: PRODUK = {p_val:6d} (raw: {p_raw:14,.2f}), JASA = {j_val:6d} (raw: {j_raw:14,.2f})')

print('-'*60)
print(f'Sum of rounded per warehouse: PRODUK = {tot_prod}, JASA = {tot_jasa}, TOTAL = {tot_prod + tot_jasa}')
print(f'Raw total / 1e6: PRODUK = {raw_tot_prod/1e6:.3f} (round: {round(raw_tot_prod/1e6)}), JASA = {raw_tot_jasa/1e6:.3f} (round: {round(raw_tot_jasa/1e6)}), TOTAL = {(raw_tot_prod+raw_tot_jasa)/1e6:.3f} (round: {round((raw_tot_prod+raw_tot_jasa)/1e6)})')
