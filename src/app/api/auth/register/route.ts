import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  username: z.string().min(3, 'שם משתמש חייב להכיל לפחות 3 תווים'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['ARTIST', 'VIEWER']).default('VIEWER')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'משתמש עם אימייל או שם משתמש זה כבר קיים' },
        { status: 400 }
      )
    }

    // הצפנת הסיסמה
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // יצירת המשתמש החדש
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'משתמש נרשם בהצלחה',
      user
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'נתונים לא תקינים', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}
