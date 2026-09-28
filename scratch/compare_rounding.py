import csv, sys
sys.path.append('scratch')
from analyze_sales import normalize_gudang, is_jasa_type, warehouses

with open('scratch/sales_raw.tsv', 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f, delimiter='\t'))

sept_rows = [r for r in rows if (r.get('Order Date') or '').startswith('2026-09')]

# Check if any row is cancelled/draft
valid_sept = []
for r in sept_rows:
    status = (r.get('Invoice Status') or '').upper().strip()
    valid_sept.append(r)

sept_raw = {w: {'PRODUK': {'W_1-6': 0.0, 'W_7-13': 0.0, 'W_14-20': 0.0, 'W_21-27': 0.0},
                'JASA': {'W_1-6': 0.0, 'W_7-13': 0.0, 'W_14-20': 0.0, 'W_21-27': 0.0}}
            for w in warehouses}

for r in valid_sept:
    gudang = normalize_gudang(r.get('Company'))
    if gudang not in warehouses: continue
    cat = r.get('Product Category')
    prod = r.get('Product')
    itype = 'JASA' if is_jasa_type(cat, prod) else 'PRODUK'
    day = int(r.get('Order Date')[8:10])
    total = float((r.get('Total') or '0').replace(',', ''))
    if 1 <= day <= 6: b = 'W_1-6'
    elif 7 <= day <= 13: b = 'W_7-13'
    elif 14 <= day <= 20: b = 'W_14-20'
    else: b = 'W_21-27'
    sept_raw[gudang][itype][b] += total

print('SEPTEMBER RAW COMPARISON:')
for b in ['W_7-13', 'W_14-20', 'W_21-27']:
    # Method 1: sum of rounded per warehouse (what our app currently does)
    p_sum_rounded = sum(round(sept_raw[w]['PRODUK'][b] / 1e6) for w in warehouses)
    j_sum_rounded = sum(round(sept_raw[w]['JASA'][b] / 1e6) for w in warehouses)
    tot_sum_rounded = p_sum_rounded + j_sum_rounded

    # Method 2: round of total raw sum (what Excel SUM does)
    p_raw_sum = sum(sept_raw[w]['PRODUK'][b] for w in warehouses)
    j_raw_sum = sum(sept_raw[w]['JASA'][b] for w in warehouses)
    p_rounded_total = round(p_raw_sum / 1e6)
    j_rounded_total = round(j_raw_sum / 1e6)
    tot_rounded_total = round((p_raw_sum + j_raw_sum) / 1e6)

    print(f'=== {b} ===')
    print(f'Sum of rounded (Our App):   PRODUK = {p_sum_rounded:6d}, JASA = {j_sum_rounded:4d}, TOTAL = {tot_sum_rounded:6d}')
    print(f'Round of raw sum (Excel):   PRODUK = {p_rounded_total:6d}, JASA = {j_rounded_total:4d}, TOTAL = {tot_rounded_total:6d}')

# Full month September
p_all_raw = sum(sept_raw[w]['PRODUK'][b] for w in warehouses for b in sept_raw[w]['PRODUK'])
j_all_raw = sum(sept_raw[w]['JASA'][b] for w in warehouses for b in sept_raw[w]['JASA'])
p_all_sum_round = sum(round(sum(sept_raw[w]['PRODUK'].values()) / 1e6) for w in warehouses)
j_all_sum_round = sum(round(sum(sept_raw[w]['JASA'].values()) / 1e6) for w in warehouses)
print(f'\n=== FULL SEPTEMBER ===')
print(f'Sum of rounded per warehouse (Our App): PRODUK = {p_all_sum_round:6d}, JASA = {j_all_sum_round:4d}, TOTAL = {p_all_sum_round + j_all_sum_round:6d}')
print(f'Round of raw sum (Excel):               PRODUK = {round(p_all_raw/1e6):6d}, JASA = {round(j_all_raw/1e6):4d}, TOTAL = {round((p_all_raw+j_all_raw)/1e6):6d}')
