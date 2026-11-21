import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wxqimmnubggkfzmiqdka.supabase.co'
const supabaseKey = 'sb_publishable_dBA5ATYY-IxHw2EPyNVW5Q_Zet5GRcN'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
