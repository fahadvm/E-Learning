"use client"

import type React from "react"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  isLoading?: boolean
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-start gap-3">
              {isDangerous && (
                <div className="p-2 bg-destructive/20 rounded-lg flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
              )}
              <div className="flex-1">
                <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
                <AlertDialogDescription className="text-base mt-2">{description}</AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-border/50 hover:bg-muted/50"
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              disabled={isLoading}
              className={
                isDangerous
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }
            >
              {isLoading ? "Processing..." : confirmText}
            </Button>
          </div>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
