jest.mock('jsonwebtoken', () => ({
  token: 'qualquer_token',

  sign (payload, secret) {
    this.payload = payload
    this.secret = secret
    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const { MissingParamError } = require('../../src/utils/errors-generics')
const TokenGenerator = require('../../src/utils/token-generator')

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('Token Genarator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('qualquer_id')
    expect(token).toBeNull()
  })

  test('Should return a token if JWT returns token', async () => {
    const sut = makeSut()
    const token = await sut.generate('qualquer_id')
    expect(token).toBe(jwt.token)
  })

  test('Should calls JWT with correct values ', async () => {
    const sut = makeSut()
    await sut.generate('qualquer_id')
    expect(jwt.payload).toEqual({ _id: 'qualquer_id' })
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Should throw if no secret is proveded', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('qualquer_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('Should throw if no id is proveded', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
