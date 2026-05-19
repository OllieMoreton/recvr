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
    options: ['London', 'Manchester', 'Bristol', 'Edinburgh', 'Other UK'],
  },
]

const slideVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export default function ProtocolForm({ onSubmit, isLoading = false }: ProtocolFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProtocolFormData>({
    sport: [],
    trainingLoad: '',
    issues: [],
    goal: '',
    city: '',
  })

  const step = STEPS[currentStep - 1]

  const getValue = (field: typeof step.field): string | string[] => formData[field]

  const isSelected = (field: typeof step.field, option: string): boolean => {
    const value = getValue(field)
    return Array.isArray(value) ? value.includes(option) : value === option
  }

  const toggle = (field: typeof step.field, option: string, multi: boolean) => {
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

  const hasSelection = (): boolean => {
    const value = getValue(step.field)
    return Array.isArray(value) ? value.length > 0 : value !== ''
  }

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <div
      id="protocol-section"
      className="max-w-2xl mx-auto bg-recvr-surface border border-recvr-border rounded-2xl p-5 sm:p-8"
    >
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-recvr-muted">Step {currentStep} of 5</span>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className="h-0.5 flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  s.id <= currentStep ? '#06B6D4' : '#1E2433',
              }}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[240px] sm:min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
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
                          ? 'bg-recvr-cyan/10 border-recvr-cyan text-recvr-cyan'
                          : 'border-recvr-border text-recvr-muted hover:border-cyan-500/50 hover:text-recvr-text'
                      }
                    `}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {step.multi && (
              <p className="text-xs text-recvr-muted/60 mt-4">
                Select all that apply
              </p>
            )}
          </motion.div>
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

        {currentStep < 5 ? (
          <button
            onClick={handleNext}
            disabled={!hasSelection()}
            className="bg-recvr-surface border border-recvr-border text-recvr-text text-sm px-6 py-2.5 rounded-full hover:border-cyan-500/50 hover:text-recvr-cyan transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!hasSelection() || isLoading}
            className="w-full sm:w-auto bg-recvr-cyan text-recvr-bg font-semibold px-8 py-4 rounded-full hover:bg-cyan-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? 'Building...' : 'Build my recovery protocol →'}
          </button>
        )}
      </div>
    </div>
  )
}
