'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-client'

type Role = 'student' | 'teacher' | 'parent'

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
    desc: 'Öğretmenler, öğrencinin anlık performansını ve ilerleme grafiğini detaylı raporlarla takip eder.',
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
]

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()
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
              <a href="/auth/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
                Ücretsiz Deneyin
              </a>
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
                  Öğretmenlerden ve öğrencilerden gerçek deneyimler.
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


        </main>
      )}

      <Footer />
    </div>
  )
}
