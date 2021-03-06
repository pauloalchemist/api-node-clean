const request = require('supertest')
const app = require('../../../src/main/config/app')

describe('JSON Parser Middleware', () => {
  test('Should parse body is JSON', async () => {
    app.post('/test_json_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_json_parser')
      .send({ name: 'paulo' })
      .expect({ name: 'paulo' })
  })
})
