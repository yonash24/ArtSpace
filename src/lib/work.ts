// lib/work.ts

import { supabase } from "./supabase";
import {Date} from 'typescript';
import { notFound } from "next/navigation";
import { promises } from "dns";

export interface work{
  // מאפיינים חובה לזיהוי ולתצוגה
  id: string; 
  title: string;
  artistId: string;
  slug: string;
  
  // נתונים לתצוגה חזותית ופרטים
  imageUrl: string;
  creationYear: number;
  genre: string;
  description: string;
}

//create modol that: 1.check the creationYear  2.add smily to the header befour presenting it 3.cpmper data
export class WorkDisplayModel implements work{
    id: string;
    title: string;
    artistId: string;
    slug: string;
    imageUrl: string;
    creationYear: number;
    genre: string;
    description: string;

    constructor(data: work){
        this.id = data.id;
        this.title = data.title;
        this.artistId = data.artistId;
        this.slug = data.slug;
        this.imageUrl = data.imageUrl;
        this.creationYear = data.creationYear;
        this.genre = data.genre;
        this.description = data.description;
    }
    
    public getWorkAgw( cur_year: number = new Date().getFullYear()): string {
        const age = cur_year - this.creationYear;
        if(age < 1){
            return "עבודה שהושלמה השנה";
        }
        else{
            return `יצירה בת ${age} שנים`;
        }
    }

    public getFormattedTitle(): string {
        return `🖼️ ${this.title}`; 
    }

    public compareTo(otherWork: WorkDisplayModel): boolean {
        const thisDecade = Math.floor(this.creationYear / 10);
        const otherDecade = Math.floor(otherWork.creationYear / 10);
        return thisDecade === otherDecade;
    }
} 

export async function getWorkBySlug(slug: string): Promise<WorkDisplayModel> {
    
    // 1. קריאה אסינכרונית למסד הנתונים
    const { data: rawWork, error } = await supabase
        .from('works') // בחירת הטבלה
        .select('*')
        .eq('slug', slug) // סינון לפי ה-Slug
        .single();       // ציפייה לתוצאה אחת

    // 2. טיפול בשגיאות ונתונים חסרים
    if (error || !rawWork) {
        // ב-Next.js, הדרך הטובה ביותר לטפל ב-404 בשרת היא להשתמש ב-notFound()
        notFound(); 
    }
    
    // 3. יצירת והחזרת מופע של המודל
    // rawWork חייב להיות מסוג Work כיוון שאנו סומכים על ה-Schema של DB
    return new WorkDisplayModel(rawWork as work); 
}

