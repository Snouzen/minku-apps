import re

with open('src/app/(main)/laporan-harian/components/historicalData2026.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = False
p_tot = {f'M_{i}': 0 for i in range(7)}
j_tot = {f'M_{i}': 0 for i in range(7)}

for l in lines:
    if 'HISTORICAL_REALISASI_PENJUALAN_2026_DATA' in l:
        start = True
    if start and 'TARGET_REALISASI_PENJUALAN_2026_DATA' in l:
        start = False
        break
    if start:
        m_prod = re.search(r'PRODUK:\s*\{([^}]+)\}', l)
        if m_prod:
            for k, v in re.findall(r'"(M_\d+)":\s*(\d+)', m_prod.group(1)):
                p_tot[k] += int(v)
        m_jasa = re.search(r'JASA:\s*\{([^}]+)\}', l)
        if m_jasa:
            for k, v in re.findall(r'"(M_\d+)":\s*(\d+)', m_jasa.group(1)):
                j_tot[k] += int(v)

print('HISTORICAL_REALISASI_PENJUALAN_2026_DATA sums:')
month_names = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL"]
for i in range(7):
    k = f'M_{i}'
    print(f'{month_names[i]:5} ({k}): PRODUK = {p_tot[k]:7,}, JASA = {j_tot[k]:5,}, TOTAL = {p_tot[k]+j_tot[k]:7,}')
