import fs from "node:fs";

function parseEnvFile(path) {
  if (!fs.existsSync(path)) return {};
  const raw = fs.readFileSync(path, "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    val = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    out[key] = val;
  }
  return out;
}

const fileEnv = parseEnvFile(".env.admin");
const SUPABASE_URL = process.env.SUPABASE_URL || fileEnv.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;

// Accept multiple flags to avoid mistakes
const argv = process.argv;
const YES = argv.includes("--yes") || argv.includes("-yes") || argv.includes("-y") || argv.includes("--y");

if (!YES) {
  console.log("⚠️  This will DELETE ALL rows from public.leaderboard.");
  console.log("Run again with: node scripts/clearLeaderboardSupabase.mjs --yes");
  console.log("Or: npm run supabase:clear -- --yes");
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing env vars. Provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Create .env.admin (at project root) with:");
  console.error("  SUPABASE_URL=...");
  console.error("  SUPABASE_SERVICE_ROLE_KEY=...");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const { error } = await supabase
  .from("leaderboard")
  .delete()
  .neq("id", "00000000-0000-0000-0000-000000000000");

if (error) {
  console.error("❌ Failed to clear leaderboard:", error.message);
  process.exit(1);
}

console.log("✅ Supabase leaderboard cleared (public.leaderboard).");