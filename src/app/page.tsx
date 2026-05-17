'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-client'

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

const FEATURES = [
  {
    title: 'Kişiselleştirilmiş Öğrenme Yolları',
    desc: 'Yapay zeka, her öğrencinin güçlü ve zayıf yönlerini analiz ederek özel bir yol haritası oluşturur.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    ),
  },
  {
    title: 'Gerçek Zamanlı Analitik',
    desc: 'Öğretmenler ve veliler, öğrencinin anlık performansını ve ilerleme grafiğini detaylı raporlarla takip eder.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
    ),
  },
  {
    title: 'Gamification & Motivasyon',
    desc: 'Rozetler, seviye atlama ve başarı sıralamalarıyla öğrencilerin öğrenme motivasyonunu sürekli yüksek tutar.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
    ),
  },
  {
    title: 'MEB Müfredatına Uyumlu İçerik',
    desc: 'Tüm içerikler Milli Eğitim Bakanlığı müfredatına uygun hazırlanır ve güncel tutulur.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m9 9.5 2 2L15 8"/></svg>
    ),
  },
]

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Öğrenci Profili Oluşturun',
    desc: 'Rolünüzü seçin ve temel bilgileri girerek kişiselleştirilmiş deneyime ilk adımı atın.',
  },
  {
    num: '02',
    title: 'Yapay Zeka Değerlendirmesi Yapın',
    desc: 'Akıllı tanılama testi ile bilgi düzeyinizi ve eksiklerinizi anlık tespit edin.',
  },
  {
    num: '03',
    title: 'Kişiselleştirilmiş Yol Haritanızı Takip Edin',
    desc: 'Yapay zeka tarafından hazırlanan özel programa göre sistemli ve verimli çalışın.',
  },
]

const STATS = [
  { value: '10.000+', label: 'Aktif Öğrenci' },
  { value: '%85', label: 'Başarı Artışı' },
  { value: '500+', label: 'Öğretmen' },
  { value: '50+', label: 'Okul' },
]

const TESTIMONIALS = [
  {
    quote: 'LearnTwin AI sayesinde öğrencilerimin güçlü ve zayıf yönlerini çok net görebiliyorum. Ders planlamam yarı zamana indi.',
    name: 'Ayşe Yılmaz',
    role: 'Matematik Öğretmeni, Ankara',
  },
  {
    quote: 'Oğlum matematikte sürekli zorlanıyordu. Artık kendi hızında ilerliyor ve sınav notları ciddi şekilde yükseldi.',
    name: 'Mehmet Kaya',
    role: 'Veli, İstanbul',
  },
  {
    quote: 'Önce tereddüt ettim ama yapay zeka bana tam olarak nerede eksik olduğumu gösterdi. Bu sistemle ders çalışmak keyifli hale geldi.',
    name: 'Elif Demir',
    role: '11. Sınıf Öğrencisi, İzmir',
  },
]

