'use client'

import { useState } from 'react'
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

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ zIndex: isHovered ? 20 : 10 - index }}
      initial={{ opacity: 0, y: 20, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      whileHover={{ scale: 1.08, rotate: 0, y: -8, zIndex: 30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className="relative bg-white p-2 pb-8 rounded-sm"
        style={{
          boxShadow: isHovered
            ? '0 22px 44px rgba(0,0,0,0.28), 0 10px 20px rgba(0,0,0,0.18)'
            : '0 10px 22px rgba(0,0,0,0.22), 0 5px 10px rgba(0,0,0,0.14)',
        }}
      >
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 overflow-hidden bg-gray-100">
          {!imageError ? (
            <Image
              src={src}
              alt={caption || `Memory ${index + 1}`}
              fill
              className={`object-cover transition-all duration-300 ${isHovered ? 'saturate-110 brightness-105' : 'saturate-100'}`}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 144px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-rose-300">
              <span className="text-3xl">💕</span>
            </div>
          )}

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
              💖
            </motion.span>
          </motion.div>
        </div>

        {caption && (
          <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 font-medium truncate px-1">
            {caption}
          </p>
        )}
      </div>

      <motion.div
        className="absolute -inset-2 rounded-lg pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.28) 0%, transparent 70%)', filter: 'blur(10px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  )
}
