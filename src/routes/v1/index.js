import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoute'
import { columnRoutes } from '~/routes/v1/columnRoute'
import { cardRoutes } from '~/routes/v1/cardRoute'
import { userRoute } from './userRoute'

const Router = express.Router()

// Check APIs v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

// Board APIs
Router.use('/boards', boardRoutes)

// Column APIs
Router.use('/columns', columnRoutes)

// Card APIs
Router.use('/cards', cardRoutes)

// User APIs
Router.use('/users', userRoute)

export const APIs_V1 = Router