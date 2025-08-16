
'use client'

import Image from 'next/image'
import { useState } from 'react'

const OPCIONES_CASILLAS = [
  '', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '10b', '11b', '12b', '13b', '14b', '15b', '16b', '17b', 'R'
]

export default function HojaPuntosPanel({ 
  showHojaPuntos, 
  hojaDePuntos, 
  setHojaDePuntos,
  socket,
  userID 
}) {
  if (!showHojaPuntos) return null

  const handleChangeNombre = (e) => {
    let { name, value } = e.target
    setHojaDePuntos((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-4 overflow-auto'>
      <section className='relative w-full max-w-[50rem] h-[50rem] p-2 glass-morphism rounded-lg'>
        <Image
          width={1200}
          height={1200}
          src={'/assets/img/hoja-puntos.png'}
          alt='hoja de puntos'
          className='w-full h-auto p-2 object-contain select-none pointer-events-none max-w-[50rem]'
        />
        
        <input
          name='nombre'
          onChange={handleChangeNombre}
          value={hojaDePuntos.nombre}
          type='text'
          className='w-[6rem] h-[2rem] opacity-50 absolute top-[19%] left-[8%] text-zinc-950 font-bold text-center text-sm'
        />

        {/* Aquí iría todo el resto del formulario de la hoja de puntos */}
        {/* Por brevedad, incluyo solo algunos campos como ejemplo */}
        
        {/* CALLE 1 - CASAS */}
        {Object.keys(hojaDePuntos.casas).slice(0, 10).map((casa, index) => {
          const positions = [
            { top: '14%', left: '25.5%' },
            { top: '14%', left: '32%' },
            { top: '14.5%', left: '38.5%' },
            { top: '14%', left: '45%' },
            { top: '14%', left: '51.5%' },
            { top: '14%', left: '58%' },
            { top: '15%', left: '64.5%' },
            { top: '15%', left: '71%' },
            { top: '14%', left: '77%' },
            { top: '14%', left: '83.5%' }
          ]
          
          return (
            <select
              key={casa}
              onChange={(e) => {
                const { name, value } = e.target
                setHojaDePuntos(prev => ({
                  ...prev,
                  casas: { ...prev.casas, [name]: value }
                }))
              }}
              value={hojaDePuntos.casas[casa]}
              name={casa}
              className={`appearance-none w-[2rem] h-[3rem] bg-transparent absolute text-zinc-950 font-bold text-center`}
              style={{
                top: positions[index].top,
                left: positions[index].left
              }}
            >
              {OPCIONES_CASILLAS.map((op, idx) => (
                <option key={idx}>{op}</option>
              ))}
            </select>
          )
        })}

        {/* PUNTOS TOTALES */}
        <input
          value={hojaDePuntos.puntos.totales.final}
          type='text'
          className='pointer-events-none appearance-none w-[2rem] h-[2rem] absolute top-[89.7%] left-[90.4%] text-zinc-950 text-center bg-transparent'
          readOnly
        />
      </section>
    </div>
  )
}
