import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceRole) {
    console.error("Missing SUPABASE envs. Provide NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const FROM = "Fifi";
  const TO = "Vivi";

  const { data, error } = await admin.from("tasks").select("*").contains("pic", [FROM]);
  if (error) {
    console.error("Failed to fetch tasks:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("No tasks with PIC", FROM);
    return;
  }

  let updated = 0;
  for (const row of data as Array<{ id: number; pic: string[] }>) {
    const newPic = (row.pic || []).map((p) => (p === FROM ? TO : p));
    const { error: upErr } = await admin
      .from("tasks")
      .update({ pic: newPic, updatedAt: new Date().toISOString() })
      .eq("id", row.id);
    if (upErr) {
      console.error(`Update failed for id=${row.id}:`, upErr);
    } else {
      updated++;
    }
  }

  console.log(`Renamed PIC "${FROM}" -> "${TO}" on ${updated} task(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
