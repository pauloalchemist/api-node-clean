const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (id) {
    return jwt.sign(id, 'ohsecret')
  }
}

describe('Token Genarator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = new TokenGenerator()
    jwt.token = null
    const token = await sut.generate('qualquer_id')
    expect(token).toBeNull()
  })

  test('Should return a token if JWT returns token', async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate('qualquer_id')
    expect(token).toBe(jwt.token)
  })
})
