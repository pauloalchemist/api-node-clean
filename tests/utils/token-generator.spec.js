class TokenGenerator {
  async generate (id) {
    return null
  }
}

describe('Token Genarator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate('qualquer_id')
    expect(token).toBeNull()
  })
})
