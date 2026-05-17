import { TopNav } from './TopNav'
import { Footer } from './Footer'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeNav?: 'dashboard' | 'courses' | 'analytics'
}

export function DashboardLayout({ children, activeNav }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface)' }}>
      <TopNav active={activeNav} />
      <main className="flex-1" style={{ padding: '40px 0' }}>
        <div className="container-dashboard">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
