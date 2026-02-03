'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SecretLetterProps {
  isOpen: boolean
  onClose: () => void
}

export default function SecretLetter({ isOpen, onClose }: SecretLetterProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay with blur */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Letter modal content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 w-auto sm:w-[500px] max-w-full z-[999]"
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div
              className="relative rounded-t-3xl sm:rounded-3xl p-8 sm:p-10 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
              }}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-900/10 hover:bg-amber-900/20 flex items-center justify-center transition-colors"
                aria-label="Close letter"
              >
                <span className="text-amber-900/60">✕</span>
              </button>

              {/* Letter header */}
              <div className="mb-6 text-center">
                <motion.div
                  className="inline-block"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <span className="text-4xl" aria-hidden="true">💌</span>
                </motion.div>
                <h2 id="letter-title" className="sr-only">Secret Love Letter</h2>
              </div>

              {/* Letter content - handwritten font */}
              <motion.div
                className="relative z-10 font-dancing text-amber-950/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-2xl sm:text-3xl leading-relaxed mb-4">
                  Ndzalo,
                </p>
                <p className="text-xl sm:text-2xl leading-relaxed mb-4">
                  I don&apos;t always say it out loud, but you&apos;re my favorite part of every day.
                </p>
                <p className="text-xl sm:text-2xl leading-relaxed mb-4">
                  I love the way you make ordinary moments feel special.
                </p>
                <p className="text-xl sm:text-2xl leading-relaxed mb-4">
                  This Valentine&apos;s, I just want time with you — laughs, good food, and a memory we&apos;ll keep.
                </p>
                <p className="text-xl sm:text-2xl leading-relaxed mb-2">
                  Will you be my date?{' '}
                  <motion.span
                    className="inline-block"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    💗
                  </motion.span>
                </p>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute top-6 left-6 text-2xl opacity-20">🌹</div>
              <div className="absolute bottom-6 right-6 text-2xl opacity-20">🌹</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
