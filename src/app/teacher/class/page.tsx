'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Toast } from '@/components/ui/Toast'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

type ClassItem = {
  id: string
  name: string
  grade: string
  advisor: string
  studentCount: number
  focus: string
  riskLevel: 'low' | 'medium' | 'high'
  lastUpdated: string
}

type ClassFormState = {
  name: string
  grade: string
  advisor: string
  studentCount: string
  focus: string
}

const INITIAL_CLASSES: ClassItem[] = [
  { id: '9a', name: '9-A', grade: '9. Sınıf', advisor: 'Ayşe Öğretmen', studentCount: 28, focus: 'Temel problem çözme', riskLevel: 'medium', lastUpdated: 'Bugün' },
  { id: '10b', name: '10-B', grade: '10. Sınıf', advisor: 'Mert Öğretmen', studentCount: 31, focus: 'Sınav panik yönetimi', riskLevel: 'high', lastUpdated: 'Dün' },
  { id: '11c', name: '11-C', grade: '11. Sınıf', advisor: 'Elif Öğretmen', studentCount: 24, focus: 'Hız ve doğruluk dengesi', riskLevel: 'low', lastUpdated: '2 gün önce' },
]

const RISK_LABEL: Record<ClassItem['riskLevel'], string> = {
  low: 'Düşük risk',
  medium: 'Orta risk',
  high: 'Yüksek risk',
}

const RISK_COLOR: Record<ClassItem['riskLevel'], string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f43f5e',
}

const EMPTY_FORM: ClassFormState = {
  name: '',
  grade: '',
  advisor: '',
  studentCount: '',
  focus: '',
}

