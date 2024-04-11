import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Get: API get list board.' })
  })
  .post(boardValidation.CreateNew, boardController.CreateNew)

Router.route('/:id')
  //Get Detail
  .get(boardController.getDetails)
  //Update
  .put(boardValidation.update, boardController.update)

export const boardRoutes = Router