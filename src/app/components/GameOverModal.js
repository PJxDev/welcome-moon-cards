
'use client'

export default function GameOverModal({ estadoPartida, hojaDePuntos }) {
  if (estadoPartida !== 2) return null

  return (
    <div
      onClick={(e) => {
        e.target.style.display = 'none'
      }}
      className='fixed inset-0 w-full h-full flex flex-col items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'
    >
      <div className='flex-col gap-4 z-10 w-96 h-auto p-6 rounded-lg flex justify-center items-center glass-morphism neon-glow'>
        <h1 className='text-3xl font-extrabold text-neon text-center'>JUEGO TERMINADO!</h1>
        <div className='score-display w-full'>
          <h2 className='text-2xl font-bold text-center'>
            TU PUNTUACIÓN ES: 
          </h2>
          <div className='text-4xl font-black text-neon text-center mt-2'>
            {hojaDePuntos.puntos.totales.final}
          </div>
        </div>
        <p className='text-sm opacity-70 text-center'>Toca para cerrar</p>
      </div>
    </div>
  )
}
