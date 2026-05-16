'use client'

import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, backHref = '/', backLabel = 'Ana Sayfa', badge, actions }: PageHeaderProps) {
  const router = useRouter()
  return (
    <div style={{ marginBottom: '4px' }}>
      <button
        onClick={() => router.push(backHref)}
        style={{
          color: 'var(--color-muted)', fontSize: '13px', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '10px',
          display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0,
        }}
      >
        ← {backLabel}
      </button>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontWeight: 800, fontSize: '24px', margin: 0 }}>{title}</h1>
            {badge}
          </div>
          {subtitle && <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>{subtitle}</div>}
        </div>
        {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  )
}
