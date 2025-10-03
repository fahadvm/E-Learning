"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RoleCardProps {
  title: string
  description: string
  buttonText: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string
}

export const RoleCard = ({ title, description, buttonText, icon, onClick, href }: RoleCardProps) => {
  const button = (
    <Button
      variant="ghost"
      size="lg"
      onClick={onClick}
      className="w-full font-semibold"
    >
      {buttonText}
    </Button>
  )

  return (
    <Card className="group hover:shadow-hover hover:scale-105 transition-all duration-300 hover:border-primary/40">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow">
          {icon}
        </div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <CardDescription className="text-muted-foreground leading-relaxed px-2">
          {description}
        </CardDescription>
        {href ? <Link href={href}>{button}</Link> : button}
      </CardContent>
    </Card>
  )
}
