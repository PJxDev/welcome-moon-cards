
'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MissionCards({ images }) {
  const [showMissions, setShowMissions] = useState(false)

  const toggleMissions = () => {
    setShowMissions(!showMissions)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className='md:hidden w-full flex justify-center mb-4'>
        <button
          onClick={toggleMissions}
          className='space-button hover-glow z-10 w-48 h-12 text-sm font-bold text-center py-2 px-4 rounded-lg transition-all duration-300'
        >
          {showMissions ? 'Ocultar Misiones' : 'Mostrar Misiones'}
        </button>
      </div>

      {/* Mission Cards Container */}
      <section className={`w-full max-w-6xl flex flex-col glass-morphism relative overflow-hidden rounded-lg ${!showMissions ? 'hidden md:flex' : ''}`}>
        <div className='absolute -top-1/3 -left-1/4 rounded-full w-full h-full blur-3xl opacity-30 bg-gradient-to-r from-var(--primary) to-var(--secondary) z-0'></div>

        {/* Desktop Layout - Row */}
        <div className='hidden md:flex z-10 flex-1 flex-row flex-wrap justify-center items-center p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden'>
          <div className='relative floating-card card-game pulse-glow'>
            <Image
              width={500}
              height={500}
              src={images.imgMis1}
              alt='carta'
              className='w-auto p-1 sm:p-2 object-contain min-w-20 sm:min-w-32 max-h-28 sm:max-h-48'
            />
          </div>
          <div className='relative floating-card card-game pulse-glow'>
            <Image
              width={500}
              height={500}
              src={images.imgMis2}
              alt='carta'
              className='w-auto p-1 sm:p-2 object-contain min-w-20 sm:min-w-32 max-h-28 sm:max-h-48'
            />
          </div>
          <div className='relative floating-card card-game pulse-glow'>
            <Image
              width={500}
              height={500}
              src={images.imgMis3}
              alt='carta'
              className='w-auto p-1 sm:p-2 object-contain min-w-20 sm:min-w-32 max-h-28 sm:max-h-48'
            />
          </div>
        </div>

        {/* Mobile Layout - Column */}
        <div className='md:hidden z-10 flex-1 flex flex-col justify-center items-center p-4 gap-4 overflow-hidden'>
          <div className='relative floating-card card-game pulse-glow'>
            <Image
              width={500}
              height={500}
              src={images.imgMis1}
              alt='carta'
              className='w-auto p-2 object-contain min-w-32 max-h-40'
            />
          </div>
          <div className='relative floating-card card-game pulse-glow'>
            <Image
              width={500}
              height={500}
              src={images.imgMis2}
              alt='carta'
              className='w-auto p-2 object-contain min-w-32 max-h-40'
            />
          </div>
          <div className='relative floating-card card-game pulse-glow'>
            <Image
              width={500}
              height={500}
              src={images.imgMis3}
              alt='carta'
              className='w-auto p-2 object-contain min-w-32 max-h-40'
            />
          </div>
        </div>
      </section>
    </>
  )
}
