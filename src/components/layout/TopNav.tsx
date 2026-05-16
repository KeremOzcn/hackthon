import Link from 'next/link'

type NavItem = 'dashboard' | 'courses' | 'analytics' | 'resources'

interface TopNavProps {
  active?: NavItem
}

const NAV_LINKS: { key: NavItem; label: string; href: string }[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/teacher' },
  { key: 'courses',   label: 'Courses',   href: '/courses' },
  { key: 'analytics', label: 'Analytics', href: '/analytics' },
  { key: 'resources', label: 'Resources', href: '#' },
]

export function TopNav({ active }: TopNavProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px',
      height: '56px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-primary)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-text)', letterSpacing: '-0.02em', fontFamily: 'var(--font-hanken)', whiteSpace: 'nowrap' }}>
          İşler LearnTwin AI
        </div>
        <nav style={{ display: 'flex', gap: '4px' }}>
          {NAV_LINKS.map(({ key, label, href }) => {
            const isActive = active === key
            return (
              <Link
                key={key}
                href={href}
                style={{
                  color: isActive ? 'var(--color-text)' : 'var(--color-muted)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  padding: '0 12px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                  transition: 'color 150ms ease',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-muted)', cursor: 'pointer' }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-muted)', cursor: 'pointer' }}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-muted)', cursor: 'pointer' }}>
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', border: '1px solid var(--border-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
          Ö
        </div>
      </div>
    </header>
  )
}
