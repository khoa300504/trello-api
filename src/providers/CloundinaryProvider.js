import cloundinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

//Use v2 to config cloundinary
//https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud

const cloundinaryV2 = cloundinary.v2
cloundinaryV2.config({
  cloud_name: env.CLOUNDINARY_NAME,
  api_key: env.CLOUNDINARY_API_KEY,
  api_secret: env.CLOUNDINARY_API_SECRET
})

const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const steam = cloundinaryV2.uploader.upload_stream({ folder: folderName }, ( err, result ) => {
      if (err) reject(err)
      else resolve(result)
    })
    streamifier.createReadStream(fileBuffer).pipe(steam)
  })
}

export const CloundinaryProvider = { streamUpload }