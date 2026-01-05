'use client'

import { useState } from 'react'
import { Star, Tag, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { adminApiMethods } from '@/services/APIservices/adminApiService'
import { showSuccessToast } from '@/utils/Toast'

/* ================= ZOD SCHEMA ================= */

const priceRegex = /^(Free|Custom|\d+(\.\d{1,2})?)$/

const subscriptionPlanSchema = z.object({
  name: z.string().trim().min(3, 'Plan name must be at least 3 characters'),

  price: z
    .string()
    .trim()
    .regex(priceRegex, 'Enter a valid price, "Free" or "Custom"')
    .refine(
      (val) => ['Free', 'Custom'].includes(val) || Number(val) > 0,
      { message: 'Price must be greater than 0' }
    ),

  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters'),

  features: z.array(z.string()).min(1, 'Select at least one feature'),

  planFor: z.enum(['Student', 'Company']),

  popular: z.boolean(),
})

type SubscriptionForm = z.infer<typeof subscriptionPlanSchema>

/* ================= PAGE ================= */

export default function AddSubscriptionPlanPage() {
  const router = useRouter()

  const builtInFeatures: Record<string, string> = {
    Compiler: 'Write and run code directly on the platform.',
    'Video Call': 'Connect with instructors or peers in real time.',
  }

  const [form, setForm] = useState<SubscriptionForm>({
    name: '',
    price: '',
    description: '',
    features: [],
    popular: false,
    planFor: 'Student',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  /* ============== HANDLERS ============== */

  const handleChange = <K extends keyof SubscriptionForm>(
    field: K,
    value: SubscriptionForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const toggleFeature = (feature: string) => {
    setForm((prev) => {
      const updated = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature]

      return { ...prev, features: updated }
    })

    setErrors((prev) => ({ ...prev, features: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = subscriptionPlanSchema.safeParse(form)

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}

      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as string
        fieldErrors[field] = err.message
      })

      setErrors(fieldErrors)
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        ...parsed.data,
        features: parsed.data.features.map((name) => ({
          name,
          description: builtInFeatures[name],
        })),
      }

      const res = await adminApiMethods.createPlan(payload)
      if (res.ok) {
        showSuccessToast(res.message)
        router.push('/admin/subscriptions')
      }
    } catch (err) {
      console.error('Failed to create plan', err)
    } finally {
      setSubmitting(false)
    }
  }

  const isFormInvalid = Object.values(errors).some(Boolean)

  /* ============== UI ============== */

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

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-5 max-w-2xl"
        >
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Plan Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium">Price</label>
            <input
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="499 / Free / Custom"
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

          {/* Features */}
          <div>
            <label className="text-sm font-medium">Features</label>
            <div className="flex gap-3 mt-2 flex-wrap">
              {Object.keys(builtInFeatures).map((feature) => (
                <label
                  key={feature}
                  className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  {feature}
                </label>
              ))}
            </div>
            {errors.features && (
              <p className="text-red-500 text-xs">{errors.features}</p>
            )}
          </div>

          {/* Plan For */}
          <div className="flex gap-6">
            {['Student'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={type}
                  checked={form.planFor === type}
                  onChange={(e) =>
                    handleChange('planFor', e.target.value as 'Student' | 'Company')
                  }
                />
                {type}
              </label>
            ))}
          </div>

          {/* Popular */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(e) => handleChange('popular', e.target.checked)}
            />
            <Star className="w-4 h-4 text-yellow-400" />
            Popular
          </label>

          <button
            type="submit"
            disabled={submitting || isFormInvalid}
            className={`${
              submitting || isFormInvalid
                ? 'bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-6 py-2 rounded-xl`}
          >
            {submitting ? 'Saving...' : 'Save Plan'}
          </button>
        </form>
      </div>
    </div>
  )
}
