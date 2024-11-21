import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleWare } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.route('/board')
  .post(authMiddleWare.isAuthorized,
    invitationValidation.createNewBoardInvitaion,
    invitationController.createNewBoardInvitaion
  )

Router.route('/board/:invitationId')
  .put(authMiddleWare.isAuthorized,
    invitationController.updateBoardInvitation
  )

Router.route('/')
  .get(authMiddleWare.isAuthorized,
    invitationController.getInvitations
  )

export const invitationRoute = Router