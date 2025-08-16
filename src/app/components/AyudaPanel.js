
'use client'

import Image from 'next/image'

export default function AyudaPanel({ showAyuda }) {
  if (!showAyuda) return null

  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-4'>
      <div className='glass-morphism rounded-lg p-4 max-w-4xl w-full'>
        <Image
          width={500}
          height={500}
          src={'/assets/img/ayuda.png'}
          alt='carta'
          className='w-full h-auto object-contain max-h-[70vh]'
        />
      </div>
    </div>
  )
}
