/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1/index'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import http from 'http'
import socketIo from 'socket.io'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'

var cookieParser = require('cookie-parser')

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())

  app.use(cors(corsOptions))

  //Enable req.file

  //Enable req.body json data
  app.use(express.json())

  //Sử dụng API v1
  app.use('/v1', APIs_V1)

  //Middleware sử lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  // tao 1 server boc app express de lam realtime voi socket.io
  const server = http.createServer(app)

  //Khoi tao io voi server va cors
  const io = socketIo(server, { cors: corsOptions })

  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
  })

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT || 4000, () => {
      console.log(`3. Hi ${env.AUTHOR}, Back-end server is running successfully at PORT: ${process.env.PORT || 4000}`)
    })
  } else {
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local Dev: 3. Hi ${env.AUTHOR}, Back-end server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`)
    })
  }

  exitHook(() => {
    console.log('Disconecting...')
    CLOSE_DB()
    console.log('Disconected!')
  })
}

(async () => {
  try {
    console.log('1. Connecting to MongoDb Clound Atlas....')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Clound Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// console.log('1. Connecting to MongoDb Clound Atlas....')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Clound Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })