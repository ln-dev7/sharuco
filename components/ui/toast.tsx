import * as React from "react"

export type ToastProps = Record<string, unknown>
export type ToastActionElement = React.ReactElement

interface ToastActionProps extends React.ComponentPropsWithoutRef<"button"> {
  altText: string
}

export const ToastAction = React.forwardRef<
  HTMLButtonElement,
  ToastActionProps
>(({ altText, children, ...props }, ref) => (
  <button ref={ref} aria-label={altText} {...props}>
    {children}
  </button>
))
ToastAction.displayName = "ToastAction"
