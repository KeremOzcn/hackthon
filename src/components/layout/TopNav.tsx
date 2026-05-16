import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = 'dashboard' | 'courses' | 'analytics' | 'resources'

interface TopNavProps {
  active?: NavItem
}

const NAV_LINKS: { key: NavItem; label: string; href: string }[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/teacher' },
  { key: 'courses',   label: 'Courses',   href: '/courses' },
  { key: 'analytics', label: 'Analytics', href: '/teacher/analytics' },
  { key: 'resources', label: 'Resources', href: '#' },
]

export function TopNav({ active }: TopNavProps) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12"
      style={{
        height: '56px',
        borderBottom: '0.5px solid var(--border-highlight)',
        background: 'rgba(12, 19, 36, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-10">
        <Link href="/" className="text-lg font-extrabold tracking-tight whitespace-nowrap" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-hanken)' }}>
          İşler LearnTwin AI
        </Link>
        <nav className="hidden md:flex gap-1">
          {NAV_LINKS.map(({ key, label, href }) => {
            const isActive = active === key
            return (
              <Link
                key={key}
                href={href}
                className="relative flex items-center px-3 text-sm transition-colors duration-150"
                style={{
                  color: isActive ? 'var(--on-surface)' : 'var(--color-muted)',
                  fontWeight: isActive ? 600 : 400,
                  height: '56px',
                  textDecoration: 'none',
                }}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3"
                    style={{
                      height: '2px',
                      background: 'var(--color-accent)',
                      borderRadius: '1px 1px 0 0',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer" style={{ color: 'var(--color-muted)' }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer" style={{ color: 'var(--color-muted)' }}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer" style={{ color: 'var(--color-muted)' }}>
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
        <div
          className="flex items-center justify-center text-xs font-bold text-white cursor-pointer"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
            border: '0.5px solid var(--border-highlight)',
          }}
        >
          Ö
        </div>
      </div>
    </header>
  )
}
