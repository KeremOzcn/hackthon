'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-client'

interface Course {
  slug: string
  name: string
  subject: string
  description: string
  topics: number
  color: string
}

export default function CoursesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data: subjects } = await supabase
          .from('subjects')
          .select('id, slug, name, color, description')

        const { data: topicRows } = await supabase
          .from('topics')
          .select('subject_id')

        const topicCountMap = new Map<string, number>()
        for (const t of (topicRows ?? [])) {
          topicCountMap.set(t.subject_id, (topicCountMap.get(t.subject_id) || 0) + 1)
        }

        const built: Course[] = (subjects ?? []).map((s) => ({
          slug: s.slug,
          name: s.name,
          subject: s.name.toUpperCase(),
          description: s.description,
          topics: topicCountMap.get(s.id) ?? 0,
          color: s.color,
        }))

        setCourses(built)
      } catch {
        setCourses([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
          {loading ? (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>
              Yükleniyor...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {courses.map(course => (
                <div
                  key={course.slug}
                  className="glass-card"
                  style={{ padding: '28px', borderTop: `2px solid ${course.color}`, cursor: 'pointer' }}
                  onClick={() => router.push(`/courses/${course.slug}`)}
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
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}
