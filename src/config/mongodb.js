import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

URI = 'mongodb+srv://khoa300504:KSNIijaiPR9QKnUf@trello-api.rsgk0.mongodb.net/?retryWrites=true&w=majority&appName=Trello-Api'

// 1 đối tượng client connect tới mongodb
const mongoClientInstance = new MongoClient(URI, {
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
