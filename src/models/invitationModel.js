import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { userModel } from './userModel'
import { boardModel } from './boardModel'


const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string().required().valid(...Object.values(INVITATION_TYPES)),

  boardInvitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string().required().valid(...Object.values(BOARD_INVITATION_STATUS))
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'inviterId', 'inviteeId', 'type', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync( data, { abortEarly: false } )
}

const createNewBoardInvitaion = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    let newInvitationToAdd = {
      ...validData,
      inviterId: new ObjectId(validData.inviterId),
      inviteeId: new ObjectId(validData.inviteeId)
    }

    if (validData.boardInvitation) {
      newInvitationToAdd.boardInvitation = {
        ...validData.boardInvitation,
        boardId: new ObjectId(validData.boardInvitation.boardId)
      }
    }
    return await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitationToAdd)
  } catch (error) {throw new Error(error)}
}

const findOneById = async (invitationId) => {
  try {
    return await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({ _id: new ObjectId(invitationId) })
  } catch (error) {throw new Error(error)}
}

const update = async (invitationId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    if (updateData.boardInvitation) {
      updateData.boardInvitation = {
        ...updateData.boardInvitation,
        boardId: new ObjectId(updateData.boardInvitation.boardId)
      }
    }

    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(invitationId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {throw new Error(error)}
}

const findByUser = async (userId) => {
  try {
    const queryConditions = [
      { inviteeId:  new ObjectId(userId) },
      { _destroy: false }
    ]
    const results = await GET_DB().collection(INVITATION_COLLECTION_NAME).aggregate([
      { $match: { $and:  queryConditions } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'inviterId',
        foreignField: '_id',
        as: 'inviter',
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'inviteeId',
        foreignField: '_id',
        as: 'invitee',
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
      } },
      { $lookup: {
        from: boardModel.BOARD_COLLECTION_NAME,
        localField: 'boardInvitation.boardId',
        foreignField: '_id',
        as: 'board'
      } },
      { $unwind: '$invitee' },
      { $unwind: '$inviter' },
      { $unwind: '$board' }
    ]).toArray()
    return results
  } catch (error) {throw new Error(error)}
}

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewBoardInvitaion,
  findOneById,
  update,
  findByUser
}