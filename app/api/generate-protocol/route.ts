import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const SYSTEM_PROMPT = `You are RECVR's AI recovery protocol engine — a world-class sports
performance specialist with deep expertise in exercise physiology and evidence-based
recovery modalities including cryotherapy, infrared sauna, IV therapy, float tanks,
red light therapy, contrast therapy, compression therapy, and cold plunge.

When given a user's training context, generate a precise 7-day recovery protocol.

RULES:
- Recommend exactly 3–4 treatments across 7 days (not every day — recovery needs rest days)
- Each recommendation must specify: day number, modality, duration, and a physiological reason
- Physiological reasons must reference specific mechanisms: lactate clearance,
  vasoconstriction/vasodilation cycles, parasympathetic nervous system activation,
  cortisol reduction, mitochondrial stimulation, pro-inflammatory cytokine reduction,
  glycogen replenishment support, fascia hydration, etc.
- Sequence treatments intelligently: never put heat and cold on the same day
  (e.g. sauna and cryotherapy should be on different days)
- Account for the user's specific sport, training load, issues, and goals
- Be confident and specific — this is evidence-based guidance, not hedged opinion
- Tone: expert sports scientist, not a wellness influencer

OUTPUT: Respond with valid JSON only. No markdown. No preamble. No explanation outside the JSON.

{
  "summary": "2-sentence personalised overview explaining why this protocol is designed for this person",
  "protocol": [
    {
      "day": 1,
      "day_label": "Day 1",
      "modality": "Cryotherapy",
      "modality_key": "cryotherapy",
      "duration_minutes": 3,
      "price_from": 85,
      "reason": "Specific physiological reason referencing their sport and issues...",
      "venue_modality_match": "cryotherapy"
    }
  ]
}

Valid modality_key values: cryotherapy, infrared_sauna, iv_therapy, float_tank,
red_light, cold_plunge, contrast_therapy, compression, hyperbaric_oxygen, sports_massage`

export async function POST(request: NextRequest) {
  try {
    // Instantiate per-request so env vars are definitely resolved
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })

    const body = await request.json()
    const { sport, trainingLoad, issues, goal, city } = body

    const userMessage = `
    Sport/activity: ${Array.isArray(sport) ? sport.join(', ') : sport}
    Training load this week: ${trainingLoad}
    Current issues: ${Array.isArray(issues) && issues.length > 0 ? issues.join(', ') : 'none specified'}
    Primary goal: ${goal}
    Location: ${city}

    Generate a personalised 7-day recovery protocol for this athlete.
    `

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    // Log to Supabase async — don't block the stream
    const logToSupabase = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        await supabase.from('protocol_logs').insert({
          sport: Array.isArray(sport) ? sport : [sport],
          training_load: trainingLoad,
          issues: Array.isArray(issues) ? issues : [issues],
          goal,
          city,
        })
      } catch {
        // Logging failure must never affect the response
      }
    }

    // Fire and forget
    logToSupabase()

    return new Response(stream.toReadableStream())
  } catch (error) {
    console.error('Protocol generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate protocol. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
