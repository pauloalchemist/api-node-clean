const { MissingParamError } = require('../../../src/utils/errors-generics')
const AuthUseCase = require('../../../src/domain/usecases/auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'qualuerToken'
  return tokenGeneratorSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepository.user = {
    id: 'qualquer_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepository
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepository = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase(
    loadUserByEmailRepository,
    encrypterSpy,
    tokenGeneratorSpy
  )
  return {
    sut,
    loadUserByEmailRepository,
    encrypterSpy,
    tokenGeneratorSpy
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
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false // {} representa uma instância do repostitória inválida.
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

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepository, tokenGeneratorSpy } = makeSut() // {} representa uma instância do repostitória inválida.
    await sut.auth('qualqueremailValido@mail.com', 'qualquersenhaValida')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepository.user.id)
  })
})
