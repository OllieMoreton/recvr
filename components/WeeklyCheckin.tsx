'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { parseProtocolFromStream } from '@/lib/parseProtocol'
import { calculateRecoveryScore } from '@/lib/recovery-score'
import type { Protocol, ProtocolFormData } from '@/lib/types'

interface WeeklyCheckinProps {
  formData: ProtocolFormData
  currentProtocol: Protocol
  weekNumber: number
  currentIssues: string[]
  onNewProtocol: (protocol: Protocol, response: string, newIssues: string[]) => void
}

const RECOVERY_RATINGS = [
  { value: 'great', label: '💪 Felt great', description: 'Noticeably less soreness, better energy' },
  { value: 'good', label: '👍 Mostly good', description: 'Improvements but still some fatigue' },
  { value: 'okay', label: '😐 Mixed results', description: 'Some days better, some not' },
  { value: 'poor', label: '😕 Still struggling', description: 'Not much improvement' },
]

const ISSUE_OPTIONS = [
  'Still fatigued',
  'New soreness',
  'Sleep issues',
  'Lower back',
  'Leg heaviness',
  'Mental fatigue',
  'Feeling strong',
]

export default function WeeklyCheckin({
  formData,
  currentProtocol,
  weekNumber,
  currentIssues,
  onNewProtocol,
}: WeeklyCheckinProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [rating, setRating] = useState('')
  const [newIssues, setNewIssues] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  // Pending state — holds the generated protocol while showing the comparison banner
  const [pendingProtocol, setPendingProtocol] = useState<Protocol | null>(null)

  const toggleIssue = (issue: string) => {
    setNewIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    )
  }

  const handleSubmit = async () => {
    if (!rating) return
    setIsLoading(true)
    setError('')

    try {
      const issuesForNext = newIssues.length > 0 ? newIssues : currentIssues

      const res = await fetch('/api/generate-protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isReturning: true,
          previousProtocolSummary: currentProtocol.summary,
          previousResponse: rating,
          issues: issuesForNext,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errData.error ?? `HTTP ${res.status}`)
      }

      const raw = await res.text()
      const parsed = parseProtocolFromStream(raw)

      if (!parsed || !parsed.protocol || parsed.protocol.length === 0) {
        throw new Error(`Failed to generate Week ${weekNumber + 1} programme. Please try again.`)
      }

      // Show comparison banner before transitioning
      setPendingProtocol(parsed)
      setIsLoading(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setIsLoading(false)
    }
  }

  const handleProceed = () => {
    if (!pendingProtocol) return
    const issuesForNext = newIssues.length > 0 ? newIssues : currentIssues
    onNewProtocol(pendingProtocol, rating, issuesForNext)
  }

  // Score comparison
  const previousScore = calculateRecoveryScore({
    trainingLoad: formData.trainingLoad,
    issues: currentIssues,
  })
  const newScore = pendingProtocol
    ? calculateRecoveryScore({
        trainingLoad: formData.trainingLoad,
        issues: newIssues.length > 0 ? newIssues : currentIssues,
        previousResponse: rating,
      })
    : null

  const scoreDelta = newScore ? newScore.score - previousScore.score : 0
  const scoreImproved = scoreDelta >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-6 bg-recvr-surface border border-recvr-border rounded-2xl overflow-hidden"
    >
      {/* Header — always visible (hidden when comparison is showing) */}
      {!pendingProtocol && (
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-recvr-bg/50 transition-colors"
        >
          <div>
            <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-1">
              Week {weekNumber + 1}
            </p>
            <h3 className="text-recvr-text font-semibold">
              Ready for Week {weekNumber + 1}?
            </h3>
            <p className="text-recvr-muted text-sm mt-0.5">
              Tell your coach how Week {weekNumber} went
            </p>
          </div>
          <div
            className={`text-recvr-cyan transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </div>
        </button>
      )}

      {/* Expandable form */}
      <AnimatePresence>
        {isExpanded && !pendingProtocol && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-recvr-border pt-5">
              {/* Rating */}
              <h4 className="text-recvr-text text-sm font-medium mb-3">
                How did your recovery feel this week?
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {RECOVERY_RATINGS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRating(r.value)}
                    className={`text-left p-3 rounded-xl border text-sm transition-all ${
                      rating === r.value
                        ? 'border-recvr-cyan bg-recvr-cyan/10 text-recvr-text'
                        : 'border-recvr-border text-recvr-muted hover:border-cyan-500/50 hover:text-recvr-text'
                    }`}
                  >
                    <span className="block font-medium mb-0.5">{r.label}</span>
                    <span className="text-xs opacity-70">{r.description}</span>
                  </button>
                ))}
              </div>

              {/* Issues */}
              <h4 className="text-recvr-text text-sm font-medium mb-3">
                Any issues going into Week {weekNumber + 1}?
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {ISSUE_OPTIONS.map((issue) => (
                  <button
                    key={issue}
                    onClick={() => toggleIssue(issue)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      newIssues.includes(issue)
                        ? 'border-recvr-cyan bg-recvr-cyan/10 text-recvr-cyan'
                        : 'border-recvr-border text-recvr-muted hover:border-cyan-500/50 hover:text-recvr-text'
                    }`}
                  >
                    {issue}
                  </button>
                ))}
              </div>

              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!rating || isLoading}
                className="w-full bg-recvr-cyan text-recvr-bg font-semibold py-3 rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading
                  ? `Building Week ${weekNumber + 1} programme...`
                  : `Build Week ${weekNumber + 1} programme →`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score comparison + proceed — shown when new protocol is ready */}
      <AnimatePresence>
        {pendingProtocol && newScore && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6"
          >
            <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-4">
              Week {weekNumber + 1} ready
            </p>

            {/* Score comparison banner */}
            {scoreDelta !== 0 && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E2433] bg-[#0F1117] mb-4">
                <span className="text-sm text-[#94A3B8]">Recovery score</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#94A3B8]">{previousScore.score}</span>
                  <span className="text-[#94A3B8]">→</span>
                  <span
                    className="font-mono font-semibold"
                    style={{ color: scoreImproved ? '#10B981' : '#F97316' }}
                  >
                    {newScore.score}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: scoreImproved ? '#10B981' : '#F97316' }}
                  >
                    {scoreImproved ? '+' : ''}
                    {scoreDelta}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleProceed}
              className="w-full bg-recvr-cyan text-recvr-bg font-semibold py-3 rounded-xl hover:bg-cyan-400 transition-colors text-sm"
            >
              View Week {weekNumber + 1} programme →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
