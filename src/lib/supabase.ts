import {createClient} from '@supabase/supabase-js';

// Supabase URL: נגיש רק אם מתחיל ב-NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Supabase Anon Key: נגיש רק אם מתחיל ב-NEXT_PUBLIC_
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if(!supabaseUrl || !supabaseAnonKey){
    throw new Error('חסרים משתני סביבה חיוניים ל-Supabase!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);