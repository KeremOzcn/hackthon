import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

type NavItem = 'dashboard' | 'courses' | 'analytics' | 'history' | 'achievements'
type UserRole = 'student' | 'teacher' | 'parent'

interface TopNavProps {
  active?: NavItem
  role?: UserRole
}

const TEACHER_NAV: { key: NavItem; label: string; href: string }[] = [
  { key: 'dashboard',  label: 'Panel',     href: '/teacher' },
  { key: 'courses',    label: 'Dersler',   href: '/courses' },
  { key: 'analytics', label: 'Analitik',  href: '/teacher/analytics' },
]

const STUDENT_NAV: { key: NavItem; label: string; href: string }[] = [
  { key: 'dashboard',    label: 'Panel',      href: '/student' },
  { key: 'history',      label: 'Geçmiş',     href: '/student/history' },
  { key: 'achievements', label: 'Başarımlar', href: '/student/achievements' },
  { key: 'courses',      label: 'Dersler',    href: '/courses' },
]

function isDemoMode(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('demo_auth=true')
}

export function TopNav({ active, role: roleProp }: TopNavProps) {
  const [detectedRole, setDetectedRole] = useState<UserRole>('teacher')
  const NAV_LINKS = (roleProp ?? detectedRole) === 'student' ? STUDENT_NAV : TEACHER_NAV
  const [userName, setUserName] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [demo, setDemo] = useState(false)

  useEffect(() => {
    setDemo(isDemoMode())

    if (typeof document !== 'undefined' && document.cookie.includes('demo_role=student')) {
      setDetectedRole('student')
      return
    }

    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const name = user.user_metadata?.full_name as string || user.email?.split('@')[0] || 'K'
      setUserName(name)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role) setDetectedRole(profile.role as UserRole)
    }
    loadUser()
  }, [])

  function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  async function handleLogout() {
    if (demo) {
      document.cookie = 'demo_auth=; path=/; max-age=0'
      document.cookie = 'demo_role=; path=/; max-age=0'
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const isLoggedIn = userName.length > 0 || demo

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12"
      style={{
        height: '64px',
        borderBottom: '0.5px solid var(--border-highlight)',
        background: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex items-center gap-10">
        <Link
          href="/"
          className="font-extrabold tracking-tight whitespace-nowrap"
          style={{
            color: 'var(--on-surface)',
            fontFamily: 'var(--font-hanken)',
            fontSize: '1.25rem',
            background: 'linear-gradient(90deg, var(--on-surface) 0%, var(--color-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          İşleyen
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
                  height: '64px',
                  textDecoration: 'none',
                }}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3"
                    style={{
                      height: '2px',
                      background: 'linear-gradient(90deg, var(--color-accent), #a78bfa)',
                      borderRadius: '1px 1px 0 0',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Desktop right section */}
      <div className="hidden md:flex items-center gap-5">
        {isLoggedIn ? (
          <div style={{ position: 'relative' }}>
            {demo && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'var(--warning)',
                  color: '#000',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                  zIndex: 10,
                }}
              >
                DEMO
              </span>
            )}
            <div
              className="flex items-center justify-center text-xs font-bold text-white cursor-pointer"
              onClick={() => setShowMenu(v => !v)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: demo ? 'linear-gradient(135deg, var(--warning), #f59e0b)' : 'linear-gradient(135deg, #6366f1, #a78bfa)',
                border: '0.5px solid var(--border-highlight)',
              }}
            >
              {demo ? 'D' : getInitials(userName)}
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
                    top: '48px',
                    right: 0,
                    minWidth: '180px',
                    padding: '8px',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    border: '0.5px solid var(--border-subtle)',
                    borderRadius: '12px',
                    background: 'rgba(11, 15, 25, 0.95)',
                    backdropFilter: 'blur(24px)',
                  }}
                >
                  <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--color-muted)', borderBottom: '0.5px solid var(--border-subtle)', marginBottom: '4px' }}>
                    {demo ? 'Demo Kullanıcı' : userName}
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
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: 'var(--color-muted)', textDecoration: 'none' }}
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150"
              style={{
                color: '#fff',
                background: 'linear-gradient(90deg, var(--color-accent), #a78bfa)',
                textDecoration: 'none',
              }}
            >
              Hemen Başlayın
            </Link>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <div className="flex md:hidden items-center gap-3">
        {isLoggedIn && (
          <div
            className="flex items-center justify-center text-xs font-bold text-white"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: demo ? 'linear-gradient(135deg, var(--warning), #f59e0b)' : 'linear-gradient(135deg, #6366f1, #a78bfa)',
              border: '0.5px solid var(--border-highlight)',
            }}
          >
            {demo ? 'D' : getInitials(userName)}
          </div>
        )}
        <button
          className="flex flex-col justify-center items-center gap-1.5"
          style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setShowMobileNav(v => !v)}
          aria-label="Menü"
        >
          <span
            className="block transition-transform duration-200"
            style={{
              width: '20px',
              height: '2px',
              background: 'var(--on-surface)',
              borderRadius: '1px',
              transform: showMobileNav ? 'rotate(45deg) translateY(5px)' : 'none',
            }}
          />
          <span
            className="block transition-opacity duration-200"
            style={{
              width: '20px',
              height: '2px',
              background: 'var(--on-surface)',
              borderRadius: '1px',
              opacity: showMobileNav ? 0 : 1,
            }}
          />
          <span
            className="block transition-transform duration-200"
            style={{
              width: '20px',
              height: '2px',
              background: 'var(--on-surface)',
              borderRadius: '1px',
              transform: showMobileNav ? 'rotate(-45deg) translateY(-5px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {showMobileNav && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setShowMobileNav(false)}
          />
          <div
            className="md:hidden"
            style={{
              position: 'absolute',
              top: '64px',
              left: 0,
              right: 0,
              zIndex: 50,
              background: 'rgba(11, 15, 25, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '0.5px solid var(--border-subtle)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {NAV_LINKS.map(({ key, label, href }) => {
              const isActive = active === key
              return (
                <Link
                  key={key}
                  href={href}
                  className="flex items-center py-3 text-sm"
                  style={{
                    color: isActive ? 'var(--on-surface)' : 'var(--color-muted)',
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    borderBottom: '0.5px solid var(--border-subtle)',
                  }}
                  onClick={() => setShowMobileNav(false)}
                >
                  {label}
                </Link>
              )
            })}
            {!isLoggedIn && (
              <div className="flex flex-col gap-3 pt-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-center py-2 rounded-lg"
                  style={{ color: 'var(--color-muted)', border: '0.5px solid var(--border-subtle)', textDecoration: 'none' }}
                  onClick={() => setShowMobileNav(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-semibold text-center py-2 rounded-lg"
                  style={{
                    color: '#fff',
                    background: 'linear-gradient(90deg, var(--color-accent), #a78bfa)',
                    textDecoration: 'none',
                  }}
                  onClick={() => setShowMobileNav(false)}
                >
                  Hemen Başlayın
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <>
                <div className="py-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                  {demo ? 'Demo Kullanıcı' : userName}
                </div>
                <button
                  onClick={() => { setShowMobileNav(false); handleLogout() }}
                  className="text-left py-3 text-sm font-medium"
                  style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </>
      )}
    </header>
  )
}
