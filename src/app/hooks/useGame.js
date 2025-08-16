
'use client'

import { useState, useEffect } from 'react'
import { Cartas, Misiones, TIPOS_EMOJIS } from '../cartas'
import io from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_LOCAL_URL, {
  cors: {
    origin: '*'
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

export function useGame() {
  const [userID, setUserID] = useState('')
  const [jugadoresServer, setJugadoresServer] = useState({})
  const [isRequestInProgress, setIsRequestInProgress] = useState(false)
  const [jugadorReady, setJugadorReady] = useState(0)
  const [estadoPartida, setEstadoPartida] = useState(0)
  
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
    mazoTipo1: [],
    mazoTipo2: [],
    mazoTipo3: [],
    mazoNum1: [],
    mazoNum2: [],
    mazoNum3: []
  })

  const changeImage = (imageKey, newUrl) => {
    setImages((prevImages) => ({
      ...prevImages,
      [imageKey]: newUrl
    }))
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

  const handleSacarTres = (allReady = false) => {
    if (!allReady) {
      setJugadorReady(1)
      emitJugadorReady({ userID })
    } else {
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

    setMazos({
      mazoTipo1: oldMazoTipo1,
      mazoTipo2: oldMazoTipo2,
      mazoTipo3: oldMazoTipo3,
      mazoNum1: oldMazoNum1,
      mazoNum2: oldMazoNum2,
      mazoNum3: oldMazoNum3
    })

    emitDrawCards([
      nuevoTipo1.id,
      nuevoTipo2.id,
      nuevoTipo3.id,
      nuevoNum1.id,
      nuevoNum2.id,
      nuevoNum3.id
    ])
  }

  const iniciarPartida = () => {
    setEstadoPartida(1)
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

    emitGamestatus({ estadoPartida: 1 })
    emitDrawCards([0, 0, 0, 0, 0, 0])
  }

  const finalizarPartida = () => {
    setEstadoPartida(2)
    emitGamestatus({ estadoPartida: 2 })
    socket.emit('limpiarPlayers')
  }

  // Socket emission functions
  const emitDrawCards = (data) => {
    if (isRequestInProgress) return
    setIsRequestInProgress(true)

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
    if (isRequestInProgress) return
    setIsRequestInProgress(true)

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
    fetch('api/socket', {
      method: 'POST',
      body: JSON.stringify({
        code: 'accionEstadoPartida',
        data
      })
    })
  }

  const emitJugadorReady = (data) => {
    socket.emit('accionJugadorReady', data)
  }

  return {
    userID,
    setUserID,
    jugadoresServer,
    setJugadoresServer,
    jugadorReady,
    setJugadorReady,
    estadoPartida,
    setEstadoPartida,
    images,
    mazos,
    socket,
    handleSacarTres,
    iniciarPartida,
    finalizarPartida,
    changeImage
  }
}
