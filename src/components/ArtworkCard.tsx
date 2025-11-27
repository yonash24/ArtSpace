'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Eye, ShoppingCart } from 'lucide-react'
import { Button } from './ui/Button'
import { useState } from 'react'

interface Artwork {
  id: string
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  medium?: string
  year?: number
  price?: number
  isForSale: boolean
  viewCount: number
  artist: {
    id: string
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  category?: {
    id: string
    name: string
    color?: string
  }
  _count: {
    favorites: number
    comments: number
  }
}

interface ArtworkCardProps {
  artwork: Artwork
  onFavorite?: (artworkId: string) => void
  isFavorited?: boolean
}

export function ArtworkCard({ artwork, onFavorite, isFavorited = false }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite?.(artwork.id)
  }

  const artistName = artwork.artist.firstName && artwork.artist.lastName
    ? `${artwork.artist.firstName} ${artwork.artist.lastName}`
    : artwork.artist.username

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/artwork/${artwork.id}`}>
        <div className="relative aspect-square overflow-hidden">
          {/* תמונת הציור */}
          <Image
            src={artwork.thumbnailUrl || artwork.imageUrl}
            alt={artwork.title}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${imageLoading ? 'blur-sm' : 'blur-0'}`}
            onLoad={() => setImageLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* אוברליי עם פעולות */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                onClick={handleFavorite}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </Button>
              
              {artwork.isForSale && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                >
                  <ShoppingCart className="w-4 h-4 text-gray-600" />
                </Button>
              )}
            </div>

            {/* סטטיסטיקות */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white text-sm">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{artwork.viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{artwork._count.favorites}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{artwork._count.comments}</span>
              </div>
            </div>
          </div>

          {/* תגית קטגוריה */}
          {artwork.category && (
            <div className="absolute top-4 left-4">
              <span
                className="px-2 py-1 text-xs font-medium text-white rounded-full"
                style={{ backgroundColor: artwork.category.color || '#6366f1' }}
              >
                {artwork.category.name}
              </span>
            </div>
          )}

          {/* תגית מחיר */}
          {artwork.isForSale && artwork.price && (
            <div className="absolute bottom-4 right-4">
              <span className="px-2 py-1 text-sm font-bold text-white bg-green-600 rounded-lg">
                ₪{artwork.price.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* פרטי הציור */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {artwork.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {artwork.description}
          </p>

          {/* פרטי האמן */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {artwork.artist.avatar ? (
                <Image
                  src={artwork.artist.avatar}
                  alt={artistName}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {artistName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-700 font-medium">
                {artistName}
              </span>
            </div>

            {/* שנה ומדיום */}
            <div className="text-xs text-gray-500">
              {artwork.medium && <span>{artwork.medium}</span>}
              {artwork.year && artwork.medium && <span> • </span>}
              {artwork.year && <span>{artwork.year}</span>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
