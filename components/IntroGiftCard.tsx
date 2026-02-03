'use client'

/**
 * IntroGiftCard - Premium Gift-Wrapped Valentine Card with Snake Ribbon Unwrap
 * 
 * CUSTOMIZATION:
 * - Change ribbon text: Edit RIBBON_TEXT constant below
 * - Adjust timing: Edit TIMING constant below
 * 
 * IMAGES:
 * - Place photos in /public/ndzalo/ folder
 * - Name them: 1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg, 6.jpg
 * - Photos appear on book pages during the opening sequence
 */

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RibbonSnake from './RibbonSnake'
import ElegantEnvelope from './ElegantEnvelope'

// ============ CUSTOMIZATION ============
const RIBBON_TEXT = 'For Ndzalo 💌'
const TIMING = {
  pull: 500,              // Phase 1: Pull duration (ms)
  openHold: 700,          // How long to hold book open before transition
  transitionDuration: 600, // Cinematic transition duration (ms)
  sparkleDuration: 800,   // Sparkle burst duration (ms)
}

const PHOTOS = [
  '/photos/WhatsApp Image 2026-02-02 at 22.56.13.jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.15.jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.15 (1).jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.16.jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.16 (1).jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.17.jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.17 (1).jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.17 (2).jpeg',
]
// =======================================

type Phase = 'idle' | 'pulling' | 'unwrapping' | 'opening' | 'flipping' | 'open_hold' | 'transition' | 'done'

interface IntroGiftCardProps {
  recipientName: string
  onComplete: () => void
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  type: 'heart' | 'sparkle'
}

export default function IntroGiftCard({ recipientName, onComplete }: IntroGiftCardProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleChange)
    return () => motionQuery.removeEventListener('change', handleChange)
  }, [])

  const createSparkles = useCallback(() => {
    if (!mounted) return
    const newSparkles: Sparkle[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 140,
      y: (Math.random() - 0.5) * 140,
      size: 10 + Math.random() * 18,
      rotation: Math.random() * 360,
      type: Math.random() > 0.4 ? 'heart' : 'sparkle',
    }))
    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), TIMING.sparkleDuration)
  }, [mounted])

  // Phase transitions
  const startOpenSequence = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('pulling')
    setTimeout(() => setPhase('unwrapping'), TIMING.pull)
  }, [phase])

  const handleUnwrapComplete = useCallback(() => {
    createSparkles()
    setPhase('opening')
  }, [createSparkles])

  const handleBookOpenComplete = useCallback(() => {
    setPhase('flipping')
  }, [])

  const handlePagesComplete = useCallback(() => {
    setPhase('open_hold')
    setTimeout(() => {
      setPhase('transition')
      setTimeout(() => {
        setPhase('done')
        onComplete()
      }, TIMING.transitionDuration)
    }, TIMING.openHold)
  }, [onComplete])

  // Determine envelope phase for ElegantEnvelope component
  const getEnvelopePhase = (): 'closed' | 'opening' | 'revealing' | 'complete' => {
    switch (phase) {
      case 'idle':
      case 'pulling':
      case 'unwrapping':
        return 'closed'
      case 'opening':
        return 'opening'
      case 'flipping':
        return 'revealing'
      case 'open_hold':
        return 'revealing'
      case 'transition':
      case 'done':
        return 'complete'
      default:
        return 'closed'
    }
  }

  // Determine ribbon phase for RibbonSnake component
  const getRibbonPhase = (): 'idle' | 'pulling' | 'unwrapping' | 'done' => {
    if (phase === 'idle') return 'idle'
    if (phase === 'pulling') return 'pulling'
    if (phase === 'unwrapping') return 'unwrapping'
    return 'done'
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Main Gift Card Container - Only show until transition starts */}
      <AnimatePresence mode="wait">
        {phase !== 'transition' && phase !== 'done' && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.92 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
        {/* Card shake on pull */}
        <motion.div
          animate={phase === 'pulling' ? { 
            x: [0, -4, 4, -3, 3, 0], 
            rotate: [0, -0.8, 0.8, -0.5, 0.5, 0] 
          } : {}}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Elegant Envelope Container */}
          <div className="relative">
            {/* Elegant Envelope */}
            <ElegantEnvelope
              phase={getEnvelopePhase()}
              images={PHOTOS}
              recipientName={recipientName}
              onOpenComplete={handleBookOpenComplete}
              onRevealComplete={handlePagesComplete}
              prefersReducedMotion={prefersReducedMotion}
            />

            {/* Ribbon Snake (overlays the book when not opened) */}
            <div className="absolute inset-0 z-30">
              <RibbonSnake
                phase={getRibbonPhase()}
                isHovering={isHovering}
                onUnwrapComplete={handleUnwrapComplete}
                onTrigger={startOpenSequence}
                ribbonText={RIBBON_TEXT}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            {/* Sparkle Burst */}
            <AnimatePresence>
              {sparkles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
                  {sparkles.map((sparkle) => (
                    <motion.div
                      key={sparkle.id}
                      className="absolute"
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                      animate={{ 
                        x: sparkle.x, 
                        y: sparkle.y, 
                        scale: [0, 1.3, 1],
                        opacity: [1, 1, 0],
                        rotate: sparkle.rotation
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{ fontSize: sparkle.size }}
                    >
                      {sparkle.type === 'heart' ? '💖' : '✨'}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt Text */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.p
              className="text-white/90 text-lg font-medium font-poppins flex items-center gap-2 justify-center"
              animate={!prefersReducedMotion ? { y: [0, -4, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>✨</span>
              <span>Pull the ribbon to open your gift</span>
              <span>🎀</span>
            </motion.p>
            <motion.p
              className="text-white/50 text-sm mt-2 font-poppins"
              animate={!prefersReducedMotion ? { opacity: [0.5, 0.8, 0.5] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              (tap the bow if you want)
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Transition Glow */}
      <AnimatePresence>
        {phase === 'transition' && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Soft pink/white glow bloom from center */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at center, rgba(251,207,232,0.4) 0%, rgba(251,207,232,0.1) 40%, transparent 70%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
