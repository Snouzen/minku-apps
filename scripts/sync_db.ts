import { Client } from 'pg';

const PROD_URL = "postgresql://postgres.vonliqxrnjlhgteizqed:Bulog13579!%40%23@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
const DEV_URL = "postgresql://postgres.bpcpbmjhvzpvidkkhioi:Bulog13579!!%40%40%23%23@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function main() {
  console.log('Connecting to PROD...');
  const prodClient = new Client({ 
    connectionString: PROD_URL,
    ssl: { rejectUnauthorized: false } 
  });
  await prodClient.connect();

  console.log('Fetching data from PROD...');
  const users = await prodClient.query('SELECT * FROM users');
  const unitProduksi = await prodClient.query('SELECT * FROM unit_produksi');
  const vendors = await prodClient.query('SELECT * FROM vendors');
  const matrixKegiatan = await prodClient.query('SELECT * FROM matrix_kegiatan');
  const matrixTasks = await prodClient.query('SELECT * FROM matrix_tasks');
  const matrixSubTasks = await prodClient.query('SELECT * FROM matrix_sub_tasks');
  
  await prodClient.end();
  console.log(`Fetched ${users.rowCount} users, ${unitProduksi.rowCount} unit_produksi, ${vendors.rowCount} vendors, etc.`);

  console.log('Connecting to DEV...');
  const devClient = new Client({ 
    connectionString: DEV_URL,
    ssl: { rejectUnauthorized: false }
  });
  await devClient.connect();

  console.log('Clearing existing data in DEV (if any)...');
  await devClient.query('TRUNCATE users, unit_produksi, vendors, matrix_kegiatan, matrix_tasks, matrix_sub_tasks CASCADE');

  console.log('Inserting data into DEV...');

  // Users
  for (const row of users.rows) {
    await devClient.query(
      'INSERT INTO users (id, name, role, "picName", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [row.id, row.name, row.role, row.picName, row.password, row.createdAt, row.updatedAt]
    );
  }
  if (users.rowCount && users.rowCount > 0) {
      await devClient.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`);
  }

  // Unit Produksi
  for (const row of unitProduksi.rows) {
    await devClient.query(
      'INSERT INTO unit_produksi ("idRegional", "namaRegional", "siteArea", "alamat", "kodeRegional", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [row.idRegional, row.namaRegional, row.siteArea, row.alamat, row.kodeRegional, row.createdAt, row.updatedAt]
    );
  }

  // Vendors
  for (const row of vendors.rows) {
    await devClient.query(
      'INSERT INTO vendors (id, "namaVendor", "picVendor", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
      [row.id, row.namaVendor, row.picVendor, row.createdAt, row.updatedAt]
    );
  }
  if (vendors.rowCount && vendors.rowCount > 0) {
      await devClient.query(`SELECT setval('vendors_id_seq', (SELECT MAX(id) FROM vendors))`);
  }

  // Matrix Kegiatan
  for (const row of matrixKegiatan.rows) {
    await devClient.query(
      'INSERT INTO matrix_kegiatan (id, "namaKegiatan", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4)',
      [row.id, row.namaKegiatan, row.createdAt, row.updatedAt]
    );
  }
  if (matrixKegiatan.rowCount && matrixKegiatan.rowCount > 0) {
      await devClient.query(`SELECT setval('matrix_kegiatan_id_seq', (SELECT MAX(id) FROM matrix_kegiatan))`);
  }

  // Matrix Tasks
  for (const row of matrixTasks.rows) {
    await devClient.query(
      'INSERT INTO matrix_tasks (id, "namaTask", "kegiatanId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
      [row.id, row.namaTask, row.kegiatanId, row.createdAt, row.updatedAt]
    );
  }
  if (matrixTasks.rowCount && matrixTasks.rowCount > 0) {
      await devClient.query(`SELECT setval('matrix_tasks_id_seq', (SELECT MAX(id) FROM matrix_tasks))`);
  }

  // Matrix Sub Tasks
  for (const row of matrixSubTasks.rows) {
    await devClient.query(
      'INSERT INTO matrix_sub_tasks (id, "namaSubTask", goals, "actionPlan", status, "sdiPengajuanRm", "ndIzinPrinsipGm", "ndIzinPrinsipDirsar", "ndIzinPenggunaanRka", "ndBalasanDivisiUmum", "sdiPemberitahuanRm", "ndPermohonanPembayaran", "batasPenerbitanKontrak", "taskId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
      [row.id, row.namaSubTask, row.goals, row.actionPlan, row.status, row.sdiPengajuanRm, row.ndIzinPrinsipGm, row.ndIzinPrinsipDirsar, row.ndIzinPenggunaanRka, row.ndBalasanDivisiUmum, row.sdiPemberitahuanRm, row.ndPermohonanPembayaran, row.batasPenerbitanKontrak, row.taskId, row.createdAt, row.updatedAt]
    );
  }
  if (matrixSubTasks.rowCount && matrixSubTasks.rowCount > 0) {
      await devClient.query(`SELECT setval('matrix_sub_tasks_id_seq', (SELECT MAX(id) FROM matrix_sub_tasks))`);
  }

  await devClient.end();
  console.log('Migration PROD -> DEV data successful!');
}

main().catch(console.error);
