import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, protocol_summary, city } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase.from('email_captures').upsert(
      {
        email: email.toLowerCase().trim(),
        protocol_summary: protocol_summary ?? null,
        city: city ?? null,
        captured_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )

    if (error) {
      console.error('Email capture error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Capture email route error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
