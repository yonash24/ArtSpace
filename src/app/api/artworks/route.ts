import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const createArtworkSchema = z.object({
  title: z.string().min(1, 'כותרת נדרשת'),
  description: z.string().optional(),
  imageUrl: z.string().url('URL תמונה לא תקין'),
  thumbnailUrl: z.string().url().optional(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  price: z.number().positive().optional(),
  isForSale: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  tags: z.string().default(''),
  categoryId: z.string().optional()
})

// GET - קבלת כל הציורים
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const artistId = searchParams.get('artistId')
    const isForSale = searchParams.get('isForSale')

    const skip = (page - 1) * limit

    const where: any = {
      isPublic: true
    }

    if (category) {
      where.categoryId = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search } }
      ]
    }

    if (artistId) {
      where.artistId = artistId
    }

    if (isForSale === 'true') {
      where.isForSale = true
    }

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        include: {
          artist: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          _count: {
            select: {
              favorites: true,
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.artwork.count({ where })
    ])

    return NextResponse.json({
      artworks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get artworks error:', error)
    return NextResponse.json(
      { error: 'שגיאה בטעינת הציורים' },
      { status: 500 }
    )
  }
}

// POST - יצירת ציור חדש
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'נדרשת התחברות' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createArtworkSchema.parse(body)

    const artwork = await prisma.artwork.create({
      data: {
        ...validatedData,
        artistId: session.user.id
      },
      include: {
        artist: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'הציור נוצר בהצלחה',
      artwork
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'נתונים לא תקינים', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create artwork error:', error)
    return NextResponse.json(
      { error: 'שגיאה ביצירת הציור' },
      { status: 500 }
    )
  }
}


