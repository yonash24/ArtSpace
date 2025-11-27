'use client'

import { useState, useEffect } from 'react'
import { ArtworkCard } from './ArtworkCard'
import { Button } from './ui/Button'
import { Loader2 } from 'lucide-react'

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

interface ArtworkGridProps {
  initialArtworks?: Artwork[]
  categoryId?: string
  artistId?: string
  searchQuery?: string
  isForSale?: boolean
  viewMode?: 'grid' | 'list'
  sortBy?: string
}

export function ArtworkGrid({
  initialArtworks = [],
  categoryId,
  artistId,
  searchQuery,
  isForSale,
  viewMode = 'grid',
  sortBy = 'newest'
}: ArtworkGridProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const fetchArtworks = async (pageNum: number, reset = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12'
      })

      if (categoryId) params.append('category', categoryId)
      if (artistId) params.append('artistId', artistId)
      if (searchQuery) params.append('search', searchQuery)
      if (isForSale) params.append('isForSale', 'true')

      const response = await fetch(`/api/artworks?${params}`)
      const data = await response.json()

      if (response.ok) {
        if (reset) {
          setArtworks(data.artworks)
        } else {
          setArtworks(prev => [...prev, ...data.artworks])
        }
        setHasMore(pageNum < data.pagination.pages)
      } else {
        console.error('Error fetching artworks:', data.error)
      }
    } catch (error) {
      console.error('Error fetching artworks:', error)
    } finally {
      setLoading(false)
    }
  }

  // טעינת ציורים כאשר הפרמטרים משתנים
  useEffect(() => {
    if (initialArtworks.length === 0) {
      setPage(1)
      fetchArtworks(1, true)
    }
  }, [categoryId, artistId, searchQuery, isForSale])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchArtworks(nextPage)
  }

  const handleFavorite = async (artworkId: string) => {
    try {
      const response = await fetch(`/api/artworks/${artworkId}/favorite`, {
        method: 'POST'
      })

      if (response.ok) {
        const wasAlreadyFavorited = favorites.has(artworkId)
        
        setFavorites(prev => {
          const newFavorites = new Set(prev)
          if (newFavorites.has(artworkId)) {
            newFavorites.delete(artworkId)
          } else {
            newFavorites.add(artworkId)
          }
          return newFavorites
        })

        // עדכון מספר הלייקים בציור
        setArtworks(prev =>
          prev.map(artwork =>
            artwork.id === artworkId
              ? {
                  ...artwork,
                  _count: {
                    ...artwork._count,
                    favorites: wasAlreadyFavorited
                      ? artwork._count.favorites - 1
                      : artwork._count.favorites + 1
                  }
                }
              : artwork
          )
        )
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (artworks.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          לא נמצאו ציורים
        </div>
        <p className="text-gray-400">
          נסה לשנות את הפילטרים או לחפש משהו אחר
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* רשת הציורים */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onFavorite={handleFavorite}
            isFavorited={favorites.has(artwork.id)}
          />
        ))}
      </div>

      {/* כפתור טעינת עוד */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                טוען...
              </>
            ) : (
              'טען עוד ציורים'
            )}
          </Button>
        </div>
      )}

      {/* אינדיקטור טעינה ראשונית */}
      {loading && artworks.length === 0 && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  )
}
