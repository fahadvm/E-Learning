"use client"

import { motion } from "framer-motion"
import { Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CompanyHeroProps {
  name: string
  memberCount: number
  onViewProfile: () => void
  onLeave: () => void
  isLoading?: boolean
}

export function CompanyHero({ name, memberCount, onViewProfile, onLeave, isLoading }: CompanyHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="border-border/50 bg-gradient-to-br from-primary/20 via-primary/5 to-card backdrop-blur-xl overflow-hidden group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/10 to-primary/0 opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-500" />

        <CardContent className="relative p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2.5 bg-primary/30 rounded-lg border border-primary/50"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Building2 className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">{name}</h1>
                </div>
                <p className="text-muted-foreground text-lg">You are an active member of this organization</p>
              </div>
              <Badge className="bg-primary text-primary-foreground font-bold text-base px-4 py-2 h-fit">
                Active Member
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <motion.div
                className="p-4 bg-primary/10 rounded-lg border border-primary/30 backdrop-blur-sm"
                whileHover={{ borderColor: "hsl(var(--primary))" }}
              >
                <p className="text-sm text-muted-foreground mb-1">Team Size</p>
                <p className="text-3xl font-bold text-primary">{memberCount}</p>
                <p className="text-xs text-muted-foreground mt-1">members</p>
              </motion.div>

              <div className="flex gap-2">
                <Button
                  onClick={onViewProfile}
                  variant="outline"
                  className="flex-1 border-primary/30 text-primary hover:bg-primary/10 transition-all duration-200 bg-transparent"
                >
                  View Profile
                </Button>
                <Button
                  onClick={onLeave}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 transition-all duration-200 bg-transparent"
                >
                  {isLoading ? "..." : "Leave"}
                </Button>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
