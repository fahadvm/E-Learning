"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CompanySearchProps {
  onSearch: (code: string) => Promise<void>
  isSearching: boolean
  error: string | null
}

export function CompanySearch({ onSearch, isSearching, error }: CompanySearchProps) {
  const [companyCode, setCompanyCode] = useState("")

  const handleSearch = async () => {
    if (companyCode.trim()) {
      await onSearch(companyCode.trim().toUpperCase())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl">Find Your Company</CardTitle>
          <CardDescription className="text-muted-foreground">Enter your company code to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g., COMPANY001"
                className="pl-10 bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !companyCode.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
