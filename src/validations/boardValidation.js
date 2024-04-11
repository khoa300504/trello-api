import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

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
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
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

export const boardValidation = {
  CreateNew,
  update
}