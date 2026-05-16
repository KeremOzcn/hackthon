import { NextResponse } from 'next/server'

const subjects = [
  { label: 'Matematik', topic: 'Problemler', icon: '📐', color: '#6366f1' },
  { label: 'Fen Bilimleri', topic: 'Fizik & Kimya & Biyoloji', icon: '🔬', color: '#10b981' },
  { label: 'Türkçe', topic: 'Dil ve Anlam', icon: '📖', color: '#f59e0b' },
]

export async function GET() {
  return NextResponse.json({ subjects })
}
