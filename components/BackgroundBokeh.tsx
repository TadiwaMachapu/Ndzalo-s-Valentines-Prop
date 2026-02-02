'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface BokehBlob {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

export default function BackgroundBokeh() {
  const [mounted, setMounted] = useState(false)
  const [blobs, setBlobs] = useState<BokehBlob[]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleChange)

    const colors = [
      'rgba(236, 72, 153, 0.28)',
      'rgba(192, 132, 252, 0.22)',
      'rgba(251, 113, 133, 0.26)',
      'rgba(167, 139, 250, 0.2)',
      'rgba(244, 114, 182, 0.24)',
      'rgba(139, 92, 246, 0.18)',
    ]

    const newBlobs: BokehBlob[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 160 + Math.random() * 260,
      color: colors[i % colors.length],
      duration: 18 + Math.random() * 18,
      delay: i * 1.8,
    }))

    setBlobs(newBlobs)

    return () => motionQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            135deg,
            #1e1b4b 0%,
            #4c1d95 22%,
            #7c3aed 42%,
            #a855f7 52%,
            #c026d3 62%,
            #db2777 78%,
            #be185d 90%,
            #831843 100%
          )`,
        }}
      />

      {mounted && blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: 'blur(44px)',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, 28, -18, 12, 0],
                  y: [0, -22, 18, -10, 0],
                  scale: [1, 1.08, 0.96, 1.04, 1],
                }
          }
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 52%,
            rgba(0, 0, 0, 0.32) 100%
          )`,
        }}
      />
    </div>
  )
}
