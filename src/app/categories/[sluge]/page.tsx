// app/categories/[slug]/page.tsx

import React from "react";
import { getCategoryBySlug, Category } from "@/lib/category";   

interface CategoryPageProps {
  // params הוא השם הסטנדרטי לאובייקט פרמטרי הניתוב
  params: {
    // slug הוא המפתח, הנגזר משם התיקייה [slug]
    slug: string; 
  };
}

export default function CategoryPage( {params} : CategoryPageProps){

    const {slug} = params;
    const category = getCategoryBySlug(slug);
    if(!category){
        return(
            <div className="max-w-4xl mx-auto p-20 text-center bg-red-50 rounded-lg shadow-lg border-2 border-red-300 rtl">
                <h1 className="text-3xl font-bold text-red-700 mb-4">שגיאה 404: קטגוריה לא נמצאה</h1>
                <p className="text-lg text-red-600">הסלאג '{slug}' אינו קיים במערכת. אנא בדוק את הכתובת.</p>
            </div>
        );
    }

    return(
        <div className="max-w-4xl mx-auto p-8 rtl bg-white shadow-xl rounded-lg">
            
            <h1 className="text-5xl font-extrabold mb-4 text-indigo-800 border-b-4 border-indigo-200 pb-3">
                {category.name}
            </h1>
            <p className="text-xl text-gray-700 mb-6 border-r-4 border-indigo-400 pr-3">
                {category.description}
            </p>
            
            {/* רשימת ז'אנרים */}
            <h2 className="text-2xl font-semibold mt-10 mb-3 text-purple-700 border-b pb-1">
                ז'אנרים מרכזיים
            </h2>
            <div className="flex flex-wrap gap-3">
                {/* map ליצירת תגיות עבור כל ז'אנר */}
                {category.genres.map((genre, index) => (
                    <span 
                        key={index} 
                        className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full shadow-md hover:bg-purple-200 transition"
                    >
                        {genre}
                    </span>
                ))}
            </div>

            {/* נמשיך כאן עם רשימת האמנים הרלוונטיים בשלב הבא */}
        </div>
    );
}




