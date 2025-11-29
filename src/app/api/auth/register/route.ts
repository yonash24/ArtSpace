// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // ייבוא לקוח Supabase המוגדר

export async function POST(req:NextRequest) {
    try{
        const { email, password, username, firstName, lastName, role } = await req.json();
    
        // 3. בדיקת תקינות מינימלית
        if (!email || !password || !username) {
            return NextResponse.json({ error: 'חסרים פרטים חיוניים' }, { status: 400 });
        }

        const {data: authData, error: authError} = await.supabase.auth.signUp({
            email,
            password,
            options: {
                data: { // נתונים אופציונליים שיישמרו בפרופיל המשתמש (metadata)
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    role: role || 'VIEWER' // לוודא שיש role ברירת מחדל
                }
            }
        });

      return NextResponse.json({ 
            message: 'הרשמה בוצעה בהצלחה! אנא אשר את המייל.',
            user: authData.user?.id // החזרת ID המשתמש (אופציונלי)
        }, { status: 200 });
    }
    catch (error){
      // טיפול בשגיאות שרת פנימיות
        console.error('API Registration Error:', error);
        return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
    }
}