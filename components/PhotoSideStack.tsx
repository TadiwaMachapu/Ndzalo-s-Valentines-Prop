'use client'

import PhotoCard from './PhotoCard'

interface PhotoSideStackProps {
  images: string[]
  alignment: 'left' | 'right'
  captions?: string[]
}

const leftRotations = [-8, 5, -4]
const rightRotations = [6, -5, 8]

export default function PhotoSideStack({ images, alignment, captions }: PhotoSideStackProps) {
  const rotations = alignment === 'left' ? leftRotations : rightRotations

  return (
    <div
      className={`hidden lg:flex flex-col gap-4 items-center ${
        alignment === 'left' ? 'lg:items-end lg:pr-4' : 'lg:items-start lg:pl-4'
      }`}
    >
      {images.slice(0, 3).map((src, index) => (
        <PhotoCard
          key={`${alignment}-${index}`}
          src={src}
          rotation={rotations[index % rotations.length]}
          caption={captions?.[index]}
          index={index}
        />
      ))}
    </div>
  )
}
