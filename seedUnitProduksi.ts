import 'dotenv/config';
import { prisma } from './src/app/lib/prisma';
import fs from 'fs';

async function main() {
  if (!fs.existsSync('unitProduksiDump.json')) {
    console.error("❌ File 'unitProduksiDump.json' tidak ditemukan. Silakan jalankan dumpUnitProduksi.ts di database DEV terlebih dahulu.");
    process.exit(1);
  }

  const fileData = fs.readFileSync('unitProduksiDump.json', 'utf8');
  const data = JSON.parse(fileData);

  if (!Array.isArray(data) || data.length === 0) {
    console.log("⚠️ Tidak ada data untuk diimpor.");
    return;
  }

  console.log(`Sedang mengimpor ${data.length} baris data Unit Produksi ke Database saat ini...`);

  let successCount = 0;
  for (const item of data) {
    try {
      await prisma.unitProduksi.upsert({
        where: { idRegional: item.idRegional },
        update: {
          namaRegional: item.namaRegional,
          siteArea: item.siteArea,
          alamat: item.alamat,
          kodeRegional: item.kodeRegional,
        },
        create: {
          idRegional: item.idRegional,
          namaRegional: item.namaRegional,
          siteArea: item.siteArea,
          alamat: item.alamat,
          kodeRegional: item.kodeRegional,
        }
      });
      successCount++;
    } catch (err) {
      console.error(`❌ Gagal mengimpor item ${item.namaRegional}:`, err);
    }
  }

  console.log(`✅ Berhasil mengimpor ${successCount} dari ${data.length} data Unit Produksi!`);
}

main()
  .catch((e) => {
    console.error("❌ Fatal Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
