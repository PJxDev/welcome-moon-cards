
'use client'

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
  return (
    <nav className='z-10 relative w-full px-4 py-4 flex gap-2 justify-between items-center glass-morphism'>
      <div className='flex gap-2'>
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
      
      <h1 className='flex-1 text-center font-bold text-5xl p-2 text-neon'>
        WELCOME TO
      </h1>

      <div className='flex gap-2'>
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
    </nav>
  )
}
