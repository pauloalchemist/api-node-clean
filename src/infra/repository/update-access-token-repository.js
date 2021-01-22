const { MissingParamError } = require('../../utils/errors-generics')
const MongoHelper = require('../../infra/helpers/mongo-helper')

module.exports = class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    const db = await MongoHelper.getDb()
    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          accessToken
        }
      }
    )
  }
}