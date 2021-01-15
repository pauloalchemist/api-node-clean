const bcrypt = require('bcrypt')
const Encrypter = require('../../src/utils/encrypter')
const { MissingParamError } = require('../../src/utils/errors-generics')

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('qualquervalor', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('qualquervalor', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('qualquervalor', 'hashed_value')
    expect(bcrypt.value).toBe('qualquervalor')
    expect(bcrypt.hash).toBe('hashed_value')
  })

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('qualquervalor')).rejects.toThrow(
      new MissingParamError('hash')
    )
  })
})
