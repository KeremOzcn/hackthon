'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import type { Achievement, LearningTwinResult, TwinType } from '@/types'
import { generateStudentPDF } from '@/lib/pdf'

const TWIN_ICONS: Record<TwinType, string> = {
  'Hızlı ama Dikkatsiz': '⚡',
  'Yavaş ama Sağlam': '🐢',
  'Konuyu Biliyor ama Modelleyemiyor': '🧩',
  'İpucu Bağımlısı': '🔦',
  'Sınav Panikçisi': '😰',
}

const TWIN_COLORS: Record<TwinType, string> = {
  'Hızlı ama Dikkatsiz': '#f59e0b',
  'Yavaş ama Sağlam': '#10b981',
  'Konuyu Biliyor ama Modelleyemiyor': '#8083ff',
  'İpucu Bağımlısı': '#a78bfa',
  'Sınav Panikçisi': '#f43f5e',
}

const RISK_LABEL: Record<string, string> = { low: 'Düşük Risk', medium: 'Orta Risk', high: 'Yüksek Risk' }

const MOCK_RESULT: LearningTwinResult = {
  twinType: 'Konuyu Biliyor ama Modelleyemiyor',
  dominantPattern: 'Problem metnini matematiksel denkleme dönüştürmede güçlük çekiyor; kavramsal anlayış var ama modelleme becerisi eksik.',
  cognitiveIssue: 'Problem durumunu soyutlayarak matematiksel modele çevirme güçlüğü.',
  behavioralIssue: 'Uzun sorularda ilk adımı atmakta tereddüt ediyor, ipucu olmadan başlayamıyor.',
  riskLevel: 'medium',
  nextBestAction: 'Değişken seçimi egzersizleri yaptırın. "Dinamik Temelleri" mini kursunu bu hafta sonu tamamlamasını sağlayın. Zamanlı testlerle süre yönetimini geliştirin.',
  studentMessage: 'Konuları anlıyorsun ama soruları denkleme çevirirken takılıyorsun. Bu çok yaygın bir durum! Kısa modelleme egzersizleriyle bu beceriyi hızla geliştirebilirsin.',
  teacherAction: 'Değişken seçimi ve denklem kurma odaklı 10 dakikalık günlük mini alıştırmalar ekleyin. İpucu vermeden önce "ne arıyoruz?" sorusunu sormaya teşvik edin.',
  parentMessage: 'Ali düzenli çalışıyor ancak uzun problem sorularında ilk adımı kurmakta zorlanıyor. Daha fazla soru çözmek yerine kısa soru anlama egzersizleri daha etkili olacaktır.',
  stats: { accuracy: 40, avgTimeSeconds: 58, hintsUsed: 3, highConfidenceWrong: 1 },
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<LearningTwinResult | { error: true } | null>(null)
  const [studentName, setStudentName] = useState('Öğrenci')
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [tab, setTab] = useState<'student' | 'teacher' | 'parent'>('student')

  function safeParse<T>(value: string | null): T | null {
    if (!value) return null
    try { return JSON.parse(value) as T } catch { return null }
  }

  async function handleDownloadPDF() {
    if (!result || 'error' in result) return
    setIsPdfLoading(true)
    try {
      const achievements = (result as any).gamification?.earnedAchievements as Achievement[] | undefined
      const url = await generateStudentPDF(result, studentName, achievements)
      const link = document.createElement('a')
      link.href = url
      link.download = `ogrenci-raporu-${studentName.replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (e) {
      console.error('PDF generation failed', e)
      alert('PDF oluşturulurken bir hata oluştu.')
    } finally {
      setIsPdfLoading(false)
    }
  }

  useEffect(() => {
    const raw = safeParse<LearningTwinResult | { error?: boolean }>(localStorage.getItem('learntwin_result'))
    if (raw && 'error' in raw) setResult({ error: true })
    else if (raw) setResult(raw as LearningTwinResult)
    else setResult(MOCK_RESULT)
    const st = safeParse<{ name?: string }>(localStorage.getItem('learntwin_student'))
    if (st?.name) setStudentName(st.name)
  }, [])

  if (!result) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-muted)' }}>Sonuç yükleniyor...</div>
      </main>
    )
  }

  if ('error' in result) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNav active="analytics" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Analiz başarısız oldu</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '24px' }}>API anahtarınızı kontrol edin.</div>
            <button className="btn-primary" onClick={() => router.push('/')} style={{ justifyContent: 'center' }}>Ana Sayfaya Dön</button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const twinColor = TWIN_COLORS[result.twinType] ?? '#8083ff'
  const twinIcon = TWIN_ICONS[result.twinType] ?? '🧠'

  const actionItems = result.nextBestAction
    .split(/[.\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="analytics" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Page header */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              ÖĞRENCİ PROFİLİ ANALİZİ
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Öğrenci Sonuçları
              </h1>
              <span className={`badge badge-${result.riskLevel}`}>{RISK_LABEL[result.riskLevel]}</span>
            </div>
          </div>

          {/* Twin persona card */}
          <div className="glass-card fade-in" style={{ padding: '32px', borderTop: `2px solid ${twinColor}`, display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${twinColor}18`, border: `1px solid ${twinColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>
              {twinIcon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: twinColor, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                LEARNTWIN PERSONA
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.02em' }}>
                &ldquo;{result.twinType}&rdquo;
              </div>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                {result.dominantPattern}
              </p>
            </div>
          </div>

          {/* 3 Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Doğruluk Oranı', value: `%${result.stats.accuracy}`, sub: `Başarı: %60+` },
              { label: 'Sınıf Başına Göre', value: `${result.stats.avgTimeSeconds}sn`, sub: 'Sınıf Ortalaması: 42sn' },
              { label: 'İpucu Kullanımı', value: `${result.stats.hintsUsed}`, sub: 'Sayısı: Kritik sorularda 1.5' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                  {s.label.toUpperCase()}
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Tab panel */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
              {([
                { key: 'student', label: 'Öğrenciye Özel Geri Bildirim' },
                { key: 'teacher', label: 'Öğretmen İçin Aksiyonlar' },
                { key: 'parent', label: 'Veli Raporu' },
              ] as const).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer',
                    background: 'transparent', fontSize: '13px', fontWeight: tab === t.key ? 600 : 400,
                    color: tab === t.key ? 'var(--color-text)' : 'var(--color-muted)',
                    borderBottom: tab === t.key ? '2px solid var(--color-accent)' : '2px solid transparent',
                    transition: 'all 150ms ease', marginBottom: '-1px',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="fade-in" style={{ padding: '28px' }} key={tab}>
              {tab === 'student' && (
                <>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>Merhaba, {studentName}!</div>
                  <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>{result.studentMessage}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '180px', padding: '14px', background: 'rgba(99,102,241,0.07)', borderRadius: '10px', fontSize: '13px', lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '10px', marginBottom: '6px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>BİLİŞSEL SORUN</div>
                      {result.cognitiveIssue}
                    </div>
                    <div style={{ flex: 1, minWidth: '180px', padding: '14px', background: 'rgba(99,102,241,0.07)', borderRadius: '10px', fontSize: '13px', lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '10px', marginBottom: '6px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>DAVRANIŞSAL SORUN</div>
                      {result.behavioralIssue}
                    </div>
                  </div>
                </>
              )}
              {tab === 'teacher' && (
                <>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>Öğretmen Notu</div>
                  <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.8 }}>{result.teacherAction}</p>
                </>
              )}
              {tab === 'parent' && (
                <>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>Veli Raporu</div>
                  <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.8 }}>{result.parentMessage}</p>
                </>
              )}
            </div>
          </div>

          {/* Yapay Zeka Analizi */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '20px' }}>🎯</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>Yapay Zeka Analizi</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginTop: '2px' }}>İNCELEME AKSİYON PLANI</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(actionItems.length > 0 ? actionItems : [result.nextBestAction]).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(128,131,255,0.12)', border: '1px solid rgba(128,131,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-muted)', margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-outline" onClick={() => router.push('/student/history')} style={{ flex: 1, justifyContent: 'center' }}>Geçmişim</button>
            <button className="btn-outline" onClick={() => router.push('/student/achievements')} style={{ flex: 1, justifyContent: 'center' }}>Rozetlerim</button>
            <button className="btn-outline" onClick={handleDownloadPDF} disabled={isPdfLoading} style={{ flex: 1, justifyContent: 'center' }}>{isPdfLoading ? 'Oluşturuluyor...' : 'PDF İndir'}</button>
            <button className="btn-primary" onClick={() => router.push('/')} style={{ flex: 1, justifyContent: 'center' }}>Ana Sayfa</button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
