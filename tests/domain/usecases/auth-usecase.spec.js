const { MissingParamError } = require('../../../src/utils/errors-generics')

class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }
    await this.loadUserByEmailRepository.load(email)
  }
}

describe('Auth UseCase', () => {
  test('Should throw null if no email is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw null if no password is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('qualqueremail@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    class LoadUserByEmailRepositorySpy {
      async load (email) {
        this.email = email
      }
    }
    const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
    const sut = new AuthUseCase(loadUserByEmailRepository)
    await sut.auth('qualqueremail@mail.com', 'qualquer senha')
    expect(loadUserByEmailRepository.email).toBe('qualqueremail@mail.com')
  })
})
