import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .post(boardValidation.CreateNew, boardController.CreateNew)

Router.route('/:id')
  //Get Detail
  .get(boardController.getDetails)
  //Update
  .put(boardValidation.update, boardController.update)

Router.route('/supports/moving_card')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoutes = Router