import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

const CreateNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      //Xử lý cấu trúc data cho fe trước khi trả dữ liệu về
      getNewColumn.cards = []

      //Cập nhật lại columnOrderIds trong boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

export const columnService = {
  CreateNew
}