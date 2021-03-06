const MongoHelper = require('../../../src/infra/helpers/mongo-helper')
const { MissingParamError } = require('../../../src/utils/errors-generics')
const UpdateAccessTokenRepository = require('../../../src/infra/repository/update-access-token-repository')

let userModel, fakeUserId

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe('updateAccessTokenRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 60,
      state: 'any',
      password: 'hashed_password'
    })
    fakeUserId = fakeUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with the given accessToken', async () => {
    const sut = makeSut()
    await sut.update(fakeUserId, 'valid_token')
    const updatedFakeUser = await userModel.findOne({
      _id: fakeUserId
    })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should return throws if no params as provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserId)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
