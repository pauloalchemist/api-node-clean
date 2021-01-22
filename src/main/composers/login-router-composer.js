const LoginRouter = require('../../presentation/routers/login-router')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/email-validator')
const LoadUserByEmailRepository = require('../../infra/repository/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repository/update-access-token-repository')
const Encrypter = require('../../utils/encrypter')
const TokenGenerator = require('../../utils/token-generator')
const env = require('../config/env')

const tokenGenerator = new TokenGenerator(env.tokenSecret)
const encrypter = new Encrypter()
const updateAccessTokenRepository = new UpdateAccessTokenRepository()
const loadUserByEmailRepository = new LoadUserByEmailRepository()
const emailValidator = new EmailValidator()
const authUseCase = new AuthUseCase({
  loadUserByEmailRepository,
  updateAccessTokenRepository,
  encrypter,
  tokenGenerator
})
const loginRouter = new LoginRouter({
  authUseCase,
  emailValidator
})

module.exports = loginRouter
