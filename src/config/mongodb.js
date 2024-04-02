import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

// 1 đối tượng client connect tới mongodb
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // chỉ đinh 1 stable api version của mongodb
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// kết nối db
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

// sau khi đảm bảo đã connect tới db thì sẽ lưu và sử dụng biến trello database instance ở nhiều nơi tái sử dụng mà k cần connect lại
export const GET_DB = () => {
  if (!trelloDatabaseInstance)
  {
    throw new Error('Must connect to Database first!')
  }
  return trelloDatabaseInstance
}
