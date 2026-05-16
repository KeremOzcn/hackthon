'use client'

import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
}

export function PageHeader({ title, subtitle, backHref = '/', backLabel = 'Ana Sayfa' }: PageHeaderProps) {
  const router = useRouter()
  return (
    <div>
      <button
        onClick={() => router.push(backHref)}
        style={{ color: 'var(--color-muted)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}
      >
        ← {backLabel}
      </button>
      <h1 style={{ fontWeight: 800, fontSize: '24px' }}>{title}</h1>
      {subtitle && <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>{subtitle}</div>}
    </div>
  )
}
