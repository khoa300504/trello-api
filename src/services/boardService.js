/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formartters'

const CreateNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    //Sau khi xử lí logic ta gọi tới MOdel để lưu vào Database; email, Notification về admin khi có new  board
    //....
    //Trả kqua về cho controller
    return newBoard
  } catch (error) { throw error }
}

export const boardService = {
  CreateNew
}