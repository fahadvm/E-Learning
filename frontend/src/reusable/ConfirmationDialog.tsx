'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'

interface ConfirmationDialogProps {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  triggerButton: React.ReactNode
}

export default function ConfirmationDialog({
  title,
  description,
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  triggerButton,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg">
          <Dialog.Title className="text-lg font-bold text-gray-900">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">{description}</Dialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => setOpen(false)}
            >
              {cancelText}
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => {
                onConfirm()
                setOpen(false)
              }}
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
