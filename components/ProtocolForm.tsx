'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProtocolFormData } from '@/lib/types'

interface ProtocolFormProps {
  onSubmit: (data: ProtocolFormData) => void
  isLoading?: boolean
}

const STEPS = [
  {
    id: 1,
    question: "What's your main sport or activity?",
    field: 'sport' as const,
    multi: true,
    options: [
      'Running',
      'Cycling',
      'CrossFit',
      'Gym training',
      'Triathlon',
      'Swimming',
      'Team sports',
      'Other',
    ],
  },
  {
    id: 2,
    question: 'How hard have you been training this week?',
    field: 'trainingLoad' as const,
    multi: false,
    options: [
      'Light (1–2 sessions)',
      'Moderate (3–4)',
      'Heavy (5–6)',
      'Extreme (daily / race week)',
    ],
  },
  {
    id: 3,
    question: 'What are you dealing with right now?',
    field: 'issues' as const,
    multi: true,
    options: [
      'Leg fatigue',
      'Upper body tightness',
      'Lower back',
      'Full body soreness',
      'Injury prevention',
      'Mental fatigue',
      'Nothing specific',
    ],
  },
  {
    id: 4,
    question: "What's your main goal this week?",
    field: 'goal' as const,
    multi: false,
    options: [
      'Recover faster',
      'Reduce inflammation',
      'Boost performance',
      'Prevent injury',
      'General optimisation',
    ],
  },
  {
    id: 5,
    question: 'Where are you based?',
    field: 'city' as const,
    multi: false,
    options: ['London', 'Manchester', 'Bristol', 'Edinburgh'],
  },
  {
    id: 6,
    question: 'When did you last train hard?',
    field: 'lastTrainedHard' as const,
    multi: false,
    options: ['Today', 'Yesterday', '2 days ago', '3+ days ago'],
  },
]

const TOTAL_STEPS = 7

const slideVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

