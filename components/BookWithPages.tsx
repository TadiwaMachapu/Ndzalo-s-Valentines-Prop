'use client'

/**
 * BookWithPages - REALISTIC 3D book with curved page turns
 * 
 * ARCHITECTURE:
 * - Book container with perspective (1400px)
 * - Visible spine in center with depth
 * - Left/Right covers with thickness illusion
 * - Page stack with individual page components
 * - Each page has curl effect, dynamic shadows, and highlights
 * 
 * CUSTOMIZATION:
 * - Adjust perspective: BOOK_CONFIG.perspective
 * - Change timing: TIMING constants
 * - Page count: automatically matches images.length (max 10)
 * 
 * REALISTIC PAGE TURN:
 * - Pages rotate with scaleX compression at mid-turn (curvature illusion)
 * - Dynamic shadow overlay changes with rotation progress
 * - Highlight gradient near fold edge
 * - Subtle rotateZ wobble for organic feel
 * - Pages behind have stacked offset for thickness
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'

// ============ CUSTOMIZATION ============
const BOOK_CONFIG = {
  perspective: 1400,        // 3D perspective depth
  spineWidth: 12,           // Visible spine width (px)
  coverThickness: 4,        // Cover edge thickness (px)
  pageStackOffset: 0.8,     // Offset between stacked pages (px)
}

const TIMING = {
  coverOpen: 1.5,           // Duration for covers to open (seconds)
  pageFlipDelay: 0.15,      // Delay between each page flip (seconds)
  pageFlipDuration: 0.95,   // Duration of each page flip (seconds)
  holdDuration: 700,        // How long to hold open before transition (ms)
}

const PAGE_CAPTIONS = [
  'Memory #1 💕',
  'Memory #2 💖',
  'Memory #3 💗',
  'Memory #4 💝',
  'Memory #5 💞',
  'Memory #6 💘',
  'Memory #7 💗',
  'Memory #8 💖',
]
// =======================================

interface BookWithPagesProps {
  phase: 'closed' | 'opening' | 'flipping' | 'open' | 'done'
  images: string[]
  recipientName: string
  onOpenComplete: () => void
  onPagesComplete: () => void
  prefersReducedMotion: boolean
}

/**
 * RealisticPage - Individual page component with curl effect and dynamic shadows
 * 
 * LAYERS:
 * A) Base page with photo content and paper texture
 * B) Shadow overlay - darkens during turn (linked to rotation)
 * C) Highlight overlay - bright gradient near fold edge
 * D) Cast shadow - shadow projected onto pages beneath
 */
interface RealisticPageProps {
  src: string
  caption: string
  index: number
  isFlipped: boolean
  isCurrentlyFlipping: boolean
  zIndex: number
  stackOffset: number
  prefersReducedMotion: boolean
}

function RealisticPage({
  src,
  caption,
  index,
  isFlipped,
  isCurrentlyFlipping,
  zIndex,
  stackOffset,
  prefersReducedMotion,
}: RealisticPageProps) {
  // Calculate rotation progress for dynamic effects (0 = flat, 1 = fully turned)
  const targetRotation = isFlipped ? -165 : 0
  
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: 'left center',
        zIndex,
        // Stack offset for thickness illusion (only for unflipped pages)
        left: !isFlipped ? `${stackOffset}px` : 0,
      }}
      initial={{ rotateY: 0 }}
      animate={
        prefersReducedMotion
          ? { opacity: isFlipped ? 0.2 : 1 }
          : {
              rotateY: targetRotation,
              // Curvature: compress horizontally at mid-turn
              scaleX: isCurrentlyFlipping ? [1, 0.96, 1] : 1,
              // Organic wobble during flip
              rotateZ: isCurrentlyFlipping ? [0, 0.8, -0.6, 0] : 0,
            }
      }
      transition={{
        duration: TIMING.pageFlipDuration,
        ease: [0.45, 0.05, 0.55, 0.95], // Custom easeInOut for smooth feel
        times: isCurrentlyFlipping ? [0, 0.5, 1] : undefined,
      }}
    >
      {/* LAYER A: Page Base with Photo */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          backfaceVisibility: 'hidden',
          boxShadow: isFlipped 
            ? 'none' 
            : '-2px 0 8px rgba(0,0,0,0.12), -1px 0 3px rgba(0,0,0,0.08)',
        }}
      >
        {/* Paper texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Photo container with border (printed photo look) */}
        <div className="absolute inset-4 rounded-md overflow-hidden bg-white shadow-sm">
          <div className="absolute inset-1 overflow-hidden">
            <Image
              src={src}
              alt={caption}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 250px, (max-width: 768px) 280px, 340px"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            {/* Fallback gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center -z-10">
              <span className="text-4xl">💕</span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span
            className="text-xs font-dancing text-amber-800/70 font-medium"
            style={{ textShadow: '0 1px 2px rgba(255,255,255,0.6)' }}
          >
            {caption}
          </span>
        </div>

        {/* Page edge - subtle darker line on right */}
        <div
          className="absolute right-0 top-2 bottom-2 w-[2px]"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.08) 80%, transparent)',
          }}
        />
      </div>

      {/* LAYER B: Shadow Overlay (darkens during turn) */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 30%, transparent 60%)',
          backfaceVisibility: 'hidden',
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isCurrentlyFlipping ? [0, 0.7, 0] : 0,
        }}
        transition={{
          duration: TIMING.pageFlipDuration,
          times: [0, 0.5, 1],
        }}
      />

      {/* LAYER C: Highlight/Shine near fold (left edge) */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-12 rounded-l-lg pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.4) 0%, transparent 100%)',
          backfaceVisibility: 'hidden',
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isCurrentlyFlipping ? [0, 0.8, 0.2] : 0,
        }}
        transition={{
          duration: TIMING.pageFlipDuration,
          times: [0, 0.4, 1],
        }}
      />

      {/* Page Back (visible when flipped) */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          boxShadow: '2px 0 8px rgba(0,0,0,0.12)',
        }}
      >
        {/* Paper texture on back */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* LAYER D: Cast Shadow onto pages beneath (only during flip) */}
      {isCurrentlyFlipping && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 40%)',
            transform: 'translateZ(-2px)',
            zIndex: -1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{
            duration: TIMING.pageFlipDuration,
            times: [0, 0.5, 1],
          }}
        />
      )}
    </motion.div>
  )
}

