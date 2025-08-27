'use client'

import { useState } from 'react'
import AdminSidebar from '@/componentssss/admin/sidebar'
import { IndianRupee, Star, Plus, Tag, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function AddSubscriptionPlanPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        features: [''],
        popular: false,
        planFor: 'student',
    })

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleFeatureChange = (index: number, value: string) => {
        const updated = [...form.features]
        updated[index] = value
        setForm((prev) => ({ ...prev, features: updated }))
    }

    const addFeature = () => {
        setForm((prev) => ({ ...prev, features: [...prev.features, ''] }))
    }

    const removeFeature = (index: number) => {
        const updated = form.features.filter((_, i) => i !== index)
        setForm((prev) => ({ ...prev, features: updated }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/subscriptionplans`,
                form
            )

            router.push('/admin/subscriptions')
        } catch (error) {
            console.error("Failed to add subscription plan", error)
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-50 flex">
            <aside className="w-64 bg-white border-r shadow-sm">
                    <AdminSidebar />
                  </aside>
            
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

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow  text-gray-700 space-y-5 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="mt-1 w-full border rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (Number / Free / Custom)</label>
                        <input
                            type="text"
                            value={form.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            className="mt-1 w-full border rounded-lg px-3 py-2"
                            placeholder="e.g., 499 or Free"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="mt-1 w-full border rounded-lg px-3 py-2"
                            rows={3}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Features</label>
                        <div className="space-y-2 mt-2">
                            {form.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder={`Feature ${index + 1}`}
                                    />
                                    {form.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addFeature}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add Feature
                            </button>
                        </div>
                    </div>
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
                                    className="text-blue-600"
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
                                    className="text-blue-600"
                                />
                                Company
                            </label>
                        </div>
                    </div>


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

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm shadow-md"
                    >
                        Save Plan
                    </button>
                </form>
            </div>
        </div>
    )
}
