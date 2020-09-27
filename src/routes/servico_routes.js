const serviceRoutes = require('express').Router();
const controller = require('../controller/servico_controller')()


serviceRoutes.post('/RealizarCompra', controller.SeCompra)
serviceRoutes.get('/compra/:id', controller.buscarNota)
serviceRoutes.post('/Venda', controller.SeVenda)
serviceRoutes.post('/ConsumoInterno', controller.SeConsumoInterno)
serviceRoutes.post('/Perda', controller.SePerda)
serviceRoutes.post('/Devolucao', controller.SeDevolucao)
serviceRoutes.post('/Ajuste', controller.SeAjuste)
serviceRoutes.get('/ListarDepositos/:id', controller.listarDepositos)

module.exports = serviceRoutes