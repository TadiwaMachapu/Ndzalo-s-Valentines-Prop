'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ValentineCardOpenerProps {
  recipientName: string
  onOpen: () => void
}

export default function ValentineCardOpener({ recipientName, onOpen }: ValentineCardOpenerProps) {
  const [isOpening, setIsOpening] = useState(false)

  const handleClick = () => {
    if (isOpening) return
    setIsOpening(true)
    window.setTimeout(() => onOpen(), 1400)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[520px]">
      <motion.div
        className="relative cursor-pointer"
        onClick={handleClick}
        whileHover={!isOpening ? { scale: 1.02, y: -6 } : {}}
        whileTap={!isOpening ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
      >
        <motion.div
          className="relative w-72 h-96 sm:w-80 sm:h-[420px] md:w-96 md:h-[480px]"
          animate={{ rotateY: isOpening ? 180 : 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #f472b6 100%)',
              boxShadow: '0 25px 50px rgba(244,114,182,0.35), 0 12px 28px rgba(0,0,0,0.22)',
            }}
          >
            <div
              className="absolute inset-3 rounded-xl border-2 border-white/40"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}
            />

            <motion.div
              className="absolute top-8 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg"
              animate={!isOpening ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ❤️
            </motion.div>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <p className="text-rose-700/80 text-sm sm:text-base font-medium mb-2 font-poppins">A Special Message For</p>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-600 text-center mb-4 font-sora"
                style={{ textShadow: '0 2px 10px rgba(190,24,93,0.2)' }}
              >
                {recipientName}
              </h1>
              <div className="flex gap-2 text-2xl">
                <motion.span animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  💝
                </motion.span>
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0.2 }}>
                  💖
                </motion.span>
                <motion.span animate={{ rotate: [5, -5, 5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>
                  💝
                </motion.span>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <motion.p
                className="text-rose-500/70 text-xs sm:text-sm font-medium font-poppins"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Happy Valentine&apos;s Day 💕
              </motion.p>
            </div>

            <div className="absolute top-4 left-4 text-xl opacity-60">💗</div>
            <div className="absolute top-4 right-4 text-xl opacity-60">💗</div>
            <div className="absolute bottom-4 left-4 text-xl opacity-60">💗</div>
            <div className="absolute bottom-4 right-4 text-xl opacity-60">💗</div>
          </div>

          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
              boxShadow: '0 25px 50px rgba(244,114,182,0.35)',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={isOpening ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <span className="text-6xl">💖</span>
              </motion.div>
              <motion.p
                className="text-rose-600 font-bold text-xl mt-4 font-sora text-center"
                initial={{ opacity: 0 }}
                animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.75 }}
              >
                Opening your surprise...
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {!isOpening && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p
              className="text-white/90 text-lg font-medium font-poppins flex items-center gap-2 justify-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>✨</span>
              <span>Tap to open your card</span>
              <span>✨</span>
            </motion.p>
            <p className="text-white/50 text-sm mt-2 font-poppins">Something special awaits...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
