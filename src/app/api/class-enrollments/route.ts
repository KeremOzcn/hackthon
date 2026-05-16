import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return { user, supabase }
}

// GET /api/class-enrollments?classId=xxx — list enrolled students
export async function GET(req: NextRequest) {
  try {
    const { user, supabase } = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')
    if (!classId) {
      return NextResponse.json({ error: 'classId is required' }, { status: 400 })
    }

    // Verify the user is the teacher of this class
    const { data: classRow } = await supabase
      .from('classes')
      .select('teacher_id')
      .eq('id', classId)
      .single()

    if (!classRow || classRow.teacher_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: rows, error } = await supabase
      .from('class_enrollments')
      .select('id, student_id, profiles(id, full_name, email)')
      .eq('class_id', classId)

    if (error) throw error

    const students = (rows ?? []).map((row: any) => ({
      id: row.student_id,
      enrollmentId: row.id,
      name: row.profiles?.full_name ?? 'Öğrenci',
      email: row.profiles?.email ?? '',
    }))

    return NextResponse.json({ students })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}

// POST /api/class-enrollments — add student to class
export async function POST(req: NextRequest) {
  try {
    const { user, supabase } = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { classId, studentId } = body
    if (!classId || !studentId?.trim()) {
      return NextResponse.json({ error: 'classId and studentId are required' }, { status: 400 })
    }

    // Verify the user is the teacher of this class
    const { data: classRow } = await supabase
      .from('classes')
      .select('teacher_id')
      .eq('id', classId)
      .single()

    if (!classRow || classRow.teacher_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify student exists and is a student
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', studentId)
      .single()

    if (!profile || profile.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('class_enrollments')
      .insert({ class_id: classId, student_id: studentId })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ enrollment: data }, { status: 201 })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}

// DELETE /api/class-enrollments?id=xxx — remove enrollment
export async function DELETE(req: NextRequest) {
  try {
    const { user, supabase } = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const enrollmentId = searchParams.get('id')
    const classId = searchParams.get('classId')
    if (!enrollmentId || !classId) {
      return NextResponse.json({ error: 'id and classId are required' }, { status: 400 })
    }

    // Verify the user is the teacher of this class
    const { data: classRow } = await supabase
      .from('classes')
      .select('teacher_id')
      .eq('id', classId)
      .single()

    if (!classRow || classRow.teacher_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('class_enrollments')
      .delete()
      .eq('id', enrollmentId)
      .eq('class_id', classId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}
