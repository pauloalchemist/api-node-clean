const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = bcrypt.compare(value, hash)
    return isValid
  }
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('qualquervalor', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('qualquervalor', 'hashed_value')
    expect(isValid).toBe(false)
  })
})
