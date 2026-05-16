import Link from 'next/link'

export function TopNav() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div style={{ fontWeight: 800, fontSize: '20px', color: 'var(--color-text)', letterSpacing: '-0.02em', fontFamily: 'var(--font-hanken)' }}>
          İşler LearnTwin AI
        </div>
        <nav style={{ display: 'flex', gap: '28px' }}>
          <Link href="/" style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Dashboard</Link>
          <Link href="#" style={{ color: 'var(--color-muted)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Courses</Link>
          <Link href="/student/history" style={{ color: 'var(--color-muted)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Analytics</Link>
          <Link href="#" style={{ color: 'var(--color-muted)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Resources</Link>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--color-muted)', fontSize: '16px' }}>
        <span style={{ cursor: 'pointer' }}>🔍</span>
        <span style={{ cursor: 'pointer' }}>🔔</span>
        <span style={{ cursor: 'pointer' }}>⚙️</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-highlight)' }} />
      </div>
    </header>
  )
}
