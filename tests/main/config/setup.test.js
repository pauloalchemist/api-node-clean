const request = require('supertest')
const app = require('../../../src/main/config/app')

describe('App Setup', () => {
  test('Should disable x-powered-by header', async () => {
    app.get('/testheaders', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/testheaders')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
