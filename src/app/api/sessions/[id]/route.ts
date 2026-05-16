import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('learning_twin_results')
    .select('id,subject,topic,twin_type,risk_level,accuracy,avg_time_seconds,hints_used,created_at,dominant_pattern,next_best_action,achievements')
    .eq('profile_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ sessions: [] }, { status: 200 })
  }

  const sessions = (data ?? []).map(row => ({
    id: row.id,
    subject: row.subject,
    topic: row.topic,
    twinType: row.twin_type,
    riskLevel: row.risk_level,
    accuracy: row.accuracy,
    avgTimeSeconds: row.avg_time_seconds ?? 0,
    hintsUsed: row.hints_used ?? 0,
    completedAt: row.created_at,
    dominantPattern: row.dominant_pattern ?? '',
    nextBestAction: row.next_best_action ?? '',
    achievements: row.achievements ?? [],
  }))

  return NextResponse.json({ sessions })
}
