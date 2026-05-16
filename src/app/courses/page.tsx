'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'

interface ClassCard {
  id: string
  name: string
  subject: string
  code: string
  students: number
  avatars: string[]
  extra: number
  color: string
}

interface RosterChange {
  initials: string
  name: string
  cls: string
  status: 'Active' | 'Pending Invite'
  color: string
}

const CLASSES: ClassCard[] = [
  { id: '1', name: '12-A Science', subject: 'ADVANCED PHYSICS', code: 'PH-12A-24', students: 28, avatars: ['JD', 'AM', 'SK'], extra: 25, color: '#6366f1' },
  { id: '2', name: '11-B Math',    subject: 'CALCULUS I',       code: 'HA-11B-24', students: 32, avatars: ['TR', 'LP'],       extra: 30, color: '#10b981' },
  { id: '3', name: '10-C History', subject: 'WORLD HISTORY',    code: 'HI-10C-24', students: 24, avatars: ['NK', 'BR'],       extra: 22, color: '#f59e0b' },
]

const ROSTER: RosterChange[] = [
  { initials: 'EY', name: 'Emre Yılmaz', cls: '12-A Science', status: 'Active',         color: '#6366f1' },
  { initials: 'AK', name: 'Ayşe Kaya',   cls: '11-B Math',    status: 'Pending Invite', color: '#10b981' },
  { initials: 'MÖ', name: 'Mehmet Öz',   cls: '10-C History', status: 'Active',         color: '#f59e0b' },
]

export default function CoursesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = CLASSES.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="courses" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                Sınıf Yönetimi
              </h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                Manage your classes, students, and invitations.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ fontSize: '13px' }}>↗ Invite Students</button>
              <button className="btn-primary" style={{ fontSize: '13px' }}>+ Yeni Sınıf</button>
            </div>
          </div>

          {/* Search + filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '13px', pointerEvents: 'none' }}>🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search students or classes..."
                style={{ width: '100%', paddingLeft: '38px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-inter)' }}
              />
            </div>
            {['All Grades', 'Active Classes'].map(label => (
              <button key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-muted)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                {label} <span style={{ fontSize: '10px', opacity: 0.7 }}>▾</span>
              </button>
            ))}
          </div>

          {/* Class cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {filtered.map(cls => (
              <div key={cls.id} className="glass-card" style={{ padding: '24px', borderTop: `2px solid ${cls.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{cls.name}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: cls.color, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>{cls.subject}</div>
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '20px', lineHeight: 1, padding: '0 4px' }}>⋮</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '18px', fontSize: '13px', color: 'var(--color-muted)' }}>
                  <span>👥 {cls.students} Students</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '12px' }}>🔑</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: cls.color }}>{cls.code}</span>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {cls.avatars.map((a, i) => (
                      <div key={a} style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${cls.color}18`, border: `2px solid var(--bg-card)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: cls.color, marginLeft: i > 0 ? '-8px' : 0 }}>
                        {a}
                      </div>
                    ))}
                    <span style={{ fontSize: '12px', color: 'var(--color-muted)', marginLeft: '10px' }}>+{cls.extra}</span>
                  </div>
                  <button onClick={() => router.push(`/courses/${cls.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600 }}>
                    Manage →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Roster Changes */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '16px' }}>Recent Roster Changes</h2>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 48px', borderBottom: '1px solid var(--border-subtle)' }}>
                {['STUDENT NAME', 'CLASS', 'STATUS', 'ACTION'].map(h => (
                  <div key={h} style={{ padding: '12px 20px', fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>

              {ROSTER.map((r, i) => (
                <div
                  key={r.name}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 48px', borderBottom: i < ROSTER.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 150ms ease' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${r.color}18`, border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: r.color, flexShrink: 0 }}>{r.initials}</div>
                    <span style={{ fontWeight: 500, fontSize: '14px' }}>{r.name}</span>
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', fontSize: '13px', color: 'var(--color-muted)' }}>{r.cls}</div>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: r.status === 'Active' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: r.status === 'Active' ? '#10b981' : '#f59e0b' }}>
                      {r.status}
                    </span>
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '14px' }}>✏</button>
                  </div>
                </div>
              ))}

              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>1-3 / 32 Gösteriliyor</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['←', '→'].map(arrow => (
                    <button key={arrow} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{arrow}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
