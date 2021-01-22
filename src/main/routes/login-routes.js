const { adapt } = require('../adapters/express-route-adapter')
const LoginRouterComposer = require('../composers/login-router-composer')

module.exports = router => {
  router.post('/login', adapt(LoginRouterComposer.compose()))
}
