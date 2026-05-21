import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Node.js runtime — @anthropic-ai/sdk requires Node built-ins incompatible with edge
export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are RECVR's recovery coach. You build practical, personalised weekly recovery programmes for serious athletes. You speak as a knowledgeable performance coach — direct, specific, and immediately useful. Not a researcher, not a wellness influencer.

PROTOCOL STRUCTURE:
- Recommend exactly 3–4 treatments across 7 days. Rest days are part of the programme.
- Use the athlete's last hard training session to anchor your day sequencing:
  - Trained hard TODAY: Day 1 should be gentle (sports massage, float, or red light). Cryotherapy is fine Day 1 post-session. No sauna on Day 1.
  - Trained hard YESTERDAY: Day 1 can include cryotherapy. Save parasympathetic modalities (float, sauna) for Day 2–3.
  - 2+ days since last hard session: more flexibility — lead with whatever addresses their stated issues most directly.
- Never put heat and cold on the same day.
- Only recommend compression if the athlete specifically mentioned leg fatigue or circulation issues.

SUMMARY — write in second person, directly to this athlete:
- Name their specific sport and primary issues in the first sentence. Never open with "Based on your..." or "Given your training context..."
- Be specific about what this week's protocol is targeting and why. 2–3 sentences maximum.

PRIORITY_PICK — one sentence only:
- Start exactly with: "If you do one thing this week:"
- Name the single most important modality for this person right now and say specifically why it matters for them.

REASON — per recommendation:
- Reference the athlete's specific sport, load, and issues. "Your heavy running week will have..." not "Heavy training causes..."
- Explain the mechanism in plain language a serious athlete would understand — not dumbed down, not academic.
- Connect to what they actually said. 2 sentences.

TIMING_NOTE — per recommendation:
- When to do this treatment relative to training. Specific in hours, not vague.
- Example: "Best 12–24h after your last session. Avoid scheduling within 3h of a hard effort."
- 1–2 sentences.

SESSION_NOTE — per recommendation:
- Exactly what to ask for and do at the venue. Temperature, duration, equipment type, positioning.
- Example: "Request whole-body chamber, not localised. 3 min at −85°C or colder. Wear dry socks and gloves."
- This is what the athlete reads before walking through the door. 1–2 sentences.

NOT_INSTEAD_OF — per recommendation:
- Name one modality the athlete might think is equivalent, and explain why it specifically doesn't work here.
- Write as a coach: what goes wrong mechanically, not just "less effective". 1 sentence.

OUTPUT: Valid JSON only. No markdown, no preamble, nothing outside the JSON object.

{
  "summary": "...",
  "priority_pick": "If you do one thing this week: ...",
  "protocol": [
    {
      "day": 1,
      "day_label": "Day 1",
      "modality": "Cryotherapy",
      "modality_key": "cryotherapy",
      "duration_minutes": 3,
      "price_from": 85,
      "reason": "...",
      "timing_note": "...",
      "session_note": "...",
      "not_instead_of": "...",
      "venue_modality_match": "cryotherapy"
    }
  ]
}

Valid modality_key values: cryotherapy, infrared_sauna, iv_therapy, float_tank, red_light, cold_plunge, contrast_therapy, compression, hyperbaric_oxygen, sports_massage`

export async function POST(request: NextRequest) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })

    const body = await request.json()
    const {
      sport,
      trainingLoad,
      issues,
      goal,
      city,
      lastTrainedHard,
      isReturning,
      previousProtocolSummary,
      previousResponse,
      hasEvent,
      eventDate,
    } = body

    const weeksToEvent: number | null =
      hasEvent && eventDate
        ? Math.ceil(
            (new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)
          )
        : null

    const userMessage = `Sport/activity: ${Array.isArray(sport) ? sport.join(', ') : sport}
Training load this week: ${trainingLoad}
Last hard training session: ${lastTrainedHard || 'not specified'}
Current issues: ${Array.isArray(issues) && issues.length > 0 ? issues.join(', ') : 'none specified'}
Primary goal: ${goal}
Location: ${city}
${weeksToEvent !== null ? `Race/event in: ${weeksToEvent} weeks (${eventDate})` : 'No upcoming event'}
${previousProtocolSummary ? `Last week's protocol: ${previousProtocolSummary}` : ''}
${previousResponse ? `How they responded: ${previousResponse}` : ''}
${
  weeksToEvent !== null && weeksToEvent <= 2
    ? '\nCRITICAL: Athlete is within 2 weeks of their event. Prioritise low-stress, restorative modalities only. No heavy cold exposure within 5 days of race. Focus on parasympathetic activation and muscle priming. This protocol must protect race-day performance above all else.'
    : weeksToEvent !== null && weeksToEvent <= 6
    ? '\nAthlete is in race build phase. Balance recovery intensity with maintaining training adaptation. Avoid modalities that cause excessive fatigue.'
    : ''
}
${isReturning ? '\nThis is a returning athlete. Adapt the protocol based on how they responded last week.' : '\nGenerate a personalised 7-day recovery programme for this athlete.'}`

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    return new Response(stream.toReadableStream())
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Protocol generation error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
