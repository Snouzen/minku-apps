import { Client } from 'pg';

const PROD_URL = "postgresql://postgres.vonliqxrnjlhgteizqed:Bulog13579!%40%23@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
const DEV_URL = "postgresql://postgres.bpcpbmjhvzpvidkkhioi:Bulog13579!!%40%40%23%23@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function main() {
  console.log('Connecting to PROD...');
  const prodClient = new Client({ connectionString: PROD_URL, ssl: { rejectUnauthorized: false } });
  await prodClient.connect();

  console.log('Fetching tasks from PROD...');
  const tasksRes = await prodClient.query('SELECT * FROM tasks');
  await prodClient.end();

  console.log(`Fetched ${tasksRes.rowCount} tasks.`);

  console.log('Connecting to DEV...');
  const devClient = new Client({ connectionString: DEV_URL, ssl: { rejectUnauthorized: false } });
  await devClient.connect();

  console.log('Clearing existing tasks in DEV...');
  await devClient.query('TRUNCATE tasks CASCADE');

  console.log('Inserting tasks into DEV...');
  for (const row of tasksRes.rows) {
    await devClient.query(`
      INSERT INTO tasks (
        id, "inputDate", task, "dueDate", pic, status, remarks, "createdAt", "updatedAt", "deletedAt", "createdById"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      row.id,
      row.inputDate,
      row.task,
      row.dueDate,
      row.pic,
      row.status,
      row.remarks,
      row.createdAt,
      row.updatedAt,
      row.deletedAt,
      row.createdById
    ]);
  }

  if (tasksRes.rowCount && tasksRes.rowCount > 0) {
    await devClient.query(`SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks))`);
  }

  await devClient.end();
  console.log('Migration tasks PROD -> DEV successful!');
}

main().catch(console.error);
