
'use client'

import { useState, useEffect } from 'react'

export function useHistorial() {
  const [historial, setHistorial] = useState([])

  // Cargar historial desde localStorage al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistorial = localStorage.getItem('gameHistorial')
      if (savedHistorial) {
        try {
          setHistorial(JSON.parse(savedHistorial))
        } catch (error) {
          console.error('Error parsing historial from localStorage:', error)
        }
      }
    }
  }, [])

  // Guardar historial en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== 'undefined' && historial.length > 0) {
      localStorage.setItem('gameHistorial', JSON.stringify(historial))
    }
  }, [historial])

  const addLog = (log, tipo) => {
    let time = Date.now()
    let currentHistorial = [...historial]
    if (!currentHistorial.find((reg) => reg.id === `log_${tipo}_${time}`))
      setHistorial((prevHistorial) => [
        ...prevHistorial,
        { id: `log_${tipo}_${time}`, time, log }
      ])
  }

  return {
    historial,
    addLog
  }
}
