'use client'

import Image from 'next/image'
import { Cartas, Misiones, TIPOS, TIPOS_EMOJIS } from './cartas'
import { useEffect, useState } from 'react'
// import io from 'socket.io-client'
import io from 'socket.io-client'
const socket = io(process.env.NEXT_PUBLIC_LOCAL_URL, {
  cors: {
    origin: '*' // Si es necesario, ajusta según el origen permitido
  },
  transports: ['polling']
})

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

let lastCartas
let lastMisiones
let lastEstado

export default function Home() {
  const mazo = shuffle([...Cartas])

  const [userID, setUserID] = useState('')
  const [jugadoresServer, setJugadoresServer] = useState({})

  const [isRequestInProgress, setIsRequestInProgress] = useState(false)
  const [showAyuda, setShowAyuda] = useState(false)
  const [showHistorial, setShowHistorial] = useState(false)
  const [showHojaPuntos, setShowHojaPuntos] = useState(false)

  const [jugadorReady, setJugadorReady] = useState(0)

  const [estadoPartida, setEstadoPartida] = useState(0)

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
  const [hojaDePuntos, setHojaDePuntos] = useState({
    nombre: '',
    casas: {
      c1c1: '',
      c1c2: '',
      c1c3: '',
      c1c4: '',
      c1c5: '',
      c1c6: '',
      c1c7: '',
      c1c8: '',
      c1c9: '',
      c1c10: '',
      c2c1: '',
      c2c2: '',
      c2c3: '',
      c2c4: '',
      c2c5: '',
      c2c6: '',
      c2c7: '',
      c2c8: '',
      c2c9: '',
      c2c10: '',
      c2c11: '',
      c3c1: '',
      c3c2: '',
      c3c3: '',
      c3c4: '',
      c3c5: '',
      c3c6: '',
      c3c7: '',
      c3c8: '',
      c3c9: '',
      c3c10: '',
      c3c11: '',
      c3c12: ''
    },
    piscinas: {
      c1p1: false,
      c1p2: false,
      c1p3: false,
      c2p1: false,
      c2p2: false,
      c2p3: false,
      c3p1: false,
      c3p2: false,
      c3p3: false
    },
    parques: {
      c1pq1: false,
      c1pq2: false,
      c1pq3: false,
      c2pq1: false,
      c2pq2: false,
      c2pq3: false,
      c2pq4: false,
      c3pq1: false,
      c3pq2: false,
      c3pq3: false,
      c3pq4: false,
      c3pq5: false
    },
    vallas: {
      c1v1: false,
      c1v2: false,
      c1v3: false,
      c1v4: false,
      c1v5: false,
      c1v6: false,
      c1v7: false,
      c1v8: false,
      c1v9: false,
      c2v1: false,
      c2v2: false,
      c2v3: false,
      c2v4: false,
      c2v5: false,
      c2v6: false,
      c2v7: false,
      c2v8: false,
      c2v9: false,
      c2v10: false,
      c3v1: false,
      c3v2: false,
      c3v3: false,
      c3v4: false,
      c3v5: false,
      c3v6: false,
      c3v7: false,
      c3v8: false,
      c3v9: false,
      c3v10: false,
      c3v11: false
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
        misiones: 0,
        parques: 0,
        piscinas: 0,
        trabajo: 0,
        banco1: 0,
        banco2: 0,
        banco3: 0,
        banco4: 0,
        banco5: 0,
        banco6: 0,
        bis: 0,
        rotondas: 0,
        pifias: 0,
        final: 0
      }
    }
  })

  const [images, setImages] = useState({
    imgTipo1: '/assets/img/dummy.png',
    imgTipo2: '/assets/img/dummy.png',
    imgTipo3: '/assets/img/dummy.png',
    imgNum1: '/assets/img/dummy.png',
    imgNum2: '/assets/img/dummy.png',
    imgNum3: '/assets/img/dummy.png',
    imgMis1: '/assets/img/dummy.png',
    imgMis2: '/assets/img/dummy.png',
    imgMis3: '/assets/img/dummy.png'
  })

  const [mazos, setMazos] = useState({
    mazoTipo1: mazo.slice(0, 27),
    mazoTipo2: mazo.slice(27, 27 * 2),
    mazoTipo3: mazo.slice(27 * 2, 27 * 3),
    mazoNum1: [],
    mazoNum2: [],
    mazoNum3: []
  })

  const changeImage = (imageKey, newUrl) => {
    let newValor = { ...images }

    setImages((prevImages) => ({
      ...prevImages,
      [imageKey]: newUrl
    }))

    newValor[imageKey] = newUrl
  }

  const addLog = (log, tipo) => {
    let time = Date.now()
    let currentHistorial = [...historial]
    if (!currentHistorial.find((reg) => reg.id === `log_${tipo}_${time}`))
      setHistorial((prevHistorial) => [
        ...prevHistorial,
        { id: `log_${tipo}_${time}`, time, log }
      ])
  }

  const handleSacarMisiones = () => {
    let misionesBarajadas = shuffle([...Misiones])
    let misionNivel1 = misionesBarajadas.find((mis) => mis.nivel === 1)
    let misionNivel2 = misionesBarajadas.find((mis) => mis.nivel === 2)
    let misionNivel3 = misionesBarajadas.find((mis) => mis.nivel === 3)

    changeImage('imgMis1', misionNivel1.img)
    changeImage('imgMis2', misionNivel2.img)
    changeImage('imgMis3', misionNivel3.img)

    emitMissionCards([misionNivel1.id, misionNivel2.id, misionNivel3.id])
  }

  const handleSacarTres = (allReady) => {
    //Hay que comprobar si todos los jugadores estan preparados para sacar Cartas
    if (!allReady) {
      console.log('jugadores no ready')
      addLog('⏳ Esperando a otros jugadores...', 'esperando-jugadores')
      setJugadorReady(1)
      emitJugadorReady({ userID })
    } else {
      console.log('jugadores READY')
      addLog('✅ Todos los jugadores listos', 'jugadores-ready')
      addLog('🃏 Sacando cartas...', 'sacando-cartas')
      emitSacarCartas()
    }
  }

  const emitSacarCartas = () => {
    let oldMazoTipo1 = [...mazos.mazoTipo1]
    let oldMazoTipo2 = [...mazos.mazoTipo2]
    let oldMazoTipo3 = [...mazos.mazoTipo3]

    let nuevoNum1 = oldMazoTipo1.pop()
    let nuevoNum2 = oldMazoTipo2.pop()
    let nuevoNum3 = oldMazoTipo3.pop()


    let oldMazoNum1 = [...mazos.mazoNum1, nuevoNum1]
    let oldMazoNum2 = [...mazos.mazoNum2, nuevoNum2]
    let oldMazoNum3 = [...mazos.mazoNum3, nuevoNum3]

    if (!oldMazoTipo1.length || !oldMazoTipo2.length || !oldMazoTipo3.length) {
      let newCartas = Cartas.filter(
        (car) =>
          car.id !== nuevoNum1.id &&
          car.id !== nuevoNum2.id &&
          car.id !== nuevoNum3.id
      )

      let newMazo = shuffle([...newCartas])
      oldMazoTipo1 = newMazo.slice(0, 26)
      oldMazoTipo2 = newMazo.slice(26, 26 * 2)
      oldMazoTipo3 = newMazo.slice(26 * 2, 26 * 3)

      oldMazoNum1 = [nuevoNum1]
      oldMazoNum2 = [nuevoNum2]
      oldMazoNum3 = [nuevoNum3]
    }

    let nuevoTipo1 = oldMazoTipo1[oldMazoTipo1.length - 1]
    let nuevoTipo2 = oldMazoTipo2[oldMazoTipo2.length - 1]
    let nuevoTipo3 = oldMazoTipo3[oldMazoTipo3.length - 1]


    changeImage('imgTipo1', nuevoTipo1.reverso.img)
    changeImage('imgTipo2', nuevoTipo2.reverso.img)
    changeImage('imgTipo3', nuevoTipo3.reverso.img)
    changeImage('imgNum1', nuevoNum1.frontal.img)
    changeImage('imgNum2', nuevoNum2.frontal.img)
    changeImage('imgNum3', nuevoNum3.frontal.img)

    setMazos((prevMazos) => ({
      ...prevMazos,
      ['mazoTipo1']: oldMazoTipo1,
      ['mazoTipo2']: oldMazoTipo2,
      ['mazoTipo3']: oldMazoTipo3,
      ['mazoNum1']: oldMazoNum1,
      ['mazoNum2']: oldMazoNum2,
      ['mazoNum3']: oldMazoNum3
    }))

    lastCartas = [
      nuevoTipo1.id,
      nuevoTipo2.id,
      nuevoTipo3.id,
      nuevoNum1.id,
      nuevoNum2.id,
      nuevoNum3.id
    ]

    emitDrawCards([
      nuevoTipo1.id,
      nuevoTipo2.id,
      nuevoTipo3.id,
      nuevoNum1.id,
      nuevoNum2.id,
      nuevoNum3.id
    ])
  }

  const finalizarPartida = async () => {
    addLog('🏁 FINALIZANDO PARTIDA', 'finalizar-partida')
    addLog('Calculando puntuaciones finales...', 'calculo-final')
    
    await conteoFinalDePuntos()

    // PEDIR LISTA DE JUGADORES PARA SABER LOS PUNTOS TOTALES DE TRABAJO √
    // ENVIAR LOS PUNTOS FINALES
    // PEDIR LA LISTA DE JUGADORES PARA SABER LOS PUNTOS FINALES DE CADA UNO

    addLog(`🎯 Tu puntuación final: ${hojaDePuntos.puntos.totales.final} puntos`, 'puntuacion-final')
    addLog('=============', 'espacio-blanco')
    
    setEstadoPartida(2)
    emitGamestatus({ estadoPartida: 2 })
    socket.emit('limpiarPlayers')
  }

  // Función temporal para probar el historial
  const agregarEntradaHistorial = (mensaje) => {
    const nuevaEntrada = {
      id: Date.now(),
      log: mensaje,
      time: Date.now()
    }
    setHistorial(prev => [...prev, nuevaEntrada])
  }

  const resetHojasDePuntos = () => {
    setHojaDePuntos({
      nombre: '',
      casas: {
        c1c1: '',
        c1c2: '',
        c1c3: '',
        c1c4: '',
        c1c5: '',
        c1c6: '',
        c1c7: '',
        c1c8: '',
        c1c9: '',
        c1c10: '',
        c2c1: '',
        c2c2: '',
        c2c3: '',
        c2c4: '',
        c2c5: '',
        c2c6: '',
        c2c7: '',
        c2c8: '',
        c2c9: '',
        c2c10: '',
        c2c11: '',
        c3c1: '',
        c3c2: '',
        c3c3: '',
        c3c4: '',
        c3c5: '',
        c3c6: '',
        c3c7: '',
        c3c8: '',
        c3c9: '',
        c3c10: '',
        c3c11: '',
        c3c12: ''
      },
      piscinas: {
        c1p1: false,
        c1p2: false,
        c1p3: false,
        c2p1: false,
        c2p2: false,
        c2p3: false,
        c3p1: false,
        c3p2: false,
        c3p3: false
      },
      parques: {
        c1pq1: false,
        c1pq2: false,
        c1pq3: false,
        c2pq1: false,
        c2pq2: false,
        c2pq3: false,
        c2pq4: false,
        c3pq1: false,
        c3pq2: false,
        c3pq3: false,
        c3pq4: false,
        c3pq5: false
      },
      vallas: {
        c1v1: false,
        c1v2: false,
        c1v3: false,
        c1v4: false,
        c1v5: false,
        c1v6: false,
        c1v7: false,
        c1v8: false,
        c1v9: false,
        c2v1: false,
        c2v2: false,
        c2v3: false,
        c2v4: false,
        c2v5: false,
        c2v6: false,
        c2v7: false,
        c2v8: false,
        c2v9: false,
        c2v10: false,
        c3v1: false,
        c3v2: false,
        c3v3: false,
        c3v4: false,
        c3v5: false,
        c3v6: false,
        c3v7: false,
        c3v8: false,
        c3v9: false,
        c3v10: false,
        c3v11: false
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
          misiones: 0,
          parques: 0,
          piscinas: 0,
          trabajo: 0,
          banco1: 0,
          banco2: 0,
          banco3: 0,
          banco4: 0,
          banco5: 0,
          banco6: 0,
          bis: 0,
          rotondas: 0,
          pifias: 0,
          final: 0
        }
      }
    })
  }

  const iniciarPartida = () => {
    //reseteamos las hojas
    resetHojasDePuntos()

    setEstadoPartida(1)
    addLog('=============', 'espacio-blanco')
    addLog('🎮 NUEVA PARTIDA INICIADA', 'inicio-partida')
    addLog('Preparando el juego...', 'preparacion')
    
    handleSacarMisiones()
    let newMazo = shuffle([...Cartas])

    setMazos({
      mazoTipo1: newMazo.slice(0, 27),
      mazoTipo2: newMazo.slice(27, 27 * 2),
      mazoTipo3: newMazo.slice(27 * 2, 27 * 3),
      mazoNum1: [],
      mazoNum2: [],
      mazoNum3: []
    })

    changeImage('imgTipo1', '/assets/img/dummy.png')
    changeImage('imgTipo2', '/assets/img/dummy.png')
    changeImage('imgTipo3', '/assets/img/dummy.png')
    changeImage('imgNum1', '/assets/img/dummy.png')
    changeImage('imgNum2', '/assets/img/dummy.png')
    changeImage('imgNum3', '/assets/img/dummy.png')

    setShowAyuda(false)
    setShowHistorial(false)

    emitGamestatus({ estadoPartida: 1 })
    emitDrawCards([0, 0, 0, 0, 0, 0])
  }

  const handleAyuda = () => {
    setShowAyuda(!showAyuda)
    setShowHojaPuntos(false)
    setShowHistorial(false)
  }
  const handleHistorial = () => {
    setShowHistorial(!showHistorial)
    setShowHojaPuntos(false)
    setShowAyuda(false)
  }
  const handleHojaDeCalle = () => {
    setShowHojaPuntos(!showHojaPuntos)
    setShowHistorial(false)
    setShowAyuda(false)
  }

  const OPCIONES_CASILLAS = [
    '',
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    '1b',
    '2b',
    '3b',
    '4b',
    '5b',
    '6b',
    '7b',
    '8b',
    '9b',
    '10b',
    '11b',
    '12b',
    '13b',
    '14b',
    '15b',
    '16b',
    '17b',
    'R'
  ]

  const conteoFinalDePuntos = () => {
    socket.emit('accionListarPuntosTrabajo', {})
  }

  ///////////=========== MANEJAR INPUTS DE LA HOJA DE PUNTOS
  const handleChangeNombre = (e) => {
    let { name, value } = e.target

    setHojaDePuntos((prevHojaDePuntos) => ({
      ...prevHojaDePuntos,
      [name]: value
    }))
  }
  const handleChangePuntosMisiones = (e) => {
    let { name, value } = e.target
    let newValor = {
      ...hojaDePuntos,
      puntos: {
        ...hojaDePuntos.puntos,
        misiones: {
          ...hojaDePuntos.puntos.misiones,
          [name]: parseInt(value) || ''
        }
      }
    }

    newValor.puntos.totales.misiones =
      (newValor.puntos.misiones.m1 || 0) +
      (newValor.puntos.misiones.m2 || 0) +
      (newValor.puntos.misiones.m3 || 0)

    calculoPuntosFinal(newValor)
  }
  const handleChangeCasas = async (e) => {
    let { name, value } = e.target
    let oldHojaDePuntos = { ...hojaDePuntos }
    let oldVallas = oldHojaDePuntos.vallas
    let oldCasas = oldHojaDePuntos.casas

    oldCasas[name] = value

    if (
      Object.values(oldVallas).some((valla) => valla) &&
      Object.values(oldCasas).some((casa) => casa !== '')
    ) {
      let newHoja = await calculoCasasCalle({
        hoja: oldHojaDePuntos,
        objVallas: oldVallas,
        objCasas: oldCasas
      })
      setHojaDePuntos(newHoja)
    } else {
      setHojaDePuntos(oldHojaDePuntos)
    }
  }
  const handleChangePuntosBanco = (e) => {
    let { name, value } = e.target
    let newValor = { ...hojaDePuntos }
    newValor.puntos.banco[name].cantidad = value || 0
    newValor.puntos.totales[name] =
      newValor.puntos.banco[name].valor * newValor.puntos.banco[name].cantidad

    calculoPuntosFinal(newValor)
  }

  const handleChangePiscinas = (e) => {
    let { name, value, checked } = e.target
    let newValor = {
      ...hojaDePuntos,
      piscinas: { ...hojaDePuntos.piscinas, [name]: checked }
    }

    newValor.puntos.piscinas = 0
    newValor.puntos.piscinas = Object.values(newValor.piscinas).filter(
      (pisc) => pisc === true
    ).length

    switch (newValor.puntos.piscinas) {
      case 0:
        newValor.puntos.totales.piscinas = 0
        break
      case 1:
        newValor.puntos.totales.piscinas = 3
        break
      case 2:
        newValor.puntos.totales.piscinas = 6
        break
      case 3:
        newValor.puntos.totales.piscinas = 9
        break
      case 4:
        newValor.puntos.totales.piscinas = 13
        break
      case 5:
        newValor.puntos.totales.piscinas = 17
        break
      case 6:
        newValor.puntos.totales.piscinas = 21
        break
      case 7:
        newValor.puntos.totales.piscinas = 26
        break
      case 8:
        newValor.puntos.totales.piscinas = 31
        break
      case 9:
        newValor.puntos.totales.piscinas = 36
        break

      default:
        newValor.puntos.totales.piscinas = 0
        break
    }

    calculoPuntosFinal(newValor)
  }
  const handleChangeTrabajo = (e) => {
    let { name, value, checked } = e.target
    let newValor = {
      ...hojaDePuntos
    }

    newValor.puntos.trabajo = checked
      ? newValor.puntos.trabajo + 1
      : newValor.puntos.trabajo - 1
    setHojaDePuntos(newValor)

    emitChangeTrabajo({ userID, trabajo: newValor.puntos.trabajo })
  }

  const handleChangeBancos = (e) => {
    let { name, value, checked } = e.target

    let newValor = { ...hojaDePuntos }

    newValor.puntos.banco[name].checks = checked
      ? newValor.puntos.banco[name].checks + 1
      : newValor.puntos.banco[name].checks - 1

    switch (newValor.puntos.banco[name].checks) {
      case 0:
        if (name === 'banco1') newValor.puntos.banco[name].valor = 1
        if (name === 'banco2') newValor.puntos.banco[name].valor = 2
        if (name === 'banco3') newValor.puntos.banco[name].valor = 3
        if (name === 'banco4') newValor.puntos.banco[name].valor = 4
        if (name === 'banco5') newValor.puntos.banco[name].valor = 5
        if (name === 'banco6') newValor.puntos.banco[name].valor = 6
        break
      case 1:
        if (name === 'banco1') newValor.puntos.banco[name].valor = 3
        if (name === 'banco2') newValor.puntos.banco[name].valor = 3
        if (name === 'banco3') newValor.puntos.banco[name].valor = 4
        if (name === 'banco4') newValor.puntos.banco[name].valor = 5
        if (name === 'banco5') newValor.puntos.banco[name].valor = 6
        if (name === 'banco6') newValor.puntos.banco[name].valor = 7
        break
      case 2:
        if (name === 'banco2') newValor.puntos.banco[name].valor = 4
        if (name === 'banco3') newValor.puntos.banco[name].valor = 5
        if (name === 'banco4') newValor.puntos.banco[name].valor = 6
        if (name === 'banco5') newValor.puntos.banco[name].valor = 7
        if (name === 'banco6') newValor.puntos.banco[name].valor = 8
        break
      case 3:
        if (name === 'banco3') newValor.puntos.banco[name].valor = 6
        if (name === 'banco4') newValor.puntos.banco[name].valor = 7
        if (name === 'banco5') newValor.puntos.banco[name].valor = 8
        if (name === 'banco6') newValor.puntos.banco[name].valor = 10
        break
      case 4:
        if (name === 'banco4') newValor.puntos.banco[name].valor = 8
        if (name === 'banco5') newValor.puntos.banco[name].valor = 10
        if (name === 'banco6') newValor.puntos.banco[name].valor = 12
        break

      default:
        if (name === 'banco1') newValor.puntos.banco[name].valor = 1
        if (name === 'banco2') newValor.puntos.banco[name].valor = 2
        if (name === 'banco3') newValor.puntos.banco[name].valor = 3
        if (name === 'banco4') newValor.puntos.banco[name].valor = 4
        if (name === 'banco5') newValor.puntos.banco[name].valor = 5
        if (name === 'banco6') newValor.puntos.banco[name].valor = 6
        break
    }

    newValor.puntos.totales.banco1 =
      newValor.puntos.banco.banco1.cantidad * newValor.puntos.banco.banco1.valor
    newValor.puntos.totales.banco2 =
      newValor.puntos.banco.banco2.cantidad * newValor.puntos.banco.banco2.valor
    newValor.puntos.totales.banco3 =
      newValor.puntos.banco.banco3.cantidad * newValor.puntos.banco.banco3.valor
    newValor.puntos.totales.banco4 =
      newValor.puntos.banco.banco4.cantidad * newValor.puntos.banco.banco4.valor
    newValor.puntos.totales.banco5 =
      newValor.puntos.banco.banco5.cantidad * newValor.puntos.banco.banco5.valor
    newValor.puntos.totales.banco6 =
      newValor.puntos.banco.banco6.cantidad * newValor.puntos.banco.banco6.valor

    calculoPuntosFinal(newValor)
    setHojaDePuntos(newValor)
  }

  const handleChangeBis = (e) => {
    let { name, value, checked } = e.target
    let newValor = {
      ...hojaDePuntos,
      puntos: {
        ...hojaDePuntos.puntos,
        bis: checked ? hojaDePuntos.puntos.bis + 1 : hojaDePuntos.puntos.bis - 1
      }
    }

    switch (newValor.puntos.bis) {
      case 0:
        newValor.puntos.totales.bis = 0
        break
      case 1:
        newValor.puntos.totales.bis = 1
        break
      case 2:
        newValor.puntos.totales.bis = 3
        break
      case 3:
        newValor.puntos.totales.bis = 6
        break
      case 4:
        newValor.puntos.totales.bis = 9
        break
      case 5:
        newValor.puntos.totales.bis = 12
        break
      case 6:
        newValor.puntos.totales.bis = 16
        break
      case 7:
        newValor.puntos.totales.bis = 20
        break
      case 8:
        newValor.puntos.totales.bis = 24
        break
      case 9:
        newValor.puntos.totales.bis = 28
        break

      default:
        newValor.puntos.totales.bis = 0
        break
    }

    calculoPuntosFinal(newValor)
  }

  const handleChangeRotondas = (e) => {
    let { name, value, checked } = e.target
    let newValor = {
      ...hojaDePuntos,
      puntos: {
        ...hojaDePuntos.puntos,
        rotondas: checked
          ? hojaDePuntos.puntos.rotondas + 1
          : hojaDePuntos.puntos.rotondas - 1
      }
    }

    switch (newValor.puntos.rotondas) {
      case 0:
        newValor.puntos.totales.rotondas = 0
        break
      case 1:
        newValor.puntos.totales.rotondas = 3
        break
      case 2:
        newValor.puntos.totales.rotondas = 8
        break

      default:
        newValor.puntos.totales.rotondas = 0
        break
    }

    switch (newValor.puntos.pifias) {
      case 0:
        newValor.puntos.totales.pifias = 0 + newValor.puntos.totales.rotondas
        break
      case 1:
        newValor.puntos.totales.pifias = 0 + newValor.puntos.totales.rotondas
        break
      case 2:
        newValor.puntos.totales.pifias = 3 + newValor.puntos.totales.rotondas
        break

      case 2:
        newValor.puntos.totales.pifias = 5 + newValor.puntos.totales.rotondas
        break

      default:
        newValor.puntos.totales.pifias = 0 + newValor.puntos.totales.rotondas
        break
    }

    calculoPuntosFinal(newValor)
  }

  const handleChangePifias = (e) => {
    let { name, value, checked } = e.target
    let newValor = {
      ...hojaDePuntos,
      puntos: {
        ...hojaDePuntos.puntos,
        pifias: checked
          ? hojaDePuntos.puntos.pifias + 1
          : hojaDePuntos.puntos.pifias - 1
      }
    }

    switch (newValor.puntos.pifias) {
      case 0:
        newValor.puntos.totales.pifias = 0 + newValor.puntos.totales.rotondas
        break
      case 1:
        newValor.puntos.totales.pifias = 0 + newValor.puntos.totales.rotondas
        break
      case 2:
        newValor.puntos.totales.pifias = 3 + newValor.puntos.totales.rotondas
        break

      case 2:
        newValor.puntos.totales.pifias = 5 + newValor.puntos.totales.rotondas
        break

      default:
        newValor.puntos.totales.pifias = 0 + newValor.puntos.totales.rotondas
        break
    }

    calculoPuntosFinal(newValor)
  }

  const handleChangeParques = (e) => {
    let { name, value, checked } = e.target
    let newValor = {
      ...hojaDePuntos,
      parques: { ...hojaDePuntos.parques, [name]: checked }
    }

    newValor.puntos.parques.pq1 = 0
    newValor.puntos.parques.pq2 = 0
    newValor.puntos.parques.pq3 = 0

    if (newValor.parques.c1pq1) newValor.puntos.parques.pq1 = 2
    if (newValor.parques.c1pq2) newValor.puntos.parques.pq1 = 4
    if (newValor.parques.c1pq3) newValor.puntos.parques.pq1 = 10

    if (newValor.parques.c2pq1) newValor.puntos.parques.pq2 = 2
    if (newValor.parques.c2pq2) newValor.puntos.parques.pq2 = 4
    if (newValor.parques.c2pq3) newValor.puntos.parques.pq2 = 6
    if (newValor.parques.c2pq4) newValor.puntos.parques.pq2 = 14

    if (newValor.parques.c3pq1) newValor.puntos.parques.pq3 = 2
    if (newValor.parques.c3pq2) newValor.puntos.parques.pq3 = 4
    if (newValor.parques.c3pq3) newValor.puntos.parques.pq3 = 6
    if (newValor.parques.c3pq4) newValor.puntos.parques.pq3 = 8
    if (newValor.parques.c3pq5) newValor.puntos.parques.pq3 = 18

    newValor.puntos.totales.parques =
      newValor.puntos.parques.pq1 +
      newValor.puntos.parques.pq2 +
      newValor.puntos.parques.pq3

    calculoPuntosFinal(newValor)
  }

  const handleChangeVallas = async (e) => {
    let { name, value, checked } = e.target

    let oldHojaDePuntos = { ...hojaDePuntos }
    let oldVallas = oldHojaDePuntos.vallas
    let oldCasas = oldHojaDePuntos.casas

    oldVallas[name] = checked

    setHojaDePuntos((prevHojaDePuntos) => ({
      ...prevHojaDePuntos,
      vallas: {
        ...prevHojaDePuntos.vallas,
        [name]: checked
      }
    }))

    if (
      Object.values(oldVallas).some((valla) => valla) &&
      Object.values(oldCasas).some((casa) => casa !== '')
    ) {
      let newHoja = await calculoCasasCalle({
        hoja: oldHojaDePuntos,
        objVallas: oldVallas,
        objCasas: oldCasas
      })
      setHojaDePuntos(newHoja)
    }
  }

  const calculoCasasCalle = async ({ hoja, objVallas, objCasas }) => {
    let sections = []
    let startIndex = 0

    const mapping1 = Object.keys(objCasas).slice(0, 9)
    const divisors1 = Object.keys(objVallas)
      .slice(0, 8)
      .filter((key) => objVallas[key])

    const mapping2 = Object.keys(objCasas).slice(10, 20)
    const divisors2 = Object.keys(objVallas)
      .slice(9, 18)
      .filter((key) => objVallas[key])

    const mapping3 = Object.keys(objCasas).slice(21)
    const divisors3 = Object.keys(objVallas)
      .slice(19)
      .filter((key) => objVallas[key])

    divisors1.forEach((key) => {
      let endIndex = Object.keys(objVallas).indexOf(key)
      if (endIndex >= 0) {
        sections.push(mapping1.slice(startIndex, endIndex + 1))
        startIndex = endIndex + 1
      }
    })

    if (startIndex < mapping1.length) {
      sections.push(mapping1.slice(startIndex))
    }

    startIndex = 0
    divisors2.forEach((key) => {
      let endIndex = Object.keys(objVallas).indexOf(key) - 9

      if (endIndex >= 0) {
        sections.push(mapping2.slice(startIndex, endIndex + 1))
        startIndex = endIndex + 1
      }
    })

    if (startIndex < mapping2.length) {
      sections.push(mapping2.slice(startIndex))
    }

    startIndex = 0
    divisors3.forEach((key) => {
      let endIndex = Object.keys(objVallas).indexOf(key) - 19

      if (endIndex >= 0) {
        sections.push(mapping3.slice(startIndex, endIndex + 1))
        startIndex = endIndex + 1
      }
    })

    if (startIndex < mapping3.length) {
      sections.push(mapping3.slice(startIndex))
    }

    sections = sections.filter((sect) => {
      if (sect.length < 1) return
      return sect.every((cas) => objCasas[cas] !== '')
    })

    hoja.puntos.banco.banco1.cantidad = 0
    hoja.puntos.banco.banco2.cantidad = 0
    hoja.puntos.banco.banco3.cantidad = 0
    hoja.puntos.banco.banco4.cantidad = 0
    hoja.puntos.banco.banco5.cantidad = 0
    hoja.puntos.banco.banco6.cantidad = 0

    if (sections.length > 0) {
      sections.forEach((sect) => {
        hoja.puntos.banco[`banco${sect.length}`].cantidad += 1
      })
    }

    hoja.puntos.totales.banco1 =
      hoja.puntos.banco.banco1.cantidad * hoja.puntos.banco.banco1.valor
    hoja.puntos.totales.banco2 =
      hoja.puntos.banco.banco2.cantidad * hoja.puntos.banco.banco2.valor
    hoja.puntos.totales.banco3 =
      hoja.puntos.banco.banco3.cantidad * hoja.puntos.banco.banco3.valor
    hoja.puntos.totales.banco4 =
      hoja.puntos.banco.banco4.cantidad * hoja.puntos.banco.banco4.valor
    hoja.puntos.totales.banco5 =
      hoja.puntos.banco.banco5.cantidad * hoja.puntos.banco.banco5.valor
    hoja.puntos.totales.banco6 =
      hoja.puntos.banco.banco6.cantidad * hoja.puntos.banco.banco6.valor

    let newHoja = await calculoPuntosFinal(hoja)

    return newHoja
  }

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

  /////////========== COMUNICACION CON EL SOCKET
  // Hay que comunicar Mazos, images, historial, estadoPartida

  const emitDrawCards = (data) => {
    if (isRequestInProgress) {
      console.log('Ya hay una petición en marcha, espera a que termine.')
      return
    }
    setIsRequestInProgress(true)

    console.log('emitiendo draw cards')
    fetch('api/socket', {
      method: 'POST',
      body: JSON.stringify({
        code: 'accionSacarCartas',
        data
      })
    }).then(() => {
      setIsRequestInProgress(false)
    })
  }
  const emitMissionCards = (data) => {
    if (isRequestInProgress) {
      console.log('Ya hay una petición en marcha, espera a que termine.')
      return
    }
    setIsRequestInProgress(true)

    console.log('emitiendo missionCards')
    fetch('api/socket', {
      method: 'POST',
      body: JSON.stringify({
        code: 'accionSacarMisiones',
        data
      })
    }).then(() => {
      setIsRequestInProgress(false)
    })
  }
  const emitGamestatus = (data) => {
    console.log('emitiendo status')
    fetch('api/socket', {
      method: 'POST',
      body: JSON.stringify({
        code: 'accionEstadoPartida',
        data
      })
    })
  }

  const emitChangeTrabajo = (data) => {
    console.log('emitiendo trabajo')
    socket.emit('accionEnviarTrabajo', data)
  }

  const emitJugadorReady = (data) => {
    console.log('emitiendo jugador ready')
    socket.emit('accionJugadorReady', data)
  }

  useEffect(() => {
    let storedUserID = localStorage.getItem('userID')
    let storedUserName = localStorage.getItem('userName')

    //Se Puede usar un numero de letras y digitos aleatorio con: ${Math.random().toString(36).substring(2, 15)}
    if (!storedUserID && !userID) {
      if (!storedUserName) {
        storedUserName = prompt('Indica un nombre para reconocerte:')
      }
      storedUserID = `user_${storedUserName}`
      localStorage.setItem('userID', storedUserID)
      localStorage.setItem('userName', storedUserName)
    }

    setUserID(storedUserID)

    socket.emit('registerPlayer', {
      userID: storedUserID,
      userAgent: navigator.userAgent
    })

    // Conexión establecida
    socket.on('connect', () => {
      console.log('Conectado al servidor')
    })

    socket.on('listaJugadores', (jugadores) => {
      let currentJugadores = { ...jugadoresServer }
      if (currentJugadores === jugadores) return

      console.log('Jugadores conectados:', jugadores)
      setJugadoresServer(jugadores)
    })

    socket.on('listaPuntosTrabajo', (jugadores) => {
      setJugadoresServer(jugadores)

      let newValor = { ...hojaDePuntos }
      newValor.puntos.totales.trabajo = jugadores[storedUserID].puntos

      setHojaDePuntos(newValor)
      calculoPuntosFinal(newValor)
    })

    socket.on('nuevoJugador', (nuevoJugador) => {
      console.log(`Nuevo jugador conectado: ${nuevoJugador.userID}`)
    })

    socket.on('allPlayersReady', (data) => {
      console.log(`Los jugadores estan listos para sacar cartas`)
      setJugadorReady(0)
      if (data.userID === localStorage.getItem('userID')) {
        console.log('YO SACO CARTAS')
        handleSacarTres(true)
      }
    })

    // Escuchar nuevas selecciones de otros jugadores
    socket.on('newCards', (cards) => {
      console.log({ lastCartas })

      if (lastCartas && lastCartas.every(c => cards.includes(c))) return

      lastCartas = cards

      console.log('recibiendo cartas')
      if (cards) {
        console.log(cards)
        if (cards[0] !== 0) {
          let t1 = Cartas.find((car) => car.id === cards[0])
          let t2 = Cartas.find((car) => car.id === cards[1])
          let t3 = Cartas.find((car) => car.id === cards[2])
          let n1 = Cartas.find((car) => car.id === cards[3])
          let n2 = Cartas.find((car) => car.id === cards[4])
          let n3 = Cartas.find((car) => car.id === cards[5])

          changeImage('imgTipo1', t1.reverso.img)
          changeImage('imgTipo2', t2.reverso.img)
          changeImage('imgTipo3', t3.reverso.img)
          changeImage('imgNum1', n1.frontal.img)
          changeImage('imgNum2', n2.frontal.img)
          changeImage('imgNum3', n3.frontal.img)

          addLog('***', 'espacio-cartas')
          addLog(`-> Se robaron tres cartas:`, 'sacar-cartas')
          addLog(
            `  Opcion 1: ${n1.frontal.valor} ${TIPOS_EMOJIS[t1.reverso.tipo]}`,
            'carta-1'
          )
          addLog(
            `   Opcion 2: ${n2.frontal.valor} ${TIPOS_EMOJIS[t2.reverso.tipo]}`,
            'carta-2'
          )
          addLog(
            `    Opcion 3: ${n3.frontal.valor} ${
              TIPOS_EMOJIS[t3.reverso.tipo]
            }`,
            'carta-3'
          )
        } else {
          changeImage('imgTipo1', '/assets/img/dummy.png')
          changeImage('imgTipo2', '/assets/img/dummy.png')
          changeImage('imgTipo3', '/assets/img/dummy.png')
          changeImage('imgNum1', '/assets/img/dummy.png')
          changeImage('imgNum2', '/assets/img/dummy.png')
          changeImage('imgNum3', '/assets/img/dummy.png')
        }
      }
    })
    socket.on('newMisionCards', (data) => {
      if (lastMisiones === data) return
      lastMisiones = data

      console.log('recibiendo misiones')
      if (data) {
        let m1 = Misiones.find((mis) => mis.id === data[0])
        let m2 = Misiones.find((mis) => mis.id === data[1])
        let m3 = Misiones.find((mis) => mis.id === data[2])

        if (
          images.imgMis1 === m1.img &&
          images.imgMis2 === m2.img &&
          images.imgMis3 === m3.img
        )
          return

        addLog('=============', 'espacio-blanco')
        addLog('Se inicio la partida', 'inicio-partida')

        addLog(`  Mision 1: ${m1.id}`, 'mision-1')
        addLog(`   Mision 2: ${m2.id}`, 'mision-2')
        addLog(`    Mision 3: ${m3.id}`, 'mision-3')

        changeImage('imgMis1', m1.img)
        changeImage('imgMis2', m2.img)
        changeImage('imgMis3', m3.img)
      }
    })
    socket.on('newGameStatus', (data) => {
      if (lastEstado === data) return
      lastEstado = data

      console.log('recibiendo status')
      if (data.estadoPartida) setEstadoPartida(data.estadoPartida)
    })
    return () => {
      socket.emit('disconnectPlayer', storedUserID)
    }
  }, [socket])

  return (
    <div className='bg-zinc-900 w-full text-emerald-50 grid grid-rows-[7rem_1fr] items-center justify-items-center min-h-screen gap-16  font-[family-name:var(--font-geist-sans)]'>
      <nav className='px-2 w-full h-full flex flex-row gap-2 justify-between items-center bg-emerald-900'>
        {estadoPartida !== 1 && (
          <button
            onClick={iniciarPartida}
            className='z-10 w-40 h-16 font-bold text-center py-2 px-6 rounded-lg button-shaddow border-2 text-emerald-500 border-emerald-600
          bg-emerald-950 hover:text-emerald-700 hover:border-emerald-700 active:text-emerald-800 active:border-emerald-800 disabled:bg-zinc-950 disabled:text-emerald-900 disabled:border-emerald-900'
          >
            Iniciar Partida
          </button>
        )}
        {estadoPartida === 1 && (
          <button
            onClick={finalizarPartida}
            className='z-10 w-40 h-16 font-bold text-center py-2 px-6 rounded-lg button-shaddow border-2 text-emerald-500 border-emerald-600
        bg-emerald-950 hover:text-emerald-700 hover:border-emerald-700 active:text-emerald-800 active:border-emerald-800 disabled:bg-zinc-950 disabled:text-emerald-900 disabled:border-emerald-900'
          >
            Finalizar Partida
          </button>
        )}
        <h1 className='flex-1 text-center font-bold text-5xl p-2'>
          WELCOME TO
        </h1>

        <button
          onClick={handleHojaDeCalle}
          className='z-10 w-40 h-16 font-bold text-center py-2 px-6 rounded-lg button-shaddow border-2 text-emerald-500 border-emerald-600
          bg-emerald-950 hover:text-emerald-700 hover:border-emerald-700 active:text-emerald-800 active:border-emerald-800 disabled:bg-zinc-950 disabled:text-emerald-900 disabled:border-emerald-900'
        >
          {!showHojaPuntos ? 'Hoja de Calles' : 'Cerrar'}
        </button>
        <button
          onClick={handleHistorial}
          className='z-10 w-40 h-16 font-bold text-center py-2 px-6 rounded-lg button-shaddow border-2 text-emerald-500 border-emerald-600
          bg-emerald-950 hover:text-emerald-700 hover:border-emerald-700 active:text-emerald-800 active:border-emerald-800 disabled:bg-zinc-950 disabled:text-emerald-900 disabled:border-emerald-900'
        >
          {!showHistorial ? 'Historial' : 'Cerrar'}
        </button>
        <button
          onClick={() => agregarEntradaHistorial(`🎲 Acción de prueba - ${new Date().toLocaleTimeString()}`)}
          className='z-10 w-32 h-16 font-bold text-center py-2 px-4 rounded-lg button-shaddow border-2 text-blue-500 border-blue-600
          bg-blue-950 hover:text-blue-700 hover:border-blue-700 active:text-blue-800 active:border-blue-800'
        >
          Test Historial
        </button>
        <button
          onClick={handleAyuda}
          className='z-10 w-40 h-16 font-bold text-center py-2 px-6 rounded-lg button-shaddow border-2 text-emerald-500 border-emerald-600
          bg-emerald-950 hover:text-emerald-700 hover:border-emerald-700 active:text-emerald-800 active:border-emerald-800 disabled:bg-zinc-950 disabled:text-emerald-900 disabled:border-emerald-900'
        >
          {!showAyuda ? 'Ayuda' : 'Cerrar'}
        </button>
      </nav>
      <main
        className={`w-full h-full flex flex-col p-4 gap-8 row-start-2 items-center text-emerald-50 sm:items-start ${
          (showAyuda || showHistorial || showHojaPuntos) && 'hidden'
        }`}
      >
        <section className='w-full flex flex-col border-2 border-emerald-500 relative overflow-hidden'>
          <div className='absolute -top-1/3 -left-["5%"] -translate-y-1/2 rounded-full w-full h-full blur-3xl mix-blend opacity bg-emerald-700 z-0'></div>
          <div className='absolute top-3/4 -left-1/4 -translate-x-1/2 rounded-full w-full h-full blur-3xl mix-blend opacity bg-emerald-600 z-0'></div>

          <div className='z-10 flex-1 flex flex-row flex-wrap justify-center items-center p-2 gap-4  overflow-hidden'>
            <Image
              width={500}
              height={500}
              src={images.imgMis1}
              alt='carta'
              className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
            />
            <Image
              width={500}
              height={500}
              src={images.imgMis2}
              alt='carta'
              className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
            />
            <Image
              width={500}
              height={500}
              src={images.imgMis3}
              alt='carta'
              className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
            />
          </div>
        </section>
        <button
          onClick={handleSacarTres}
          className='z-10 w-40 h-16 font-bold text-center py-2 px-6 rounded-lg button-shaddow border-2 text-emerald-500 border-emerald-600
          bg-emerald-950 hover:text-emerald-700 hover:border-emerald-700 active:text-emerald-800 active:border-emerald-800 disabled:bg-zinc-950 disabled:text-emerald-900 disabled:border-emerald-900'
        >
          {jugadorReady ? 'Esperando...' : 'Sacar tres'}
        </button>
        <section className='w-full flex flex-col p-2 border-2 border-emerald-500 relative overflow-hidden'>
          <div className='absolute -top-1/3 -left-["5%"] -translate-y-1/2 rounded-full w-full h-full blur-3xl mix-blend opacity bg-emerald-700 z-0'></div>
          <div className='absolute top-3/4 -left-1/4 -translate-x-1/2 rounded-full w-full h-full blur-3xl mix-blend opacity bg-emerald-600 z-0'></div>

          <div className='z-10 flex-1 flex-wrap flex flex-row justify-center items-center p-2 gap-4  overflow-hidden'>
            <div className='flex flex-row justify-center items-center p-2 gap-4  overflow-hidden'>
              <Image
                width={500}
                height={500}
                src={images.imgNum1}
                alt='carta'
                className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
              />
              <Image
                width={500}
                height={500}
                src={images.imgTipo1}
                alt='carta'
                className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
              />
            </div>
            <div className=' flex flex-row justify-center items-center p-2 gap-4  overflow-hidden'>
              <Image
                width={500}
                height={500}
                src={images.imgNum2}
                alt='carta'
                className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
              />
              <Image
                width={500}
                height={500}
                src={images.imgTipo2}
                alt='carta'
                className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
              />
            </div>
            <div className='flex flex-row justify-center items-center p-2 gap-4  overflow-hidden'>
              <Image
                width={500}
                height={500}
                src={images.imgNum3}
                alt='carta'
                className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
              />
              <Image
                width={500}
                height={500}
                src={images.imgTipo3}
                alt='carta'
                className='w-auto p-2 object-contain min-w-32 max-h-[18rem]'
              />
            </div>
          </div>
        </section>
      </main>
      {showAyuda && (
        <div className='w-full h-full flex flex-col items-center justify-center'>
          <Image
            width={500}
            height={500}
            src={'/assets/img/ayuda.png'}
            alt='carta'
            className='flex-1 w-auto p-2 object-contain'
          />
        </div>
      )}
      {showHistorial && (
        <div className='w-full h-full flex flex-col items-center justify-center'>
          <ul>
            {historial.map((reg, idx) => {
              // SE PUEDE AÑADIR LA HORA CON: new Date(reg.time).toLocaleString()
              return (
                <li key={reg.id} className='text-xl'>
                  <pre>{reg.log}</pre>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {showHojaPuntos && (
        <div className='w-full h-full flex flex-col items-center justify-center'>
          <section className=' relative w-[50rem] h-[50rem] p-2'>
            <Image
              width={1200}
              height={1200}
              src={'/assets/img/hoja-puntos.png'}
              alt='carta'
              className='w-[50rem] h-[50rem] p-2 object-contain select-none pointer-events-none'
            />
            <input
              name='nombre'
              onChange={handleChangeNombre}
              value={hojaDePuntos.nombre}
              type='text'
              className='w-[6rem] h-[2rem] opacity-50 absolute top-[19%] left-[8%] text-zinc-950 font-bold text-center text-sm'
            />

            {/* CALLE 1 */}
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c1}
              name='c1c1'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[14%] left-[25.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c2}
              name='c1c2'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[14%] left-[32%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c3}
              name='c1c3'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[14.5%] left-[38.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c4}
              name='c1c4'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[14%] left-[45%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c5}
              name='c1c5'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[14%] left-[51.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              value={hojaDePuntos.casas.c1c6}
              onChange={handleChangeCasas}
              name='c1c6'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[14%] left-[58%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c7}
              name='c1c7'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[15%] left-[64.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c8}
              name='c1c8'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[15%] left-[71%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c9}
              name='c1c9'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[14%] left-[77%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c1c10}
              name='c1c10'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[14%] left-[83.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            {/* Piscinas */}
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c1p1}
              name='c1p1'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[12.3%] left-[38.4%] text-zinc-950'
            />
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c1p2}
              name='c1p2'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[12.3%] left-[64.5%] text-zinc-950'
            />
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c1p3}
              name='c1p3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[12.3%] left-[71%] text-zinc-950'
            />
            {/* Parques */}
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c1pq1}
              name='c1pq1'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[7.7%] left-[78.9%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c1pq2}
              name='c1pq2'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[7.7%] left-[82.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c1pq3}
              name='c1pq3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[7.7%] left-[85.3%] text-zinc-950'
            />
            {/* Vallas */}
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v1}
              name='c1v1'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[30.4%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v2}
              name='c1v2'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[36.9%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v3}
              name='c1v3'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[43.4%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v4}
              name='c1v4'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[49.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v5}
              name='c1v5'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[56.3%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v6}
              name='c1v6'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[62.7%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v7}
              name='c1v7'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[69.1%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v8}
              name='c1v8'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[75.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c1v9}
              name='c1v9'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[11.5%] left-[81.8%] text-zinc-950'
            />

            {/* CALLE 2 */}
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c1}
              name='c2c1'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[32%] left-[19%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c2}
              name='c2c2'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[31.2%] left-[25.6%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c3}
              name='c2c3'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[31.2%] left-[32%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c4}
              name='c2c4'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[32.2%] left-[38.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c5}
              name='c2c5'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[31.2%] left-[45%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c6}
              name='c2c6'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[31.2%] left-[51.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c7}
              name='c2c7'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[31.2%] left-[58%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c8}
              name='c2c8'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[32.2%] left-[64.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c9}
              name='c2c9'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[31.2%] left-[70.8%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c10}
              name='c2c10'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[31.2%] left-[77.2%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c2c11}
              name='c2c11'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[31.2%] left-[83.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>

            {/* Piscinas */}
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c2p1}
              name='c2p1'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[29.8%] left-[19.1%] text-zinc-950'
            />
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c2p2}
              name='c2p2'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[29.8%] left-[38.4%] text-zinc-950'
            />
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c2p3}
              name='c2p3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[29.8%] left-[64.4%] text-zinc-950'
            />
            {/* Parques */}
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c2pq1}
              name='c2pq1'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[25%] left-[75.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c2pq2}
              name='c2pq2'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[25%] left-[78.9%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c2pq3}
              name='c2pq3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[25%] left-[82.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c2pq4}
              name='c2pq4'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[25%] left-[85.3%] text-zinc-950'
            />

            {/* Vallas */}
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v1}
              name='c2v1'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[23.9%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v2}
              name='c2v2'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[30.4%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v3}
              name='c2v3'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[36.9%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v4}
              name='c2v4'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[43.4%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v5}
              name='c2v5'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[49.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v6}
              name='c2v6'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[56.3%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v7}
              name='c2v7'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[62.7%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v8}
              name='c2v8'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[69.1%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v9}
              name='c2v9'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[75.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c2v10}
              name='c2v10'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[28.6%] left-[81.8%] text-zinc-950'
            />

            {/* CALLE 3 */}
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c1}
              name='c3c1'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[12.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c2}
              name='c3c2'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48.5%] left-[19%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c3}
              name='c3c3'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[25.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c4}
              name='c3c4'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[32%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c5}
              name='c3c5'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[38.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c6}
              name='c3c6'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[45%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c7}
              name='c3c7'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48.5%] left-[51.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c8}
              name='c3c8'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[58%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c9}
              name='c3c9'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[64.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c10}
              name='c3c10'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[70.8%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c11}
              name='c3c11'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48.5%] left-[77.2%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>
            <select
              onChange={handleChangeCasas}
              value={hojaDePuntos.casas.c3c12}
              name='c3c12'
              className=' appearance-none w-[2rem] h-[3rem] bg-transparent absolute top-[48%] left-[83.5%] text-zinc-950 font-bold text-center'
            >
              {OPCIONES_CASILLAS.map((op, index) => {
                return <option key={index}>{op}</option>
              })}
            </select>

            {/* Piscinas */}
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c3p1}
              name='c3p1'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[46.7%] left-[19%] text-zinc-950'
            />
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c3p2}
              name='c3p2'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[46.7%] left-[51.5%] text-zinc-950'
            />
            <input
              onChange={handleChangePiscinas}
              checked={hojaDePuntos.piscinas.c3p3}
              name='c3p3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[2rem] h-[1rem] absolute top-[46.7%] left-[77.2%] text-zinc-950'
            />
            {/* Parques */}
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c3pq1}
              name='c3pq1'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[42.4%] left-[72.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c3pq2}
              name='c3pq2'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[42.4%] left-[75.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c3pq3}
              name='c3pq3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[42.4%] left-[78.9%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c3pq4}
              name='c3pq4'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[42.4%] left-[82.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeParques}
              checked={hojaDePuntos.parques.c3pq5}
              name='c3pq5'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[42.4%] left-[85.3%] text-zinc-950'
            />

            {/* Vallas */}
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v1}
              name='c3v1'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[17.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v2}
              name='c3v2'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[23.9%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v3}
              name='c3v3'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[30.4%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v4}
              name='c3v4'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[36.9%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v5}
              name='c3v5'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[43.4%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v6}
              name='c3v6'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[49.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v7}
              name='c3v7'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[56.3%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v8}
              name='c3v8'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[62.7%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v9}
              name='c3v9'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[69.1%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v10}
              name='c3v10'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[75.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeVallas}
              checked={hojaDePuntos.vallas.c3v11}
              name='c3v11'
              type='checkbox'
              className='checked:rounded-[100vh] checked:bg-zinc-950 checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[0.5rem] h-[5rem] absolute top-[46%] left-[81.8%] text-zinc-950'
            />

            {/* PUNTOS */}
            {/* Misiones */}
            <input
              onChange={handleChangePuntosMisiones}
              name='m1'
              value={hojaDePuntos.puntos.misiones.m1}
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[67.5%] left-[7.2%] text-zinc-950 text-center bg-transparent'
            />
            <input
              onChange={handleChangePuntosMisiones}
              name='m2'
              value={hojaDePuntos.puntos.misiones.m2}
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[75.2%] left-[7.2%] text-zinc-950 text-center bg-transparent'
            />
            <input
              onChange={handleChangePuntosMisiones}
              name='m3'
              value={hojaDePuntos.puntos.misiones.m3}
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[82.7%] left-[7.2%] text-zinc-950 text-center bg-transparent'
            />
            {/* Parques */}
            <input
              value={hojaDePuntos.puntos.parques.pq1}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[72.9%] left-[15%] text-zinc-950 text-center bg-transparent'
            />
            <input
              value={hojaDePuntos.puntos.parques.pq2}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[77.9%] left-[15%] text-zinc-950 text-center bg-transparent'
            />
            <input
              value={hojaDePuntos.puntos.parques.pq3}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[82.7%] left-[15%] text-zinc-950 text-center bg-transparent'
            />
            {/* Piscinas */}
            <input
              checked={hojaDePuntos.puntos.piscinas > 0}
              type='checkbox'
              className='pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[72%] left-[23.3%] text-zinc-950'
            />
            <input
              checked={hojaDePuntos.puntos.piscinas > 1}
              type='checkbox'
              className='pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[72%] left-[26.4%] text-zinc-950'
            />
            <input
              checked={hojaDePuntos.puntos.piscinas > 2}
              type='checkbox'
              className='pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[75%] left-[23.3%] text-zinc-950'
            />
            <input
              checked={hojaDePuntos.puntos.piscinas > 3}
              type='checkbox'
              className='pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[75%] left-[26.4%] text-zinc-950'
            />
            <input
              checked={hojaDePuntos.puntos.piscinas > 4}
              type='checkbox'
              className='pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[78.2%] left-[23.3%] text-zinc-950'
            />
            <input
              checked={hojaDePuntos.puntos.piscinas > 5}
              type='checkbox'
              className='pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[78.2%] left-[26.4%] text-zinc-950'
            />
            <input
              checked={hojaDePuntos.puntos.piscinas > 6}
              type='checkbox'
              className='pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[81.5%] left-[23.3%] text-zinc-950'
            />
            <input
              checked={hojaDePuntos.puntos.piscinas > 7}
              type='checkbox'
              className=' pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[81.5%] left-[26.4%] text-zinc-950'
            />
            <input
              checked={hojaDePuntos.puntos.piscinas > 8}
              type='checkbox'
              className='pointer-events-none checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[84.5%] left-[23.3%] text-zinc-950'
            />

            {/* Trabajo */}
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 0}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[70.3%] left-[33.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 1}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[70.3%] left-[37.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 2}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[72.2%] left-[35.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 3}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[74.2%] left-[33.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 4}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[74.2%] left-[37.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 5}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[76%] left-[35.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 6}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[77.8%] left-[33.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 7}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[77.8%] left-[37.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 8}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[79.6%] left-[35.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 9}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[81.4%] left-[33.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeTrabajo}
              checked={hojaDePuntos.puntos.trabajo > 10}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[81.4%] left-[37.2%] text-zinc-950'
            />

            {/* Banco */}
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco1.checks > 0}
              name='banco1'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[76.1%] left-[45.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco2.checks > 0}
              name='banco2'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[74.7%] left-[49.6%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco2.checks > 1}
              name='banco2'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[77.5%] left-[49.6%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco3.checks > 0}
              name='banco3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[72.9%] left-[53.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco3.checks > 1}
              name='banco3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[75.7%] left-[53.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco3.checks > 2}
              name='banco3'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[78.4%] left-[53.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco4.checks > 0}
              name='banco4'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[71.4%] left-[58.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco4.checks > 1}
              name='banco4'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[74.2%] left-[58.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco4.checks > 2}
              name='banco4'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[76.9%] left-[58.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco4.checks > 3}
              name='banco4'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[79.6%] left-[58.2%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco5.checks > 0}
              name='banco5'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[70.1%] left-[62.7%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco5.checks > 1}
              name='banco5'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[72.7%] left-[62.7%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco5.checks > 2}
              name='banco5'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[75.3%] left-[62.7%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco5.checks > 3}
              name='banco5'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[78.1%] left-[62.7%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco6.checks > 0}
              name='banco6'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[68.6%] left-[66.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco6.checks > 1}
              name='banco6'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[71.3%] left-[66.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco6.checks > 2}
              name='banco6'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[74%] left-[66.8%] text-zinc-950'
            />
            <input
              onChange={handleChangeBancos}
              checked={hojaDePuntos.puntos.banco.banco6.checks > 3}
              name='banco6'
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[76.8%] left-[66.8%] text-zinc-950'
            />

            {/* BIS */}
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 0}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[69%] left-[74.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 1}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[69%] left-[78%] text-zinc-950'
            />
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 2}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[72.9%] left-[74.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 3}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[72.9%] left-[78%] text-zinc-950'
            />
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 4}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[76.9%] left-[74.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 5}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[76.9%] left-[78%] text-zinc-950'
            />
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 6}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[80.8%] left-[74.5%] text-zinc-950'
            />
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 7}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[80.8%] left-[78%] text-zinc-950'
            />
            <input
              onChange={handleChangeBis}
              checked={hojaDePuntos.puntos.bis > 8}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[84.6%] left-[74.5%] text-zinc-950'
            />

            {/* Rotondas */}
            <input
              onChange={handleChangeRotondas}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[62.9%] left-[84.6%] text-zinc-950'
            />
            <input
              onChange={handleChangeRotondas}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[66.5%] left-[84.6%] text-zinc-950'
            />

            {/* Pifias */}
            <input
              onChange={handleChangePifias}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[74.3%] left-[84.6%] text-zinc-950'
            />
            <input
              onChange={handleChangePifias}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[78.1%] left-[84.6%] text-zinc-950'
            />
            <input
              onChange={handleChangePifias}
              type='checkbox'
              className=' checked:bg-[url(/assets/img/cross-mark.png)] checked:bg-center checked:bg-no-repeat checked:bg-contain appearance-none  w-[1rem] h-[1rem] absolute top-[81.9%] left-[84.6%] text-zinc-950'
            />

            {/* TOTALEES */}
            {/* Misiones */}
            <input
              value={hojaDePuntos.puntos.totales.misiones}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[7.2%] text-zinc-950 text-center bg-transparent'
            />
            {/* Parques */}
            <input
              value={hojaDePuntos.puntos.totales.parques}
              type='text'
              className=' pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[15%] text-zinc-950 text-center bg-transparent'
            />
            {/* Piscinas */}
            <input
              value={hojaDePuntos.puntos.totales.piscinas}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[23.7%] text-zinc-950 text-center bg-transparent'
            />
            {/* Trabajo */}
            <input
              value={hojaDePuntos.puntos.totales.trabajo}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[33.9%] text-zinc-950 text-center bg-transparent'
            />
            {/* Banco */}
            <input
              onChange={handleChangePuntosBanco}
              value={hojaDePuntos.puntos.banco.banco1.cantidad}
              name='banco1'
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[83.9%] left-[44.7%] text-zinc-950 text-center bg-transparent'
            />
            <input
              onChange={handleChangePuntosBanco}
              value={hojaDePuntos.puntos.banco.banco2.cantidad}
              name='banco2'
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[83.9%] left-[49.3%] text-zinc-950 text-center bg-transparent'
            />
            <input
              onChange={handleChangePuntosBanco}
              value={hojaDePuntos.puntos.banco.banco3.cantidad}
              name='banco3'
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[83.9%] left-[53.9%] text-zinc-950 text-center bg-transparent'
            />
            <input
              onChange={handleChangePuntosBanco}
              value={hojaDePuntos.puntos.banco.banco4.cantidad}
              name='banco4'
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[83.9%] left-[58.2%] text-zinc-950 text-center bg-transparent'
            />
            <input
              onChange={handleChangePuntosBanco}
              value={hojaDePuntos.puntos.banco.banco5.cantidad}
              name='banco5'
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[83.9%] left-[63%] text-zinc-950 text-center bg-transparent'
            />
            <input
              onChange={handleChangePuntosBanco}
              value={hojaDePuntos.puntos.banco.banco6.cantidad}
              name='banco6'
              type='text'
              className=' appearance-none  w-[2rem] h-[2rem] absolute top-[83.9%] left-[67.5%] text-zinc-950 text-center bg-transparent'
            />
            <input
              value={hojaDePuntos.puntos.totales.banco1}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[43.7%] text-zinc-950 text-center bg-transparent'
            />
            <input
              value={hojaDePuntos.puntos.totales.banco2}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[48.1%] text-zinc-950 text-center bg-transparent'
            />
            <input
              value={hojaDePuntos.puntos.totales.banco3}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[52.6%] text-zinc-950 text-center bg-transparent'
            />
            <input
              value={hojaDePuntos.puntos.totales.banco4}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[56.9%] text-zinc-950 text-center bg-transparent'
            />
            <input
              value={hojaDePuntos.puntos.totales.banco5}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[61.7%] text-zinc-950 text-center bg-transparent'
            />
            <input
              value={hojaDePuntos.puntos.totales.banco6}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[66.4%] text-zinc-950 text-center bg-transparent'
            />
            {/* BIS */}
            <input
              value={hojaDePuntos.puntos.totales.bis}
              type='text'
              className=' pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[75.4%] text-zinc-950 text-center bg-transparent'
            />
            {/* PIFIAS */}
            <input
              value={hojaDePuntos.puntos.totales.pifias}
              type='text'
              className='pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[83.8%] text-zinc-950 text-center bg-transparent'
            />
            {/* FINAL */}
            <input
              value={hojaDePuntos.puntos.totales.final}
              type='text'
              className=' pointer-events-none appearance-none  w-[2rem] h-[2rem] absolute top-[89.7%] left-[90.4%] text-zinc-950 text-center bg-transparent'
            />
          </section>
        </div>
      )}
      {estadoPartida === 2 && (
        <div
          onClick={(e) => {
            e.target.style.display = 'none'
          }}
          className='absolute w-full h-full flex flex-col items-center justify-center'
        >
          <div className='flex-col gap-4 z-10 w-96 h-40 rounded-lg flex justify-center items-center bg-emerald-500'>
            <h1 className='text-3xl font-extrabold'>JUEGO TERMINADO !</h1>
            <h1 className='text-3xl font-extrabold'>
              TU PUNTUACION ES: {hojaDePuntos.puntos.totales.final}
            </h1>
          </div>
        </div>
      )}
    </div>
  )
}
