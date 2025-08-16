const express = require('express')
const next = require('next')
const cors = require('cors') // <--- Asegúrate de requerir 'cors'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const http = require('http')
const socketIO = require('socket.io')

let lastCartas
let lastMisiones
let lastEstado

app.prepare().then(async () => {
  const server = express()

  server.use(
    cors({
      origin: '*', // Permitir todas las fuentes, puedes ajustar esto según tus necesidades
      methods: ['GET', 'POST'] // Métodos permitidos
    })
  )

  const httpServer = http.createServer(server)
  const io = socketIO(httpServer, {
    cors: {
      origin: '*', // Permitir todas las fuentes, ajusta según sea necesario
      methods: ['GET', 'POST'], // Métodos permitidos
      credentials: true
    }
  })

  const players = {}

  io.on('connection', (socket) => {
    console.log('Connected:', socket.id)

    socket.on('registerPlayer', ({ userID, userAgent }) => {
      if (players[userID]) {
        players[userID].id = socket.id
      } else {
        players[userID] = { id: socket.id, userID, puntos: 0, trabajo: 0, userAgent }
      }

      socket.broadcast.emit('nuevoJugador', { userID })

      io.emit('listaJugadores', players)
      console.log({ players })
    })

    socket.on('accionListarPuntosTrabajo', (data) => {
      const sortedPlayers = Object.values(players).sort(
        (a, b) => b.trabajo - a.trabajo
      )
      let rank = 1
      let lastScore = null
      let rankCount = 0

      sortedPlayers.forEach((player, idx) => {
        if (lastScore === null || player.trabajo < lastScore) {
          rank = rankCount + 1
        }

        lastScore = player.trabajo

        if (rank === 1) players[player.userID].puntos = 7
        if (rank === 2) players[player.userID].puntos = 4
        if (rank === 3) players[player.userID].puntos = 1

        rankCount++
      })

      io.emit('listaPuntosTrabajo', players)
      console.log({ players })
    })

    socket.on('accionEnviarTrabajo', (data) => {
      if (players[data.userID]) {
        players[data.userID].trabajo = data.trabajo
        io.emit('listaJugadores', players)
      } else {
        console.log(`Jugador con userID ${data.userID} no encontrado`)
      }
    })

    socket.on('accionJugadorReady', (data) => {
      if (players[data.userID]) {
        players[data.userID].ready = true
      } else {
        console.log(`Jugador con userID ${data.userID} no encontrado`)
      }

      let playersNotReady = Object.values(players).some(pl => !pl.ready)
      
      if (!playersNotReady) {

        Object.values(players).forEach(pl=>{pl.ready = false})
        io.emit('allPlayersReady', data)
      }
    })

    socket.on('accionSacarCartas', (data) => {
      if (lastCartas === data) return
      lastCartas = data
      console.log('++ NUEVAS CARTAS')
      // Emitir los datos a todos los clientes conectados
      io.emit('newCards', data)
    })

    socket.on('accionSacarMisiones', (data) => {
      if (lastMisiones === data) return
      lastMisiones = data
      console.log('++ NUEVAS MISIONES')
      // Emitir los datos a todos los clientes conectados
      io.emit('newMisionCards', data)
    })

    socket.on('accionEstadoPartida', (data) => {
      if (lastEstado === data) return
      lastEstado = data
      console.log('++ NUEVO ESTADO')
      // Emitir los datos a todos los clientes conectados
      io.emit('newGameStatus', data)
    })

    socket.on('limpiarPlayers', () => {
      for (let id in players) {
        delete players[id]
      }

      console.log(players)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id)
      for (let userID in players) {
        console.log({userID})
        if (players[userID].id === socket.id) {
          delete players[userID]
          console.log(`Jugador desconectado: ${userID}`)
          console.log({jugadoresRestantes: players})
          break
        }
      }
    })
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  const PORT = process.env.PORT || 3000
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
})
