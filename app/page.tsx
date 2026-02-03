'use client'

/**
 * Valentine Proposal Website - Story-Driven Edition
 * 
 * HOW TO ADD PHOTOS:
 * 1. Place photos in /public/ndzalo/ folder
 * 2. Name them: 1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg, 6.jpg
 * 3. Photos will appear as Polaroid cards beside the main card
 * 
 * HOW TO CHANGE CAPTIONS:
 * - Edit the STORY_CAPTIONS array below (they form one sentence when read in order)
 * 
 * HOW TO CHANGE WHATSAPP:
 * - Update WHATSAPP_NUMBER below
 * 
 * HOW TO EDIT LETTER TEXT:
 * - Open /components/SecretLetter.tsx and edit the letter content
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
import IntroGiftCard from '@/components/IntroGiftCard'
import SecretLetter from '@/components/SecretLetter'

const GIRLFRIEND_NAME = 'Ndzalo'
const WHATSAPP_NUMBER = '27693129667'
const PICKUP_TIME = '7'

const PHOTOS = [
  '/photos/WhatsApp Image 2026-02-02 at 22.56.13.jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.15.jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.15 (1).jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.16.jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.16 (1).jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.17.jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.17 (1).jpeg',
  '/photos/WhatsApp Image 2026-02-02 at 22.56.17 (2).jpeg',
]

// Story captions - they form ONE sentence when read in order 1->8
const STORY_CAPTIONS = [
  "You're my favorite",
  'part of',
  'every single',
  'day, and',
  'I choose',
  'you, always',
  'and forever',
  '💕',
]

type Screen = 'intro' | 'proposal' | 'yes' | 'nope'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [noCount, setNoCount] = useState(0)
  const [dodgeLevel, setDodgeLevel] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [isLetterOpen, setIsLetterOpen] = useState(false)

  const handleIntroComplete = () => setScreen('proposal')

  const handleYes = () => {
    setScreen('yes')
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2500)
  }

  const handleNo = () => {
    setNoCount((prev) => prev + 1)
    setScreen('nope')
    setTimeout(() => setScreen('proposal'), 1200)
  }

  const handleOpenLetter = () => setIsLetterOpen(true)
  const handleCloseLetter = () => setIsLetterOpen(false)

  const whatsappMessage = encodeURIComponent("Yesss I'm your Valentine! 💖")
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  const leftPhotos = PHOTOS.slice(0, 4)
  const rightPhotos = PHOTOS.slice(4, 8)

  const backgroundMood = screen === 'yes' ? 'celebration' : screen === 'nope' ? 'rejection' : 'calm'

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <BackgroundBokeh mood={backgroundMood} />
      <FloatingHearts />
      {showConfetti && <Confetti />}

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {screen === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center"
            >
              <IntroGiftCard recipientName={GIRLFRIEND_NAME} onComplete={handleIntroComplete} />
            </motion.div>
          )}

          {screen === 'proposal' && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-8 lg:gap-12">
                <PhotoSideStack images={leftPhotos} alignment="left" captions={STORY_CAPTIONS.slice(0, 4)} />

                <div className="relative z-10 flex-shrink-0">
                  <MainValentineCard 
                    recipientName={GIRLFRIEND_NAME} 
                    onYes={handleYes} 
                    onNo={handleNo} 
                    noCount={noCount}
                    dodgeLevel={dodgeLevel}
                    onDodgeLevelChange={setDodgeLevel}
                    onOpenLetter={handleOpenLetter}
                  />
                </div>

                <PhotoSideStack images={rightPhotos} alignment="right" captions={STORY_CAPTIONS.slice(4, 8)} />
              </div>

              <PhotoMemoriesStrip images={PHOTOS} captions={STORY_CAPTIONS} />
            </motion.div>
          )}

          {screen === 'yes' && (
            <motion.div
              key="yes"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="w-full flex justify-center"
            >
              <CelebrationScreen recipientName={GIRLFRIEND_NAME} whatsappUrl={whatsappUrl} pickupTime={PICKUP_TIME} />
            </motion.div>
          )}

          {screen === 'nope' && (
            <motion.div
              key="nope"
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

      {/* Easter Egg Footer */}
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: screen === 'proposal' ? 0.6 : 0 }}
        transition={{ delay: 3 }}
      >
        <button
          onClick={() => setShowEasterEgg(true)}
          className="text-white/40 hover:text-white/70 text-xs font-poppins transition-colors"
        >
          made with love 💖
        </button>
      </motion.div>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {showEasterEgg && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEasterEgg(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <p className="text-white text-center font-poppins text-lg leading-relaxed">
                Thank you for opening this.
                <br />
                I really meant it. 💖
              </p>
              <button
                onClick={() => setShowEasterEgg(false)}
                className="mt-6 w-full px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-poppins transition-colors"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Secret Letter Modal - Rendered at root level to avoid clipping */}
      <SecretLetter isOpen={isLetterOpen} onClose={handleCloseLetter} />
    </main>
  )
}
