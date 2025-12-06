import { ArtworkGrid } from '@/components/ArtworkGrid'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Brush, 
  Image as ImageIcon, 
  Camera, 
  PenTool, 
  Layers, 
  Shapes 
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    // רקע כללי אפור בהיר מאוד, טקסט כהה, הדגשת טקסט בשחור
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-black selection:text-white font-sans">
      
      {/* 1. Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-200">
        <div className="flex flex-col items-center text-center">
          
          {/* כותרת עליונה - שחור נקי */}
          <span className="text-zinc-500 font-medium tracking-widest text-xs uppercase mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zinc-300"></span>
            הפלטפורמה מס' 1 בישראל לאומנות
            <span className="w-8 h-[1px] bg-zinc-300"></span>
          </span>
          
          {/* כותרת ראשית - פונט סריף לאלגנטיות */}
          <h1 className="text-5xl md:text-7xl font-serif text-zinc-900 mb-8 tracking-tight leading-tight">
            הבית של <span className="italic font-light">האמנות</span> הישראלית
          </h1>
          
          <p className="text-xl text-zinc-500 mb-12 max-w-2xl font-light leading-relaxed">
            אוצרות של יצירות מקוריות. עיצוב מינימליסטי המפנה את הבמה למה שחשוב באמת - היצירה.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/gallery">
              <Button className="bg-zinc-900 text-white hover:bg-black hover:scale-105 transition-all duration-300 rounded-none px-10 py-6 text-lg tracking-wide min-w-[200px] shadow-lg shadow-zinc-200">
                לכניסה לגלריה
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" className="border-zinc-300 bg-transparent text-zinc-900 hover:bg-white hover:border-black rounded-none px-10 py-6 text-lg tracking-wide min-w-[200px]">
                הצטרפות כאמן
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* יצירות נבחרות */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-zinc-900">אוסף נבחר</h2>
              <p className="text-zinc-500 mt-2 font-light">היצירות שכולם מדברים עליהן</p>
            </div>
            <Link href="/gallery" className="group flex items-center text-sm font-bold uppercase tracking-widest text-zinc-900 hover:text-zinc-600 transition-colors">
              לכל היצירות
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          
          {/* כאן ה-ArtworkGrid שלך יקבל רקע לבן לכל כרטיס כדי שיבלוט על הרקע האפור */}
          <ArtworkGrid />
        </div>
      </section>

      {/* 2. Banner Image 1 - שחור לבן קלאסי */}
      <div className="w-full h-[550px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 transition-all duration-700 z-10" /> 
        <img 
          src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop" 
          alt="Artistic Banner" 
          className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-3xl md:text-5xl font-serif italic text-white mb-6 leading-relaxed max-w-4xl drop-shadow-md">
            "אמנות היא לא מה שאתה רואה,<br/> אלא מה שאתה גורם לאחרים לראות."
          </h3>
          <span className="text-white/80 uppercase tracking-[0.2em] text-sm font-medium border-t border-white/30 pt-4 px-8">
            אדגר דגה
          </span>
        </div>
      </div>

      {/* 3. Categories - כרטיסיות לבנות על רקע אפור */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-zinc-900">לחקור לפי סגנון</h2>
            <div className="w-px h-12 bg-zinc-400 mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'ציורי שמן', icon: <Brush strokeWidth={1} className="w-8 h-8" /> },
              { name: 'צילום', icon: <Camera strokeWidth={1} className="w-8 h-8" /> },
              { name: 'אבסטרקט', icon: <Shapes strokeWidth={1} className="w-8 h-8" /> },
              { name: 'רישום', icon: <PenTool strokeWidth={1} className="w-8 h-8" /> },
              { name: 'קולאז׳', icon: <Layers strokeWidth={1} className="w-8 h-8" /> },
              { name: 'נוף וטבע', icon: <ImageIcon strokeWidth={1} className="w-8 h-8" /> }
            ].map((category, idx) => (
              <Link 
                key={idx} 
                href={`/gallery?category=${category.name}`}
                className="group relative bg-white border border-transparent p-10 flex flex-col items-center justify-center hover:border-zinc-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-zinc-400 group-hover:text-black transition-colors duration-300 mb-4 transform group-hover:scale-110">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-zinc-500 group-hover:text-black tracking-wide transition-colors duration-300">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Banner Image 2 - קונטרסט חזק (אפור כהה מאוד) */}
      <div className="w-full relative bg-zinc-900 flex flex-col md:flex-row border-t border-zinc-800">
        <div className="w-full md:w-1/2 relative h-80 md:h-[500px]">
           <img 
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop" 
            alt="Artist creating" 
            className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 text-white">
          <h3 className="text-4xl font-serif italic mb-6">יוצרים אמנות?</h3>
          <p className="text-zinc-400 mb-10 leading-relaxed max-w-md font-light">
            אנחנו מזמינים אתכם להצטרף לנבחרת האמנים שלנו. במה מינימליסטית ומכובדת ליצירה שלכם.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-transparent border border-white text-white hover:bg-white hover:text-zinc-900 rounded-none px-12 py-6 w-fit text-lg transition-all duration-300">
              הגשת מועמדות
            </Button>
          </Link>
        </div>
      </div>

      {/* 5. Footer CTA - חזרה לרקע אפור בהיר */}
      <section className="py-24 text-center px-4 bg-zinc-50 border-t border-zinc-200">
        <h2 className="text-4xl font-serif text-zinc-900 mb-6">האוסף המלא</h2>
        <p className="text-zinc-500 mb-10 max-w-xl mx-auto font-light">
          אלפי יצירות ייחודיות ממתינות לגילוי
        </p>
        <Link href="/gallery">
          <span className="inline-block border-b border-zinc-900 pb-1 text-xl text-zinc-900 hover:text-zinc-600 hover:border-zinc-600 transition-all cursor-pointer font-serif italic">
            כניסה לגלריה
          </span>
        </Link>
      </section>

    </div>
  )
}