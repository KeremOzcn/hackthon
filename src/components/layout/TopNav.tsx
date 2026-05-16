import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

type NavItem = 'dashboard' | 'courses' | 'analytics' | 'resources'

interface TopNavProps {
  active?: NavItem
}

const NAV_LINKS: { key: NavItem; label: string; href: string }[] = [
  { key: 'dashboard', label: 'Panel', href: '/teacher' },
  { key: 'courses',   label: 'Dersler',   href: '/courses' },
  { key: 'analytics', label: 'Analitik', href: '/teacher/analytics' },
  { key: 'resources', label: 'Kaynaklar', href: '#' },
]

export function TopNav({ active }: TopNavProps) {
  const [userName, setUserName] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const name = user.user_metadata?.full_name as string || user.email?.split('@')[0] || 'K'
        setUserName(name)
      }
    }
    loadUser()
  }, [])

  function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

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
        <div style={{ position: 'relative' }}>
          <div
            className="flex items-center justify-center text-xs font-bold text-white cursor-pointer"
            onClick={() => setShowMenu(v => !v)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              border: '0.5px solid var(--border-highlight)',
            }}
          >
            {getInitials(userName)}
          </div>

          {showMenu && (
            <>
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 40,
                }}
                onClick={() => setShowMenu(false)}
              />
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '44px',
                  right: 0,
                  minWidth: '160px',
                  padding: '8px',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--color-muted)', borderBottom: '0.5px solid var(--border-subtle)', marginBottom: '4px' }}>
                  {userName}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f43f5e',
                    fontSize: '13px',
                    fontWeight: 500,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                >
                  Çıkış Yap
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
