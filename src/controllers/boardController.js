import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/apiError'

const CreateNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)
    // console.log('req.query: ', req.query)
    // console.log('req.params: ', req.params)
    // console.log('req.files: ', req.files)
    // console.log('req.cookies: ', req.cookies)
    // console.log('req.jwtDecoded: ', req.jwtDecoded)

    // throw new ApiError(StatusCodes.CONFLICT, 'Test error')
    //Điều hướng data sang tầng service

    //Có kết quả thì trả về client
    res.status(StatusCodes.CREATED).json({ message: 'Post from Controller: API create new board.' })
  } catch (error) { next(error) }
}

export const boardController = {
  CreateNew
}
