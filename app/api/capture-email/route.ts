import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY)

const confirmationHtml = (email: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the RECVR waitlist</title>
</head>
<body style="margin:0;padding:0;background:#080A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080A0F;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0F1117;border:1px solid #1E2433;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header bar -->
          <tr>
            <td style="background:#0F1117;padding:32px 40px 0;border-bottom:1px solid #1E2433;">
              <p style="margin:0 0 24px;font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#06B6D4;">RECVR</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 40px;">
              <h1 style="margin:0 0 8px;font-size:32px;font-weight:700;color:#F8FAFC;line-height:1.1;">
                You're in.
              </h1>
              <p style="margin:16px 0 0;font-size:16px;color:#94A3B8;line-height:1.6;">
                You're on the RECVR early access list. We'll be in touch when we open up founding member slots.
              </p>
              <p style="margin:12px 0 0;font-size:14px;color:#64748B;line-height:1.6;">
                In the meantime, explore recovery venues at
                <a href="https://recvr.uk/venues" style="color:#06B6D4;text-decoration:none;">recvr.uk/venues</a>
                — or build your personalised recovery protocol at
                <a href="https://recvr.uk" style="color:#06B6D4;text-decoration:none;">recvr.uk</a>.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr>
                  <td style="background:#06B6D4;border-radius:100px;">
                    <a href="https://recvr.uk" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#080A0F;text-decoration:none;">
                      Build my recovery protocol →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #1E2433;">
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
                — The RECVR team
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#334155;">
                You're receiving this because ${email} signed up at recvr.uk.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

export async function POST(request: NextRequest) {
  let email = ''

  try {
    const body = await request.json()
    email = (body.email ?? '').toLowerCase().trim()
    const source = body.source ?? null
    const metadata = body.metadata ?? null
    // Also support legacy fields sent by ProtocolOutput email capture
    const protocol_summary = body.protocol_summary ?? null
    const city = body.city ?? null

    // ── 1. Validate ───────────────────────────────────────────────────────
    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // ── 2. Persist to Supabase ────────────────────────────────────────────
    const supabase = createServerClient()
    // Build the record with only the guaranteed base columns first
    const record: Record<string, unknown> = {
      email,
      captured_at: new Date().toISOString(),
    }
    if (protocol_summary) record.protocol_summary = protocol_summary
    if (city) record.city = city
    if (source) record.source = source
    if (metadata) record.metadata = metadata

    const { error: dbError } = await supabase
      .from('email_captures')
      .upsert(record, { onConflict: 'email' })

    if (dbError) {
      // Log but don't fail — still send the confirmation
      console.error('[capture-email] Supabase error:', dbError.message)
    }

    // ── 3. Send confirmation via Resend ───────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      const { error: emailError } = await resend.emails.send({
        from: 'RECVR <onboarding@resend.dev>',
        to: email,
        subject: "You're on the RECVR waitlist",
        html: confirmationHtml(email),
      })

      if (emailError) {
        // Log but don't fail the request
        console.error('[capture-email] Resend error:', emailError)
      }
    } else {
      console.warn('[capture-email] RESEND_API_KEY not set — skipping confirmation email')
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[capture-email] Unexpected error:', message)
    // Return 200 so the UX success state still shows
    return NextResponse.json({ success: true })
  }
}
