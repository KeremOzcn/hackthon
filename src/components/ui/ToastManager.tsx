'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

const ICONS: Record<ToastType, string> = { success: '✅', error: '❌', info: 'ℹ️' }
const COLORS: Record<ToastType, string> = {
  success: 'var(--success)',
  error: 'var(--error)',
  info: 'var(--color-accent)',
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true))
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 3500)
    return () => { cancelAnimationFrame(show); clearTimeout(hide) }
  }, [toast.id, onDismiss])

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'var(--surface-container-low)',
        border: `1px solid ${COLORS[toast.type]}40`,
        borderLeft: `3px solid ${COLORS[toast.type]}`,
        borderRadius: '12px', padding: '12px 16px',
        fontSize: '14px', fontWeight: 500,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
        minWidth: '260px', maxWidth: '360px',
        cursor: 'pointer',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{ICONS[toast.type]}</span>
      <span style={{ flex: 1, color: 'var(--color-text)' }}>{toast.message}</span>
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 9999, pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'all' }}>
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}

/** Hook: toast yönetimi */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  function toast(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }

  function dismiss(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, toast, dismiss }
}
