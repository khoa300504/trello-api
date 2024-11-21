import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloundinaryProvider } from '~/providers/CloundinaryProvider'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      //Cập nhật lại columnOrderIds trong boards
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }

    let updatedCard = {}
    if (cardCoverFile) {
      const uploadResult = await CloundinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    }
    else if (updateData?.commentToAdd) {
      const commentData = {
        userId: userInfo._id,
        userEmail: userInfo.email,
        ...updateData.commentToAdd,
        commentedAt: Date.now()
      }
      updatedCard = await cardModel.unShiftNewComment(cardId, commentData)
    }
    else if (reqBody.incommingMemberInfo) {
      updatedCard = await cardModel.updateMembers(cardId, updateData.incommingMemberInfo)
    } else {
      updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update
}