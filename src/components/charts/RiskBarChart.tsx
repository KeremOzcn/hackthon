'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Demo için geçici mock data (gerçek veri Analytics sayfasından prop olarak gelecek)
const mockData = [
    { name: 'Düşük Risk', students: 12, color: '#10b981' }, // --color-emerald
    { name: 'Orta Risk', students: 8, color: '#f59e0b' },   // --color-amber
    { name: 'Yüksek Risk', students: 5, color: '#f43f5e' }, // --color-rose
]

export default function RiskBarChart({ data = mockData }) {
    return (
        <div className="glass-card" style={{ padding: '24px', height: '350px', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>Sınıf Risk Dağılımı</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
                    Öğrencilerin AI analiz sonuçlarına göre risk seviyeleri
                </p>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            stroke="var(--color-muted)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--color-muted)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            contentStyle={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '8px',
                                color: 'var(--color-text)'
                            }}
                            itemStyle={{ fontWeight: 600 }}
                        />
                        <Bar dataKey="students" radius={[6, 6, 0, 0]} maxBarSize={60}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
