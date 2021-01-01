const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('Should return true if validator return', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('souvalido@mail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator false', () => {
    validator.isEmailValid = false
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('insouvalido@mail.com')
    expect(isEmailValid).toBe(false)
  })
})
