'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { calculateRecoveryScore, type ScoreInput } from '@/lib/recovery-score'

interface RecoveryScoreProps {
  input: ScoreInput
}

export default function RecoveryScore({ input }: RecoveryScoreProps) {
  // Memoize so projectedGain stays stable across re-renders
  const result = useMemo(
    () => calculateRecoveryScore(input),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input.trainingLoad, JSON.stringify(input.issues), input.previousResponse]
  )

  const [displayScore, setDisplayScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const duration = 1400
    const steps = 60
    const increment = result.score / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= result.score) {
        setDisplayScore(result.score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [result.score])

  // SVG arc
  const size = 160
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = mounted
    ? circumference - (result.score / 100) * circumference
    : circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 p-6 rounded-2xl border border-[#1F1F1F] bg-[#111111]"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono text-[#8A8480] uppercase tracking-widest">
          Recovery Readiness
        </span>
        <span className="text-xs font-mono text-[#8A8480]">This week</span>
      </div>

      {/* Ring + details — stacks on mobile */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        {/* Score ring */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
          >
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#1F1F1F"
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={result.ringColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${result.ringColor}60)` }}
            />
          </svg>
          {/* Score number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-bold font-mono leading-none"
              style={{ color: result.color }}
            >
              {displayScore}
            </span>
            <span className="text-xs text-[#8A8480] mt-1">/ 100</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <span className="text-lg font-semibold block mb-3" style={{ color: result.color }}>
            {result.label}
          </span>

          <div className="space-y-2 mb-4">
            {result.drivers.map((driver, i) => (
              <div key={i} className="flex items-start gap-2 justify-center sm:justify-start">
                <div
                  className="w-1 h-1 rounded-full mt-2 shrink-0"
                  style={{ backgroundColor: result.color }}
                />
                <span className="text-xs text-[#8A8480] leading-relaxed text-left">
                  {driver}
                </span>
              </div>
            ))}
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{
              backgroundColor: `${result.color}15`,
              color: result.color,
              border: `1px solid ${result.color}30`,
            }}
          >
            Complete this programme → +{result.projectedGain} projected
          </div>
        </div>
      </div>
    </motion.div>
  )
}
