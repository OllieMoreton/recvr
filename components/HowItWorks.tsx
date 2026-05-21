'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Brain, CalendarCheck } from 'lucide-react'

const STEPS = [
  {
    icon: Zap,
    title: 'Tell us how you\'re training',
    description: 'Answer 5 quick questions about your sport, load, and goals.',
    number: '01',
  },
  {
    icon: Brain,
    title: 'Get your AI recovery programme',
    description: 'Your coach maps your context to evidence-based recovery science.',
    number: '02',
  },
  {
    icon: CalendarCheck,
    title: 'Book in one click',
    description: 'Protocols link directly to vetted venues near you.',
    number: '03',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
            The process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-recvr-text">
            How it works
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                className="flex flex-col items-start"
              >
                {/* Icon */}
                <div className="bg-recvr-copper/10 text-recvr-cyan p-4 rounded-2xl mb-5">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Step number */}
                <p className="text-recvr-muted/40 text-xs font-mono tracking-widest uppercase mb-2">
                  {step.number}
                </p>

                <h3 className="text-recvr-text font-semibold text-lg leading-snug mb-2">
                  {step.title}
                </h3>
                <p className="text-recvr-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
