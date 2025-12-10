"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"

type ToastOptions = {
  title?: string
  description?: string
}

const ToastContext = createContext<(opts: ToastOptions) => void>(() => {})

export function ToastProviderWrapper({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  const addToast = (opts: ToastOptions) => {
    setToasts((prev) => [...prev, opts])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 2500)
  }

  return (
    <ToastProvider>
      <ToastContext.Provider value={addToast}>
        {children}
        <ToastViewport />
        {toasts.map((toast, i) => (
          <Toast key={i}>
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </Toast>
        ))}
      </ToastContext.Provider>
    </ToastProvider>
  )
}

export const useToast = () => useContext(ToastContext)
