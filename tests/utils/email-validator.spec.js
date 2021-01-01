const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

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
})
