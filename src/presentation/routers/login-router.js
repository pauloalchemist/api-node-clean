const httpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../errors')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return httpResponse.badRequest(new MissingParamError('email'))
      }

      if (!this.emailValidator.isValid(email)) {
        return httpResponse.badRequest(new InvalidParamError('email'))
      }

      if (!password) {
        return httpResponse.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return httpResponse.unauthorizedError()
      }

      return httpResponse.ok({ accessToken })
    } catch (error) {
      // console.error(error) boa opção para produção
      return httpResponse.serverError()
    }
  }
}
