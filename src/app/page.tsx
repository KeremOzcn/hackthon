'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'

interface Subject {
  label: string
  topic: string
  icon: string
  color: string
}

type Role = 'student' | 'teacher' | 'parent'

interface RoleOption {
  id: Role
  title: string
  desc: string
  icon: string
}

const ROLES: RoleOption[] = [
  { id: 'student', title: 'Öğrenci', desc: 'Kişiselleştirilmiş öğrenme yolları ve adaptif testler.', icon: '\u{1F393}' },
  { id: 'teacher', title: 'Öğretmen', desc: 'Gelişmiş analitik ve otomatik müfredat oluşturma.', icon: '\u{1F468}\u{200D}\u{1F3EB}' },
  { id: 'parent', title: 'Veli', desc: 'Gerçek zamanlı ilerleme takibi ve performans içgörüleri.', icon: '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}' },
]

const STEPS = ['Profil', 'Ders', 'Detaylar']

export default function LandingPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Role>('student')
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [studentName, setStudentName] = useState('')

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch('/api/subjects')
        if (!res.ok) throw new Error('Failed to fetch subjects')
        const data: { subjects: Subject[] } = await res.json()
        setSubjects(data.subjects)
        if (data.subjects.length > 0) {
          setSelectedSubject(data.subjects[0])
        }
      } catch {
        // silently fail; page remains functional with empty subjects
      } finally {
        setLoadingSubjects(false)
      }
    }
    fetchSubjects()
  }, [])

  function handleContinue() {
    if (selectedRole === 'teacher') {
      router.push('/teacher')
      return
    }
    if (selectedRole === 'parent') {
      router.push('/parent')
      return
    }
    if (!studentName.trim()) return

    const id = `stu_${Date.now()}`
    localStorage.setItem('learntwin_student', JSON.stringify({ id, name: studentName.trim() }))
    localStorage.setItem('learntwin_student_name', studentName.trim())
    if (selectedSubject) {
      localStorage.setItem(
        'learntwin_subject',
        JSON.stringify({ subject: selectedSubject.label, topic: selectedSubject.topic })
      )
    }
    router.push('/student/session')
  }

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface)',
        color: 'var(--on-surface)',
        fontFamily: 'var(--font-inter)',
      }}
    >
      <TopNav active="dashboard" />

      <main className="flex flex-col items-center" style={{ flex: 1, padding: '64px 20px' }}>
        {/* Badge */}
        <div
          className="inline-flex items-center rounded-full"
          style={{
            border: '1px solid var(--border-highlight)',
            padding: '4px 14px',
            marginBottom: '24px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          YENİ NESİL ÖĞRENME
        </div>

        {/* Hero */}
        <h1
          className="text-center"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontSize: 'clamp(40px, 5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '16px',
            letterSpacing: '-0.03em',
          }}
        >
          Kesintisiz Eğitim,
          <br />
          Yapay Zeka <span style={{ color: 'var(--color-accent)' }}>ile.</span>
        </h1>

        <p
          className="text-center"
          style={{
            color: 'var(--color-muted)',
            fontSize: '16px',
            maxWidth: '560px',
            lineHeight: 1.7,
            marginBottom: '56px',
          }}
        >
          Adaptif, veri odaklı zeka ile öğrenme sonuçlarını hızlandırın. Akıllı başvuru sürecini başlatmak için yolunuzu seçin.
        </p>

        {/* Role Cards */}
        <div
          className="grid w-full gap-4"
          style={{
            maxWidth: '900px',
            marginBottom: '48px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          }}
        >
          {ROLES.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className="glass-card"
              style={{
                padding: '24px',
                cursor: 'pointer',
                borderColor:
                  selectedRole === role.id ? 'var(--color-accent)' : 'var(--border-subtle)',
                background:
                  selectedRole === role.id
                    ? 'rgba(128,131,255,0.06)'
                    : 'var(--bg-card)',
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '14px' }}>{role.icon}</div>
              <div
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontWeight: 700,
                  fontSize: '17px',
                  marginBottom: '8px',
                }}
              >
                {role.title}
              </div>
              <div
                style={{
                  color: 'var(--color-muted)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}
              >
                {role.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Setup Card */}
        <div className="glass-card fade-in w-full" style={{ maxWidth: '820px', padding: '40px' }}>
          {/* Step indicators */}
          <div className="flex items-center" style={{ marginBottom: '40px' }}>
            {STEPS.map((step, i) => (
              <div
                key={step}
                className="flex items-center"
                style={{ flex: i < STEPS.length - 1 ? 1 : undefined }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background:
                        i === 0 ? 'var(--color-accent-dim)' : 'rgba(255,255,255,0.05)',
                      border:
                        i === 0
                          ? '1px solid var(--color-accent)'
                          : '1px solid var(--border-subtle)',
                      color: i === 0 ? 'var(--color-accent)' : 'var(--color-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      color: i === 0 ? 'var(--color-text)' : 'var(--color-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: i === 0 ? 600 : 400,
                    }}
                  >
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1"
                    style={{
                      height: '1px',
                      background: 'var(--border-subtle)',
                      margin: '0 16px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: '22px',
              fontWeight: 700,
              marginBottom: '6px',
            }}
          >
            Ana Ders Seçin
          </h2>
          <p
            style={{
              color: 'var(--color-muted)',
              fontSize: '14px',
              marginBottom: '28px',
            }}
          >
            İlk yapay zeka değerlendirmesi için odak alanı seçin.
          </p>

          {/* Subject Selector */}
          {loadingSubjects ? (
            <div
              className="grid gap-3"
              style={{
                marginBottom: '32px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              }}
            >
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="skeleton-shimmer"
                  style={{ height: '96px', borderRadius: '8px' }}
                />
              ))}
            </div>
          ) : (
            <div
              className="grid gap-3"
              style={{
                marginBottom: '32px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              }}
            >
              {subjects.map((sub) => (
                <div
                  key={sub.label}
                  onClick={() => setSelectedSubject(sub)}
                  className="flex flex-col items-center justify-center text-center cursor-pointer"
                  style={{
                    border: `1px solid ${
                      selectedSubject?.label === sub.label
                        ? 'var(--color-accent)'
                        : 'var(--border-subtle)'
                    }`,
                    background:
                      selectedSubject?.label === sub.label
                        ? 'var(--color-accent-dim)'
                        : 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    padding: '20px 12px',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '22px',
                      marginBottom: '10px',
                      color:
                        selectedSubject?.label === sub.label
                          ? 'var(--color-text)'
                          : 'var(--color-muted)',
                    }}
                  >
                    {sub.icon}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color:
                        selectedSubject?.label === sub.label
                          ? 'var(--color-text)'
                          : 'var(--color-muted)',
                    }}
                  >
                    {sub.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Student Name Input */}
          <div style={{ marginBottom: '32px' }}>
            <label
              className="block uppercase"
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--color-muted)',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              TAM İSİM
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              placeholder="Adınızı girin"
              className="input-field"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#070D1A',
                color: 'var(--color-text)',
                fontSize: '15px',
                outline: 'none',
                fontFamily: 'var(--font-inter)',
                transition: 'border-color 150ms ease',
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              className="btn-primary"
              onClick={handleContinue}
              disabled={selectedRole === 'student' && !studentName.trim()}
              style={{
                opacity: selectedRole === 'student' && !studentName.trim() ? 0.5 : 1,
              }}
            >
              Devam Et →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
