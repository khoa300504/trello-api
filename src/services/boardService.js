/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formartters'
import { boardModel } from '~/models/boardModel'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const CreateNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    //Sau khi xử lí logic ta gọi tới MOdel để lưu vào Database; email, Notification về admin khi có new  board
    const createdBoard = await boardModel.createNew(newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    //Trả kqua về cho controller
    return getNewBoard
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board)
    {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      // column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

export const boardService = {
  CreateNew,
  getDetails
}