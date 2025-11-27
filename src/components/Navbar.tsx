'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/Button'
import { 
  Palette, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  Upload,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* לוגו */}
          <Link href="/" className="flex items-center space-x-2">
            <Palette className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ArtSpace</span>
          </Link>

          {/* תפריט דסקטופ */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/gallery" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              גלריה
            </Link>
            <Link 
              href="/artists" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              אמנים
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              קטגוריות
            </Link>
            
            {/* חיפוש */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="חפש ציורים..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* כפתורי משתמש */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                {/* כפתור העלאה (רק לאמנים) */}
                {session.user.role === 'ARTIST' && (
                  <Link href="/upload">
                    <Button size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      העלה ציור
                    </Button>
                  </Link>
                )}

                {/* תפריט משתמש */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.username || session.user.email || ''}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(session.user.username || session.user.email || '').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.username || session.user.email}
                    </span>
                  </button>

                  {/* תפריט נפתח */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-2" />
                        הפרופיל שלי
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        הגדרות
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        התנתק
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">התחבר</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>הרשם</Button>
                </Link>
              </div>
            )}
          </div>

          {/* כפתור תפריט מובייל */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* תפריט מובייל */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* חיפוש מובייל */}
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="חפש ציורים..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* קישורים */}
              <div className="space-y-2">
                <Link 
                  href="/gallery" 
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  גלריה
                </Link>
                <Link 
                  href="/artists" 
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  אמנים
                </Link>
                <Link 
                  href="/categories" 
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  קטגוריות
                </Link>
              </div>

              {/* כפתורי משתמש מובייל */}
              <div className="pt-4 border-t border-gray-200">
                {session ? (
                  <div className="space-y-2">
                    {session.user.role === 'ARTIST' && (
                      <Link href="/upload" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          העלה ציור
                        </Button>
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center py-2 text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      הפרופיל שלי
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full py-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      התנתק
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">התחבר</Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">הרשם</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
