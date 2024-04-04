import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
// import ApiError from '~/utils/apiError'

const CreateNew = async (req, res, next) => {
  try {
    //req có req.body/quary/params/files/cookie/dwtDecoded....

    // throw new ApiError(StatusCodes.CONFLICT, 'Test error')
    //Điều hướng data sang tầng service để XỬ LÝ LOGIC only sau đó hứng solveddata
    const createdBoard = await boardService.CreateNew(req.body)

    //Có kết quả thì trả về client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  CreateNew
}
