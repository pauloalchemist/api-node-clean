module.exports = class ServerError extends Error {
  constructor (paramName) {
    super('Internal error')
    this.name =
      'Foi mal! Tivemos um problema no servidor. Tente novamente já já.'
  }
}
