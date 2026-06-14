import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL
const anonKey = process.env.SUPABASE_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, serviceKey, {
    auth:{
        autoRefreshToken: false,
        persistSession: false
    }
});
