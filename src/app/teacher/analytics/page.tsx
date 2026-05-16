'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import RiskBarChart from '@/components/charts/RiskBarChart'
import AccuracyTrend from '@/components/charts/AccuracyTrend'
import TwinDistribution from '@/components/charts/TwinDistribution'

const riskLabelMap: Record<string, string> = {
    low: 'Düşük Risk',
    medium: 'Orta Risk',
    high: 'Yüksek Risk',
}

const riskColorMap: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f43f5e',
}

const twinColorMap: Record<string, string> = {
    'Hızlı ama Dikkatsiz': '#f43f5e',
    'Yavaş ama Sağlam': '#10b981',
    'Konuyu Biliyor ama Modelleyemiyor': '#f59e0b',
    'İpucu Bağımlısı': '#6366f1',
    'Sınav Panikçisi': '#a78bfa',
}

interface AnalyticsData {
    totalSessions: number
    avgAccuracy: number
    highRiskCount: number
    avgHints: number
    riskDistribution: { name: string; students: number; color: string }[]
    twinDistribution: { name: string; value: number; color: string }[]
    accuracyTrend: { date: string; accuracy: number }[]
}

export default function TeacherAnalyticsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalSessions: 0,
        avgAccuracy: 0,
        highRiskCount: 0,
        avgHints: 0,
        riskDistribution: [],
        twinDistribution: [],
        accuracyTrend: [],
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase
                    .from('learning_twin_results')
                    .select('risk_level, accuracy, created_at, twin_type, hints_used, avg_time_seconds')
                    .order('created_at', { ascending: false })
                    .limit(100)

                if (!data || data.length === 0) {
                    setLoading(false)
                    return
                }

                const totalSessions = data.length

                const avgAccuracy = Math.round(
                    data.reduce((sum, r) => sum + (r.accuracy || 0), 0) / data.length
                )

                const highRiskCount = data.filter((r) => r.risk_level === 'high').length

                const avgHints =
                    Math.round(
                        (data.reduce((sum, r) => sum + (r.hints_used || 0), 0) / data.length) * 10
                    ) / 10

                const riskCounts: Record<string, number> = {}
                for (const r of data) {
                    const level = String(r.risk_level || 'low')
                    riskCounts[level] = (riskCounts[level] || 0) + 1
                }
                const riskDistribution = Object.entries(riskCounts).map(([level, count]) => ({
                    name: riskLabelMap[level] || level,
                    students: count,
                    color: riskColorMap[level] || '#6366f1',
                }))

                const twinCounts: Record<string, number> = {}
                for (const r of data) {
                    const type = String(r.twin_type || 'Bilinmiyor')
                    twinCounts[type] = (twinCounts[type] || 0) + 1
                }
                const twinDistribution = Object.entries(twinCounts).map(([type, count]) => ({
                    name: type,
                    value: count,
                    color: twinColorMap[type] || '#6366f1',
                }))

                const dateMap: Record<string, { sum: number; count: number }> = {}
                for (const r of data) {
                    const dateStr = r.created_at ? String(r.created_at).split('T')[0] : ''
                    if (!dateStr) continue
                    if (!dateMap[dateStr]) {
                        dateMap[dateStr] = { sum: 0, count: 0 }
                    }
                    dateMap[dateStr].sum += r.accuracy || 0
                    dateMap[dateStr].count += 1
                }

                const sortedDates = Object.entries(dateMap)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .slice(-7)
                    .map(([dateStr, { sum, count }]) => {
                        const dateObj = new Date(dateStr + 'T00:00:00')
                        const label = dateObj.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' })
                        return { date: label, accuracy: Math.round(sum / count) }
                    })

                setAnalytics({
                    totalSessions,
                    avgAccuracy,
                    highRiskCount,
                    avgHints,
                    riskDistribution,
                    twinDistribution,
                    accuracyTrend: sortedDates,
                })
            } catch {
                // keep fallback data
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <main className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--color-text)' }}>
                <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
                    <p>Yükleniyor...</p>
                </div>
            </main>
        )
    }

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
        <TopNav active="analytics" />
        <main className="flex-1 px-4 py-8" style={{ color: 'var(--color-text)' }}>
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">

                {/* Üst Navigasyon ve Başlık */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
                    <div>
                        <button
                            onClick={() => router.push('/teacher')}
                            style={{ color: 'var(--color-muted)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}
                        >
                            ← Öğretmen Paneline Dön
                        </button>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>Sınıf Analiz Raporları</h1>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>
                            Claude AI tarafından üretilen öğrenme metriklerinin toplu analitiği
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <span className="badge" style={{ backgroundColor: 'rgba(99,102,241,0.12)', color: 'var(--color-accent)', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}>
                            Aktif Dönem: YKS 2026
                        </span>
                    </div>
                </div>

                {/* Özet Metrik Kartları */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    {[
                        { label: 'Toplam Sınav Oturumu', value: `${analytics.totalSessions}`, color: 'var(--color-accent)' },
                        { label: 'Sınıf Başarı Ortalaması', value: `${analytics.avgAccuracy}%`, color: '#10b981' },
                        { label: 'Müdahale Gereken (Yüksek Risk)', value: `${analytics.highRiskCount} Öğrenci`, color: '#f43f5e' },
                        { label: 'Ortalama İpucu Kullanımı', value: `${analytics.avgHints} / Soru`, color: '#f59e0b' },
                    ].map((card, i) => (
                        <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ color: 'var(--color-muted)', fontSize: '13px', fontWeight: 500 }}>{card.label}</span>
                            <span style={{ fontSize: '24px', fontWeight: 700, color: card.color }}>{card.value}</span>
                        </div>
                    ))}
                </div>

                {/* Grafik Düzeni (Grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>

                    {/* Sol Kolon: Doğruluk Trendi (Geniş Kaplasın diye grid-column ayarı yapılabilir) */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <AccuracyTrend data={analytics.accuracyTrend} />
                    </div>

                    {/* Sağ Kolon: Risk Dağılımı */}
                    <div>
                        <RiskBarChart data={analytics.riskDistribution} />
                    </div>

                    {/* Alt Satır: Twin Dağılımı (Merkezi tam genişlik veya dengeli duruş) */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <TwinDistribution data={analytics.twinDistribution} />
                    </div>

                    {/* Ek Bilgi Paneli */}
                    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Pedagojik AI Tavsiyesi</h4>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                            Sınıfta <strong style={{ color: 'var(--color-text)' }}>Yavaş ama Sağlam</strong> ilerleyen öğrencilerin oranı yüksek görünse de,
                            son testlerde <strong style={{ color: '#f43f5e' }}>Hızlı ama Dikkatsiz</strong> profilinde bir artış trendi saptandı.
                            Öğrencilere süre baskısı yapmadan, formülleri ve mantığı kağıda dökerek çözmeye yönlendirecek mikro müdahaleler planlanmalıdır.
                        </p>
                    </div>

                </div>

            </div>
        </main>
        <Footer />
      </div>
    )
}
