'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DodgingNoButton from './DodgingNoButton'

interface MainValentineCardProps {
  recipientName: string
  onYes: () => void
  onNo: () => void
  noCount: number
  dodgeLevel: number
  onDodgeLevelChange: (level: number) => void
  onOpenLetter: () => void
}

export default function MainValentineCard({ recipientName, onYes, onNo, noCount, dodgeLevel, onDodgeLevelChange, onOpenLetter }: MainValentineCardProps) {
  const [showSoftLine, setShowSoftLine] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() =>{
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleChange)
    return () => motionQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!prefersReducedMotion) {
      const timer = setTimeout(() => setShowSoftLine(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [prefersReducedMotion])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className="absolute inset-0 rounded-3xl"
        style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(8px, 8px) rotate(2deg)', filter: 'blur(1px)' }}
      />
      <div
        className="absolute inset-0 rounded-3xl"
        style={{ background: 'rgba(255,255,255,0.08)', transform: 'translate(4px, 4px) rotate(1deg)' }}
      />

      <motion.div
        className="relative rounded-3xl p-6 sm:p-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 60px rgba(236,72,153,0.14), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className="absolute -inset-[1px] rounded-3xl opacity-50 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(251,113,133,0.5) 0%, rgba(192,132,252,0.3) 50%, rgba(251,113,133,0.5) 100%)',
            filter: 'blur(2px)',
            zIndex: -1,
          }}
        />

        <div className="flex justify-center mb-5">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white/90 text-sm font-poppins"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)', border: '1px solid rgba(255,255,255,0.2)' }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span>💌</span>
            <span className="font-medium">Valentine mode: ON</span>
            <span>💘</span>
          </motion.div>
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 font-sora"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fce7f3 40%, #fbcfe8 70%, #f9a8d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 10px rgba(255,255,255,0.28))',
          }}
        >
          {recipientName}… will you be my Valentine?
        </h1>

        <p className="text-base sm:text-lg text-white/85 text-center mb-2 font-poppins">I planned something special for us 😌 ✨</p>

        {showSoftLine && (
          <motion.p
            className="text-sm text-white/60 text-center mb-5 font-poppins italic"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            No rush… but my heart is already leaning one way 🫶
          </motion.p>
        )}

        <div className="flex justify-center mb-5">
          <motion.button
            onClick={onOpenLetter}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-white/80 hover:text-white transition-colors font-poppins text-sm"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', border: '1px solid rgba(255,255,255,0.15)' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>💌</span>
            <span>Open letter</span>
          </motion.button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            onClick={onYes}
            className="relative px-10 py-4 rounded-full font-semibold text-white overflow-hidden group font-poppins"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
              boxShadow: '0 4px 20px rgba(236,72,153,0.4), 0 0 40px rgba(236,72,153,0.2)',
            }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{ background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%)' }}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
            <span className="relative z-10">Yes 💘</span>
          </motion.button>

          <DodgingNoButton onClick={onNo} dodgeLevel={dodgeLevel} onDodgeLevelChange={onDodgeLevelChange}>
            Nope 😅
          </DodgingNoButton>
        </div>

        {noCount > 0 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 text-center">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-sm font-poppins"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span>😅</span>
              <span>No&apos;s so far: {noCount}</span>
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
