import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // יצירת קטגוריות בסיסיות
  const categories = [
    {
      name: 'נוף',
      description: 'ציורי נוף וטבע',
      color: '#10B981' // green-500
    },
    {
      name: 'פורטרט',
      description: 'ציורי דיוקן ואנשים',
      color: '#3B82F6' // blue-500
    },
    {
      name: 'אבסטרקט',
      description: 'אמנות אבסטרקטית ומודרנית',
      color: '#8B5CF6' // purple-500
    },
    {
      name: 'טבע דומם',
      description: 'ציורי טבע דומם וחפצים',
      color: '#F59E0B' // yellow-500
    },
    {
      name: 'עירוני',
      description: 'ציורי עיר ואדריכלות',
      color: '#6B7280' // gray-500
    },
    {
      name: 'בעלי חיים',
      description: 'ציורי בעלי חיים וחיות',
      color: '#F97316' // orange-500
    },
    {
      name: 'ים ומים',
      description: 'ציורי ים, אגמים ונהרות',
      color: '#06B6D4' // cyan-500
    },
    {
      name: 'פרחים',
      description: 'ציורי פרחים וצמחים',
      color: '#EC4899' // pink-500
    }
  ]

  console.log('Creating categories...')
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData
    })
    console.log(`Created category: ${category.name}`)
  }

  // יצירת משתמש אדמין לדוגמה
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@artspace.com' },
    update: {},
    create: {
      email: 'admin@artspace.com',
      username: 'admin',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/1.ksB.9Ey', // password123
      firstName: 'מנהל',
      lastName: 'המערכת',
      role: 'ADMIN',
      isVerified: true
    }
  })
  console.log(`Created admin user: ${adminUser.email}`)

  // יצירת אמן לדוגמה
  const artistUser = await prisma.user.upsert({
    where: { email: 'artist@artspace.com' },
    update: {},
    create: {
      email: 'artist@artspace.com',
      username: 'artist_demo',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/1.ksB.9Ey', // password123
      firstName: 'אמן',
      lastName: 'לדוגמה',
      bio: 'אמן דיגיטלי המתמחה בציורי נוף ופורטרטים',
      role: 'ARTIST',
      isVerified: true
    }
  })
  console.log(`Created artist user: ${artistUser.email}`)

  // יצירת צופה לדוגמה
  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@artspace.com' },
    update: {},
    create: {
      email: 'viewer@artspace.com',
      username: 'art_lover',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/1.ksB.9Ey', // password123
      firstName: 'אוהב',
      lastName: 'אמנות',
      role: 'VIEWER',
      isVerified: true
    }
  })
  console.log(`Created viewer user: ${viewerUser.email}`)

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