const FAQ = [
  {
    q: 'LearnTwin AI hangi sınıf seviyelerini destekliyor?',
    a: 'Şu an ortaokul ve lise seviyelerindeki öğrenciler için MEB müfredatına uygun içerik sunuyoruz. İlkokul ve üniversite hazırlık modülleri de yakında ekleniyor.',
  },
  {
    q: 'Ücretsiz deneme süresi var mı?',
    a: 'Evet, tüm özellikleri kapsayan 14 günlük ücretsiz deneme süresi sunuyoruz. Kredi kartı gerektirmez.',
  },
  {
    q: 'Öğretmenler için ayrı bir panel var mı?',
    a: 'Evet. Öğretmenler, öğrenci performanslarını takip edebilecekleri gelişmiş analitik paneline ve otomatik değerlendirme araçlarına erişebilir.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Tüm veriler şifrelenerek saklanır ve KVKK kapsamında en üst düzey güvenlik önlemleriyle korunur. Üçüncü taraflarla paylaşılmaz.',
  },
  {
    q: 'Aile üyeleri de takip edebilir mi?',
    a: 'Evet. Veli hesaplarıyla çocuğunuzun günlük ilerlemesini, tamamlanan konuları ve başarı grafiklerini gerçek zamanlı görüntüleyebilirsiniz.',
  },
]

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()
  const onboardingRef = useRef<HTMLDivElement>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Role>('student')
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [studentName, setStudentName] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        const role = profile?.role as Role
        if (role === 'teacher') router.push('/teacher')
        else if (role === 'parent') router.push('/parent')
        else router.push('/student')
        return
      }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [router, supabase])

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

  function scrollToOnboarding() {
    onboardingRef.current?.scrollIntoView({ behavior: 'smooth' })
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

      {checkingAuth && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-muted)' }}>Yükleniyor...</div>
        </div>
      )}

      {!checkingAuth && (
        <main className="flex flex-col" style={{ flex: 1 }}>

          {/* ========== HERO SECTION ========== */}
          <section
            className="gradient-hero flex flex-col items-center text-center"
            style={{ padding: '120px 20px 100px' }}
          >
            <div
              className="inline-flex items-center rounded-full"
              style={{
                border: '1px solid var(--border-highlight)',
                padding: '6px 16px',
                marginBottom: '28px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--color-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              YENİ NESİL ÖĞRENME
            </div>

            <h1
              className="gradient-text"
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: 'clamp(36px, 5.5vw, 64px)',
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: '20px',
                letterSpacing: '-0.03em',
                maxWidth: '900px',
              }}
            >
              Yapay Zeka ile Her Öğrenci Başarıya Ulaşır
            </h1>

            <p
              className="text-center"
              style={{
                color: 'var(--color-muted)',
                fontSize: '18px',
                maxWidth: '640px',
                lineHeight: 1.7,
                marginBottom: '40px',
              }}
            >
              Adaptif yapay zeka teknolojisiyle her öğrenciye özel öğrenme yolları oluşturun,
              veriye dayalı kararlarla başarıyı garantileyin.
            </p>

            <div className="flex flex-wrap items-center justify-center" style={{ gap: '14px', marginBottom: '56px' }}>
              <button className="btn-primary" onClick={scrollToOnboarding}>
                Ücretsiz Deneyin
              </button>
              <a
                href="#nasil-calisir"
                className="btn-ghost"
                style={{ textDecoration: 'none' }}
              >
                Nasıl Çalışır?
              </a>
            </div>

            <div
              className="flex flex-wrap items-center justify-center"
              style={{ gap: '32px', color: 'var(--color-muted)', fontSize: '14px' }}
            >
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>&#128640;</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>10.000+</span> Öğrenci
              </div>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>&#127891;</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>500+</span> Öğretmen
              </div>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>&#9989;</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>MEB</span> Uyumlu
              </div>
            </div>
          </section>

          {/* ========== LOGO CLOUD ========== */}
          <section
            style={{ padding: '40px 20px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div
              className="container-dashboard flex flex-wrap items-center justify-center"
              style={{ gap: '40px', opacity: 0.5 }}
            >
              {['TED Koleji', 'Bahçeşehir Koleji', 'Final Okulları', 'Anafen', 'Bilfen', 'Doğa Koleji'].map((name) => (
                <span
                  key={name}
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontWeight: 700,
                    fontSize: '16px',
                    letterSpacing: '-0.01em',
                    color: 'var(--color-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </section>

          {/* ========== FEATURES ========== */}
          <section style={{ padding: '100px 20px' }}>
            <div className="container-dashboard" style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div className="text-center" style={{ marginBottom: '64px' }}>
                <h2
                  className="gradient-text"
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    marginBottom: '14px',
                  }}
                >
                  Geleneksel Eğitimi Geride Bırakın
                </h2>
                <p style={{ color: 'var(--color-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                  Her öğrenci eşsizdir. Yapay zeka destekli sistemimiz, bireysel ihtiyaçlara göre şekillenen bir öğrenme deneyimi sunar.
                </p>
              </div>

              <div
                className="grid gap-6"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
              >
                {FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="glass-card"
                    style={{ padding: '32px' }}
                  >
                    <div
                      style={{
                        color: 'var(--color-accent)',
                        marginBottom: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'var(--color-accent-dim)',
                      }}
                    >
                      {f.icon}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-hanken)',
                        fontWeight: 700,
                        fontSize: '17px',
                        marginBottom: '10px',
                        lineHeight: 1.3,
                      }}
                    >
                      {f.title}
                    </h3>
                    <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.65 }}>
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== HOW IT WORKS ========== */}
          <section
            id="nasil-calisir"
            style={{ padding: '100px 20px', backgroundColor: 'var(--surface-low)' }}
          >
            <div className="container-dashboard" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="text-center" style={{ marginBottom: '64px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    marginBottom: '14px',
                    color: 'var(--color-text)',
                  }}
                >
                  Üç Adımda Başlayın
                </h2>
                <p style={{ color: 'var(--color-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                  Karmaşık kurulumlara gerek yok. Dakikalar içinde öğrenme yolculuğunuza başlayın.
                </p>
              </div>

              <div
                className="grid gap-8"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
              >
                {HOW_IT_WORKS.map((step) => (
                  <div
                    key={step.num}
                    className="elevated-card"
                    style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '12px',
                        fontFamily: 'var(--font-hanken)',
                        fontWeight: 800,
                        fontSize: '72px',
                        color: 'var(--surface-container)',
                        lineHeight: 1,
                        userSelect: 'none',
                      }}
                    >
                      {step.num}
                    </div>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--color-accent), var(--color-teal))',
                        marginBottom: '20px',
                        opacity: 0.25,
                      }}
                    />
                    <h3
                      style={{
                        fontFamily: 'var(--font-hanken)',
                        fontWeight: 700,
                        fontSize: '18px',
                        marginBottom: '10px',
                        position: 'relative',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        color: 'var(--color-muted)',
                        fontSize: '14px',
                        lineHeight: 1.65,
                        position: 'relative',
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== STATS ========== */}
          <section style={{ padding: '100px 20px' }}>
            <div
              className="container-dashboard grid gap-8"
              style={{
                maxWidth: '1000px',
                margin: '0 auto',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                textAlign: 'center',
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    className="gradient-text"
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontSize: 'clamp(36px, 4vw, 48px)',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      marginBottom: '8px',
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '14px', fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========== TESTIMONIALS ========== */}
          <section style={{ padding: '100px 20px', backgroundColor: 'var(--surface-low)' }}>
            <div className="container-dashboard" style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div className="text-center" style={{ marginBottom: '56px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    marginBottom: '14px',
                    color: 'var(--color-text)',
                  }}
                >
                  Kullanıcılarımız Ne Diyor?
                </h2>
                <p style={{ color: 'var(--color-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                  Öğretmenlerden, velilerden ve öğrencilerden gerçek deneyimler.
                </p>
              </div>

              <div
                className="grid gap-6"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
              >
                {TESTIMONIALS.map((t, i) => (
                  <div
                    key={i}
                    className="glass-card"
                    style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  >
                    <p
                      style={{
                        color: 'var(--on-surface-variant)',
                        fontSize: '15px',
                        lineHeight: 1.75,
                        fontStyle: 'italic',
                        marginBottom: '24px',
                      }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-hanken)',
                          fontWeight: 700,
                          fontSize: '15px',
                          marginBottom: '4px',
                        }}
                      >
                        {t.name}
                      </div>
                      <div style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
                        {t.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== FAQ ========== */}
          <section style={{ padding: '100px 20px' }}>
            <div className="container-dashboard" style={{ maxWidth: '760px', margin: '0 auto' }}>
              <div className="text-center" style={{ marginBottom: '56px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    marginBottom: '14px',
                    color: 'var(--color-text)',
                  }}
                >
                  Sıkça Sorulan Sorular
                </h2>
                <p style={{ color: 'var(--color-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                  Aklınıza takılanları önceden cevapladık.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {FAQ.map((item, i) => {
                  const open = openFaq === i
                  return (
                    <div
                      key={i}
                      className="elevated-card"
                      style={{ padding: open ? '20px 24px 24px' : '20px 24px', cursor: 'pointer', transition: 'all 200ms ease' }}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <div className="flex items-center justify-between" style={{ gap: '12px' }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-hanken)',
                            fontWeight: 600,
                            fontSize: '16px',
                            lineHeight: 1.4,
                            color: open ? 'var(--color-accent)' : 'var(--color-text)',
                          }}
                        >
                          {item.q}
                        </h3>
                        <span
                          style={{
                            color: 'var(--color-muted)',
                            fontSize: '20px',
                            lineHeight: 1,
                            transition: 'transform 200ms ease',
                            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                            flexShrink: 0,
                          }}
                        >
                          +
                        </span>
                      </div>
                      {open && (
                        <p
                          style={{
                            color: 'var(--color-muted)',
                            fontSize: '14px',
                            lineHeight: 1.7,
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid var(--border-subtle)',
                          }}
                        >
                          {item.a}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ========== FINAL CTA ========== */}
          <section
            className="gradient-hero"
            style={{ padding: '100px 20px', textAlign: 'center' }}
          >
            <div className="container-dashboard" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h2
                className="gradient-text"
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  marginBottom: '18px',
                }}
              >
                Geleceğin Eğitimi Bugün Başlıyor
              </h2>
              <p
                style={{
                  color: 'var(--color-muted)',
                  fontSize: '17px',
                  lineHeight: 1.7,
                  marginBottom: '36px',
                  maxWidth: '560px',
                  margin: '0 auto 36px',
                }}
              >
                Ücretsiz hesabınızı oluşturun, yapay zeka destekli öğrenme deneyimini hemen keşfedin.
              </p>
              <button className="btn-primary" onClick={scrollToOnboarding}>
                Hemen Ücretsiz Başlayın
              </button>
            </div>
          </section>

          {/* ========== ONBOARDING FORM ========== */}
          <section
            ref={onboardingRef}
            style={{ padding: '100px 20px', backgroundColor: 'var(--surface-low)' }}
          >
            <div className="container-dashboard" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div className="text-center" style={{ marginBottom: '48px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 'clamp(24px, 3.5vw, 36px)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    marginBottom: '12px',
                    color: 'var(--color-text)',
                  }}
                >
                  Hemen Başlayın
                </h2>
                <p style={{ color: 'var(--color-muted)', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                  Rolünüzü seçin, dersinizi belirleyin ve kişiselleştirilmiş öğrenme deneyimine adım atın.
                </p>
              </div>

              {/* Role Cards */}
              <div
                className="grid w-full gap-4"
                style={{
                  maxWidth: '900px',
                  margin: '0 auto 48px',
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
              <div className="glass-card fade-in w-full" style={{ maxWidth: '820px', margin: '0 auto', padding: '40px' }}>
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
                      background: 'var(--surface-lowest)',
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

                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '0.5px solid var(--border-subtle)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Zaten hesabınız var mı?
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <a
                      href="/auth/login"
                      className="btn-outline"
                      style={{ textDecoration: 'none', display: 'inline-flex' }}
                    >
                      Giriş Yap
                    </a>
                    <a
                      href="/auth/signup"
                      className="btn-primary"
                      style={{ textDecoration: 'none', display: 'inline-flex' }}
                    >
                      Kaydol
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      <Footer />
    </div>
  )
}
