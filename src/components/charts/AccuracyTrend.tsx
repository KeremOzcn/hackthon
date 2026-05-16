'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Demo için mock data
const mockData = [
    { date: '10 Mayıs', accuracy: 45 },
    { date: '11 Mayıs', accuracy: 52 },
    { date: '12 Mayıs', accuracy: 48 },
    { date: '13 Mayıs', accuracy: 61 },
    { date: '14 Mayıs', accuracy: 59 },
    { date: '15 Mayıs', accuracy: 68 },
    { date: '16 Mayıs', accuracy: 75 },
]

export default function AccuracyTrend({ data = mockData }) {
    return (
        <div className="glass-card" style={{ padding: '24px', height: '350px', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>Sınıf Doğruluk Trendi</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
                    Son 7 günlük ortalama doğru cevaplama oranı (%)
                </p>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--color-muted)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="var(--color-muted)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                            tickFormatter={(val) => `${val}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '8px',
                                color: 'var(--color-text)'
                            }}
                            itemStyle={{ fontWeight: 600, color: 'var(--color-accent)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="accuracy"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ fill: '#0b1120', stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
