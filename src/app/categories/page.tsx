// app/categories/page.tsx

import React from 'react';
import { CATEGORIES, Category } from '@/lib/category'; // ייבוא הנתונים והטיפוסים
import Link from 'next/link'; 

export default function CategoriesPage() {
    return (
        <div className="max-w-6xl mx-auto p-8 rtl">
            <h1 className="text-5xl font-extrabold mb-10 text-center text-indigo-800 border-b-4 border-indigo-200 pb-4">
                🎨 גלריית קטגוריות אמנות
            </h1>

            {/* רשת (Grid) להצגת הכרטיסים */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* לולאת map על הנתונים הסטטיים */}
                {CATEGORIES.map((category: Category) => (
                    // Link: עוטף את הכרטיס ליצירת ניווט מהיר
                    <Link 
                        key={category.id} 
                        href={`/categories/${category.slug}`}
                        className="block transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl"
                    >
                        {/* כרטיס קטגוריה מעוצב */}
                        <div className="bg-white p-6 rounded-lg shadow-xl border-t-8 border-indigo-500 h-full">
                            <h2 className="text-3xl font-bold mb-3 text-indigo-700">
                                {category.name}
                            </h2>
                            <p className="text-gray-600 mb-4">{category.description}</p>
                            
                            {/* הצגת תתי-הז'אנרים */}
                            <p className="text-sm font-semibold text-gray-500 mt-4">ז'אנרים מרכזיים:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {category.genres.map((genre, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}

            </div>
        </div>
    );
}