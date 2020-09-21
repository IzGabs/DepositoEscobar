const configRoutes = require('express').Router();
const controller = require('../controller/deposito_controller')()


configRoutes.get('/inf_disp', controller.Informar_Disponibilidade)

configRoutes.get('/prd_arm', controller.Produtos_Armazenados)

configRoutes.get('/cot_prd', controller.Cotacao_Produto)

// enviar info do produto q vai comprar
configRoutes.post('/cmp_prd', controller.Compra_Produto)

configRoutes.post('/enc.prd', controller.Encaminhar_Produto)

configRoutes.get('/inf_quant', controller.Informar_Quantidade)

configRoutes.post('/reg_prd', controller.Registrar_Produto)

module.exports = configRoutes;
