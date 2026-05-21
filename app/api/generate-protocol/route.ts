import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Node.js runtime — @anthropic-ai/sdk requires Node built-ins incompatible with edge
export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are RECVR's AI recovery coach — an ongoing performance recovery system that builds personalised weekly programmes and adapts based on how the athlete's body responds over time. You have deep expertise in exercise physiology and evidence-based recovery modalities including cryotherapy, infrared sauna, IV therapy, float tanks, red light therapy, contrast therapy, compression therapy, and cold plunge.

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
- For each recommendation, include a not_instead_of field that names one specific
  alternative modality the user might assume would work, and explains in one confident
  sentence exactly why that alternative is the wrong choice at this moment. Reference
  specific physiological mechanisms — never say "it's less effective", say WHY it
  would actively work against their goal. Be direct and specific.

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
      "not_instead_of": "Infrared sauna would be counterproductive today — heat stress elevates cortisol and increases systemic inflammation at this stage of your training load, directly opposing the vasoconstriction and cytokine suppression you need post-heavy week.",
      "venue_modality_match": "cryotherapy"
    }
  ]
}

Valid modality_key values: cryotherapy, infrared_sauna, iv_therapy, float_tank,
red_light, cold_plunge, contrast_therapy, compression, hyperbaric_oxygen, sports_massage`

export async function POST(request: NextRequest) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })

    const body = await request.json()
    const { sport, trainingLoad, issues, goal, city, isReturning, previousProtocolSummary, previousResponse } = body

    const baseContext = `
Sport/activity: ${Array.isArray(sport) ? sport.join(', ') : sport}
Training load this week: ${trainingLoad}
Current issues: ${Array.isArray(issues) && issues.length > 0 ? issues.join(', ') : 'none specified'}
Primary goal: ${goal}
Location: ${city}`

    const userMessage = isReturning && previousProtocolSummary
      ? `${baseContext}

RETURNING ATHLETE — Week 2 Programme:
Previous week's programme summary: ${previousProtocolSummary}
How recovery went: ${previousResponse ?? 'not specified'}

Build a Week 2 programme that intelligently progresses from Week 1. Adapt the modality selection and sequencing based on their feedback. If recovery went well, introduce a new complementary modality. If they struggled, consolidate and reduce intensity. Reference the progression explicitly in your summary.`
      : `${baseContext}

Generate a personalised 7-day recovery programme for this athlete.`

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    return new Response(stream.toReadableStream())
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Protocol generation error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