export default function TeacherClassPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ClassFormState>(EMPTY_FORM)
  const [toast, setToast] = useState<{ title: string; message: string; variant: 'success' | 'error' | 'warning' | 'info' } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  const stats = useMemo(() => {
    const totalStudents = classes.reduce((sum, item) => sum + item.studentCount, 0)
    const highRiskClasses = classes.filter(item => item.riskLevel === 'high').length
    return { totalStudents, highRiskClasses }
  }, [classes])

  function openCreateForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function startEdit(item: ClassItem) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      grade: item.grade,
      advisor: item.advisor,
      studentCount: String(item.studentCount),
      focus: item.focus,
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const studentCount = Number.parseInt(form.studentCount, 10)
    if (!form.name.trim() || !form.grade.trim() || !form.advisor.trim() || !form.focus.trim() || Number.isNaN(studentCount) || studentCount <= 0) {
      setToast({
        title: 'Eksik bilgi',
        message: 'Lütfen tüm alanları doğru biçimde doldur.',
        variant: 'warning',
      })
      return
    }

    const nextItem: ClassItem = {
      id: editingId ?? crypto.randomUUID(),
      name: form.name.trim(),
      grade: form.grade.trim(),
      advisor: form.advisor.trim(),
      studentCount,
      focus: form.focus.trim(),
      riskLevel: studentCount >= 30 ? 'high' : studentCount >= 25 ? 'medium' : 'low',
      lastUpdated: 'Az önce',
    }

    setClasses(current => {
      if (editingId) {
        return current.map(item => (item.id === editingId ? nextItem : item))
      }
      return [nextItem, ...current]
    })

    setToast({
      title: editingId ? 'Sınıf güncellendi' : 'Sınıf oluşturuldu',
      message: `${nextItem.name} artık sınıf listenizde.`,
      variant: 'success',
    })
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function removeClass(id: string) {
    setClasses(current => current.filter(item => item.id !== id))
    setToast({
      title: 'Sınıf silindi',
      message: 'Sınıf listeniz güncellendi.',
      variant: 'info',
    })
    if (editingId === id) {
      openCreateForm()
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="glass-card p-6">
            <Skeleton height="18px" width="36%" />
            <div className="mt-2">
              <Skeleton height="14px" width="52%" />
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <SkeletonCard lines={4} />
            <SkeletonCard lines={5} />
          </section>
        </div>
      </main>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="dashboard" />
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader title="Sınıf Yönetimi" subtitle="Öğretmen sınıflarını oluştur, düzenle ve incele." backHref="/teacher" backLabel="Öğretmen Paneli" />

        {toast && (
          <Toast
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="glass-card p-5">
            <div className="text-sm text-[var(--color-muted)]">Toplam sınıf</div>
            <div className="mt-2 text-3xl font-bold">{classes.length}</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-sm text-[var(--color-muted)]">Toplam öğrenci</div>
            <div className="mt-2 text-3xl font-bold">{stats.totalStudents}</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-sm text-[var(--color-muted)]">Yüksek riskli sınıf</div>
            <div className="mt-2 text-3xl font-bold">{stats.highRiskClasses}</div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Sınıflar</h2>
                <p className="text-sm text-[var(--color-muted)]">Detayları açabilir, düzenleyebilir veya silebilirsin.</p>
              </div>
              <button type="button" className="btn-outline px-4 py-2" onClick={openCreateForm}>
                Yeni sınıf
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {classes.map(item => (
                <article key={item.id} className="rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold">{item.name}</h3>
                        <span className="badge" style={{ background: `${RISK_COLOR[item.riskLevel]}20`, color: RISK_COLOR[item.riskLevel], border: `1px solid ${RISK_COLOR[item.riskLevel]}33` }}>
                          {RISK_LABEL[item.riskLevel]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">{item.grade} • {item.advisor}</p>
                      <p className="mt-2 text-sm">Odak: <span className="text-[var(--color-muted)]">{item.focus}</span></p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">{item.studentCount} öğrenci • Son güncelleme: {item.lastUpdated}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <button type="button" className="btn-outline px-4 py-2" onClick={() => router.push(`/teacher/class/${item.id}`)}>
                        Detay
                      </button>
                      <button type="button" className="btn-outline px-4 py-2" onClick={() => startEdit(item)}>
                        Düzenle
                      </button>
                      <button type="button" className="btn-outline px-4 py-2 text-[#f43f5e]" onClick={() => removeClass(item.id)}>
                        Sil
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <form className="glass-card p-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Sınıf düzenle' : 'Yeni sınıf oluştur'}</h2>
              <p className="text-sm text-[var(--color-muted)]">Bu form yalnızca local state ile çalışır, backend’e bağlanmamıştır.</p>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm">
                Sınıf adı
                <input
                  value={form.name}
                  onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
                  className="rounded-xl border border-[var(--border-subtle)] bg-white/5 px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="9-A"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Seviye
                <input
                  value={form.grade}
                  onChange={event => setForm(current => ({ ...current, grade: event.target.value }))}
                  className="rounded-xl border border-[var(--border-subtle)] bg-white/5 px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="9. Sınıf"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Sınıf öğretmeni
                <input
                  value={form.advisor}
                  onChange={event => setForm(current => ({ ...current, advisor: event.target.value }))}
                  className="rounded-xl border border-[var(--border-subtle)] bg-white/5 px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Ayşe Öğretmen"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Öğrenci sayısı
                <input
                  type="number"
                  min="1"
                  value={form.studentCount}
                  onChange={event => setForm(current => ({ ...current, studentCount: event.target.value }))}
                  className="rounded-xl border border-[var(--border-subtle)] bg-white/5 px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="28"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Odak alanı
                <textarea
                  value={form.focus}
                  onChange={event => setForm(current => ({ ...current, focus: event.target.value }))}
                  className="min-h-28 rounded-xl border border-[var(--border-subtle)] bg-white/5 px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Temel problem çözme"
                />
              </label>

              <button type="submit" className="btn-primary justify-center">
                {editingId ? 'Değişiklikleri kaydet' : 'Sınıfı oluştur'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
    <Footer />
  </div>
  )
}