// Tomorrow's date as YYYY-MM-DD for min date on the date input
function getTomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function ProtocolForm({ onSubmit, isLoading = false }: ProtocolFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  // Tracks which step is fully visible — lags behind currentStep by one animation frame
  const [displayedStep, setDisplayedStep] = useState(1)
  const [formData, setFormData] = useState<ProtocolFormData>({
    sport: [],
    trainingLoad: '',
    issues: [],
    goal: '',
    city: '',
    lastTrainedHard: '',
    hasEvent: false,
  })

  // Step 6 — tracks whether the user has made a choice (distinguishes from default false)
  const [hasEventSelected, setHasEventSelected] = useState(false)

  // ─── Steps 1–5 helpers ─────────────────────────────────────────────────────

  const step = currentStep <= 6 ? STEPS[currentStep - 1] : null

  const getValue = (field: (typeof STEPS)[number]['field']): string | string[] =>
    formData[field]

  const isSelected = (field: (typeof STEPS)[number]['field'], option: string): boolean => {
    const value = getValue(field)
    return Array.isArray(value) ? value.includes(option) : value === option
  }

  const toggle = (
    field: (typeof STEPS)[number]['field'],
    option: string,
    multi: boolean
  ) => {
    if (multi) {
      const current = formData[field] as string[]
      const updated = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option]
      setFormData({ ...formData, [field]: updated })
    } else {
      setFormData({ ...formData, [field]: option })
    }
  }

  // ─── Validation ────────────────────────────────────────────────────────────

  const hasSelection = (): boolean => {
    if (currentStep === 7) return hasEventSelected
    if (!step) return false
    const value = getValue(step.field)
    return Array.isArray(value) ? value.length > 0 : value !== ''
  }

  // Step 7 submit button text
  const submitLabel = (): string => {
    if (isLoading) return 'Building...'
    if (formData.hasEvent && formData.eventDate) return 'Build my race programme →'
    return 'Start my programme →'
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  // ─── Step 6 handlers ───────────────────────────────────────────────────────

  const selectYes = () => {
    setHasEventSelected(true)
    setFormData((f) => ({ ...f, hasEvent: true }))
  }

  const selectNo = () => {
    setHasEventSelected(true)
    setFormData((f) => ({ ...f, hasEvent: false, eventDate: undefined }))
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      id="protocol-section"
      className="max-w-2xl mx-auto bg-recvr-surface border border-recvr-border rounded-2xl p-5 sm:p-8"
    >
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-recvr-muted">Step {displayedStep} of {TOTAL_STEPS}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className="h-0.5 flex-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: s <= currentStep ? '#C4813A' : '#1F1F1F' }}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[240px] sm:min-h-[280px]">
        <AnimatePresence mode="wait">
          {/* Steps 1–6 — pill selection */}
          {currentStep <= 6 && step && (
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={(def) => { if (def === 'center') setDisplayedStep(currentStep) }}
            >
              <h2 className="text-xl font-semibold text-recvr-text mb-6">
                {step.question}
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {step.options.map((option) => {
                  const selected = isSelected(step.field, option)
                  return (
                    <button
                      key={option}
                      onClick={() => toggle(step.field, option, step.multi)}
                      className={`
                        px-4 py-2 rounded-full text-sm border transition-all duration-150 cursor-pointer
                        ${
                          selected
                            ? 'bg-recvr-copper/10 border-recvr-cyan text-recvr-cyan'
                            : 'border-recvr-border text-recvr-muted hover:border-recvr-copper/50 hover:text-recvr-text'
                        }
                      `}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              {step.multi && (
                <p className="text-xs text-recvr-muted/60 mt-4">Select all that apply</p>
              )}
            </motion.div>
          )}

          {/* Step 7 — Race countdown */}
          {currentStep === 7 && (
            <motion.div
              key={7}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={(def) => { if (def === 'center') setDisplayedStep(7) }}
            >
              <h2 className="text-xl font-semibold text-recvr-text mb-1">
                Do you have a race or event coming up?
              </h2>
              <p className="text-recvr-muted text-sm mb-6">
                We&apos;ll tailor your programme around your race schedule.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Yes option */}
                <button
                  onClick={selectYes}
                  className={`flex-1 text-left p-4 rounded-2xl border transition-all duration-150 cursor-pointer ${
                    formData.hasEvent && hasEventSelected
                      ? 'bg-recvr-copper/10 border-recvr-cyan'
                      : 'border-recvr-border hover:border-recvr-copper/50'
                  }`}
                >
                  <p className={`font-semibold text-sm mb-0.5 ${formData.hasEvent && hasEventSelected ? 'text-recvr-cyan' : 'text-recvr-text'}`}>
                    Yes, I have an event
                  </p>
                  <p className="text-recvr-muted text-xs">
                    Programme will protect your race-day performance
                  </p>
                </button>

                {/* No option */}
                <button
                  onClick={selectNo}
                  className={`flex-1 text-left p-4 rounded-2xl border transition-all duration-150 cursor-pointer ${
                    !formData.hasEvent && hasEventSelected
                      ? 'bg-recvr-copper/10 border-recvr-cyan'
                      : 'border-recvr-border hover:border-recvr-copper/50'
                  }`}
                >
                  <p className={`font-semibold text-sm mb-0.5 ${!formData.hasEvent && hasEventSelected ? 'text-recvr-cyan' : 'text-recvr-text'}`}>
                    No upcoming event
                  </p>
                  <p className="text-recvr-muted text-xs">
                    Standard recovery optimisation
                  </p>
                </button>
              </div>

              {/* Date input — only shown when Yes is selected */}
              <AnimatePresence>
                {formData.hasEvent && hasEventSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4">
                      <label className="block text-recvr-muted text-xs font-mono tracking-widest uppercase mb-2">
                        When is it?
                      </label>
                      <input
                        type="date"
                        min={getTomorrow()}
                        value={formData.eventDate ?? ''}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, eventDate: e.target.value || undefined }))
                        }
                        style={{ colorScheme: 'dark' }}
                        className="w-full bg-recvr-surface border border-recvr-border text-recvr-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-recvr-cyan transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-recvr-border">
        <button
          onClick={handleBack}
          className={`text-sm text-recvr-muted hover:text-recvr-text transition-colors duration-200 ${
            currentStep === 1 ? 'invisible' : ''
          }`}
        >
          ← Back
        </button>

        {currentStep < TOTAL_STEPS ? (
          <button
            onClick={handleNext}
            disabled={!hasSelection()}
            className="bg-recvr-surface border border-recvr-border text-recvr-text text-sm px-6 py-2.5 rounded-full hover:border-recvr-copper/50 hover:text-recvr-cyan transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!hasSelection() || isLoading}
            className="w-full sm:w-auto bg-recvr-cyan text-recvr-bg font-semibold px-8 py-4 rounded-full hover:bg-recvr-copper-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {submitLabel()}
          </button>
        )}
      </div>
    </div>
  )
}
