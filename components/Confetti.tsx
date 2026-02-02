'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Piece = {
  id: number
  left: number
  size: number
  rotate: number
  duration: number
  delay: number
  color: string
}

export default function Confetti() {
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

  const pieces = useMemo<Piece[]>(() => {
    const colors = ['#fb7185', '#f472b6', '#c084fc', '#a78bfa', '#fda4af', '#f9a8d4']
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 180,
      duration: 1.6 + Math.random() * 1.2,
      delay: Math.random() * 0.2,
      color: colors[i % colors.length],
    }))
  }, [])

  if (!mounted || prefersReducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.55, backgroundColor: p.color, rotate: p.rotate, borderRadius: 2 }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0.9, 0] , x: [0, 24, -18, 10, 0], rotate: p.rotate + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
