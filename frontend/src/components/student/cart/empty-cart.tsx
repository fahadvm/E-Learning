"use client"

import { ShoppingCart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface EmptyCartProps {
  onGoToCourses: () => void
}

export function EmptyCart({ onGoToCourses }: EmptyCartProps) {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground max-w-md">
            Looks like you haven't added any courses to your cart yet. Explore our course catalog to find something
            you'd love to learn!
          </p>
        </div>

        <Button onClick={onGoToCourses} className="mt-4">
          Browse Courses
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
