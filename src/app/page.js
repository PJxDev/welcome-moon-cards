'use client'

import { useEffect, useState } from 'react'
import { Cartas, Misiones, TIPOS_EMOJIS } from './cartas'
import { useGame } from './hooks/useGame'
import { useHistorial } from './hooks/useHistorial'
import { useHojaPuntos } from './hooks/useHojaPuntos'
import SpaceParticles from './components/SpaceParticles'
import GameHeader from './components/GameHeader'
import MissionCards from './components/MissionCards'
import GameCards from './components/GameCards'
import GameOverModal from './components/GameOverModal'
import HistorialPanel from './components/HistorialPanel'
import AyudaPanel from './components/AyudaPanel'
import HojaPuntosPanel from './components/HojaPuntosPanel'

let lastCartas
let lastMisiones
let lastEstado

export default function Home() {
  const {
    userID,
    setUserID,
    jugadoresServer,
    setJugadoresServer,
    jugadorReady,
    setJugadorReady,
    estadoPartida,
    setEstadoPartida,
    images,
    socket,
    handleSacarTres,
    iniciarPartida,
    finalizarPartida,
    changeImage
  } = useGame()

  const { historial, addLog } = useHistorial()
  const { hojaDePuntos, setHojaDePuntos, conteoFinalDePuntos } = useHojaPuntos()

  const [showAyuda, setShowAyuda] = useState(false)
  const [showHistorial, setShowHistorial] = useState(false)
  const [showHojaPuntos, setShowHojaPuntos] = useState(false)

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

  const handleFinalizarPartida = async () => {
    addLog('🏁 FINALIZANDO PARTIDA', 'finalizar-partida')
    addLog('Calculando puntuaciones finales...', 'calculo-final')

    await conteoFinalDePuntos()

    addLog(`🎯 Tu puntuación final: ${hojaDePuntos.puntos.totales.final} puntos`, 'puntuacion-final')
    addLog('=============', 'espacio-blanco')

    finalizarPartida()
  }

  const handleIniciarPartida = () => {
    setEstadoPartida(1)
    addLog('=============', 'espacio-blanco')
    addLog('🎮 NUEVA PARTIDA INICIADA', 'inicio-partida')
    addLog('Preparando el juego...', 'preparacion')

    setShowAyuda(false)
    setShowHistorial(false)
    setShowHojaPuntos(false)

    iniciarPartida()
  }

  const handleSacarTresCartas = () => {
    if (!jugadorReady) {
      console.log('jugadores no ready')
      addLog('⏳ Esperando a otros jugadores...', 'esperando-jugadores')
      handleSacarTres(false)
    } else {
      console.log('jugadores READY')
      addLog('✅ Todos los jugadores listos', 'jugadores-ready')
      addLog('🃏 Sacando cartas...', 'sacando-cartas')
      handleSacarTres(true)
    }
  }

  useEffect(() => {
    let storedUserID = localStorage.getItem('userID')
    let storedUserName = localStorage.getItem('userName')

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

    // Socket event listeners
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

    socket.on('newCards', (cards) => {
      if (lastCartas && lastCartas.every(c => cards.includes(c))) return
      lastCartas = cards

      console.log('recibiendo cartas')
      if (cards) {
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
          addLog(`  Opcion 1: ${n1.frontal.valor} ${TIPOS_EMOJIS[t1.reverso.tipo]}`, 'carta-1')
          addLog(`   Opcion 2: ${n2.frontal.valor} ${TIPOS_EMOJIS[t2.reverso.tipo]}`, 'carta-2')
          addLog(`    Opcion 3: ${n3.frontal.valor} ${TIPOS_EMOJIS[t3.reverso.tipo]}`, 'carta-3')
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

        if (images.imgMis1 === m1.img && images.imgMis2 === m2.img && images.imgMis3 === m3.img)
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
    <div className='relative min-h-screen w-full overflow-hidden text-neon grid grid-rows-[auto_1fr] items-center justify-items-center gap-4 md:gap-16 font-[family-name:var(--font-geist-sans)]'>
      <SpaceParticles />

      <GameHeader
        estadoPartida={estadoPartida}
        iniciarPartida={handleIniciarPartida}
        finalizarPartida={handleFinalizarPartida}
        handleHojaDeCalle={handleHojaDeCalle}
        handleHistorial={handleHistorial}
        handleAyuda={handleAyuda}
        showHojaPuntos={showHojaPuntos}
        showHistorial={showHistorial}
        showAyuda={showAyuda}
      />

      <main
        className={`w-full h-full flex flex-col p-2 sm:p-4 gap-4 sm:gap-8 row-start-2 items-center ${
          (showAyuda || showHistorial || showHojaPuntos) && 'hidden'
        }`}
      >
        <MissionCards images={images} />

        <button
          onClick={handleSacarTresCartas}
          className='space-button neon-glow z-10 w-40 h-12 sm:w-48 sm:h-16 font-bold text-center py-2 px-4 sm:px-6 rounded-lg transition-all duration-300 disabled:opacity-50 text-sm sm:text-base'
          disabled={jugadorReady}
        >
          {jugadorReady ? 'Esperando...' : 'Sacar tres'}
        </button>

        <GameCards images={images} />
      </main>

      <AyudaPanel showAyuda={showAyuda} />
      <HistorialPanel historial={historial} showHistorial={showHistorial} />
      <HojaPuntosPanel 
        showHojaPuntos={showHojaPuntos} 
        hojaDePuntos={hojaDePuntos}
        setHojaDePuntos={setHojaDePuntos}
        socket={socket}
        userID={userID}
      />

      <GameOverModal estadoPartida={estadoPartida} hojaDePuntos={hojaDePuntos} />
    </div>
  )
}