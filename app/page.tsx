'use client'

/**
 * HOW TO ADD PHOTOS:
 * Put photos in /public/ndzalo/ named 1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg, 6.jpg (and more optional)
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BackgroundBokeh from '@/components/BackgroundBokeh'
import Confetti from '@/components/Confetti'
import FloatingHearts from '@/components/FloatingHearts'
import CelebrationScreen from '@/components/CelebrationScreen'
import MainValentineCard from '@/components/MainValentineCard'
import PhotoMemoriesStrip from '@/components/PhotoMemoriesStrip'
import PhotoSideStack from '@/components/PhotoSideStack'
import ValentineCardOpener from '@/components/ValentineCardOpener'

const GIRLFRIEND_NAME = 'Ndzalo'
const WHATSAPP_NUMBER = '27693129667'
const PICKUP_TIME = '7'

const PHOTOS = [
  '/ndzalo/1.jpg',
  '/ndzalo/2.jpg',
  '/ndzalo/3.jpg',
  '/ndzalo/4.jpg',
  '/ndzalo/5.jpg',
  '/ndzalo/6.jpg',
]

const CAPTIONS = ['us 💕', 'my favorite 🥹', 'always 💗', 'memories ✨', 'love this 💖', 'forever 💞']

type Screen = 'card' | 'proposal' | 'celebration' | 'rejected'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('card')
  const [noCount, setNoCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleCardOpen = () => setScreen('proposal')

  const handleYes = () => {
    setScreen('celebration')
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }

  const handleNo = () => {
    setNoCount((prev) => prev + 1)
    setScreen('rejected')
    setTimeout(() => setScreen('proposal'), 1200)
  }

  const whatsappMessage = encodeURIComponent("Yesss I'm your Valentine! 💖")
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  const leftPhotos = PHOTOS.slice(0, 3)
  const rightPhotos = PHOTOS.slice(3, 6)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <BackgroundBokeh />
      <FloatingHearts />
      {showConfetti && <Confetti />}

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {screen === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center"
            >
              <ValentineCardOpener recipientName={GIRLFRIEND_NAME} onOpen={handleCardOpen} />
            </motion.div>
          )}

          {screen === 'proposal' && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-8 lg:gap-12">
                <PhotoSideStack images={leftPhotos} alignment="left" captions={CAPTIONS.slice(0, 3)} />

                <div className="relative z-10 flex-shrink-0">
                  <MainValentineCard recipientName={GIRLFRIEND_NAME} onYes={handleYes} onNo={handleNo} noCount={noCount} />
                </div>

                <PhotoSideStack images={rightPhotos} alignment="right" captions={CAPTIONS.slice(3, 6)} />
              </div>

              <PhotoMemoriesStrip images={PHOTOS} captions={CAPTIONS} />
            </motion.div>
          )}

          {screen === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="w-full flex justify-center"
            >
              <CelebrationScreen recipientName={GIRLFRIEND_NAME} whatsappUrl={whatsappUrl} pickupTime={PICKUP_TIME} />
            </motion.div>
          )}

          {screen === 'rejected' && (
            <motion.div
              key="rejected"
              initial={{ opacity: 0, scale: 0.96, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <div className="relative w-full max-w-md mx-auto">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: 'rgba(255,255,255,0.06)', transform: 'translate(6px, 6px) rotate(1.5deg)' }}
                />
                <motion.div
                  className="relative rounded-3xl p-8 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold text-white mb-4 font-sora"
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 0.3, repeat: 3 }}
                  >
                    Eish {GIRLFRIEND_NAME} 😭
                  </motion.h1>
                  <p className="text-xl text-white/90 font-poppins">one more chance?</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
