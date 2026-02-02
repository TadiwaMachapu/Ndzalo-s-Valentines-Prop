'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Heart = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export default function FloatingHearts() {
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleChange)
    return () => motionQuery.removeEventListener('change', handleChange)
  }, [])

  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 12 + Math.random() * 14,
      duration: 10 + Math.random() * 12,
      delay: Math.random() * 4,
      opacity: 0.08 + Math.random() * 0.12,
    }))
  }, [])

  if (!mounted || prefersReducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: `${h.left}%`, bottom: '-40px', fontSize: h.size, opacity: h.opacity }}
          animate={{ y: ['0vh', '-120vh'], x: [0, 12, -8, 6, 0], rotate: [0, 12, -10, 8, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'linear' }}
        >
          💗
        </motion.div>
      ))}
    </div>
  )
}
