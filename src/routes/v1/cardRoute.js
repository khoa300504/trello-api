import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleWare } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleWare.isAuthorized, cardValidation.CreateNew, cardController.CreateNew)

export const cardRoutes = Router