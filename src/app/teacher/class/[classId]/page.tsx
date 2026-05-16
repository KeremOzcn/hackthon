'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

type ClassDetail = {
  id: string
  name: string
  grade: string
  advisor: string
  studentCount: number
  focus: string
  riskLevel: 'low' | 'medium' | 'high'
  averageAccuracy: number
}

type StudentItem = {
  id: string
  name: string
  twinType: string
  riskLevel: 'low' | 'medium' | 'high'
  accuracy: number
}

type RiskLevel = 'low' | 'medium' | 'high'

const CLASS_FIXTURES: Record<string, { detail: ClassDetail; students: StudentItem[] }> = {
  '9a': {
    detail: { id: '9a', name: '9-A', grade: '9. Sınıf', advisor: 'Ayşe Öğretmen', studentCount: 28, focus: 'Temel problem çözme', riskLevel: 'medium', averageAccuracy: 71 },
    students: [
      { id: 's1', name: 'Deniz K.', twinType: 'Konuyu Biliyor ama Modelleyemiyor', riskLevel: 'medium', accuracy: 40 },
      { id: 's2', name: 'Elif S.', twinType: 'Hızlı ama Dikkatsiz', riskLevel: 'high', accuracy: 60 },
      { id: 's3', name: 'Ayşe T.', twinType: 'Yavaş ama Sağlam', riskLevel: 'low', accuracy: 92 },
    ],
  },
  '10b': {
    detail: { id: '10b', name: '10-B', grade: '10. Sınıf', advisor: 'Mert Öğretmen', studentCount: 31, focus: 'Sınav panik yönetimi', riskLevel: 'high', averageAccuracy: 64 },
    students: [
      { id: 's4', name: 'Can Ö.', twinType: 'Sınav Panikçisi', riskLevel: 'medium', accuracy: 58 },
      { id: 's5', name: 'Mert A.', twinType: 'İpucu Bağımlısı', riskLevel: 'high', accuracy: 62 },
      { id: 's6', name: 'Zeynep Y.', twinType: 'Yavaş ama Sağlam', riskLevel: 'low', accuracy: 88 },
    ],
  },
  '11c': {
    detail: { id: '11c', name: '11-C', grade: '11. Sınıf', advisor: 'Elif Öğretmen', studentCount: 24, focus: 'Hız ve doğruluk dengesi', riskLevel: 'low', averageAccuracy: 83 },
    students: [
      { id: 's7', name: 'Bora D.', twinType: 'Yavaş ama Sağlam', riskLevel: 'low', accuracy: 90 },
      { id: 's8', name: 'Sude A.', twinType: 'Hızlı ama Dikkatsiz', riskLevel: 'medium', accuracy: 76 },
      { id: 's9', name: 'Ege M.', twinType: 'Konuyu Biliyor ama Modelleyemiyor', riskLevel: 'low', accuracy: 82 },
    ],
  },
}

const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
}

const RISK_CLASS: Record<RiskLevel, string> = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
}

const ACTION_PLAYBOOK: Record<RiskLevel, Array<{ title: string; body: string }>> = {
  low: [
    { title: 'Süreyi artır', body: 'Bu gruba daha uzun ama zorlayıcı problem setleri ver.' },
    { title: 'Bağımsız çözüm', body: 'İpucu sayısını azalt ve kendi kontrol listesini kullandır.' },
  ],
  medium: [
    { title: 'Kısa yönlendirme', body: 'Soruyu parçalara bölerek adım adım çözüm yaptır.' },
    { title: 'Hedef bazlı tekrar', body: 'En sık hata yapılan konuyu 10 dakikalık mini tekrar ile pekiştir.' },
  ],
  high: [
    { title: 'Mikro müdahale', body: 'Kısa, net ve uygulanabilir bir kontrol rutini kur.' },
    { title: 'Sınav stresi', body: 'Zaman baskısı içeren ama düşük riskli deneme çalışmaları planla.' },
  ],
}

const RISK_DISTRIBUTION_LABELS: Record<RiskLevel, string> = {
  low: 'Düşük riskli',
  medium: 'Orta riskli',
  high: 'Yüksek riskli',
}

