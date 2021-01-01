module.exports = class UnauthorizdError extends Error {
  constructor (paramName) {
    super('UnauthorizedError')
    this.name = 'UnauthorizedError'
  }
}
