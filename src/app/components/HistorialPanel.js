
'use client'

export default function HistorialPanel({ historial, showHistorial }) {
  if (!showHistorial) return null

  return (
    <div className='w-full h-full flex flex-col items-center justify-start p-4 overflow-auto'>
      <div className='glass-morphism rounded-lg p-4 max-w-4xl w-full max-h-[80vh] overflow-auto'>
        <h2 className='text-2xl font-bold text-neon mb-4 text-center'>Historial de Partida</h2>
        {historial.length === 0 ? (
          <p className='text-center opacity-70'>No hay entradas en el historial</p>
        ) : (
          <ul className='space-y-2'>
            {historial.map((reg, idx) => {
              return (
                <li key={reg.id} className='text-base p-2 glass-morphism rounded'>
                  <div className='text-xs opacity-70 mb-1'>
                    {new Date(reg.time).toLocaleTimeString()}
                  </div>
                  <pre className='whitespace-pre-wrap font-mono'>{reg.log}</pre>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
