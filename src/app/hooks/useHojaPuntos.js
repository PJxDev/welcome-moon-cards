
'use client'

import { useState } from 'react'

const initialState = {
  nombre: '',
  casas: {
    c1c1: '', c1c2: '', c1c3: '', c1c4: '', c1c5: '', c1c6: '', c1c7: '', c1c8: '', c1c9: '', c1c10: '',
    c2c1: '', c2c2: '', c2c3: '', c2c4: '', c2c5: '', c2c6: '', c2c7: '', c2c8: '', c2c9: '', c2c10: '', c2c11: '',
    c3c1: '', c3c2: '', c3c3: '', c3c4: '', c3c5: '', c3c6: '', c3c7: '', c3c8: '', c3c9: '', c3c10: '', c3c11: '', c3c12: ''
  },
  piscinas: {
    c1p1: false, c1p2: false, c1p3: false,
    c2p1: false, c2p2: false, c2p3: false,
    c3p1: false, c3p2: false, c3p3: false
  },
  parques: {
    c1pq1: false, c1pq2: false, c1pq3: false,
    c2pq1: false, c2pq2: false, c2pq3: false, c2pq4: false,
    c3pq1: false, c3pq2: false, c3pq3: false, c3pq4: false, c3pq5: false
  },
  vallas: {
    c1v1: false, c1v2: false, c1v3: false, c1v4: false, c1v5: false, c1v6: false, c1v7: false, c1v8: false, c1v9: false,
    c2v1: false, c2v2: false, c2v3: false, c2v4: false, c2v5: false, c2v6: false, c2v7: false, c2v8: false, c2v9: false, c2v10: false,
    c3v1: false, c3v2: false, c3v3: false, c3v4: false, c3v5: false, c3v6: false, c3v7: false, c3v8: false, c3v9: false, c3v10: false, c3v11: false
  },
  puntos: {
    misiones: { m1: '', m2: '', m3: '' },
    parques: { pq1: 0, pq2: 0, pq3: 0 },
    piscinas: 0,
    trabajo: 0,
    banco: {
      banco1: { valor: 1, cantidad: 0, checks: 0 },
      banco2: { valor: 2, cantidad: 0, checks: 0 },
      banco3: { valor: 3, cantidad: 0, checks: 0 },
      banco4: { valor: 4, cantidad: 0, checks: 0 },
      banco5: { valor: 5, cantidad: 0, checks: 0 },
      banco6: { valor: 6, cantidad: 0, checks: 0 }
    },
    bis: 0,
    rotondas: 0,
    pifias: 0,
    totales: {
      misiones: 0, parques: 0, piscinas: 0, trabajo: 0,
      banco1: 0, banco2: 0, banco3: 0, banco4: 0, banco5: 0, banco6: 0,
      bis: 0, rotondas: 0, pifias: 0, final: 0
    }
  }
}

export function useHojaPuntos() {
  const [hojaDePuntos, setHojaDePuntos] = useState(initialState)

  const calculoPuntosFinal = (newValor) => {
    newValor.puntos.totales.final =
      newValor.puntos.totales.misiones +
      newValor.puntos.totales.parques +
      newValor.puntos.totales.piscinas +
      newValor.puntos.totales.trabajo +
      newValor.puntos.totales.banco1 +
      newValor.puntos.totales.banco2 +
      newValor.puntos.totales.banco3 +
      newValor.puntos.totales.banco4 +
      newValor.puntos.totales.banco5 +
      newValor.puntos.totales.banco6 -
      newValor.puntos.totales.bis -
      newValor.puntos.totales.pifias

    setHojaDePuntos(newValor)
    return newValor
  }

  const resetHojasDePuntos = () => {
    setHojaDePuntos(initialState)
  }

  const conteoFinalDePuntos = () => {
    // Esta función será implementada cuando se integre con el socket
    console.log('Conteo final de puntos')
  }

  return {
    hojaDePuntos,
    setHojaDePuntos,
    calculoPuntosFinal,
    resetHojasDePuntos,
    conteoFinalDePuntos
  }
}
