"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border transform transition-all duration-300 ease-in-out
            ${toast.type === 'success' && 'bg-green-900/90 border-green-700 text-green-100'}
            ${toast.type === 'error' && 'bg-red-900/90 border-red-700 text-red-100'}
            ${toast.type === 'warning' && 'bg-yellow-900/90 border-yellow-700 text-yellow-100'}
            ${toast.type === 'info' && 'bg-blue-900/90 border-blue-700 text-blue-100'}
          `}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            {toast.type === 'success' && <span className="text-green-400">✓</span>}
            {toast.type === 'error' && <span className="text-red-400">✗</span>}
            {toast.type === 'warning' && <span className="text-yellow-400">⚠</span>}
            {toast.type === 'info' && <span className="text-blue-400">ℹ</span>}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
