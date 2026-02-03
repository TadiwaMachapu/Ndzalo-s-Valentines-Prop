'use client'

/**
 * RibbonSnake - Segmented ribbon with snake-like unwrap animation
 * 
 * CUSTOMIZATION:
 * - Change segment count: Edit SEGMENT_COUNT below
 * - Adjust unwrap speed: Edit TIMING constants
 * - Change ribbon colors: Edit RIBBON_COLORS
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============ CUSTOMIZATION ============
const SEGMENT_COUNT = 8 // Number of segments per ribbon strip
const TIMING = {
  segmentDelay: 0.12,    // Delay between each segment (seconds)
  segmentDuration: 0.5,  // Duration for each segment to animate out
  bowLoosen: 0.9,        // Bow loosening duration (seconds)
  bowDrop: 0.4,          // Bow drop/fade duration
  shimmerDuration: 1.5,  // Shimmer travel duration
}
const RIBBON_COLORS = {
  primary: '#be185d',
  highlight: '#f472b6',
  shadow: '#831843',
  shimmer: 'rgba(255,255,255,0.6)',
}
// =======================================

interface RibbonSnakeProps {
  phase: 'idle' | 'pulling' | 'unwrapping' | 'done'
  isHovering: boolean
  onUnwrapComplete: () => void
  onTrigger: () => void
  ribbonText?: string
  prefersReducedMotion: boolean
}

export default function RibbonSnake({
  phase,
  isHovering,
  onUnwrapComplete,
  onTrigger,
  ribbonText = 'For Ndzalo 💌',
  prefersReducedMotion,
}: RibbonSnakeProps) {
  const [showShimmer, setShowShimmer] = useState(false)

  useEffect(() => {
    if (phase === 'unwrapping' && !prefersReducedMotion) {
      setShowShimmer(true)
      const timer = setTimeout(() => setShowShimmer(false), TIMING.shimmerDuration * 1000)
      return () => clearTimeout(timer)
    }
  }, [phase, prefersReducedMotion])

  useEffect(() => {
    if (phase === 'unwrapping') {
      // Calculate total unwrap time
      const totalTime = prefersReducedMotion
        ? 600
        : (SEGMENT_COUNT * TIMING.segmentDelay + TIMING.segmentDuration + TIMING.bowLoosen + TIMING.bowDrop) * 1000
      const timer = setTimeout(onUnwrapComplete, totalTime)
      return () => clearTimeout(timer)
    }
  }, [phase, onUnwrapComplete, prefersReducedMotion])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onTrigger()
    }
  }

  // Generate segment data
  const createSegments = (direction: 'left' | 'right' | 'top' | 'bottom') => {
    return Array.from({ length: SEGMENT_COUNT }, (_, i) => {
      const progress = i / (SEGMENT_COUNT - 1)
      const isHorizontal = direction === 'left' || direction === 'right'
      const isReverse = direction === 'right' || direction === 'bottom'
      const index = isReverse ? SEGMENT_COUNT - 1 - i : i

      return {
        id: `${direction}-${i}`,
        index,
        delay: index * TIMING.segmentDelay,
        rotation: (index - SEGMENT_COUNT / 2) * 8, // Curl effect
        wobble: Math.sin(progress * Math.PI) * 6,
        scaleY: 1 - progress * 0.15,
        isHorizontal,
        direction,
      }
    })
  }

  const horizontalLeftSegments = createSegments('left')
  const horizontalRightSegments = createSegments('right')
  const verticalTopSegments = createSegments('top')
  const verticalBottomSegments = createSegments('bottom')

  const segmentWidth = 100 / SEGMENT_COUNT

  const getSegmentStyle = (isHorizontal: boolean) => ({
    background: isHorizontal
      ? `linear-gradient(to bottom, ${RIBBON_COLORS.highlight} 0%, ${RIBBON_COLORS.primary} 30%, ${RIBBON_COLORS.primary} 70%, ${RIBBON_COLORS.shadow} 100%)`
      : `linear-gradient(to right, ${RIBBON_COLORS.shadow} 0%, ${RIBBON_COLORS.primary} 30%, ${RIBBON_COLORS.primary} 70%, ${RIBBON_COLORS.highlight} 100%)`,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  })

  const renderHorizontalSegments = (segments: ReturnType<typeof createSegments>, side: 'left' | 'right') => (
    <div
      className={`absolute top-1/2 -translate-y-1/2 h-8 w-1/2 z-20 flex ${side === 'left' ? 'left-0' : 'right-0'}`}
      style={{ flexDirection: side === 'left' ? 'row-reverse' : 'row' }}
    >
      {segments.map((seg) => (
        <motion.div
          key={seg.id}
          className="h-full relative"
          style={{
            width: `${segmentWidth}%`,
            ...getSegmentStyle(true),
          }}
          initial={{ x: 0, y: 0, rotate: 0, scaleY: 1, opacity: 1 }}
          animate={
            phase === 'unwrapping'
              ? prefersReducedMotion
                ? { opacity: 0 }
                : {
                    x: side === 'left' ? -80 - seg.index * 15 : 80 + seg.index * 15,
                    y: seg.wobble,
                    rotate: side === 'left' ? -seg.rotation : seg.rotation,
                    scaleY: seg.scaleY,
                    opacity: 0,
                  }
              : { x: 0, y: 0, rotate: 0, scaleY: 1, opacity: 1 }
          }
          transition={{
            duration: prefersReducedMotion ? 0.4 : TIMING.segmentDuration,
            delay: prefersReducedMotion ? 0 : seg.delay,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}

      {/* Ribbon text on right side */}
      {side === 'right' && phase !== 'unwrapping' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-xs font-medium tracking-wide whitespace-nowrap"
            style={{
              color: 'rgba(255,255,255,0.7)',
              textShadow: '0 1px 1px rgba(0,0,0,0.3), 0 -1px 0 rgba(255,255,255,0.2)',
            }}
          >
            {ribbonText}
          </span>
        </div>
      )}

      {/* Shimmer effect */}
      {showShimmer && side === 'right' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${RIBBON_COLORS.shimmer} 50%, transparent 100%)`,
            width: '30%',
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '400%' }}
          transition={{ duration: TIMING.shimmerDuration, ease: 'easeInOut' }}
        />
      )}
    </div>
  )

  const renderVerticalSegments = (segments: ReturnType<typeof createSegments>, side: 'top' | 'bottom') => (
    <div
      className={`absolute left-1/2 -translate-x-1/2 w-8 h-1/2 z-20 flex flex-col ${side === 'top' ? 'top-0' : 'bottom-0'}`}
      style={{ flexDirection: side === 'top' ? 'column-reverse' : 'column' }}
    >
      {segments.map((seg) => (
        <motion.div
          key={seg.id}
          className="w-full relative"
          style={{
            height: `${segmentWidth}%`,
            ...getSegmentStyle(false),
          }}
          initial={{ x: 0, y: 0, rotate: 0, scaleX: 1, opacity: 1 }}
          animate={
            phase === 'unwrapping'
              ? prefersReducedMotion
                ? { opacity: 0 }
                : {
                    y: side === 'top' ? -80 - seg.index * 15 : 80 + seg.index * 15,
                    x: seg.wobble,
                    rotate: side === 'top' ? -seg.rotation * 0.5 : seg.rotation * 0.5,
                    scaleX: seg.scaleY,
                    opacity: 0,
                  }
              : { x: 0, y: 0, rotate: 0, scaleX: 1, opacity: 1 }
          }
          transition={{
            duration: prefersReducedMotion ? 0.4 : TIMING.segmentDuration,
            delay: prefersReducedMotion ? 0.1 : seg.delay + 0.15,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
    </div>
  )

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <>
          {/* Horizontal ribbons */}
          {renderHorizontalSegments(horizontalLeftSegments, 'left')}
          {renderHorizontalSegments(horizontalRightSegments, 'right')}

          {/* Vertical ribbons */}
          {renderVerticalSegments(verticalTopSegments, 'top')}
          {renderVerticalSegments(verticalBottomSegments, 'bottom')}

          {/* Bow */}
          <motion.button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-pink-500 rounded-full"
            onClick={onTrigger}
            onKeyDown={handleKeyDown}
            aria-label="Open gift"
            initial={{ scale: 1, y: 0, opacity: 1 }}
            animate={
              phase === 'pulling'
                ? { scale: [1, 0.85, 1.05, 1] }
                : phase === 'unwrapping'
                ? prefersReducedMotion
                  ? { opacity: 0 }
                  : { scale: [1, 1.15, 0.3], y: [0, -5, 30], opacity: [1, 1, 0] }
                : isHovering && !prefersReducedMotion
                ? { scale: 1.1, y: -3 }
                : { scale: 1, y: 0 }
            }
            transition={
              phase === 'pulling'
                ? { duration: 0.5 }
                : phase === 'unwrapping'
                ? { duration: TIMING.bowLoosen + TIMING.bowDrop, ease: [0.4, 0, 0.2, 1] }
                : { type: 'spring', stiffness: 300, damping: 20 }
            }
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative w-20 h-16">
              {/* Left loop */}
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-12 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${RIBBON_COLORS.highlight} 0%, ${RIBBON_COLORS.primary} 50%, ${RIBBON_COLORS.shadow} 100%)`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transform: 'rotate(-30deg)',
                }}
                animate={
                  phase === 'unwrapping' && !prefersReducedMotion
                    ? { scale: [1, 1.3, 1.4, 0], rotate: [-30, -20, -60], x: [-5, -10, -20] }
                    : {}
                }
                transition={{ duration: TIMING.bowLoosen, ease: 'easeOut' }}
              />
              {/* Right loop */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-12 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${RIBBON_COLORS.highlight} 0%, ${RIBBON_COLORS.primary} 50%, ${RIBBON_COLORS.shadow} 100%)`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transform: 'rotate(30deg)',
                }}
                animate={
                  phase === 'unwrapping' && !prefersReducedMotion
                    ? { scale: [1, 1.3, 1.4, 0], rotate: [30, 20, 60], x: [5, 10, 20] }
                    : {}
                }
                transition={{ duration: TIMING.bowLoosen, ease: 'easeOut' }}
              />
              {/* Center knot */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-10"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${RIBBON_COLORS.highlight}, ${RIBBON_COLORS.primary} 60%, ${RIBBON_COLORS.shadow})`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              />
            </div>
          </motion.button>

          {/* Ribbon Tail (pullable) */}
          <motion.button
            className="absolute top-1/2 right-4 z-30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            onClick={onTrigger}
            onKeyDown={handleKeyDown}
            aria-label="Pull ribbon to open"
            style={{ transform: 'translateY(-50%)' }}
            animate={
              phase === 'pulling'
                ? { x: 50, rotate: 20, opacity: 0 }
                : phase === 'unwrapping'
                ? { opacity: 0 }
                : isHovering && !prefersReducedMotion
                ? { x: [0, 6, 0], rotate: [0, 8, 0] }
                : { x: 0, rotate: 0 }
            }
            transition={
              phase === 'pulling'
                ? { duration: 0.5 }
                : isHovering
                ? { duration: 0.8, repeat: Infinity }
                : { duration: 0.3 }
            }
          >
            <div
              className="w-14 h-7 relative"
              style={{
                background: `linear-gradient(to bottom, ${RIBBON_COLORS.highlight} 0%, ${RIBBON_COLORS.primary} 50%, ${RIBBON_COLORS.shadow} 100%)`,
                clipPath: 'polygon(0 0, 100% 15%, 85% 50%, 100% 85%, 0 100%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
