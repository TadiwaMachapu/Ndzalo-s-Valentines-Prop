'use client'

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface DodgingButtonProps {
  children: ReactNode
  onClick?: () => void
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function DodgingButton({ children, onClick }: DodgingButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [enabled, setEnabled] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      setEnabled(mqFine.matches && !mqReduce.matches)
      setPrefersReducedMotion(mqReduce.matches)
    }

    sync()

    const handleFine = () => sync()
    const handleReduce = () => sync()

    mqFine.addEventListener('change', handleFine)
    mqReduce.addEventListener('change', handleReduce)

    return () => {
      mqFine.removeEventListener('change', handleFine)
      mqReduce.removeEventListener('change', handleReduce)
    }
  }, [])

  const bounds = useMemo(() => ({ width: 220, height: 90 }), [])

  const dodge = () => {
    if (!enabled) return
    const x = (Math.random() - 0.5) * bounds.width
    const y = (Math.random() - 0.5) * bounds.height
    setPos({ x, y })
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className="relative px-10 py-4 rounded-full font-semibold text-white font-poppins"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
      }}
      animate={{
        x: clamp(pos.x, -bounds.width / 2, bounds.width / 2),
        y: clamp(pos.y, -bounds.height / 2, bounds.height / 2),
      }}
      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 22 }}
      onMouseEnter={dodge}
      onMouseMove={dodge}
      onFocus={dodge}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
