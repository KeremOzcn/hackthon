'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const mockData = [
  { name: 'Hızlı ama Dikkatsiz', value: 8, color: '#f43f5e' },
  { name: 'Yavaş ama Sağlam', value: 12, color: '#10b981' },
  { name: 'Konuyu Biliyor ama Modelleyemiyor', value: 6, color: '#f59e0b' },
  { name: 'İpucu Bağımlısı', value: 9, color: '#8083ff' },
  { name: 'Sınav Panikçisi', value: 5, color: '#a78bfa' },
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
                background: 'rgba(12,19,36,0.9)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                color: '#dce1fb',
                fontSize: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 10px 15px rgba(0,0,0,0.2)',
              }}
              itemStyle={{ fontWeight: 600 }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
