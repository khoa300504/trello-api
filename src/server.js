/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1/index'

const START_SERVER = () => {
  const app = express()

  //Enable req.body json data
  app.use(express.json())

  //Sử dụng API v1
  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hi ${env.AUTHOR}, Back-end server is running successfully at hostname: ${env.APP_HOST}, hostport: ${env.APP_PORT}`)
  })

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