"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { CartCourse } from "@/types/student/carts"
import { cn } from "@/lib/utils"

interface CartItemProps {
    course: CartCourse
    onRemove: (courseId: string) => void
    onQuantityChange?: (courseId: string, quantity: number) => void
}

export function CartItem({ course, onRemove }: CartItemProps) {
    const [isRemoving, setIsRemoving] = useState(false)

    const handleRemove = async () => {
        setIsRemoving(true)
        try {
            await onRemove(course._id)
        } catch (error) {
            console.error("Failed to remove item:", error)
            setIsRemoving(false)
        }
    }

    return (
        <Card
            className={cn("p-4 transition-all duration-200 hover:shadow-md", isRemoving && "opacity-50 pointer-events-none")}
        >
            <div className="flex gap-4">
                {/* Course Image */}
                <div className="flex-shrink-0">
                    <Image
                        src={course.coverImage || "/placeholder.svg"}
                        alt={course.title}
                        width={200}
                        height={120}
                        className="rounded-lg object-cover w-32 h-20 md:w-48 md:h-28"
                    />
                </div>

                {/* Course Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-balance leading-tight mb-1">{course.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">
                                By {typeof course.teacherId === "object" && "name" in course.teacherId
                                    ? course.teacherId.name
                                    : "not provided"}
                            </p>
                            {/* Price */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl font-bold text-primary">₹{course.price}</span>
                                {course.originalPrice && course.originalPrice > course.price && (
                                    <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">


                            {/* Remove Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRemove}
                                disabled={isRemoving}
                                className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove {course.title}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
