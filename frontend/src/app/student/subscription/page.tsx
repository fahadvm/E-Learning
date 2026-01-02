'use client';

import { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/utils/Toast';
import Header from '@/components/student/header';
import { studentSubscriptionApi } from '@/services/APIservices/studentApiservice';
import { useStudent } from '@/context/studentContext';
import { motion, Easing } from 'framer-motion';

/* ================= TYPES ================= */

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

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, callback: () => void) => void;
}

interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => Promise<void>;
    prefill: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme: {
        color: string;
    };
}

interface Subscription {
    _id: string;
    planId: string | Plan;
    startDate: string;
    endDate: string;
    status: string;
}

/* ================= COMPONENT ================= */

export default function SubscriptionPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [purchasedPlanIds, setPurchasedPlanIds] = useState<string[]>([]);
    const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);

    const { student } = useStudent();
    const router = useRouter();

    /* ================= FETCH DATA ================= */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const planRes = await studentSubscriptionApi.getAllPlans();
                setPlans(planRes.data);

                const subRes = await studentSubscriptionApi.getMySubscription();

                if (Array.isArray(subRes?.data)) {
                    const activeSubs = subRes.data.filter(
                        (s: Subscription) =>
                            s.status === 'active' &&
                            new Date(s.endDate) > new Date()
                    );

                    setActiveSubscriptions(activeSubs);

                    const planIds = activeSubs.map((s: Subscription) =>
                        typeof s.planId === 'object'
                            ? (s.planId as Plan)._id!
                            : s.planId
                    );

                    setPurchasedPlanIds(planIds);
                }
            } catch (error) {
                console.error(error);
                showErrorToast('Failed to load subscription data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* ================= PURCHASE HANDLER ================= */

    const handleCompletePurchase = async (plan: Plan) => {
        if (!plan._id) return;

        // BLOCK same plan repurchase
        if (purchasedPlanIds.includes(plan._id)) {
            showErrorToast('You already purchased this plan');
            return;
        }

        setProcessingPlan(plan._id);

        // ---------- FREE PLAN ----------
        if (!plan.price || Number(plan.price) === 0) {
            try {
                await studentSubscriptionApi.activateFreePlan(plan._id);
                showSuccessToast('Plan activated successfully');
                router.push(`/student/subscription/success?plan=${plan.name}`);
            } catch (err) {
                showErrorToast('Failed to activate plan');
            } finally {
                setProcessingPlan(null);
            }
            return;
        }

        // ---------- PAID PLAN ----------
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
            try {
                if (!plan._id) return
                const orderRes = await studentSubscriptionApi.createOrder(plan._id);
                const order = orderRes.data;

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'DevNext',
                    description: plan.name,
                    order_id: order.id,
                    handler: async (resp: RazorpayResponse) => {
                        try {
                            await studentSubscriptionApi.verifyPayment({
                                planId: plan._id!,
                                razorpay_order_id: resp.razorpay_order_id,
                                razorpay_payment_id: resp.razorpay_payment_id,
                                razorpay_signature: resp.razorpay_signature,
                            });

                            showSuccessToast('Payment successful');
                            router.push(`/student/subscription/success?plan=${plan.name}`);
                        } catch {
                            showErrorToast('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: student?.name,
                        email: student?.email,
                        contact: student?.phone,
                    },
                    theme: { color: '#176B87' },
                };

                const Razorpay = (window as unknown as { Razorpay: new (options: RazorpayOptions) => RazorpayInstance }).Razorpay;
                const rzp = new Razorpay(options);
                rzp.on('payment.failed', () => showErrorToast('Payment failed'));
                rzp.open();
            } catch (err) {
                showErrorToast('Failed to create order');
            } finally {
                document.body.removeChild(script);
                setProcessingPlan(null);
            }
        };
    };

    /* ================= UI ================= */

    return (
        <div className="bg-gray-100 h-screen overflow-hidden flex flex-col">
            <Header />

            <div className="px-4 md:px-10 flex-1 overflow-auto">
                <h1 className="text-4xl font-bold text-center mt-6 mb-6">
                    Choose Your Plan
                </h1>

                {activeSubscriptions.length > 0 && (
                    <div className="max-w-3xl mx-auto mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="text-blue-600" />
                        <div>
                            <h3 className="font-semibold text-blue-900">
                                Active Subscriptions
                            </h3>
                            <p className="text-sm text-blue-700">
                                You have {activeSubscriptions.length} active subscription(s)
                            </p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <p className="text-center">Loading plans...</p>
                ) : (
                    <div
                        className={`max-w-3xl mx-auto gap-6 pb-10 ${plans.length === 1
                            ? 'flex justify-center'
                            : plans.length === 2
                                ? 'grid grid-cols-1 md:grid-cols-2'
                                : 'grid grid-cols-1 md:grid-cols-3'
                            }`}
                    >            {plans.map((plan, index) => {
                        const isPurchased = purchasedPlanIds.includes(plan._id!);
                        const isDisabled = isPurchased || processingPlan === plan._id;

                        let buttonText = 'Subscribe Now';
                        if (isPurchased) buttonText = 'Purchased';
                        else if (processingPlan === plan._id) buttonText = 'Processing...';

                        return (
                            <motion.div
                                key={plan._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                className={`bg-white p-5 rounded-xl shadow border-2 ${isPurchased ? 'border-blue-600' : 'border-gray-200'
                                    }`}
                            >
                                {isPurchased && (
                                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                                        Purchased
                                    </span>
                                )}

                                <h2 className="text-2xl font-bold mt-3">{plan.name}</h2>
                                <p className="text-3xl font-bold text-indigo-600 my-2">
                                    ₹{plan.price}/Year
                                </p>

                                <p className="text-gray-600 mb-4">{plan.description}</p>

                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex text-sm">
                                            <Check className="text-blue-500 mr-2" />
                                            <span>{f.name}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    disabled={isDisabled}
                                    onClick={() => handleCompletePurchase(plan)}
                                    className={`w-full py-3 rounded-lg font-semibold ${isDisabled
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
