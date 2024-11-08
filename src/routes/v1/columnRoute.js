import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import { authMiddleWare } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleWare.isAuthorized, columnValidation.CreateNew, columnController.CreateNew)

Router.route('/:id')
  .put(authMiddleWare.isAuthorized, columnValidation.update, columnController.update)
  .delete(authMiddleWare.isAuthorized, columnValidation.deleteItem, columnController.deleteItem)

export const columnRoutes = Router