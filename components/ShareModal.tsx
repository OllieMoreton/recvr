'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, Check } from 'lucide-react'
import ShareCard from './ShareCard'
import type { Protocol, ProtocolFormData } from '@/lib/types'
import { buildShareUrl, type ShareData } from '@/lib/share-utils'
import { calculateRecoveryScore } from '@/lib/recovery-score'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  protocol: Protocol
  formData: ProtocolFormData
}

export default function ShareModal({ isOpen, onClose, protocol, formData }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const scoreResult = calculateRecoveryScore({
    trainingLoad: formData.trainingLoad,
    issues: formData.issues,
  })

  const shareData: ShareData = {
    sport: formData.sport,
    trainingLoad: formData.trainingLoad,
    score: scoreResult.score,
    scoreLabel: scoreResult.label,
    city: formData.city,
    summary: protocol.summary,
    protocol: protocol.protocol.map((p) => ({
      day: p.day,
      modality: p.modality,
      modality_key: p.modality_key,
      duration_minutes: p.duration_minutes,
      price_from: p.price_from,
    })),
  }

  const shareUrl = buildShareUrl(shareData)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback for browsers without clipboard API
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#080A0F',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = 'recvr-recovery-programme.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error('Download failed', e)
    } finally {
      setDownloading(false)
    }
  }

  const handleNativeShare = async () => {
    if (!navigator.share) return
    try {
      await navigator.share({
        title: 'My RECVR Recovery Programme',
        text: `My recovery readiness score is ${scoreResult.score} — here's my 7-day programme built by RECVR.`,
        url: shareUrl,
      })
    } catch {
      // user cancelled or API unsupported — silent
    }
  }

  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-[#0F1117] border border-[#1E2433] rounded-2xl p-6 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#F8FAFC]">Share your programme</h3>
                  <p className="text-sm text-[#94A3B8] mt-0.5">
                    Download your recovery card or copy a link
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[#1E2433] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Card preview — horizontally scrollable on small screens */}
              <div className="overflow-x-auto pb-2 mb-6 -mx-1 px-1">
                <div ref={cardRef} className="inline-block">
                  <ShareCard
                    protocol={protocol}
                    sport={formData.sport}
                    trainingLoad={formData.trainingLoad}
                    score={scoreResult.score}
                    scoreLabel={scoreResult.label}
                    scoreColor={scoreResult.color}
                    city={formData.city}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#1E2433] text-[#F8FAFC] text-sm font-medium hover:border-[#06B6D4]/50 transition-colors"
                >
                  {copied
                    ? <Check size={16} className="text-[#10B981]" />
                    : <Copy size={16} />}
                  {copied ? 'Link copied' : 'Copy link'}
                </button>

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#1E2433] text-[#F8FAFC] text-sm font-medium hover:border-[#06B6D4]/50 transition-colors disabled:opacity-50"
                >
                  <Download size={16} />
                  {downloading ? 'Generating...' : 'Download card'}
                </button>

                {canNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#06B6D4] text-[#080A0F] text-sm font-semibold hover:bg-cyan-400 transition-colors"
                  >
                    Share →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
