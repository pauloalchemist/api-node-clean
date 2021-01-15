const jwt = require('jsonwebtoken')
const { MissingParamError } = require('../../src/utils/errors-generics')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }
    if (!id) {
      throw new MissingParamError('id')
    }
    return jwt.sign(id, this.secret)
  }
}

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
    expect(jwt.id).toBe('qualquer_id')
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Should throw if no secret is proveded', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('qualquer_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('Should throw if no secret is proveded', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
