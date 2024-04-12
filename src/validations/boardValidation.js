import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const CreateNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(30).required().trim().strict().messages({
      'any.required': 'Title is required (Khoa Custome)',
      'string.empty': 'Cannot be an empty title (Khoa Customize)',
      'string.min': 'Title must at least 3 char (Khoa Customize)',
      'string.max': 'Title must be lower than 30 char (Khoa Customize)',
      'string.trim': 'Title must not has whitespace (Khoa Customize)'
    }),
    description: Joi.string().min(3).max(255).trim().strict().required(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })
  try {
    //AbortEarly là kết thúc báo lỗi ở lỗi đầu mặc định true
    await correctCondition.validateAsync( req.body, { abortEarly: false } )
    //validate data xong thì đi tiếp sang controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(30).trim().strict(),
    description: Joi.string().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })
  try {
    await correctCondition.validateAsync( req.body, {
      //cho phép đẩy lên các field chưa định nghĩa khác title, des, type
      abortEarly: false, allowUnknown: true
    } )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      prevCardOrderIds: Joi.array().required().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
      nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      nextCardOrderIds: Joi.array().required().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
    })
    await correctCondition.validateAsync( req.body, { abortEarly: false } )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  CreateNew,
  update,
  moveCardToDifferentColumn
}