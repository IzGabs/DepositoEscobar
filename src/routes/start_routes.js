const configRoutes = require('express').Router();
const controller = require('../controller/start_controller')()

configRoutes.get('/', controller.initPage)

module.exports = configRoutes;