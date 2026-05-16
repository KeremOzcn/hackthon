'use client'

import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'

interface Course {
  id: string
  name: string
  subject: string
  description: string
  topics: number
  color: string
}

const COURSES: Course[] = [
  {
    id: 'matematik',
    name: 'Matematik',
    subject: 'İLERİ MATEMATİK',
    description: 'Turev, integral, limitler ve olasilik konularini kapsayan kapsamli matematik programi.',
    topics: 7,
    color: '#8083ff',
  },
  {
    id: 'fen-bilimleri',
    name: 'Fen Bilimleri',
    subject: 'FEN BİLİMLERİ',
    description: 'Fizik, kimya ve biyoloji temellerini birlestiren disiplinler arasi bilim programi.',
    topics: 5,
    color: '#10b981',
  },
  {
    id: 'turkce',
    name: 'Turkce',
    subject: 'TÜRKÇE',
    description: 'Dil bilgisi, paragraf analizi ve anlatim bozuklugu konularini iceren dil programi.',
    topics: 5,
    color: '#f59e0b',
  },
]

export default function CoursesPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="courses" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Page header */}
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Dersler
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6 }}>
              Ogrencilerinizin takip ettigi ders programlari ve konu listeleri.
            </p>
          </div>

          {/* Course cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {COURSES.map(course => (
              <div
                key={course.id}
                className="glass-card"
                style={{ padding: '28px', borderTop: `2px solid ${course.color}`, cursor: 'pointer' }}
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: course.color, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {course.subject}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '22px', marginBottom: '8px', fontFamily: 'var(--font-hanken)' }}>
                    {course.name}
                  </div>
                  <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                    {course.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-muted)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text)' }}>{course.topics}</span>
                    <span>Konu</span>
                  </div>
                  <span style={{ color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600 }}>
                    Incele →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
