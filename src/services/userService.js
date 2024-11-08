import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formartters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { CloundinaryProvider } from '~/providers/CloundinaryProvider'

const createNew = async (reqBody) => {
  try {
    if (await userModel.findOneByEmail(reqBody.email)) throw new ApiError(StatusCodes.CONFLICT, 'Email already exist!')

    const nameFromEmail = reqBody.email.split('@')[0]

    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello: Please verify your email before using our service!'
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely</h3>
    `
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    return pickUser(getNewUser)
  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already activated and ready to use.')

    if (existUser.verifyToken !== reqBody.token) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')

    const updateData = {
      isActive: true,
      verifyToken: null
    }

    return pickUser(await userModel.update(existUser._id, updateData ))
  } catch (error) { throw error }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active yet!')

    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')

    // tao token dang nhap
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
    // const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, 5)
    const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, env.REFRESH_TOKEN_LIFE)
    // const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, 60)

    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
    // const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, 5)

    return { accessToken }
  } catch (error) { throw error }
}

const update = async (userId, reqBody, avatarFile) => {
  try {
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active yet!')
    let updateUser = {}
    if (reqBody.current_password && reqBody.new_password) {
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your current password is incorrect!')
      updateUser = await userModel.update(existUser._id, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    }
    else if (avatarFile) {
      //Cloundinary upload
      const uploadResult = await CloundinaryProvider.streamUpload(avatarFile.buffer, 'users')
      // console.log('🚀 ~ update ~ uploadResult:', uploadResult)
      updateUser = await userModel.update(existUser._id, {
        avatar: uploadResult.secure_url
      })
    }
    else {
      updateUser = await userModel.update(existUser._id, reqBody)
    }
    return pickUser(updateUser)
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}