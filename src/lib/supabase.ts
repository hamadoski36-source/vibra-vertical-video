import { createClient } from "@supabase/supabase-js";

// Publishable (anon) key — safe to ship in browser code. Row Level Security on
// the Supabase project is what protects private data; no secret keys live here.
const SUPABASE_URL = "https://svrjacetnlwlwesferwz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iXum9XuFOTo261UcV49ZNQ_LtZBp5kc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
