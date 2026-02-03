'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface DodgingNoButtonProps {
  children: ReactNode
  onClick?: () => void
  dodgeLevel: number
  onDodgeLevelChange: (level: number) => void
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function DodgingNoButton({ children, onClick, dodgeLevel, onDodgeLevelChange }: DodgingNoButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [enabled, setEnabled] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [label, setLabel] = useState<ReactNode>(children)

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

  useEffect(() => {
    if (dodgeLevel >= 5) {
      setLabel('Are you sure? 😅')
    } else {
      setLabel(children)
    }
  }, [dodgeLevel, children])

  const bounds = { width: 220, height: 90 }

  const handleInteraction = () => {
    if (!enabled) return

    const newLevel = dodgeLevel + 1
    onDodgeLevelChange(newLevel)

    if (newLevel === 1) {
      // First hover: shake
      setPos({ x: 0, y: 0 })
    } else if (newLevel === 2) {
      // Second hover: scoot away
      const x = (Math.random() - 0.5) * 60
      const y = (Math.random() - 0.5) * 40
      setPos({ x, y })
    } else {
      // Third+ hover: dodge normally
      const x = (Math.random() - 0.5) * bounds.width
      const y = (Math.random() - 0.5) * bounds.height
      setPos({ x, y })
    }
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
      animate={
        dodgeLevel === 1
          ? { x: [-2, 2, -2, 2, 0], y: 0, rotate: [-1, 1, -1, 1, 0] }
          : {
              x: clamp(pos.x, -bounds.width / 2, bounds.width / 2),
              y: clamp(pos.y, -bounds.height / 2, bounds.height / 2),
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : dodgeLevel === 1
          ? { duration: 0.4, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 400, damping: 22 }
      }
      onMouseEnter={handleInteraction}
      onMouseMove={handleInteraction}
      onFocus={handleInteraction}
      onClick={onClick}
    >
      {label}
    </motion.button>
  )
}
