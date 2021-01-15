const bcrypt = require('bcrypt')
const { MissingParamError } = require('./errors-generics')

module.exports = class Encrypter {
  async compare (value, hash) {
    if (!value) {
      throw new MissingParamError('value')
    }
    if (!hash) {
      throw new MissingParamError('hash')
    }
    const isValid = bcrypt.compare(value, hash)
    return isValid
  }
}
