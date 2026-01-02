'use client'

import { useState } from 'react'
import { Star, Tag, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { adminApiMethods } from '@/services/APIservices/adminApiService'
import { showSuccessToast } from '@/utils/Toast'
import { FormFieldValue } from '@/types/admin/adminTypes'

export default function AddSubscriptionPlanPage() {
  const router = useRouter()

  // Built-in subscription features
  const builtInFeatures: Record<string, string> = {
    'Compiler': 'Write and run code directly on the platform.',
    'Video Call': 'Connect with instructors or peers in real time.',
    // 'Chat': 'Instant messaging for questions and discussions.',
    // 'AI Bot': 'Get AI-powered guidance and learning support.',
    // 'Course Resources': 'Access all course materials and references.',
  }

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    features: [] as string[], // just store the selected feature names
    popular: false,
    planFor: 'Student',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const validateField = (field: string, value: FormFieldValue) => {
    let error = ''
    switch (field) {
      case 'name':
        if (typeof value !== 'string' || !value.trim()) error = 'Plan name is required'
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters'
        break
      case 'price':
        if (typeof value !== 'string' || !value.trim()) error = 'Price is required'
        else if (!/^(Free|Custom|\d+(\.\d{1,2})?)$/.test(value.trim()))
          error = 'Enter a valid price, "Free" or "Custom"'
        break
      case 'description':
        if (typeof value !== 'string' || !value.trim()) error = 'Description is required'
        else if (value.trim().length < 10) error = 'Description must be at least 10 characters'
        break
      case 'features':
        if (Array.isArray(value) && value.length === 0) error = 'At least one feature must be selected'
        break
      default:
        break
    }
    return error
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    Object.keys(form).forEach((key) => {
      if (key === 'popular' || key === 'planFor') return
      const error = validateField(key, form[key as keyof typeof form])
      if (error) newErrors[key] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: FormFieldValue) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  const toggleFeature = (feature: string) => {
    setForm((prev) => {
      const isSelected = prev.features.includes(feature)
      const updatedFeatures = isSelected
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
      return { ...prev, features: updatedFeatures }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      // Map features to include description for backend
      const payload = {
        ...form,
        features: form.features.map((name) => ({
          name,
          description: builtInFeatures[name],
        })),
      }
      const res = await adminApiMethods.createPlan(payload)
      if (res.ok) {
        showSuccessToast(res.message)
        router.push('/admin/subscriptions')
      }
    } catch (error) {
      console.error('Failed to add subscription plan', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">


      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-sm flex items-center text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
            <Tag className="w-6 h-6" />
            Add Subscription Plan
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow text-gray-700 space-y-5 max-w-2xl">
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (Number / Free / Custom)</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="e.g., 499 or Free"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              rows={3}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {Object.keys(builtInFeatures).map((feature) => (
                <label key={feature} className="flex items-center gap-2 text-sm border px-3 py-1 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  {feature}
                </label>
              ))}
            </div>
            {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features}</p>}
          </div>

          {/* Plan For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan For</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="planFor"
                  value="Student"
                  checked={form.planFor === 'Student'}
                  onChange={(e) => handleChange('planFor', e.target.value)}
                />
                Student
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="planFor"
                  value="Company"
                  checked={form.planFor === 'Company'}
                  onChange={(e) => handleChange('planFor', e.target.value)}
                />
                Company
              </label>
            </div>
          </div>

          {/* Popular Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(e) => handleChange('popular', e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label className="text-sm text-gray-700 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              Mark as Popular
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`${submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-5 py-2.5 rounded-xl text-sm shadow-md`}
          >
            {submitting ? 'Saving...' : 'Save Plan'}
          </button>
        </form>
      </div>
    </div>
  )
}
