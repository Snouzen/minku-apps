import { Client } from 'pg';

const devUrl = "postgresql://postgres.bpcpbmjhvzpvidkkhioi:Bulog13579!!%40%40%23%23@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function main() {
  const devClient = new Client({ connectionString: devUrl });

  try {
    await devClient.connect();
    const res = await devClient.query('SELECT id, name, role, "picName" FROM "users"');
    console.table(res.rows);
  } finally {
    await devClient.end();
  }
}

main().catch(console.error);
