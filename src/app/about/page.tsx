// app/page.tsx
import React from 'react';
import { thePainter, Artist } from '@/lib/artist';

// ----------------------------------------------------
// קומפוננטת פרסים (עודכנה לשימוש ב-Tailwind)
// ----------------------------------------------------
interface AwardsProps {
    awards: string[];
}

const Awards: React.FC<AwardsProps> = ({ awards }) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-700 border-r-4 border-orange-500 pr-2">
                פרסים והישגים
            </h2>
            <ul className="list-none p-0">
                {awards.map((award, index) => (
                    <li 
                        key={index} 
                        className="bg-purple-50 p-3 mb-2 rounded-lg border-r-4 border-purple-500 shadow-sm transition duration-300 hover:bg-purple-100"
                    >
                        {award}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// ----------------------------------------------------
// קומפוננטת העמוד הראשית (Home Page)
// ----------------------------------------------------
export default function Home() {
    const artist: Artist = thePainter; 

    return (
        // הגדרת קונטיינר מרכזי מוגבל ברוחבו וממורכז
        <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-xl rtl">
            
            {/* כותרת ראשית וז'אנר */}
            <h1 className="text-5xl font-extrabold mb-4 text-purple-900 border-b-4 border-purple-300 pb-3 flex justify-between items-end">
                <span>{artist.name}</span>
                <span className="text-lg font-light text-gray-500">({artist.genre})</span>
            </h1>
            
            {/* סטטוס פעיל */}
            {artist.isActive && (
                <div className="text-left mb-6">
                    <span className="inline-block bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        פעיל/ה כרגע
                    </span>
                </div>
            )}

            {/* תמונת האמן */}
            <img 
                src={artist.imageURL} 
                alt={`Portrait of ${artist.name}`} 
                className="w-full h-80 object-cover rounded-lg shadow-lg mb-8" 
            />

            {/* אודות האמן */}
            <div className="mb-8 border-r-4 border-blue-500 pr-4">
                <h2 className="text-2xl font-semibold mb-3 text-blue-700">אודות האמן</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-2">{artist.bio}</p>
                <p className="text-sm text-gray-500">
                    <strong>תאריך לידה:</strong> {artist.birthDate}
                </p>
            </div>
            
            {/* יצירות בולטות */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-700 border-r-4 border-orange-500 pr-2">
                    יצירות בולטות
                </h2>
                <ul className="list-none p-0">
                    {artist.notableWorks.map((work, index) => (
                        <li 
                            key={index}
                            className="bg-gray-50 p-3 mb-2 rounded-lg shadow-sm border-r-4 border-gray-400"
                        >
                            {work}
                        </li>
                    ))}
                </ul>
            </div>

            {/* פרסים והישגים - שימוש בקומפוננטה הנפרדת */}
            {artist.awards.length > 0 && (
                <Awards awards={artist.awards} />
            )}

        </div>
    );
}