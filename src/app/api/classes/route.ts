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

// GET /api/classes — return authenticated teacher's classes
export async function GET() {
  try {
    const { user, supabase } = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: rows, error } = await supabase
      .from('classes')
      .select('id, name, grade, focus, created_at')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ classes: rows ?? [] })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}

// POST /api/classes — create a new class
export async function POST(req: NextRequest) {
  try {
    const { user, supabase } = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, grade, focus } = body
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Class name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('classes')
      .insert({ teacher_id: user.id, name: name.trim(), grade: grade?.trim(), focus: focus?.trim() })
      .select('id, name, grade, focus, created_at')
      .single()

    if (error) throw error

    return NextResponse.json({ class: data }, { status: 201 })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}

// PATCH /api/classes — update a class
export async function PATCH(req: NextRequest) {
  try {
    const { user, supabase } = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, name, grade, focus } = body
    if (!id) {
      return NextResponse.json({ error: 'Class id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('classes')
      .update({ name: name?.trim(), grade: grade?.trim(), focus: focus?.trim() })
      .eq('id', id)
      .eq('teacher_id', user.id)
      .select('id, name, grade, focus, created_at')
      .single()

    if (error) throw error

    return NextResponse.json({ class: data })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}

// DELETE /api/classes — delete a class
export async function DELETE(req: NextRequest) {
  try {
    const { user, supabase } = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Class id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id)
      .eq('teacher_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}
