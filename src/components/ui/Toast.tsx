'use client'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  title: string
  message?: string
  variant?: ToastVariant
  onClose?: () => void
}

const TOAST_STYLES: Record<ToastVariant, { border: string; accent: string; label: string }> = {
  success: { border: 'rgba(52,211,153,0.28)', accent: 'var(--success)', label: 'Başarılı' },
  error: { border: 'rgba(251,113,133,0.28)', accent: 'var(--error)', label: 'Hata' },
  warning: { border: 'rgba(251,191,36,0.28)', accent: 'var(--warning)', label: 'Uyarı' },
  info: { border: 'rgba(129,140,248,0.28)', accent: 'var(--color-accent)', label: 'Bilgi' },
}

export function Toast({ title, message, variant = 'info', onClose }: ToastProps) {
  const styles = TOAST_STYLES[variant]

  return (
    <div
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      aria-live={variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className="glass-card fade-in"
      style={{
        padding: '16px 18px',
        borderColor: styles.border,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '999px',
          background: styles.accent,
          marginTop: '6px',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: message ? '4px' : 0 }}>
          <strong style={{ fontSize: '14px' }}>{title}</strong>
          <span style={{ color: styles.accent, fontSize: '12px', fontWeight: 600 }}>{styles.label}</span>
        </div>

        {message && <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '13px', lineHeight: 1.5 }}>{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Bildirimi kapat"
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            fontSize: '18px',
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
