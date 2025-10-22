'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AdminSidebar from '@/components/admin/sidebar';
import {
  Pencil,
  Trash2,
  Plus,
  Package,
  Star,
  IndianRupee,
  Tag,
  Menu,
  X,
} from 'lucide-react';
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import { showSuccessToast } from '@/utils/Toast';

export interface Feature {
  name: string;
  description: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number | 'Free' | 'Custom';
  description: string;
  features: Feature[];
  popular?: boolean;
  planFor: 'company' | 'student';
}

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await adminApiMethods.getPlans();
      console.log('res from ', res.data.plans);
      setPlans(res.data.plans);
    } catch (error) {
      console.error('Failed to fetch subscription plans', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAdd = () => {
    router.push('/admin/subscriptions/add');
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/subscriptions/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      const res = await adminApiMethods.deletePlan(id);
      if (res.ok) {
        showSuccessToast(res.message);
        setPlans((prev) => prev.filter((plan) => plan._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete plan', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden relative">
      {/* Mobile Hamburger */}
      <button
        className="absolute top-4 left-4 z-50 lg:hidden p-2 bg-gray-900 text-white rounded-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 h-full bg-gray-900 text-white p-6 shadow-lg">
            <div className="flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <AdminSidebar />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 sm:w-7 h-6 sm:h-7" />
            Subscription Plans
          </h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>

        {loading ? (
          <div className="text-gray-500 text-center py-8 sm:py-10 text-sm sm:text-base">
            Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="text-gray-500 text-center py-8 sm:py-10 text-sm sm:text-base">
            No plans found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100 hover:scale-[1.02] duration-200 flex flex-col"
              >
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                      {plan.name} {plan.planFor ? ` - ${plan.planFor}` : ''}
                      {plan.popular && (
                        <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" strokeWidth={2.5} />
                      )}
                    </h2>
                    <div className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                      <Tag className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500" />
                      {typeof plan.price === 'number' ? (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <IndianRupee className="w-3 sm:w-4 h-3 sm:h-4" />
                          {plan.price}
                        </span>
                      ) : (
                        <span className="capitalize text-purple-600 font-medium">
                          {plan.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {plan.description}
                  </p>

                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 space-y-1 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{feature.name}:</span> {feature.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 sm:p-5 pt-0 flex justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => handleEdit(plan._id)}
                    className="bg-gray-100 hover:bg-gray-200 text-blue-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition-all duration-200"
                  >
                    <Pencil className="w-3 sm:w-4 h-3 sm:h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="bg-gray-100 hover:bg-red-100 text-red-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition-all duration-200"
                  >
                    <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}