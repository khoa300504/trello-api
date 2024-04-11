import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
// import ApiError from '~/utils/apiError'

const CreateNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.CreateNew(req.body)

    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

export const cardController = {
  CreateNew
}
