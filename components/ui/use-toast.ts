"use client"

import * as React from "react"
import { toast as sonnerToast, type ExternalToast } from "sonner"

type Variant = "default" | "destructive" | "success"

interface ToastOptions extends Omit<ExternalToast, "description"> {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: Variant
  action?: React.ReactNode
}

function toast({ title, description, variant, action, ...rest }: ToastOptions) {
  const message = (title ?? description ?? "") as React.ReactNode
  const options: ExternalToast = { ...rest }
  if (title && description) options.description = description as string
  if (action) options.action = action as ExternalToast["action"]

  switch (variant) {
    case "destructive":
      return sonnerToast.error(message as string, options)
    case "success":
      return sonnerToast.success(message as string, options)
    default:
      return sonnerToast(message as string, options)
  }
}

export function useToast() {
  return { toast }
}

export { toast }
