export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
}

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  throw new Error('Missing env variables')
}
