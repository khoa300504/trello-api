import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleWare } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleWare.isAuthorized, boardController.getBoards)
  .post(authMiddleWare.isAuthorized, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  //Get Detail
  .get(authMiddleWare.isAuthorized, boardController.getDetails)
  //Update
  .put(authMiddleWare.isAuthorized, boardValidation.update, boardController.update)

Router.route('/supports/moving_card')
  .put(authMiddleWare.isAuthorized, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoutes = Router