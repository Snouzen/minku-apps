with open('src/app/(main)/laporan-harian/components/historicalData2026.ts', 'r', encoding='utf-8') as f:
    content = f.read()

for i, line in enumerate(content.splitlines(), 1):
    if 'M_7' in line:
        print(f'{i}: {line}')
