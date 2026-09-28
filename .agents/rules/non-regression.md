# Non-Regression, Module Isolation, and Process Preservation Rule

1. **Strict Cross-Report Isolation (Non-Interference Rule)**:
   - When introducing, refactoring, or updating features for subsequent report types (Report 2 "Harga Pembelian", Report 3 "Realisasi Pengadaan UB", Slide Deck Presentation, etc.), **all previously completed reports (especially Report 1 "Realisasi Pengadaan" and Report 2 "Harga Pembelian") must remain 100% intact, untouched, and isolated**.
   - No shared mutable state, parser changes, or styling overrides should bleed across different report types or tabs.

2. **Commodity Filter Standards (Pivot Raw Data & Subtabs)**:
   - The `Semua Komoditi` option is omitted.
   - Dropdown options strictly consist of:
    1. `Beras (Beras Bahan Baku)` (`BERAS,BAHAN BAKU` / `BERAS`) — **Default active filter**
    2. `Gabah (GKP)` (`GABAH,GKP` / `GABAH`)
    3. `Jagung` (`JAGUNG`) — Always available even if data is currently empty.

3. **Never alter or break existing calculation formulas, established groupings, or workflows** when introducing new features, tabs, or columns.

4. **Protected Core Elements**:
   - **Report 1 (Realisasi Pengadaan)**:
     - Strict commodity classification (`classifyCommodity` - non-commodities like KEMASAN, BIAYA, and prefixes [D...], [E...] must NEVER be counted as Beras/Gabah/Jagung).
     - Smart Price Validator (`getRealKuantumKg` - automatically corrects 50x multiplier errors from ERP Odoo when `Ukuran = 50`).
     - Closed Matrix Math (active month equals sum of displayed weeks $\text{W1}+\text{W2}+\text{W3}+\text{W4}$, summary footers directly sum displayed column integers).
     - SPB product category filter (`BERAS BAHAN BAKU`).
     - RM Groupings (RM I, II, III) and sequential row ordering (1–24).
     - Weekly buckets (`W_1-9`, `W_10-16`, `W_17-23`, `W_24-31` / dynamic month-end tail merging) and dynamic accumulation (`REAL S/D [BULAN]`).
     - R. Pengadaan UB sub-tab (Table 1 Realisasi Pengadaan UBI Nasional & Table 2 Realisasi Pengadaan Per RM).
     - `TARGET 2026`, `TARGET_2026_RM` + `VS TGT 2026 (%)`.
   - **Report 2 (Harga Pembelian)**:
     - Sub-tabs: `Pivot Raw Data`, `Final Report (Gabah & Beras)`, `Final Report (Jagung)`, `R. Harga Pembelian`, `Pivot Custom`.
     - Weighted average price calculation: $\text{Harga (Rp/Kg)} = \frac{\sum \text{Nominal (Rp)}}{\sum \text{Qty (Kg)}}$.
     - Dynamic Month Detection.
     - Final Report structure: `No`, `RM`, `LOKASI`, `JAN`..`JULI`, Active Month (`AGT`/`SEPT`), `MINGGUAN`, and `REAL S/D [BULAN_AKTUAL]`.
     - Footer Summary: `HARGA BERAS SPB`, `HARGA BERAS SPP`, `HARGA GABAH SPP`, `HARGA BERAS UP`, `HARGA GABAH UP`, `HARGA JAGUNG`, `HARGA BERAS`, `HARGA GABAH` (weighted averages, not addition).
     - `R. Harga Pembelian` (Tab 4): `REALISASI HARGA PEMBELIAN UBI` summarizing `GABAH`, `BERAS`, `JAGUNG`.
     - Multi-month accumulation: when active month is September or later, all earlier months in dataset (e.g., August) are automatically calculated and accumulated into their past month columns (`AGT`) across rows and footers.
   - **Report 3 (Realisasi Pengadaan UB)**:
     - Sub-tabs: `Pivot Raw Data`, `Harga`, `Final Report`, `Pivot Custom`.
     - `Pivot Raw Data` (Tab 1): Weighted average procurement price per company, dynamic month columns, daily breakdown toggle, standard 3-commodity filter.
     - `Harga` (Tab 2): 2-level header with `31 [Bulan Sebelumnya] 2026`, `S/d Terakhir`, `Total` (each with `Kuantum` & `Nilai` sub-columns), and `HARGA (Rp/KG)`, seeded with `HISTORICAL_REALISASI_PENGADAAN_UB_JULI_2026`.
     - `Final Report` (Tab 3): 3-level header structure with Target 2026, Realisasi Ton (`s.d [Kemarin]`, `[Hari Terakhir]`, `Total`), Persentase Pencapaian (%), and weighted average prices per commodity (Gabah, Beras, Jagung).
     - `Pivot Custom` (Tab 4): Custom pivot data view.
   - **Report 4 (Data Penyerapan)**:
      - Sub-tabs: `Penyerapan`, `HPP`, `Final Report`, `Pivot Custom`.
      - `Penyerapan` (Tab 1):
        - Table 1: 2-level header with `31 [Bulan Sebelumnya] 2026`, `S/d Terakhir`, `Total` (each with `Kuantum` & `Nilai` sub-columns), and `HARGA (Rp/KG)`. Exclusively displays Gabah/GKP for **SPP units only** (SPP 1–10; UP omitted) with no commodity filter. Seeded with `HISTORICAL_REALISASI_PENGADAAN_UB_JULI_2026.GABAH`.
        - Table 2: Perbandingan Realisasi 2026 vs 2025 (`COMPANY`, `2026 TON`, `2025 TON`, `2026 Rp`, `2025 Rp`). Sourced dynamically from 2026 realization and hardcoded 2025 baseline `DATA_PENYERAPAN_2025`.
        - Unit price: $\text{Harga} = \frac{\text{Total Nilai (Rp)}}{\text{Total Kuantum (Kg)}}$. Footer displays weighted average price for 2026 and 2025 Rp.

    - **Smart 3-Slot ERP Data Hub (Multi-Source Architecture)**:
       - **Slot 1 (Data Pengadaan / PO)**: State `data`, `columns`, `fileName`. Powers Report 1, 2, 3, and 4 Tab 1.
       - **Slot 2 (Data Persediaan / Stok & Valuation)**: State `inventoryData`, `inventoryColumns`, `inventoryFileName`. Powers Report 4 Tab 2 (HPP), Report 5, and inventory slides.
       - **Slot 3 (Data Penjualan / SO & Sales)**: State `salesData`, `salesColumns`, `salesFileName`. Powers Report 6 and sales slides.
       - **Smart Classifier & Multi-Dropzone (`classifyExcel`)**: Heuristic signature routing based on header keys.

5. **Always build additively and verify** with `npm run build` to guarantee zero regressions.
