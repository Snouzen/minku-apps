import { Client } from 'pg';

const PROD_URL = "postgresql://postgres.vonliqxrnjlhgteizqed:Bulog13579!%40%23@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
const DEV_URL = "postgresql://postgres.bpcpbmjhvzpvidkkhioi:Bulog13579!!%40%40%23%23@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function main() {
  console.log('Connecting to PROD...');
  const prodClient = new Client({ connectionString: PROD_URL, ssl: { rejectUnauthorized: false } });
  await prodClient.connect();

  console.log('Fetching ubi_maintenances from PROD...');
  const prodUbi = await prodClient.query('SELECT * FROM ubi_maintenances');
  await prodClient.end();

  if (prodUbi.rowCount === 0) {
    console.log('No UBI data in PROD to migrate.');
    return;
  }
  
  console.log(`Fetched ${prodUbi.rowCount} old UBI records.`);

  console.log('Connecting to DEV...');
  const devClient = new Client({ connectionString: DEV_URL, ssl: { rejectUnauthorized: false } });
  await devClient.connect();

  console.log('Clearing existing ubi data in DEV (if any)...');
  await devClient.query('TRUNCATE ubi_administrasi, ubi_kegiatan CASCADE');

  console.log('Transforming and inserting data into DEV (Parent-Child)...');

  let parentIdCounter = 1;
  let childIdCounter = 1;

  for (const row of prodUbi.rows) {
    // Insert Parent (ubi_administrasi)
    const parentRes = await devClient.query(`
      INSERT INTO ubi_administrasi (
        id, status, dependency, "vendorId", "nominalHasilEvaluasi", "nominalRealisasi",
        "ndIzinPrinsipGm", "ndIzinPrinsipDirsar", "ndIzinPenggunaanRka", "ndBalasanDivisiUmum",
        "sdiPemberitahuanRm", "ndPermohonanPembayaran", "batasPenerbitanKontrak", "dokumentasiUrls",
        "createdAt", "updatedAt", "deletedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id
    `, [
      parentIdCounter,
      row.status || 'INISIASI',
      row.dependency || 'MINKU',
      row.vendorId || null,
      row.nominalHasilEvaluasi || null,
      row.nominalRealisasi || null,
      row.ndIzinPrinsipGm || null,
      row.ndIzinPrinsipDirsar || null,
      row.ndIzinPenggunaanRka || null,
      row.ndBalasanDivisiUmum || null,
      row.sdiPemberitahuanRm || null,
      row.ndPermohonanPembayaran || null,
      row.batasPenerbitanKontrak || null,
      row.dokumentasiUrls || [],
      row.createdAt || new Date(),
      row.updatedAt || new Date(),
      row.deletedAt || null
    ]);

    const newParentId = parentRes.rows[0].id;
    parentIdCounter++;

    // Insert Child (ubi_kegiatan)
    await devClient.query(`
      INSERT INTO ubi_kegiatan (
        id, "administrasiId", kegiatan, site, "sdiPengajuanRm", "nominalPengajuan", progress, "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      childIdCounter,
      newParentId,
      row.kegiatan || '-',
      row.site || '-',
      row.sdiPengajuanRm || null,
      row.nominalPengajuan || null,
      row.progress || null,
      row.createdAt || new Date(),
      row.updatedAt || new Date()
    ]);
    
    childIdCounter++;
  }

  // Update sequences
  if (parentIdCounter > 1) {
    await devClient.query(`SELECT setval('ubi_administrasi_id_seq', (SELECT MAX(id) FROM ubi_administrasi))`);
    await devClient.query(`SELECT setval('ubi_kegiatan_id_seq', (SELECT MAX(id) FROM ubi_kegiatan))`);
  }

  await devClient.end();
  console.log('Migration UBI data PROD -> DEV (Parent-Child) successful!');
}

main().catch(console.error);
