import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

console.log(supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WaitlistEntry = {
  id?: number;
  email: string;
  created_at?: string;
};
