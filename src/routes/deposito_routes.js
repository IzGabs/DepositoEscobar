const configRoutes = require('express').Router();
const controller = require('../controller/deposito_controller')()


<<<<<<< HEAD
configRoutes.get('/', controller.initPage)

configRoutes.get('/informarDisponibilidade', controller.Informar_Disponibilidade)
=======
configRoutes.get('/inf_disp', controller.Informar_Disponibilidade)
>>>>>>> 82cefa324a51402798ee2ee49c943e738c946353

configRoutes.get('/produtosArmazenados', controller.Produtos_Armazenados)

configRoutes.get('/cotacaoProduto', controller.Cotacao_Produto)

// enviar info do produto q vai comprar
configRoutes.post('/compraProduto', controller.Compra_Produto)

configRoutes.post('/encaminharProduto', controller.Encaminhar_Produto)

configRoutes.get('/informarQuantidade', controller.Informar_Quantidade)

configRoutes.post('/registrarProduto', controller.Registrar_Produto)

module.exports = configRoutes;
