import { Client } from 'pg';

const devUrl = "postgresql://postgres.bpcpbmjhvzpvidkkhioi:Bulog13579!!%40%40%23%23@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString: devUrl });

  try {
    await client.connect();
    
    // Get all tasks where pic array contains 'Agung'
    const res = await client.query(`SELECT id, pic FROM "tasks" WHERE 'Agung' = ANY(pic)`);
    console.log(`Found ${res.rows.length} tasks with Agung.`);

    for (const row of res.rows) {
      // Replace 'Agung' with 'Rakha'
      const updatedPic = row.pic.map((p: string) => p === 'Agung' ? 'Rakha' : p);
      
      // Update in db
      await client.query(`UPDATE "tasks" SET pic = $1 WHERE id = $2`, [updatedPic, row.id]);
    }
    
    console.log("Updated all tasks successfully.");
  } finally {
    await client.end();
  }
}

main().catch(console.error);
