import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const CreateNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(30).required().trim().strict().messages({
      'any.required': 'Title is required (Khoa Custome)',
      'string.empty': 'Cannot be an empty title (Khoa Customize)',
      'string.min': 'Title must at least 3 char (Khoa Customize)',
      'string.max': 'Title must be lower than 30 char (Khoa Customize)',
      'string.trim': 'Title must not has whitespace (Khoa Customize)'
    }),
    description: Joi.string().min(3).max(560).trim().strict()
      .required()
  })
  try {
    console.log(req.body)
    //AbortEarly là kết thúc báo lỗi ở lỗi đầu mặc định true
    await correctCondition.validateAsync( req.body )
    // next()
    res.status(StatusCodes.CREATED).json({ message: 'Post from Validation: API create new board.' })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: new Error(error).message })
  }
}

export const boardValidation = {
  CreateNew
}