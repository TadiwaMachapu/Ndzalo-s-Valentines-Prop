'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface PhotoCardProps {
  src: string
  rotation: number
  caption?: string
  index: number
}

export default function PhotoCard({ src, rotation, caption, index }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const frameVariations = useMemo(() => {
    const seed = index * 0.618033988749895
    return {
      borderWidth: 7 + (Math.sin(seed * 2) * 1.5),
      bottomBorder: 36 + (Math.cos(seed * 3) * 4),
      cornerRadius: 1 + (Math.sin(seed * 5) * 0.5),
      tiltAdjust: Math.sin(seed * 7) * 0.8,
      shadowSpread: 2 + (Math.cos(seed * 11) * 1),
    }
  }, [index])

  const refinedRotation = rotation + frameVariations.tiltAdjust

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ zIndex: isHovered ? 20 : 10 - index }}
      initial={{ opacity: 0, y: 20, rotate: refinedRotation }}
      animate={{ opacity: 1, y: 0, rotate: refinedRotation }}
      whileHover={{ scale: 1.08, rotate: refinedRotation * 0.3, y: -12, zIndex: 30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className="relative bg-white overflow-hidden"
        style={{
          padding: `${frameVariations.borderWidth}px ${frameVariations.borderWidth}px ${frameVariations.bottomBorder}px`,
          borderRadius: `${frameVariations.cornerRadius}px`,
          boxShadow: isHovered
            ? `0 ${20 + frameVariations.shadowSpread}px ${40 + frameVariations.shadowSpread * 2}px rgba(0,0,0,0.25), 
               0 ${8 + frameVariations.shadowSpread}px ${16 + frameVariations.shadowSpread * 2}px rgba(0,0,0,0.15),
               inset 0 1px 0 rgba(255,255,255,0.8),
               inset 0 -1px 2px rgba(0,0,0,0.04)`
            : `0 ${8 + frameVariations.shadowSpread}px ${18 + frameVariations.shadowSpread * 2}px rgba(0,0,0,0.18), 
               0 ${4 + frameVariations.shadowSpread}px ${8 + frameVariations.shadowSpread}px rgba(0,0,0,0.12),
               inset 0 1px 0 rgba(255,255,255,0.6),
               inset 0 -1px 2px rgba(0,0,0,0.03)`,
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,248,0.95) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")
          `,
          backgroundBlendMode: 'overlay, normal',
        }}
      >
        <div 
          className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 overflow-hidden bg-gray-100"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 2px 4px rgba(0,0,0,0.08)',
          }}
        >
          {!imageError ? (
            <Image
              src={src}
              alt={caption || `Memory ${index + 1}`}
              fill
              className={`object-cover transition-all duration-300 ${isHovered ? 'saturate-125 brightness-105' : 'saturate-100'}`}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 144px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-rose-300">
              <span className="text-3xl">💕</span>
            </div>
          )}

          {/* Sparkle overlay on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.span
              className="text-2xl drop-shadow-lg"
              animate={isHovered ? { scale: [0.85, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              ✨
            </motion.span>
          </motion.div>
        </div>

        {/* Story caption - handwritten vibe */}
        <motion.p
          className="absolute left-0 right-0 text-center text-xs font-dancing font-bold px-2"
          style={{
            bottom: `${frameVariations.bottomBorder * 0.25}px`,
            color: '#6b7280',
            transform: `rotate(${refinedRotation * 0.4}deg)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0.5,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {caption}
        </motion.p>

        {/* Subtle edge wear effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 5% 5%, rgba(0,0,0,0.02) 0%, transparent 15%),
              radial-gradient(circle at 95% 5%, rgba(0,0,0,0.02) 0%, transparent 15%),
              radial-gradient(circle at 5% 95%, rgba(0,0,0,0.02) 0%, transparent 15%),
              radial-gradient(circle at 95% 95%, rgba(0,0,0,0.02) 0%, transparent 15%)
            `,
            borderRadius: `${frameVariations.cornerRadius}px`,
          }}
        />
      </div>

      {/* Warm glow on hover */}
      <motion.div
        className="absolute -inset-3 rounded-lg pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(251,207,133,0.22) 0%, rgba(251,113,133,0.18) 40%, transparent 70%)', 
          filter: 'blur(12px)' 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  )
}