export default function BookWithPages({
  phase,
  images,
  recipientName,
  onOpenComplete,
  onPagesComplete,
  prefersReducedMotion,
}: BookWithPagesProps) {
  const [currentFlippingPage, setCurrentFlippingPage] = useState(-1)
  const [flippedPages, setFlippedPages] = useState<Set<number>>(new Set())

  const pageCount = Math.min(images.length, 10)

  // Handle cover opening complete
  useEffect(() => {
    if (phase === 'opening') {
      const timer = setTimeout(() => {
        onOpenComplete()
      }, TIMING.coverOpen * 1000)
      return () => clearTimeout(timer)
    }
  }, [phase, onOpenComplete])

  // Handle page flipping sequence
  useEffect(() => {
    if (phase === 'flipping' && !prefersReducedMotion) {
      let pageIndex = 0
      const flipNextPage = () => {
        if (pageIndex < pageCount) {
          setCurrentFlippingPage(pageIndex)
          setFlippedPages(prev => new Set(prev).add(pageIndex))
          pageIndex++
          setTimeout(flipNextPage, (TIMING.pageFlipDelay + TIMING.pageFlipDuration) * 1000)
        } else {
          setCurrentFlippingPage(-1)
          setTimeout(onPagesComplete, TIMING.holdDuration)
        }
      }
      flipNextPage()
    } else if (phase === 'flipping' && prefersReducedMotion) {
      setTimeout(onPagesComplete, 800)
    }
  }, [phase, pageCount, onPagesComplete, prefersReducedMotion])

  return (
    <div
      className="relative w-72 h-96 sm:w-80 sm:h-[420px] md:w-96 md:h-[480px]"
      style={{ 
        perspective: `${BOOK_CONFIG.perspective}px`, 
        transformStyle: 'preserve-3d' 
      }}
    >
      {/* Backboard - subtle base layer visible when book opens */}
      <AnimatePresence>
        {(phase === 'opening' || phase === 'flipping' || phase === 'open') && (
          <motion.div
            className="absolute inset-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Paper texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* REALISTIC PAGE STACK - Render pages with RealisticPage component */}
      {(phase === 'flipping' || phase === 'open') && (
        <div className="absolute inset-3" style={{ transformStyle: 'preserve-3d' }}>
          {images.slice(0, pageCount).map((src, index) => {
            const isFlipped = flippedPages.has(index)
            const isCurrentlyFlipping = currentFlippingPage === index
            const zIndex = isFlipped ? index : pageCount - index
            const stackOffset = isFlipped ? 0 : index * BOOK_CONFIG.pageStackOffset

            return (
              <RealisticPage
                key={`page-${index}`}
                src={src}
                caption={PAGE_CAPTIONS[index] || `Memory #${index + 1}`}
                index={index}
                isFlipped={isFlipped}
                isCurrentlyFlipping={isCurrentlyFlipping}
                zIndex={zIndex}
                stackOffset={stackOffset}
                prefersReducedMotion={prefersReducedMotion}
              />
            )
          })}
        </div>
      )}

      {/* LEFT COVER with thickness */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          zIndex: 20,
        }}
        initial={{ rotateY: 0 }}
        animate={
          phase === 'opening' || phase === 'flipping' || phase === 'open' || phase === 'done'
            ? { rotateY: prefersReducedMotion ? -90 : -145, opacity: phase === 'done' ? 0 : 1 }
            : { rotateY: 0 }
        }
        transition={{ duration: TIMING.coverOpen, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        {/* Cover front face */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #f472b6 100%)',
            boxShadow: '0 25px 50px rgba(244,114,182,0.35), 0 12px 28px rgba(0,0,0,0.22)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Glass overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)',
            }}
          />

          {/* Inner border */}
          <div
            className="absolute inset-3 rounded-xl border-2 border-white/40"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}
          />

          {/* Cover content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
            <motion.div
              className="text-5xl mb-4"
              animate={phase === 'closed' && !prefersReducedMotion ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ❤️
            </motion.div>

            <p className="text-rose-700/80 text-sm sm:text-base font-medium mb-2 font-poppins">
              A Special Message For
            </p>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-600 text-center mb-4 font-sora"
              style={{ textShadow: '0 2px 10px rgba(190,24,93,0.2)' }}
            >
              {recipientName}
            </h1>

            <div className="flex gap-2 text-2xl">
              <motion.span
                animate={phase === 'closed' && !prefersReducedMotion ? { rotate: [-5, 5, -5] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💝
              </motion.span>
              <motion.span
                animate={phase === 'closed' && !prefersReducedMotion ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.1, repeat: Infinity, delay: 0.2 }}
              >
                💖
              </motion.span>
              <motion.span
                animate={phase === 'closed' && !prefersReducedMotion ? { rotate: [5, -5, 5] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              >
                💝
              </motion.span>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 text-xl opacity-60">💗</div>
          <div className="absolute top-4 right-4 text-xl opacity-60">💗</div>
          <div className="absolute bottom-4 left-4 text-xl opacity-60">💗</div>
          <div className="absolute bottom-4 right-4 text-xl opacity-60">💗</div>
        </div>

        {/* Cover thickness edge (right side) - visible when cover opens */}
        <div
          className="absolute top-0 bottom-0 right-0 rounded-r-2xl"
          style={{
            width: `${BOOK_CONFIG.coverThickness}px`,
            background: 'linear-gradient(to right, #ec4899, #f472b6)',
            transform: `translateZ(-${BOOK_CONFIG.coverThickness / 2}px) rotateY(90deg)`,
            transformOrigin: 'right center',
            boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.2)',
          }}
        />
      </motion.div>

      {/* RIGHT COVER with thickness */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'right center',
          zIndex: 19,
        }}
        initial={{ rotateY: 0, opacity: 0 }}
        animate={
          phase === 'opening' || phase === 'flipping' || phase === 'open' || phase === 'done'
            ? { rotateY: prefersReducedMotion ? 90 : 145, opacity: phase === 'done' ? 0 : 1 }
            : { rotateY: 0, opacity: 0 }
        }
        transition={{ duration: TIMING.coverOpen, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        {/* Cover back face */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
            boxShadow: '0 25px 50px rgba(244,114,182,0.35)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Subtle texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Cover thickness edge (left side) */}
        <div
          className="absolute top-0 bottom-0 left-0 rounded-l-2xl"
          style={{
            width: `${BOOK_CONFIG.coverThickness}px`,
            background: 'linear-gradient(to left, #ec4899, #f472b6)',
            transform: `translateZ(-${BOOK_CONFIG.coverThickness / 2}px) rotateY(-90deg)`,
            transformOrigin: 'left center',
            boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.2)',
          }}
        />
      </motion.div>

      {/* SPINE - Visible center element with depth */}
      <AnimatePresence>
        {(phase === 'opening' || phase === 'flipping' || phase === 'open') && (
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 rounded-sm"
            style={{
              width: `${BOOK_CONFIG.spineWidth}px`,
              marginLeft: `-${BOOK_CONFIG.spineWidth / 2}px`,
              background: 'linear-gradient(to right, rgba(0,0,0,0.25), rgba(0,0,0,0.15), rgba(0,0,0,0.25))',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3), 0 0 12px rgba(0,0,0,0.2)',
              zIndex: 15,
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Spine highlight */}
            <div
              className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic spine shadow - deepens during page turns */}
      <AnimatePresence>
        {(phase === 'flipping' || phase === 'open') && (
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 pointer-events-none"
            style={{
              width: `${BOOK_CONFIG.spineWidth * 3}px`,
              marginLeft: `-${(BOOK_CONFIG.spineWidth * 3) / 2}px`,
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)',
              zIndex: 14,
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentFlippingPage >= 0 ? [0.5, 0.8, 0.5] : 0.5 
            }}
            transition={{ 
              duration: currentFlippingPage >= 0 ? TIMING.pageFlipDuration : 0.3,
              times: currentFlippingPage >= 0 ? [0, 0.5, 1] : undefined,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
