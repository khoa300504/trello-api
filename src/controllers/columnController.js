import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
// import ApiError from '~/utils/apiError'

const CreateNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.CreateNew(req.body)

    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) { next(error) }
}

export const columnController = {
  CreateNew
}
