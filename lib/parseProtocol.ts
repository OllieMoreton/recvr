import type { Protocol } from './types'

/**
 * Parses a raw NDJSON stream body from the Anthropic SDK's toReadableStream().
 * Each line is a MessageStreamEvent object. We accumulate text_delta text
 * and parse the final JSON.
 */
export function parseProtocolFromStream(raw: string): Protocol | null {
  let accumulated = ''

  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      const event = JSON.parse(trimmed)
      if (
        event.type === 'content_block_delta' &&
        event.delta?.type === 'text_delta'
      ) {
        accumulated += event.delta.text
      }
    } catch {
      // non-JSON line — skip
    }
  }

  const text = accumulated.trim()
  if (!text) return null

  try {
    return JSON.parse(text) as Protocol
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) as Protocol } catch { /* fall through */ }
    }
    return null
  }
}
