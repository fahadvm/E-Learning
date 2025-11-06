"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

interface NotificationAlertProps {
  title: string
  message: string
  type?: "success" | "error" | "info"
  autoClose?: boolean
  duration?: number
  onClose?: () => void
}

export function NotificationAlert({
  title,
  message,
  type = "info",
  autoClose = true,
  duration = 4000,
  onClose,
}: NotificationAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const bgColor = {
    success: "bg-primary/20 border-primary/50",
    error: "bg-destructive/20 border-destructive/50",
    info: "bg-accent/20 border-accent/50",
  }

  const iconColor = {
    success: "text-primary",
    error: "text-destructive",
    info: "text-accent",
  }

  const Icon = {
    success: Check,
    error: AlertCircle,
    info: AlertCircle,
  }[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 p-4 rounded-lg border backdrop-blur-sm ${bgColor[type]} max-w-sm z-50`}
        >
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor[type]}`} />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
