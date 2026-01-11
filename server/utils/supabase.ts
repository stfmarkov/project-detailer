import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAPIKey = process.env.SUPABASE_API_KEY

if (!supabaseUrl || !supabaseAPIKey) {
    throw new Error('SUPABASE_URL and SUPABASE_API_KEY are required')
}

const supabase = createClient(supabaseUrl, supabaseAPIKey)

export default supabase