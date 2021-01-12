const { MissingParamError } = require('../../../src/utils/errors-generics')
const AuthUseCase = require('../../../src/domain/usecases/auth-usecase')

const makeSut = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }
  const encrypterSpy = new EncrypterSpy()

  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepository.user = {
    password: 'hashed_password'
  }
  const sut = new AuthUseCase(loadUserByEmailRepository, encrypterSpy)
  return {
    sut,
    loadUserByEmailRepository,
    encrypterSpy
  }
}

describe('Auth UseCase', () => {
  test('Should throw null if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw null if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('qualqueremail@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    await sut.auth('qualqueremail@mail.com', 'qualquer senha')
    expect(loadUserByEmailRepository.email).toBe('qualqueremail@mail.com')
  })

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('qualqueremail@mail.com', 'qualquer senha')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({}) // {} representa uma instância do repostitória inválida.
    const promise = sut.auth('qualqueremail@mail.com', 'qualquer senha')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    loadUserByEmailRepository.user = null // {} representa uma instância do repostitória inválida.
    const accessToken = await sut.auth(
      'qualqueremailInvalido@mail.com',
      'qualquersenhaValida'
    )
    expect(accessToken).toBeNull()
  })

  test('Should return null if invalid password is provided', async () => {
    const { sut } = makeSut() // {} representa uma instância do repostitória inválida.
    const accessToken = await sut.auth(
      'qualqueremailValido@mail.com',
      'qualquersenhaInvalida'
    )
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepository, encrypterSpy } = makeSut() // {} representa uma instância do repostitória inválida.
    await sut.auth('qualqueremailValido@mail.com', 'qualquersenha')
    expect(encrypterSpy.password).toBe('qualquersenha')
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepository.user.password
    )
  })
})
