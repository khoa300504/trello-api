import { StatusCodes } from 'http-status-codes'
// import { isEqual } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { pickUser } from '~/utils/formartters'

const createNewBoardInvitaion = async (reqBody, inviterId) => {
  try {
    const inviter = await userModel.findOneById(inviterId)

    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)

    const board = await boardModel.findOneById(reqBody.boardId)

    if (!invitee || !inviter || !board) throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, invitee or board not found!')

    // if (isEqual(inviter, invitee)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'You can\u0027t invite yourself')

    const newInvationData = {
      inviterId,
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const createdInvitation = await invitationModel.createNewBoardInvitaion(newInvationData)
    const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }

    return resInvitation
  } catch (error) { throw error }
}

const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUser(userId)
    return getInvitations
  } catch (error) { throw error }
}

export const invitationService = {
  createNewBoardInvitaion,
  getInvitations
}