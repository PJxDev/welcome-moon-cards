
'use client'

import Image from 'next/image'

export default function GameCards({ images }) {
  const cardPairs = [
    { num: images.imgNum1, tipo: images.imgTipo1 },
    { num: images.imgNum2, tipo: images.imgTipo2 },
    { num: images.imgNum3, tipo: images.imgTipo3 }
  ]

  return (
    <section className='w-full max-w-6xl flex flex-col glass-morphism relative overflow-hidden rounded-lg'>
      <div className='absolute -top-1/3 -right-1/4 rounded-full w-full h-full blur-3xl opacity-30 bg-gradient-to-l from-var(--accent) to-var(--primary) z-0'></div>

      <div className='z-10 flex-1 flex flex-row flex-wrap justify-center items-center p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden'>
        {cardPairs.map((pair, index) => (
          <div key={index} className='flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-2 sm:mb-0'>
            <div className='relative floating-card card-game hover-glow'>
              <Image
                width={500}
                height={500}
                src={pair.num}
                alt='carta'
                className='w-auto p-1 sm:p-2 object-contain min-w-20 sm:min-w-32 max-h-28 sm:max-h-48'
              />
            </div>
            <div className='relative floating-card card-game hover-glow'>
              <Image
                width={500}
                height={500}
                src={pair.tipo}
                alt='carta'
                className='w-auto p-1 sm:p-2 object-contain min-w-20 sm:min-w-32 max-h-28 sm:max-h-48'
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
