"use client"

import { motion } from "framer-motion"
import { Building2, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CompanyCardProps {
  name: string
  code: string
  employeeCount?: number
  onViewProfile: () => void
  onJoinRequest?: () => void
  onCancelRequest?: () => void
  status: "none" | "requested" | "approved"
  isLoading?: boolean
}

export function CompanyCard({
  name,
  code,
  employeeCount,
  onViewProfile,
  onJoinRequest,
  onCancelRequest,
  status,
  isLoading,
}: CompanyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 overflow-hidden group">
        <div className="h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:via-primary transition-all duration-500" />

        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-3xl">{name}</CardTitle>
              </div>
              <CardDescription className="font-mono text-accent">{code}</CardDescription>
            </div>
            {status === "approved" && (
              <Badge className="bg-primary/20 text-primary border-primary/50 hover:bg-primary/30 transition-colors">
                Active
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {employeeCount !== undefined && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                <span className="text-primary font-bold">{employeeCount}</span> team members
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={onViewProfile}
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/10 transition-all duration-200 bg-transparent"
            >
              View Company Profile
            </Button>

            {status === "none" && onJoinRequest && (
              <Button
                onClick={onJoinRequest}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
              >
                {isLoading ? "Sending..." : "Send Join Request"}
              </Button>
            )}

            {status === "requested" && (
              <>
                <div className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 text-amber-600 text-sm font-medium">
                  ⏳ Request Pending Review
                </div>
                {onCancelRequest && (
                  <Button
                    onClick={onCancelRequest}
                    variant="outline"
                    className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 transition-all duration-200 bg-transparent"
                  >
                    Cancel Request
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
