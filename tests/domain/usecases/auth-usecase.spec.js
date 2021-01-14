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
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'qualquer_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })
  return {
    sut,
    loadUserByEmailRepositorySpy,
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
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('qualqueremail@mail.com', 'qualquer senha')
    expect(loadUserByEmailRepositorySpy.email).toBe('qualqueremail@mail.com')
  })

  test('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null // {} representa uma instância do repostitória inválida.
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
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut() // {} representa uma instância do repostitória inválida.
    await sut.auth('qualqueremailValido@mail.com', 'qualquersenha')
    expect(encrypterSpy.password).toBe('qualquersenha')
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password
    )
  })

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut() // {} representa uma instância do repostitória inválida.
    await sut.auth('qualqueremailValido@mail.com', 'qualquersenhaValida')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('Should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut() // {} representa uma instância do repostitória inválida.
    const accessToken = await sut.auth(
      'qualqueremailValido@mail.com',
      'qualquersenhaValida'
    )
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const invalid = {}
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({ loadUserByEmailRepository: null }),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({
        loadUserByEmailRepository
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid
      })
    )
    for (const sut of suts) {
      const promise = sut.auth('qualqueremail@mail.com', 'qualquer senha')
      expect(promise).rejects.toThrow()
    }
  })
})
