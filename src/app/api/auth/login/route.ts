// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // ייבוא לקוח Supabase
import { setCookie } from 'cookies-next'; // ייבוא ספריית Cookies

export async function POST(req: NextRequest){
    try{
        // 1. חילוץ האימייל והסיסמה מגוף הבקשה (JSON)
        const { email, password } = await req.json();

        // 2. אימות מול Supabase: signInWithPassword
        // הפעולה מחזירה את נתוני הסשן (כולל ה-Token) או שגיאה.
        const {data: authData, error: authError} = await supabase.auth.signInWithPassword({
            email,
            password,    
        })

        if (authError || !authData.session) {
            // טיפול בשגיאות אימות שחוזרות מ-Supabase
            return NextResponse.json({ error: authError?.message || 'שם משתמש או סיסמה שגויים' }, { status: 401 });
        }

        // 3. שמירת הסשן ב-Cookie (השלב הקריטי לניהול סשן)
        const session = authData.session;
        const supabaseAccessToken = session.access_token;
        const cookieName = 'my-app-auth-token'; // שם מותאם אישית ל-Cookie

        // הגדרת ה-Cookie: httpOnly: true חיוני לאבטחה
        setCookie(cookieName, supabaseAccessToken, {
            req,
            res: new NextResponse(), // מופע Response חדש לשמירת ה-Cookie
            maxAge: 60 * 60 * 24 * 7, // אורך חיי ה-Cookie (שבוע)
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production', 
            httpOnly: true, // 🔒 קריטי: מונע גישת JavaScript ל-Token (הגנה מפני XSS)
        });

        // 4. הצלחה
        // ה-Token נשלח חזרה לדפדפן ב-HTTP Header (Set-Cookie) ולא בגוף התשובה.
        return NextResponse.json({ message: 'כניסה בוצעה בהצלחה' }, { status: 200 });

    } catch (error) {
        console.error('API Login Error:', error);
        return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
    }
}
