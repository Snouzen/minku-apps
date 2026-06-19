import 'dotenv/config';
import { prisma } from './src/app/lib/prisma';
import fs from 'fs';

async function main() {
  console.log("Sedang menarik data Unit Produksi dari Database saat ini...");
  const data = await prisma.unitProduksi.findMany();
  
  fs.writeFileSync('unitProduksiDump.json', JSON.stringify(data, null, 2));
  
  console.log(`✅ Berhasil mengekstrak ${data.length} baris data Unit Produksi ke file 'unitProduksiDump.json'.`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
