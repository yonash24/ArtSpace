// middleware.ts

import { NextResponse, NextRequest } from 'next/server';

// 1. הגדרת הנתיבים המוגנים והציבוריים
// נתיבים ציבוריים: ניתן לגשת אליהם ללא אימות
const PUBLIC_ROUTES = [
    '/auth/signin',
    '/auth/signup',
    '/', // דף הבית
];
// נתיבים פנימיים: דורשים אימות
const PROTECTED_ROUTES = [
    '/dashboard',
    // ... כל נתיב אחר שרק משתמש מחובר צריך לראות
];

// 2. הפונקציה הראשית של Middleware
export function middleware(request: NextRequest) {
    
    // קריאת ה-Cookie המאובטח שלנו, שנוצר במהלך הכניסה
    // זכור: ה-Token ב-Cookie נקרא 'my-app-auth-token'
    const accessToken = request.cookies.get('my-app-auth-token')?.value;
    
    // הנתיב הנוכחי שהמשתמש מנסה לגשת אליו
    const pathname = request.nextUrl.pathname;

    // --- לוגיקה 1: משתמש מחובר מנסה לגשת לנתיבי אימות (Signin/Signup) ---
    if (accessToken && PUBLIC_ROUTES.includes(pathname)) {
        // אם המשתמש מחובר וניסה לגשת לדף כניסה/הרשמה
        // מפנים אותו אוטומטית לדאשבורד (מקום בטוח)
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // --- לוגיקה 2: משתמש לא מחובר מנסה לגשת לנתיב מוגן ---
    // אנו בודקים אם הנתיב הנוכחי הוא אחד מהנתיבים המוגנים
    const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (isProtected && !accessToken) {
        // אם הנתיב מוגן ואין Token ב-Cookie
        // מפנים את המשתמש לדף הכניסה
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // --- לוגיקה 3: מעבר הלאה ---
    // בכל מקרה אחר (למשל, גישה לדף ציבורי כמשתמש לא מחובר, או גישה לדף מוגן כמשתמש מחובר),
    // מאפשרים לבקשה להמשיך ליעד המקורי.
    return NextResponse.next();
}

// 3. הגדרת התאמה לנתיבים (Matcher)
// זוהי הגדרה אופציונלית אך מומלצת כדי למנוע מה-Middleware לרוץ על קבצי סטטיים/נתיבי API לא רלוונטיים.
export const config = {
    // ה-Middleware ירוץ רק על נתיבים שנמצאים ברשימה
    matcher: [
        '/dashboard/:path*', // כל נתיב שמתחיל ב- /dashboard
        '/auth/signin',
        '/auth/signup',
        '/',
    ],
};