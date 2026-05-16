'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const mockData = [
  { name: 'Düşük Risk', students: 12, color: '#10b981' },
  { name: 'Orta Risk', students: 8, color: '#f59e0b' },
  { name: 'Yüksek Risk', students: 5, color: '#f43f5e' },
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
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
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
              itemStyle={{ fontWeight: 600, color: '#dce1fb' }}
              labelStyle={{ color: '#94a3b8' }}
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
