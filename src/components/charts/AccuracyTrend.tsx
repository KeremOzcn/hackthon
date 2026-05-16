'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts'

const mockData = [
  { date: '10 Mayıs', accuracy: 45 },
  { date: '11 Mayıs', accuracy: 52 },
  { date: '12 Mayıs', accuracy: 48 },
  { date: '13 Mayıs', accuracy: 61 },
  { date: '14 Mayıs', accuracy: 59 },
  { date: '15 Mayıs', accuracy: 68 },
  { date: '16 Mayıs', accuracy: 75 },
]

export default function AccuracyTrend({ data = mockData }: { data?: { date: string; accuracy: number }[] }) {
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
            <defs>
              <linearGradient id="accuracyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(128,131,255,0.2)" />
                <stop offset="100%" stopColor="rgba(128,131,255,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(12,19,36,0.9)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                color: '#dce1fb',
                fontSize: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 10px 15px rgba(0,0,0,0.2)',
              }}
              itemStyle={{ fontWeight: 600, color: '#8083ff' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="none"
              fill="url(#accuracyFill)"
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#8083ff"
              strokeWidth={3}
              dot={{ fill: '#0c1324', stroke: '#8083ff', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#8083ff', stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
