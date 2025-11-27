'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Tag, 
  DollarSign,
  Eye,
  EyeOff 
} from 'lucide-react'
import Image from 'next/image'

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    dimensions: '',
    year: new Date().getFullYear(),
    price: '',
    isForSale: false,
    isPublic: true,
    tags: '',
    categoryId: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // הפניה אם המשתמש לא מחובר או לא אמן
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">טוען...</div>
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (session.user.role !== 'ARTIST') {
    router.push('/')
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = formData.tags ? formData.tags.split(',').filter(t => t.trim()) : []
      if (!currentTags.includes(tagInput.trim())) {
        const newTags = [...currentTags, tagInput.trim()]
        setFormData(prev => ({
          ...prev,
          tags: newTags.join(',')
        }))
        setTagInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = formData.tags ? formData.tags.split(',').filter(t => t.trim()) : []
    const newTags = currentTags.filter(tag => tag !== tagToRemove)
    setFormData(prev => ({
      ...prev,
      tags: newTags.join(',')
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!imageFile) {
      setError('נדרש להעלות תמונה')
      setLoading(false)
      return
    }

    try {
      // העלאת התמונה (כאן נשתמש בשירות כמו Cloudinary)
      const formDataUpload = new FormData()
      formDataUpload.append('file', imageFile)
      formDataUpload.append('upload_preset', 'artspace_preset') // צריך להגדיר ב-Cloudinary

      // לצורך הדגמה, נשתמש ב-URL מקומי
      const imageUrl = URL.createObjectURL(imageFile)

      // יצירת הציור
      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          price: formData.price ? parseFloat(formData.price) : undefined,
          year: formData.year || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/artwork/${data.artwork.id}`)
      } else {
        setError(data.error || 'שגיאה בהעלאת הציור')
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* כותרת */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              העלה ציור חדש
            </h1>
            <p className="text-blue-100">
              שתף את היצירה שלך עם העולם
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* העלאת תמונה */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  תמונת הציור
                </h3>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">לחץ להעלאת תמונה</p>
                      <p className="text-sm text-gray-400">PNG, JPG, GIF עד 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="תצוגה מקדימה"
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* פרטי הציור */}
              <div className="space-y-6">
                {/* כותרת */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כותרת הציור *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="שם הציור"
                    required
                  />
                </div>

                {/* תיאור */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תיאור
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ספר על הציור שלך..."
                  />
                </div>

                {/* מדיום ומידות */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      חומר/טכניקה
                    </label>
                    <input
                      type="text"
                      name="medium"
                      value={formData.medium}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="שמן על בד, אקריליק..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מידות
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50x70 ס״מ"
                    />
                  </div>
                </div>

                {/* שנה */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שנת יצירה
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* תגיות */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תגיות
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="הוסף תגית..."
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags && formData.tags.split(',').filter(t => t.trim()).map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* מכירה */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isForSale"
                      checked={formData.isForSale}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="mr-2 text-sm text-gray-700">
                      הציור למכירה
                    </label>
                  </div>

                  {formData.isForSale && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        מחיר (₪)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* פרטיות */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="mr-2 text-sm text-gray-700 flex items-center gap-1">
                    {formData.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    הציור גלוי לכולם
                  </label>
                </div>
              </div>
            </div>

            {/* כפתורי פעולה */}
            <div className="mt-8 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                ביטול
              </Button>
              <Button
                type="submit"
                disabled={loading || !imageFile}
                className="min-w-32"
              >
                {loading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    מעלה...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    פרסם ציור
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
