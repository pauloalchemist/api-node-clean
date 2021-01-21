const MongoHelper = require('../../../src/domain/infra/helpers/mongo-helper')
const { MissingParamError } = require('../../../src/utils/errors-generics')
const UpdateAccessTokenRepository = require('../../../src/domain/infra/repository/update-access-token-repository')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return {
    userModel,
    sut
  }
}

describe('updateAccessTokenRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with the given accessToken', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 60,
      state: 'any',
      password: 'hashed_password'
    })
    await sut.update(fakeUser.ops[0]._id, 'valid_token')
    const updatedFakeUser = await userModel.findOne({
      _id: fakeUser.ops[0]._id
    })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should return throws if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const userModel = db.collection('users')
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 60,
      state: 'any',
      password: 'hashed_password'
    })

    const promise = sut.update(fakeUser.ops[0]._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should return throws if no params as provided', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 60,
      state: 'any',
      password: 'hashed_password'
    })
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUser.ops[0]._id)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
