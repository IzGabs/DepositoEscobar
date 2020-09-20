const serviceRoutes = require('express').Router();
const controller = require('../controller/storage_controller')()


serviceRoutes.get('/', controller.initPage)
serviceRoutes.get('/Compra', controller.SeCompra)
serviceRoutes.get('/Venda', controller.SeVenda)
serviceRoutes.get('/ConsInt', controller.SeConsumoInterno)
serviceRoutes.get('/Perda', controller.SePerde)
serviceRoutes.get('/Dev', controller.SeDevolucao)
serviceRoutes.get('/Ajuste', controller.SeAjuste)