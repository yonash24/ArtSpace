// app/api/scrape/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios'; // ייבוא axios
import * as cheerio from 'cheerio'; // ייבוא Cheerio


// 1. פונקציית POST לטיפול בבקשות Scraping
export async function POST(req: NextRequest) {

    try{
        const {url, contentType} = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'חסרה כתובת URL' }, { status: 400 });
        }

        // 3. קריאת HTTP לאתר החיצוני
        const response = await axios.get(url);
        const html = response.data; // ה-HTML המלא של הדף

        // 4. טעינת ה-HTML לתוך Cheerio
        const $ = cheerio.load(html);

        let result = '';

        // 5. לוגיקת החילוץ (Scraping)
        switch (contentType) {
            case 'image':
                // ניסיון למצוא תמונה ראשית באמצעות סלקטור נפוץ
                // נחפש תגית <img> בתוך body עם src כלשהו
                const img = $('body img[src]').first();
                result = img.attr('src') || 'לא נמצאה תמונה מתאימה.';
                break;

            case 'text':
                // חילוץ טקסט רב מתוך אלמנט נפוץ (למשל, פסקה או גוף מאמר)
                // נחפש את כל תגיות ה-<p> ונחבר את הטקסט
                $('p').each((index, element) => {
                    result += $(element).text() + '\n\n';
                });
                result = result.trim().substring(0, 1000) + '...'; // הגבלת אורך
                break;

            default:
                result = 'סוג תוכן לא חוקי';
        }

        // 6. החזרת הנתונים שחולצו
        return NextResponse.json({ content: result, type: contentType }, { status: 200 });
    }
    catch (error) {
        console.error('Scraping Error:', error);
        return NextResponse.json({ error: 'שגיאה בגישה או ניתוח האתר' }, { status: 500 });
    }
}