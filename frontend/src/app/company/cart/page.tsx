"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/company/cart/cart-item"
import { CartSummary } from "@/components/company/cart/cart-summary"
import { EmptyCart } from "@/components/company/cart/empty-cart"
import { CartItemSkeleton, CartSummarySkeleton } from "@/components/company/cart/cart-skeleton"
import { companyApiMethods } from "@/services/APImethods/companyAPImethods"
import type { CartData, CartSummary as CartSummaryType } from "@/types/company/carts"
import { useRouter } from "next/navigation"


export default function CartPage() {
    const [cartData, setCartData] = useState<CartData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()


    // Load cart data
    useEffect(() => {
        loadCart()
    }, [])

    const loadCart = async () => {


        try {
            setIsLoading(true)
            const data = await companyApiMethods.getCart()
            console.log("data", data.data.courses)

            setCartData(data.data)
        } catch (error) {
            console.error("Failed to load cart:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveItem = async (courseId: string) => {
        try {
            setIsUpdating(true)
            await companyApiMethods.removeFromCart(courseId)



            if (cartData) {
                setCartData({
                    ...cartData,
                    courses: cartData.courses.filter((course) => course.id !== courseId),
                })
            }
            const data = await companyApiMethods.getCart()
            setCartData(data.data)
        } catch (error) {
            console.error("Failed to remove item:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleClearCart = async () => {
        try {
            setIsUpdating(true)
            await companyApiMethods.clearCart()
            setCartData({ courses: [], total: 0 })
        } catch (error) {
            console.error("Failed to clear cart:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleCheckout = () => {
        // navigate to checkout page
        router.push("/company/checkout")
    }

    const handleGoToCourses = () => {
         router.push("/company/courses")
    }

    const handleGoBack = () => {
        router.back()
    }

    const calculateSummary = (): CartSummaryType => {
        if (!cartData || cartData.courses.length === 0) {
            return { subtotal: 0, discount: 0, total: 0, courseCount: 0 }
        }

        const subtotal = cartData.courses.reduce((sum, course) => sum + course.price * course.quantity, 0)
        const discount = cartData.courses.reduce((sum, course) => {
            if (course.originalPrice && course.originalPrice > course.price) {
                return sum + (course.originalPrice - course.price) * course.quantity
            }
            return sum
        }, 0)

        return {
            subtotal,
            discount,
            total: subtotal,
            courseCount: cartData.courses.length,
        }
    }

    const summary = calculateSummary()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header Skeleton */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 bg-muted rounded" />
                            <div className="w-32 h-8 bg-muted rounded" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Skeleton */}
                        <div className="lg:col-span-2 space-y-4">
                            <CartItemSkeleton />
                            <CartItemSkeleton />
                            <CartItemSkeleton />
                        </div>

                        {/* Summary Skeleton */}
                        <div>
                            <CartSummarySkeleton />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" size="sm" onClick={handleGoBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold text-balance">Shopping Cart</h1>
                    {summary.courseCount > 0 && (
                        <p className="text-muted-foreground mt-2">
                            {summary.courseCount} {summary.courseCount === 1 ? "course" : "courses"} in your cart
                        </p>
                    )}
                </div>

                {/* Cart Content */}
                {!cartData || cartData.courses.length === 0 ? (
                    <EmptyCart onGoToCourses={handleGoToCourses} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartData.courses.map((course) => (
                                <CartItem key={course.id} course={course} onRemove={handleRemoveItem} />
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div>
                            <CartSummary
                                summary={summary}
                                onClearCart={handleClearCart}
                                onCheckout={handleCheckout}
                                isLoading={isUpdating}
                                total={cartData.total}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
