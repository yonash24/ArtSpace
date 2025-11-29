// lib/category.ts

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string; 
  genres: string[]; 
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "אמנות דיגיטלית",
    description: "יצירות שנוצרו באמצעות כלים דיגיטליים, כולל ציור וקטורי, תלת-ממד ובינה מלאכותית.",
    slug: "digital-art",
    genres: ["Surrealist Digital Art", "Vector Illustration", "AI-Generated Art"],
  },
  {
    id: "cat-2",
    name: "אמנות קלאסית",
    description: "סגנונות מסורתיים החל מהרנסנס ועד תקופת האימפרסיוניזם, עם דגש על טכניקות מסורתיות.",
    slug: "classical-art",
    genres: ["Renaissance", "Impressionism", "Baroque"],
  },
];


export function getCategoryBySlug(slug: string): Category | undefined{
    return CATEGORIES.find(category => category.slug == slug);
}