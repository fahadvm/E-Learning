'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/utils/Toast';
import Header from '@/components/student/header';
import { studentSubscriptionApi } from '@/services/APIservices/studentApiservice';
import { useStudent } from '@/context/studentContext';

interface Feature {
    name: string;
    description: string;
}

interface Plan {
    _id?: string;
    name: string;
    price: string | number;
    description: string;
    features: Feature[];
    popular?: boolean;
}

export default function SubscriptionPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const { student } = useStudent()
    const [loading, setLoading] = useState(true);
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await studentSubscriptionApi.getAllPlans();
                setPlans(response.data);
            } catch (error) {
                console.error('Error fetching subscription plans:', error);
                showErrorToast('Failed to load plans.');
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
            transition: { delay: i * 0.2, duration: 0.5, ease: 'easeOut' },
        }),
    };

    const handleCompletePurchase = async (plan: Plan) => {
        if (!plan._id) return;

        setProcessingPlan(plan._id);

        if (!plan.price || plan.price === 0 || String(plan.price).toLowerCase().includes('free')) {
            try {
                await studentSubscriptionApi.activateFreePlan(plan._id);
                showSuccessToast('Free plan activated!');
                router.push(
                    `/student/subscription/success?planName=${plan.name}&price=${plan.price}`
                )
            } catch (err) {
                console.error('Error activating free plan:', err);
                showErrorToast('Failed to activate free plan.');
            } finally {
                setProcessingPlan(null);
            }
            return;
        }

        // Paid plan → load Razorpay
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
            try {
                const response = await studentSubscriptionApi.createOrder(plan._id!);
                showSuccessToast("sending create order")
                console.log("res is ", response)
                const order = response.data;

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'DevNext',
                    description: plan.name,
                    image: '/logo.png',
                    order_id: order.id,
                    handler: async (response: any) => {
                        try {
                            const verifyResponse = await studentSubscriptionApi.verifyPayment({
                                planId: plan._id ? plan._id : "",
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            console.log("verification is ", verifyResponse)

                            if (verifyResponse.ok) {
                                showSuccessToast('Payment successful!');

                                router.push(
                                    `/student/subscription/success?planName=${plan.name}&price=${plan.price}`
                                )
                            } else {
                                showErrorToast('Payment verification failed.');
                                console.error('Verification failed');
                            }
                        } catch (err) {
                            console.error('Verification error:', err);
                            showErrorToast('Error verifying payment.');
                        }
                    },
                    prefill: {
                        name: student?.name,
                        email: student?.email,
                        contact: student?.phone,
                    },
                    theme: { color: '#176B87' },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', () => {
                    showErrorToast('Payment failed.');
                    console.error('Payment failed');
                });
                rzp.open();
            } catch (err) {
                console.error('Order creation failed:', err);
                showErrorToast('Failed to create order.');
            } finally {
                document.body.removeChild(script);
                setProcessingPlan(null);
            }
        };

        script.onerror = () => {
            console.error('Failed to load Razorpay SDK');
            showErrorToast('Failed to load payment gateway.');
            document.body.removeChild(script);
            setProcessingPlan(null);
        };
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
                    <div className={`max-w-6xl mx-auto gap-8 ${plans.length === 1
                        ? 'flex justify-center'
                        : plans.length === 2
                            ? 'grid grid-cols-1 md:grid-cols-2'
                            : 'grid grid-cols-1 md:grid-cols-3'
                        }`}
                    >
                        {plans.map((plan, index) => {
                            const isCenter = index === 1;
                            return (
                                <motion.div
                                    key={plan._id || plan.name}
                                    className={`rounded-xl shadow-lg p-8 bg-white border-2 transform transition-all duration-300 ${isCenter ? 'border-indigo-500 scale-105 z-10' : 'border-gray-200 scale-95'
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
                                        {typeof plan.price? `₹${plan.price}/Year` : plan.price}
                                    </p>
                                    <p className="text-gray-600 mb-6">{plan.description}</p>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features?.map((feature, idx) => (
                                            <li key={idx} className="flex flex-col text-sm text-gray-700">
                                                <div className="flex items-start">
                                                    <Check className="text-green-500 w-5 h-5 mt-0.5 mr-2" />
                                                    <span className="font-semibold">{feature.name}</span>
                                                </div>
                                                <p className="ml-7 text-gray-600">{feature.description}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        disabled={processingPlan === plan._id}
                                        onClick={() => handleCompletePurchase(plan)}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
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
