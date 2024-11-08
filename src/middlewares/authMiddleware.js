import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

//Xac thuc jwt AccessToken nhan tu fe co hop le k
const isAuthorized = async (req, res, next) => {
  const clinetAccessToken = req.cookies?.accessToken
  if (!clinetAccessToken) {
    next( new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Token not found') )
    return
  }
  try {
    //decoded token
    const accessTokenDecoded = await JwtProvider.verifyToken(clinetAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)

    // neu hop le luu vao req.jwtDecoded de su dung cho request phia sau
    req.jwtDecoded = accessTokenDecoded

    // cho phep request di tiep
    next()
  } catch (error) {
    //Accesstoken het han 410 GONE, bao loi cho fe de goi refreshToken
    if (error?.message?.includes('jwt expired')) {
      next( new ApiError(StatusCodes.GONE, 'Need to refresh token.') )
      return
    }

    //neu k phai het han tra ve 401 de sign out
    next( new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!') )
  }
}

export const authMiddleWare = { isAuthorized }
