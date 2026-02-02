'use client'

import PhotoCard from './PhotoCard'

interface PhotoMemoriesStripProps {
  images: string[]
  captions?: string[]
}

const rotations = [-6, 4, -3, 5, -4, 6]

export default function PhotoMemoriesStrip({ images, captions }: PhotoMemoriesStripProps) {
  return (
    <div className="lg:hidden w-full mt-8">
      <p className="text-white/70 text-sm font-medium text-center mb-4 font-poppins">✨ Our Memories ✨</p>

      <div
        className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((src, index) => (
          <div key={index} className="flex-shrink-0 snap-center">
            <PhotoCard
              src={src}
              rotation={rotations[index % rotations.length]}
              caption={captions?.[index]}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
