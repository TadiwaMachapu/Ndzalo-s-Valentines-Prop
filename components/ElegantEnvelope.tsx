'use client'

/**
 * ElegantEnvelope - Premium envelope opening animation
 * 
 * DESIGN:
 * - Luxury envelope with wax seal
 * - Smooth flap opening reveal
 * - Card slides out elegantly
 * - Subtle shimmer and glow effects
 * - Photos appear as polaroids floating out
 * 
 * PHASES:
 * - closed: Envelope sealed with wax seal
 * - opening: Flap opens, seal breaks
 * - revealing: Card slides out with photos
 * - complete: Fade to proposal screen
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ElegantEnvelopeProps {
  phase: 'closed' | 'opening' | 'revealing' | 'complete'
  images: string[]
  recipientName: string
  onOpenComplete: () => void
  onRevealComplete: () => void
  prefersReducedMotion: boolean
}

const TIMING = {
  flapOpen: 1.2,        // Flap opening duration (seconds)
  cardSlide: 1.4,       // Card sliding out duration
  photoFloat: 0.8,      // Each photo floating duration
  photoStagger: 0.12,   // Delay between photos
  holdDuration: 1200,   // Hold before transition (ms)
}

export default function ElegantEnvelope({
  phase,
  images,
  recipientName,
  onOpenComplete,
  onRevealComplete,
  prefersReducedMotion,
}: ElegantEnvelopeProps) {
  const [showPhotos, setShowPhotos] = useState(false)

  // Handle flap opening complete
  useEffect(() => {
    if (phase === 'opening') {
      const timer = setTimeout(() => {
        onOpenComplete()
      }, TIMING.flapOpen * 1000)
      return () => clearTimeout(timer)
    }
  }, [phase, onOpenComplete])

  // Handle card reveal complete
  useEffect(() => {
    if (phase === 'revealing') {
      setShowPhotos(true)
      const timer = setTimeout(() => {
        onRevealComplete()
      }, (TIMING.cardSlide + images.length * TIMING.photoStagger + TIMING.photoFloat) * 1000 + TIMING.holdDuration)
      return () => clearTimeout(timer)
    }
  }, [phase, images.length, onRevealComplete])

  return (
    <div className="relative w-80 sm:w-96 md:w-[420px] h-[500px] sm:h-[560px]">
      {/* Envelope Container */}
      <div
        className="relative w-full h-full"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Envelope Body */}
        <motion.div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)',
          }}
          animate={
            phase === 'complete'
              ? { opacity: 0, scale: 0.95, y: -20 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 0.6 }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Envelope edges/seams */}
          <div
            className="absolute inset-x-8 top-0 h-[2px]"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.08) 80%, transparent)',
            }}
          />
          <div
            className="absolute inset-y-8 left-0 w-[2px]"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.08) 80%, transparent)',
            }}
          />
          <div
            className="absolute inset-y-8 right-0 w-[2px]"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.08) 80%, transparent)',
            }}
          />

          {/* Inner card (slides out) */}
          <AnimatePresence>
            {phase === 'revealing' && (
              <motion.div
                className="absolute inset-8 rounded-md overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -520, opacity: 1 }}
                transition={{
                  duration: TIMING.cardSlide,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Card content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <motion.div
                    className="text-6xl mb-6"
                    animate={!prefersReducedMotion ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    💖
                  </motion.div>
                  <h2 className="text-2xl font-bold text-rose-600 text-center mb-3 font-sora">
                    {recipientName}
                  </h2>
                  <p className="text-gray-600 text-center text-sm font-poppins">
                    Something special awaits...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Envelope Flap (opens upward) */}
        <motion.div
          className="absolute inset-x-0 top-0 h-48 origin-top"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center',
            zIndex: 10,
          }}
          initial={{ rotateX: 0 }}
          animate={
            phase === 'opening' || phase === 'revealing' || phase === 'complete'
              ? { rotateX: prefersReducedMotion ? 0 : -165 }
              : { rotateX: 0 }
          }
          transition={{
            duration: TIMING.flapOpen,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Flap front (visible when closed) */}
          <div
            className="absolute inset-0 rounded-t-lg"
            style={{
              background: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backfaceVisibility: 'hidden',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          >
            {/* Paper texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />

            {/* Flap edge shadow */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.08) 100%)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />
          </div>

          {/* Flap back (visible when open) */}
          <div
            className="absolute inset-0 rounded-t-lg"
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          />
        </motion.div>

        {/* Wax Seal (breaks when opening) */}
        <AnimatePresence>
          {phase === 'closed' && (
            <motion.div
              className="absolute left-1/2 top-36 -translate-x-1/2 z-20"
              initial={{ scale: 1, opacity: 1 }}
              exit={{
                scale: [1, 1.1, 0.8],
                opacity: [1, 0.8, 0],
                rotate: [0, -5, 5],
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Seal circle */}
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #dc2626, #991b1b)',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                }}
              >
                {/* Seal texture */}
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                />
                {/* Heart emblem */}
                <span className="text-2xl relative z-10">❤️</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Photos (appear during reveal) */}
        <AnimatePresence>
          {showPhotos && phase === 'revealing' && (
            <div className="absolute inset-0 pointer-events-none">
              {images.slice(0, 6).map((src, index) => {
                const angle = (index / 6) * 360
                const radius = 180
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius - 100

                return (
                  <motion.div
                    key={`photo-${index}`}
                    className="absolute left-1/2 top-1/2"
                    initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 0 }}
                    animate={{
                      x,
                      y,
                      scale: [0, 1.1, 1],
                      rotate: (index - 3) * 8,
                      opacity: [0, 1, 1],
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: TIMING.photoFloat,
                      delay: index * TIMING.photoStagger + TIMING.cardSlide * 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    {/* Polaroid frame */}
                    <div
                      className="relative bg-white p-2 pb-8 rounded-sm"
                      style={{
                        width: '80px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="relative w-16 h-16 overflow-hidden bg-gray-100">
                        <Image
                          src={src}
                          alt={`Memory ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Subtle shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
          animate={
            phase === 'closed' && !prefersReducedMotion
              ? {
                  background: [
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                  ],
                  backgroundPosition: ['-200% 0', '200% 0'],
                }
              : {}
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </div>
  )
}
