'use client'

import { useRouter } from 'next/navigation'
import RiskBarChart from '@/components/charts/RiskBarChart'
import AccuracyTrend from '@/components/charts/AccuracyTrend'
import TwinDistribution from '@/components/charts/TwinDistribution'

export default function TeacherAnalyticsPage() {
    const router = useRouter()

    return (
        <main className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--color-text)' }}>
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
                        { label: 'Toplam Sınav Oturumu', value: '34', color: 'var(--color-accent)' },
                        { label: 'Sınıf Başarı Ortalaması', value: '61.4%', color: '#10b981' },
                        { label: 'Müdahale Gereken (Yüksek Risk)', value: '5 Öğrenci', color: '#f43f5e' },
                        { label: 'Ortalama İpucu Kullanımı', value: '1.8 / Soru', color: '#f59e0b' },
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
                        <AccuracyTrend />
                    </div>

                    {/* Sağ Kolon: Risk Dağılımı */}
                    <div>
                        <RiskBarChart />
                    </div>

                    {/* Alt Satır: Twin Dağılımı (Merkezi tam genişlik veya dengeli duruş) */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <TwinDistribution />
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
    )
}