const EmailValidator = require('../../src/utils/email-validator')
const validator = require('validator')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('Should return true if validator return true', async () => {
    const sut = makeSut()
    const isEmailValid = await sut.isValid('souvalido@mail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator false', async () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = await sut.isValid('insouvalido@mail.com')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', async () => {
    const sut = makeSut()
    await sut.isValid('qualqueremail@mail.com')
    expect(validator.email).toBe('qualqueremail@mail.com')
  })
})
