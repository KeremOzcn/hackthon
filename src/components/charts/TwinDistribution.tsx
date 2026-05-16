'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// PLAN.md C7 ve C9 kuralına göre 5 sabit Twin Tipi ve renkleri
const mockData = [
    { name: 'Hızlı ama Dikkatsiz', value: 8, color: '#f43f5e' }, // rose
    { name: 'Yavaş ama Sağlam', value: 12, color: '#10b981' }, // emerald
    { name: 'Konuyu Biliyor ama Modelleyemiyor', value: 6, color: '#f59e0b' }, // amber
    { name: 'İpucu Bağımlısı', value: 9, color: '#6366f1' }, // indigo
    { name: 'Sınav Panikçisi', value: 5, color: '#a78bfa' }, // violet
]

export default function TwinDistribution({ data = mockData }) {
    return (
        <div className="glass-card" style={{ padding: '24px', height: '350px', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>Öğrenme İkizi Dağılımı</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
                    Sınıftaki öğrencilerin baskın profilleri
                </p>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '8px',
                                color: 'var(--color-text)'
                            }}
                            itemStyle={{ fontWeight: 600 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', color: 'var(--color-muted)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}