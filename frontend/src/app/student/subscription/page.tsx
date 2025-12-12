'use client';

import { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/utils/Toast';
import Header from '@/components/student/header';
import { studentSubscriptionApi } from '@/services/APIservices/studentApiservice';
import { useStudent } from '@/context/studentContext';
import { motion, Easing } from 'framer-motion';

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

interface Subscription {
    _id: string;
    planId: string | Plan;
    endDate: string;
    startDate: string;
    status: string;
}

export default function SubscriptionPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const { student } = useStudent();
    const [loading, setLoading] = useState(true);
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await studentSubscriptionApi.getAllPlans();
                setPlans(response.data);

                // Fetch current active plan
                const curr = await studentSubscriptionApi.getMySubscription();
                console.log("my current plan is are", curr)
                if (curr?.data) {
                    const sub = curr.data;
                    // Check if actually active by date
                    if (sub.status === 'active') {
                        console.log("iam active")
                        setCurrentSubscription(sub);
                     
                        const pId = typeof sub.planId === 'object' && sub.planId !== null ? (sub.planId as any)._id : sub.planId;
                        console.log("pid",pId)
                        setCurrentPlanId(pId);
                    }
                } else {
                    setCurrentPlanId(null);
                    setCurrentSubscription(null);
                }

            } catch (error) {
                console.error('Error fetching subscription data:', error);
                showErrorToast('Failed to load subscription info.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const isSubscriptionActive = currentSubscription && new Date(currentSubscription.endDate) > new Date();

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.2,
                duration: 0.5,
                ease: [0, 0, 0.2, 1] as unknown as Easing[]
            },
        }),
    };

    const handleCompletePurchase = async (plan: Plan) => {
        if (!plan._id) return;

        // prevent repurchase logic
        if (isSubscriptionActive) {
            showErrorToast("You already have an active subscription.");
            return;
        }

        if (currentPlanId === plan._id) {
            showErrorToast("You already have this plan active.");
            return;
        }

        setProcessingPlan(plan._id);

        // Free plan
        if (!plan.price || plan.price === 0 || String(plan.price).toLowerCase().includes('free')) {
            try {
                await studentSubscriptionApi.activateFreePlan(plan._id);
                showSuccessToast('Free plan activated!');
                router.push(`/student/subscription/success?planName=${plan.name}&price=${plan.price}`);
            } catch (err) {
                console.error('Error activating free plan:', err);
                showErrorToast('Failed to activate free plan.');
            } finally {
                setProcessingPlan(null);
            }
            return;
        }

        // Paid plan
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
            try {
                const response = await studentSubscriptionApi.createOrder(plan._id!);
                const order = response.data;

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'DevNext',
                    description: plan.name,
                    image: '/logo.png',
                    order_id: order.id,
                    handler: async (resp: any) => {
                        try {
                            if (!plan._id) return
                            const verifyResponse = await studentSubscriptionApi.verifyPayment({
                                planId: plan._id,
                                razorpay_order_id: resp.razorpay_order_id,
                                razorpay_payment_id: resp.razorpay_payment_id,
                                razorpay_signature: resp.razorpay_signature,
                            });

                            if (verifyResponse.ok) {
                                showSuccessToast('Payment successful!');
                                router.push(`/student/subscription/success?planName=${plan.name}&price=${plan.price}`);
                            } else {
                                showErrorToast('Payment verification failed.');
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
                rzp.on('payment.failed', () => showErrorToast('Payment failed.'));
                rzp.open();
            } catch (err) {
                console.error('Order creation failed:', err);
                // Extract error message
                const msg = err instanceof Error ? err.message : 'Failed to create order.';
                if (msg.includes('active subscription')) {
                    showErrorToast('You already have an active subscription.');
                } else {
                    showErrorToast('Failed to create order.');
                }
            } finally {
                document.body.removeChild(script);
                setProcessingPlan(null);
            }
        };
    };

    return (

        <div className="bg-gray-100 h-screen overflow-hidden flex flex-col">
            <Header />

            <div className="px-4 md:px-10 flex-1 overflow-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 mt-6">
                    Choose Your Plan
                </h1>

                {isSubscriptionActive && currentSubscription && (
                    <div className="max-w-3xl mx-auto mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-blue-900">Active Subscription</h3>
                                <p className="text-blue-700 text-sm">
                                    You already have an active subscription. Expires on: <span className="font-medium">{new Date(currentSubscription.endDate).toLocaleDateString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-gray-500">Loading plans...</p>
                ) : (
                    <div
                        className={`max-w-3xl mx-auto gap-6 pb-10 ${plans.length === 1
                            ? 'flex justify-center'
                            : plans.length === 2
                                ? 'grid grid-cols-1 md:grid-cols-2'
                                : 'grid grid-cols-1 md:grid-cols-3'
                            }`}
                    >
                        {plans.map((plan, index) => {
                            // If active, this plan is current if IDs match
                            const isCurrent = currentPlanId === plan._id;

                            // Button text logic
                            let buttonText = 'Subscribe Now';
                            if (isCurrent && isSubscriptionActive) buttonText = 'Current Plan';
                            else if (String(plan.price).toLowerCase().includes('free') || plan.price === 0) buttonText = 'Get Started';

                            // Disable logic: 
                            // 1. If processing any plan
                            // 2. If subscription is active (disable ALL buy buttons)
                            // 3. Unless subscription is expired (isSubscriptionActive is false) -> then buttons enabled.
                            const isDisabled = isSubscriptionActive || processingPlan === plan._id;

                            return (
                                <motion.div
                                    key={plan._id}
                                    className={`rounded-xl shadow-lg p-5 bg-white border-2 max-w-sm w-full mx-auto transition-all duration-300
          ${isCurrent ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200'}
        `}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={index}
                                >

                                    {isCurrent && (
                                        <div className="text-sm font-semibold text-white bg-blue-600 px-3 py-1 rounded-full w-fit mb-4">
                                            Current Plan
                                        </div>
                                    )}

                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                                    <p className="text-3xl font-bold text-indigo-600 mb-2">
                                        {typeof plan.price ? `₹${plan.price}/Year` : plan.price}
                                    </p>

                                    <p className="text-gray-600 mb-6">{plan.description}</p>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                                                <Check className="text-blue-500 w-5 h-5 mt-0.5 mr-2" />
                                                <div>
                                                    <span className="font-semibold">{feature.name}</span>
                                                    <p className="text-gray-600">{feature.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        disabled={isDisabled}
                                        onClick={() => handleCompletePurchase(plan)}
                                        className={`w-full py-3 rounded-lg font-semibold transition 
                                            ${isDisabled
                                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {buttonText}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

    );
}
