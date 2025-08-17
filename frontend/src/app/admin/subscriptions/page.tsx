'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios' 
import AdminSidebar from "@/componentssss/admin/sidebar"
import {
  Pencil, Trash2, Plus, Package, Star,
  IndianRupee, Tag
} from 'lucide-react'

interface SubscriptionPlan {
  _id: string
  name: string
  price: number | 'Free' | 'Custom'
  description: string
  features: string[]
  popular?: boolean
  planFor:string
}

export default function AdminSubscriptionsPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/subscriptionplans`) 
      setPlans(res.data.data)
    } catch (error) {
      console.error("Failed to fetch subscription plans", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleAdd = () => {
    router.push('/admin/subscriptions/add')
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/subscriptions/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/subscriptionplans/${id}`)
      setPlans(prev => prev.filter(plan => plan._id !== id))
    } catch (err) {
      console.error("Failed to delete plan", err)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r shadow-sm">
        <AdminSidebar />
      </aside>

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
            <Package className="w-7 h-7" />
            Subscription Plans
          </h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>

        {loading ? (
          <p>Loading plans...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="rounded-2xl bg-gray-100 border hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div >
                  <div className="flex items-center justify-between mb-3 ">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      {plan.name} {plan.planFor ? ` - ${plan.planFor}` : ''}
                      {plan.popular && (
                        <Star className="w-5 h-5 text-yellow-400" strokeWidth={2.5} />
                      )}
                    </h2>
                    <div className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                      <Tag className="w-4 h-4 text-gray-500" />
                      {typeof plan.price === 'number' ? (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <IndianRupee className="w-4 h-4" />
                          {plan.price}
                        </span>
                      ) : (
                        <span className="capitalize text-purple-600 font-medium">
                          {plan.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(plan._id)}
                    className="bg-gray-100 hover:bg-gray-200 text-blue-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="bg-gray-100 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
