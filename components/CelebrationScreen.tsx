'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CelebrationScreenProps {
  recipientName: string
  whatsappUrl: string
  pickupTime: string
}

export default function CelebrationScreen({ recipientName, whatsappUrl, pickupTime }: CelebrationScreenProps) {
  const [showMemory, setShowMemory] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowMemory(true), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto space-y-6">
      <div className="absolute inset-0 rounded-3xl" style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(8px, 8px) rotate(2deg)' }} />
      <div className="absolute inset-0 rounded-3xl" style={{ background: 'rgba(255,255,255,0.08)', transform: 'translate(4px, 4px) rotate(1deg)' }} />

      <motion.div
        className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 60px rgba(34,197,94,0.16)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      >
        <div className="text-center mb-6">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-sora leading-tight"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fce7f3 50%, #fbcfe8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            YAY {recipientName}!! 🎉💞
          </motion.h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-poppins">It&apos;s a date! I can&apos;t wait to spend time with you 😌💞</p>
        </div>

        <motion.div className="flex justify-center mb-8" animate={{ y: [0, -14, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <motion.div className="text-7xl sm:text-8xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
            💖
          </motion.div>
        </motion.div>

        <motion.a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <button
            className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white overflow-hidden group relative font-poppins text-base sm:text-lg"
            style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)', boxShadow: '0 4px 20px rgba(34,197,94,0.4)' }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>Send me the details</span>
              <span>💬</span>
            </span>
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{ background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)' }}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </button>
        </motion.a>
      </motion.div>

      {/* Memory Unlocked Card */}
      {showMemory && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <div
            className="relative rounded-2xl p-6 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 0 40px rgba(251,113,133,0.2)',
            }}
          >
            <motion.div
              className="absolute top-2 right-2 text-2xl"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✨
            </motion.div>
            
            <p className="text-white/70 text-xs font-medium mb-2 font-poppins uppercase tracking-wider">Memory Unlocked</p>
            <h3 className="text-2xl font-bold text-white mb-1 font-sora">Valentine's 2026</h3>
            <p className="text-white/80 text-lg font-poppins">{recipientName} & Tadiwa 💖</p>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/60 text-xs font-poppins italic">
                This moment is screenshot-worthy 📸
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
