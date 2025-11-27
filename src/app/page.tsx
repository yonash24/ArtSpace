import { ArtworkGrid } from '@/components/ArtworkGrid'
import { Button } from '@/components/ui/Button'
import { Search, Palette, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            גלה את עולם ה
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              אמנות
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            פלטפורמה לאמנים ואוהבי אמנות. גלה, שתף והתחבר עם יצירות מדהימות מאמנים מכל העולם
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/gallery">
              <Button size="lg" className="w-full sm:w-auto">
                <Palette className="w-5 h-5 mr-2" />
                גלה ציורים
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Users className="w-5 h-5 mr-2" />
                הצטרף כאמן
              </Button>
            </Link>
          </div>

          {/* סטטיסטיקות */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,000+</div>
              <div className="text-gray-600">ציורים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">אמנים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">צפיות</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ציורים מובחרים
              </h2>
              <p className="text-gray-600">
                הציורים הפופולריים והחדשים ביותר
              </p>
            </div>
            <Link href="/gallery">
              <Button variant="outline">
                צפה בכל הציורים
              </Button>
            </Link>
          </div>

          <ArtworkGrid />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            קטגוריות פופולריות
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'נוף', color: 'bg-green-500', icon: '🌄' },
              { name: 'פורטרט', color: 'bg-blue-500', icon: '👤' },
              { name: 'אבסטרקט', color: 'bg-purple-500', icon: '🎨' },
              { name: 'טבע דומם', color: 'bg-yellow-500', icon: '🍎' },
              { name: 'עירוני', color: 'bg-gray-500', icon: '🏙️' },
              { name: 'בעלי חיים', color: 'bg-orange-500', icon: '🦋' }
            ].map((category) => (
              <Link
                key={category.name}
                href={`/gallery?category=${category.name}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            מוכן להציג את האמנות שלך?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            הצטרף לקהילת האמנים שלנו ושתף את היצירות שלך עם העולם
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-4">
              התחל עכשיו - חינם
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
