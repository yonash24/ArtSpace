import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - קבלת כל הקטגוריות
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            artworks: {
              where: {
                isPublic: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        artworkCount: category._count.artworks
      }))
    })

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'שגיאה בטעינת הקטגוריות' },
      { status: 500 }
    )
  }
}

// POST - יצירת קטגוריה חדשה (רק למנהלים)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json(
        { error: 'שם הקטגוריה נדרש' },
        { status: 400 }
      )
    }

    // בדיקה אם הקטגוריה כבר קיימת
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'קטגוריה עם שם זה כבר קיימת' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        color
      }
    })

    return NextResponse.json({
      message: 'הקטגוריה נוצרה בהצלחה',
      category
    }, { status: 201 })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'שגיאה ביצירת הקטגוריה' },
      { status: 500 }
    )
  }
}
