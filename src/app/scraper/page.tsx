// src/app/scraper/page.tsx
// שימו לב ל-use client, חובה לניהול State ואירועים

'use client'; 

import { useState } from 'react';

// הגדרת סוגי התוכן שאנו יכולים לחלץ
type ContentType = 'image' | 'text';

// ממשק לנתוני התוצאה
interface ScrapeResult {
  content: string;
  type: ContentType;
}

export default function WebScraperPage() {
  
  // State לניהול הקלט של המשתמש
  const [url, setUrl] = useState('');
  const [contentType, setContentType] = useState<ContentType>('image');

  // State לניהול התוצאה והסטטוס
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // פונקציית שליחת הטופס
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // מניעת טעינה מחדש של הדף
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
        // שליחת בקשת POST ל-API Route שלנו
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, contentType }),
        });

        // בדיקה אם השרת הגיב עם שגיאה
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'שגיאה כללית בשרת הגירוד.');
        }

        // קבלת התוצאה המוצלחת
        const data: ScrapeResult = await response.json();
        setResult(data);

    } catch (err: any) {
        // טיפול בשגיאות HTTP, רשת, או שגיאות ששלחנו מה-API Route
        setError(err.message || 'שגיאה לא ידועה בתהליך הגירוד.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      
      {/* כותרת */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛠️ Web Scraper Tool</h1>
      <p className="mb-6 text-gray-600">הזן כתובת URL ובחר את סוג התוכן שברצונך לחלץ מהדף.</p>

      {/* 1. טופס הקלט */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* קלט URL */}
        <div>
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
            כתובת האתר (URL) המלאה:
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page-to-scrape"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* בורר סוג תוכן */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סוג התוכן לחילוץ:
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="image"
                checked={contentType === 'image'}
                onChange={() => setContentType('image')}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">תמונה ראשית</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="text"
                checked={contentType === 'text'}
                onChange={() => setContentType('text')}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">טקסט (עד 1000 תווים)</span>
            </label>
          </div>
        </div>

        {/* כפתור שליחה */}
        <button
          type="submit"
          disabled={isLoading || !url}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isLoading ? 'מחלץ נתונים...' : 'התחל גירוד (Scrape)'}
        </button>
      </form>

      {/* 2. אזור התוצאות והשגיאות */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">תוצאות החילוץ</h2>

        {/* תצוגת שגיאה */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">שגיאה! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* תצוגת תוצאה מוצלחת */}
        {result && !error && (
          <div className="border border-green-300 rounded-lg p-5 bg-green-50">
            <p className="text-gray-700 mb-3">**סוג שחולץ:** <span className="font-semibold">{result.type === 'image' ? 'תמונה' : 'טקסט'}</span></p>
            
            {result.type === 'image' && (
              <div className="mt-4">
                <p className="mb-2 font-mono text-sm text-blue-700 break-all">
                  **כתובת התמונה שחולצה:** {result.content}
                </p>
                
                {/* הצגת התמונה בפועל */}
                <img
                  src={result.content}
                  alt="תמונה שחולצה מהאתר החיצוני"
                  className="mt-3 max-w-full h-auto rounded-md shadow-lg border border-gray-200"
                  onError={(e) => {
                      // טיפול במקרים בהם ה-URL של התמונה אינו תקין
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Load+Failed';
                  }}
                />
              </div>
            )}

            {result.type === 'text' && (
              <div className="mt-4 bg-white p-4 rounded-md border border-gray-200 whitespace-pre-line text-sm text-gray-800">
                {result.content}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}