'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArtworkGrid } from '@/components/ArtworkGrid'
import { Button } from '@/components/ui/Button'
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  X 
} from 'lucide-react'

export default function GalleryPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [isForSale, setIsForSale] = useState(searchParams.get('isForSale') === 'true')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<Array<{id: string, name: string, color?: string}>>([])

  // טעינת קטגוריות
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // כאן נעדכן את ה-URL עם הפרמטרים החדשים
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (isForSale) params.set('isForSale', 'true')
    
    window.history.pushState({}, '', `/gallery?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setIsForSale(false)
    window.history.pushState({}, '', '/gallery')
  }

  const activeFiltersCount = [searchQuery, selectedCategory, isForSale].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100/60 via-pink-50 to-white overflow-x-hidden">
      {/* כותרת עיצובית */}
      <div className="relative overflow-hidden bg-white shadow-xl border-b z-10">
        {/* דינמיות צבע ואיור דקורטיבי */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <svg viewBox="0 0 1440 280" fill="none" className="w-full h-full">
            <defs>
              <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(800 30) rotate(119) scale(800 340)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a5e1ff" />
                <stop offset="1" stopColor="#fdcaf1" />
              </radialGradient>
            </defs>
            <ellipse cx="700" cy="120" rx="800" ry="140" fill="url(#paint0_radial)" opacity="0.35" />
          </svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4">
          <div className="text-center md:text-right w-full">
            <h1 className="font-extrabold text-5xl sm:text-6xl text-gradient bg-gradient-to-r from-blue-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              גלריית האמנות
            </h1>
            <p className="text-2xl text-gray-700 max-w-2xl mx-auto md:mr-0 leading-relaxed shadow-sm rounded-lg px-1 pb-1">
              גלה יצירות אמנות מדהימות מאמנים מכל העולם
            </p>
          </div>
          <img 
            src="/gallery-hero-art.svg"
            alt="Art Gallery Illustration"
            className="w-44 h-44 object-contain hidden md:block drop-shadow-xl animate-fade-in"
          />
        </div>

        {/* שורת חיפוש ופילטר */}
        <div className="relative max-w-3xl mx-auto px-3 z-20 -mt-6 mb-12">
          <form
            onSubmit={handleSearch}
            className="rounded-2xl shadow-lg border bg-white/60 backdrop-blur gap-3 flex flex-col md:flex-row items-center px-5 py-5 md:py-4"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-6 h-6 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש ציורים, אמנים, תגיות..."
                className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gradient-to-l from-pink-400 to-blue-400 focus:border-transparent bg-white/80 text-lg"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="shadow-md transition-all duration-150 bg-gradient-to-r from-blue-500 to-fuchsia-500 hover:from-blue-600 hover:to-pink-600 text-white font-semibold rounded-xl mt-2 md:mt-0"
            >
              חפש
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="relative border-blue-200 text-blue-600 hover:border-fuchsia-400 hover:text-fuchsia-700 font-semibold rounded-xl mt-2 md:mt-0"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              סינון
              {activeFiltersCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-fuchsia-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white shadow-lg">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </form>

          {/* פאנל סינון קופץ בעיצוב מודרני */}
          {showFilters && (
            <div className="animate-fade-in-up bg-white/90 rounded-3xl shadow-2xl p-8 -mt-2 absolute w-full left-0 top-20 z-30 border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                  סינון תוצאות
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-fuchsia-500 transition-all"
                  aria-label="סגור"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {/* קטגוריה */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    קטגוריה
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-fuchsia-300 outline-none transition shadow-sm"
                  >
                    <option value="">כל הקטגוריות</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* מכירה */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    זמינות
                  </label>
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-2">
                    <input
                      type="checkbox"
                      checked={isForSale}
                      onChange={(e) => setIsForSale(e.target.checked)}
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-400 accent-fuchsia-500"
                      id="for-sale-filter"
                    />
                    <label htmlFor="for-sale-filter" className="text-sm select-none text-blue-700">רק ציורים למכירה</label>
                  </div>
                </div>
                {/* מיון */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    מיון לפי
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-fuchsia-300 outline-none shadow-sm"
                  >
                    <option value="newest">החדשים ביותר</option>
                    <option value="oldest">הישנים ביותר</option>
                    <option value="popular">הפופולריים ביותר</option>
                    <option value="price-low">מחיר: נמוך לגבוה</option>
                    <option value="price-high">מחיר: גבוה לנמוך</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-lg border-fuchsia-400 text-fuchsia-700 font-semibold"
                >
                  נקה הכל
                </Button>
                <Button
                  onClick={handleSearch}
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow"
                >
                  החל סינון
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* תוצאות */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* כלי בקרה */}
        <div className="flex flex-wrap items-center justify-between mb-10 gap-y-5 gap-x-3">
          <div className="flex items-center gap-4">
            {/* מצב תצוגה */}
            <div className="flex items-center bg-white rounded-full border border-blue-200 shadow px-1 py-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-blue-400 to-fuchsia-400 text-white shadow-lg scale-110'
                    : 'text-blue-500 hover:bg-blue-50'
                }`}
                title="תצוגת רשת"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-fuchsia-400 to-blue-400 text-white shadow-lg scale-110'
                    : 'text-fuchsia-600 hover:bg-fuchsia-50'
                }`}
                title="תצוגת רשימה"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* פילטרים פעילים */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base text-fuchsia-600 font-semibold">פילטרים פעילים:</span>
                {searchQuery && (
                  <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow">
                    <span>
                      חיפוש: <span className="font-bold">{searchQuery}</span>
                    </span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 p-1 hover:bg-blue-200 rounded transition"
                      aria-label="מחק חיפוש"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="bg-gradient-to-r from-emerald-100 to-green-200 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow">
                    <span>
                      קטגוריה: <span className="font-bold">{categories.find(c => c.id === selectedCategory)?.name}</span>
                    </span>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="ml-1 p-1 hover:bg-green-200 rounded transition"
                      aria-label="מחק קטגוריה"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {isForSale && (
                  <span className="bg-gradient-to-r from-fuchsia-100 to-purple-200 text-fuchsia-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow">
                    למכירה
                    <button
                      onClick={() => setIsForSale(false)}
                      className="ml-1 p-1 hover:bg-fuchsia-200 rounded transition"
                      aria-label="הסר 필טר למכירה"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
          <div>
            {/* כאן אפשר להוסיף/להציג סיכום תוצאות או כפתור אחר */}
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${
            viewMode === "grid" ? "" : ""
          }`}
        >
          {/* רשת הציורים */}
          <ArtworkGrid
            categoryId={selectedCategory}
            searchQuery={searchQuery}
            isForSale={isForSale}
            viewMode={viewMode}
            sortBy={sortBy}
          />
        </div>
      </div>
    </div>
  )
}