export default function TeacherClassDetailPage() {
  const params = useParams<{ classId: string }>()
  const router = useRouter()
  const classId = Array.isArray(params.classId) ? params.classId[0] : params.classId
  const data = CLASS_FIXTURES[classId]
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [classId])

  const summary = useMemo(() => {
    if (!data) {
      return null
    }

    const highRiskStudents = data.students.filter(item => item.riskLevel === 'high').length
    const averageAccuracy = Math.round(data.students.reduce((sum, item) => sum + item.accuracy, 0) / data.students.length)
    const distribution = data.students.reduce<Record<RiskLevel, number>>(
      (acc, item) => {
        acc[item.riskLevel] += 1
        return acc
      },
      { low: 0, medium: 0, high: 0 },
    )
    return { highRiskStudents, averageAccuracy, distribution }
  }, [data])

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="glass-card p-6">
            <Skeleton height="18px" width="42%" />
            <div className="mt-2">
              <Skeleton height="14px" width="58%" />
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-4">
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <SkeletonCard lines={4} />
            <SkeletonCard lines={5} />
          </section>

          <SkeletonCard lines={3} />
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto w-full max-w-4xl">
          <PageHeader title="Sınıf bulunamadı" subtitle="Bu sınıf için demo veri tanımlı değil." backHref="/teacher/class" backLabel="Sınıflara dön" />
          <div className="glass-card mt-6 p-6">
            <p className="text-sm text-[var(--color-muted)]">Bu sayfa mock veriyle çalışıyor. Geçerli sınıflardan birini açmak için sınıf listesine dön.</p>
            <button type="button" className="btn-primary mt-4" onClick={() => router.push('/teacher/class')}>
              Sınıf listesine git
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader title={`${data.detail.name} Detayı`} subtitle={`${data.detail.grade} • ${data.detail.advisor}`} backHref="/teacher/class" backLabel="Sınıf yönetimi" />

        <section className="grid gap-4 md:grid-cols-4">
          <div className="glass-card p-5">
            <div className="text-sm text-[var(--color-muted)]">Öğrenci</div>
            <div className="mt-2 text-3xl font-bold">{data.detail.studentCount}</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-sm text-[var(--color-muted)]">Ortalama doğruluk</div>
            <div className="mt-2 text-3xl font-bold">%{summary?.averageAccuracy ?? data.detail.averageAccuracy}</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-sm text-[var(--color-muted)]">Yüksek risk</div>
            <div className="mt-2 text-3xl font-bold">{summary?.highRiskStudents ?? 0}</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-sm text-[var(--color-muted)]">Sınıf risk seviyesi</div>
            <div className="mt-2">
              <span className={`badge ${RISK_CLASS[data.detail.riskLevel]}`}>{RISK_LABEL[data.detail.riskLevel]}</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold">Sınıf özeti</h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-[var(--color-muted)]">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Odak alanı</div>
                <div className="mt-1 text-[var(--color-text)]">{data.detail.focus}</div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Durum yorumu</div>
                <div className="mt-1 text-[var(--color-text)]">
                  Bu sınıfta genel risk seviyesi {RISK_LABEL[data.detail.riskLevel].toLowerCase()} ve ortalama doğruluk %{summary?.averageAccuracy ?? data.detail.averageAccuracy}.
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Risk dağılımı</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Object.keys(RISK_DISTRIBUTION_LABELS) as RiskLevel[]).map(level => (
                    <span key={level} className="badge" style={{ background: level === 'low' ? 'rgba(16,185,129,0.12)' : level === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)', color: level === 'low' ? '#10b981' : level === 'medium' ? '#f59e0b' : '#f43f5e', borderColor: 'transparent' }}>
                      {RISK_DISTRIBUTION_LABELS[level]}: {summary?.distribution[level] ?? 0}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Öğretmen notu</div>
                <p className="mt-1">Bu ekran, öğretmenin sınıfı hızlıca tarayıp müdahale planı seçmesi için hazırlanmış bir sınıf panosudur.</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold">Öğrenciler</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Her öğrenci için twin tipi, doğruluk ve risk seviyesi.</p>

            <div className="mt-4 flex flex-col gap-3">
              {data.students.map(student => (
                <article key={student.id} className="rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{student.name}</div>
                      <div className="mt-1 text-sm text-[var(--color-muted)]">{student.twinType}</div>
                    </div>
                    <span className={`badge ${RISK_CLASS[student.riskLevel]}`}>{RISK_LABEL[student.riskLevel]}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted)]">Doğruluk</span>
                    <span className="font-semibold">%{student.accuracy}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold">Önerilen müdahaleler</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Sınıfın risk seviyesine göre öğretmen için hızlı aksiyon planı.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ACTION_PLAYBOOK[data.detail.riskLevel].map(action => (
              <article key={action.title} className="rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] p-4">
                <div className="text-sm font-semibold">{action.title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{action.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
