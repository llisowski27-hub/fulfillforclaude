// Global test setup
// Env vars for local runs — CI injects real values via secrets
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "";
