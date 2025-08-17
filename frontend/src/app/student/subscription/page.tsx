'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/componentssss/student/header';
import axios from '@/utils/axios';

interface Plan {
  _id?: string;
  name: string;
  price: string | number;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/auth/student/subscriptions');
        setPlans(response.data.data);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen py-16 px-4 md:px-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Choose Your Plan</h1>
        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          Unlock your potential with plans tailored for learners, professionals, and enterprises.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading plans...</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const isCenter = index === 1;

              return (
                <motion.div
                  key={plan._id || plan.name}
                  className={`rounded-xl shadow-lg p-8 bg-white border-2 transform transition-all duration-300 ${
                    isCenter ? 'border-indigo-500 scale-105 z-10' : 'border-gray-200 scale-95'
                  }`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  {isCenter && (
                    <div className="text-sm font-semibold text-white bg-indigo-500 px-3 py-1 rounded-full w-fit mb-4">
                      Most Popular
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                  <p className="text-3xl font-bold text-indigo-600 mb-2">
                    {typeof plan.price === 'number' ? `₹${plan.price}/mo` : plan.price}
                  </p>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-6">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <Check className="text-green-500 w-5 h-5 mt-0.5 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                    {String(plan.price).toLowerCase().includes('free') || plan.price === 0
                      ? 'Get Started'
                      : 'Subscribe Now'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
