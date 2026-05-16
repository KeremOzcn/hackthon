import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: rows, error } = await supabase
      .from('subjects')
      .select('name, description, icon, color, topics(name)')
      .order('name')

    if (error) throw error

    const subjects = (rows ?? []).map((row: any) => ({
      label: row.name,
      topic: row.topics?.[0]?.name ?? row.description ?? '',
      icon: row.icon ?? '📚',
      color: row.color ?? '#6366f1',
    }))

    return NextResponse.json({ subjects })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}
