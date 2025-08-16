
'use client'

import Image from 'next/image'

export default function MissionCards({ images }) {
  return (
    <section className='w-full max-w-6xl flex flex-col glass-morphism relative overflow-hidden rounded-lg'>
      <div className='absolute -top-1/3 -left-1/4 rounded-full w-full h-full blur-3xl opacity-30 bg-gradient-to-r from-var(--primary) to-var(--secondary) z-0'></div>

      <div className='z-10 flex-1 flex flex-row flex-wrap justify-center items-center p-4 gap-4 overflow-hidden'>
        <div className='relative floating-card card-game pulse-glow'>
          <Image
            width={500}
            height={500}
            src={images.imgMis1}
            alt='carta'
            className='w-auto p-2 object-contain min-w-32 max-h-48'
          />
        </div>
        <div className='relative floating-card card-game pulse-glow'>
          <Image
            width={500}
            height={500}
            src={images.imgMis2}
            alt='carta'
            className='w-auto p-2 object-contain min-w-32 max-h-48'
          />
        </div>
        <div className='relative floating-card card-game pulse-glow'>
          <Image
            width={500}
            height={500}
            src={images.imgMis3}
            alt='carta'
            className='w-auto p-2 object-contain min-w-32 max-h-48'
          />
        </div>
      </div>
    </section>
  )
}
