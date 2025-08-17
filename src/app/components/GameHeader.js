
'use client'

import { useState } from 'react'

export default function GameHeader({ 
  estadoPartida, 
  iniciarPartida, 
  finalizarPartida, 
  handleHojaDeCalle, 
  handleHistorial, 
  handleAyuda, 
  showHojaPuntos, 
  showHistorial, 
  showAyuda 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className='z-10 relative w-full px-4 py-4 flex gap-2 justify-between items-center glass-morphism'>
      {/* Desktop Layout */}
      <div className='hidden md:flex gap-2'>
        {estadoPartida !== 1 && (
          <button
            onClick={iniciarPartida}
            className='space-button hover-glow z-10 w-40 h-16 text-sm font-bold text-center py-2 px-6 rounded-lg transition-all duration-300'
          >
            Iniciar Partida
          </button>
        )}
        {estadoPartida === 1 && (
          <button
            onClick={finalizarPartida}
            className='space-button hover-glow z-10 w-40 h-16 text-sm font-bold text-center py-2 px-6 rounded-lg transition-all duration-300'
          >
            Finalizar Partida
          </button>
        )}
      </div>
      
      {/* Mobile Hamburger Button */}
      <div className='md:hidden flex items-center'>
        <button
          onClick={toggleMobileMenu}
          className='space-button hover-glow z-50 w-12 h-12 flex flex-col justify-center items-center rounded-lg transition-all duration-300'
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white my-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      <h1 className='flex-1 text-center font-bold text-3xl md:text-5xl p-2 text-neon'>
        WELCOME TO
      </h1>

      {/* Desktop Right Buttons */}
      <div className='hidden md:flex gap-2'>
        <button
          onClick={handleHojaDeCalle}
          className='space-button hover-glow z-10 w-40 h-16 text-sm font-bold text-center py-2 px-6 rounded-lg transition-all duration-300'
        >
          {!showHojaPuntos ? 'Hoja' : 'Cerrar'}
        </button>
        <button
          onClick={handleHistorial}
          className='space-button hover-glow z-10 w-40 h-16 text-sm font-bold text-center py-2 px-6 rounded-lg transition-all duration-300'
        >
          {!showHistorial ? 'Historial' : 'Cerrar'}
        </button>
        <button
          onClick={handleAyuda}
          className='space-button hover-glow z-10 w-40 h-16 text-sm font-bold text-center py-2 px-6 rounded-lg transition-all duration-300'
        >
          {!showAyuda ? 'Ayuda' : 'Cerrar'}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 glass-morphism z-50 p-4 mt-2 mx-4 rounded-lg'>
          <div className='flex flex-col gap-3'>
            {estadoPartida !== 1 && (
              <button
                onClick={() => {
                  iniciarPartida()
                  setMobileMenuOpen(false)
                }}
                className='space-button hover-glow w-full h-12 text-sm font-bold text-center py-2 px-4 rounded-lg transition-all duration-300'
              >
                Iniciar Partida
              </button>
            )}
            {estadoPartida === 1 && (
              <button
                onClick={() => {
                  finalizarPartida()
                  setMobileMenuOpen(false)
                }}
                className='space-button hover-glow w-full h-12 text-sm font-bold text-center py-2 px-4 rounded-lg transition-all duration-300'
              >
                Finalizar Partida
              </button>
            )}
            <button
              onClick={() => {
                handleHojaDeCalle()
                setMobileMenuOpen(false)
              }}
              className='space-button hover-glow w-full h-12 text-sm font-bold text-center py-2 px-4 rounded-lg transition-all duration-300'
            >
              {!showHojaPuntos ? 'Hoja' : 'Cerrar'}
            </button>
            <button
              onClick={() => {
                handleHistorial()
                setMobileMenuOpen(false)
              }}
              className='space-button hover-glow w-full h-12 text-sm font-bold text-center py-2 px-4 rounded-lg transition-all duration-300'
            >
              {!showHistorial ? 'Historial' : 'Cerrar'}
            </button>
            <button
              onClick={() => {
                handleAyuda()
                setMobileMenuOpen(false)
              }}
              className='space-button hover-glow w-full h-12 text-sm font-bold text-center py-2 px-4 rounded-lg transition-all duration-300'
            >
              {!showAyuda ? 'Ayuda' : 'Cerrar'}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
