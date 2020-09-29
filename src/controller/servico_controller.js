const mysql = require('../mysql')
const dao = require('../DAO/servico_DAO')()
const compraDAO = require('../DAO/servico/compra_dao')()
const vendaDAO = require('../DAO/servico/venda_dao')()
const consumoInternoDAO = require('../DAO/servico/consumo_interno_dao')()
const perdaDAO = require('../DAO/servico/perda_dao')()
const devolucaoDAO = require('../DAO/servico/devolucao_dao')()
const ajusteDAO = require('../DAO/servico/ajuste_dao')()
//const compraDAO = require('../DAO/servico/compra_dao')()

module.exports = () => {

    const controller = {}

    ///Quando o usuario deseja realizar uma compra
    controller.SeCompra = (req, res) => {

        if (req.body.id_fornecedor != undefined && req.body.id_estoque != undefined) {
            compraDAO.Compra(req.body)
                .then((value) => { res.status(200).send(value) })
                .catch((err) => { res.status(404).send(err) })
        } else res.status(400).send(`Precisa do ID do estoque, filial e fornecedor`)
    }

    ///Quando o usuário quer fazer uma venda
    controller.SeVenda = (req, res) => {
        if (req.body.id_filial != undefined && req.body.id_estoque != undefined) {
            vendaDAO.venda(req.body)
                .then((value) => { res.status(200).send(value) })
                .catch((err) => { res.status(404).send(err) })
        } else res.status(400).send(`Id Filial e id estoque sao obrigatorios`)
    }

    ///Quando realizar uma solicitacao para consumo interno
    controller.SeConsumoInterno = (req, res) => {
        if (req.body != undefined) {
            consumoInternoDAO.consumo_interno(req.body)
                .then((value) => { res.status(200).send(value) })
                .catch((err) => { res.status(404).send(err) })
        } else res.status(400).send(`Precisa informar os dados a serem cadastrados`)
    }

    ///Quando o usuario quer informar uma perda de produto
    controller.SePerda = (req, res) => {
        if (req.body != undefined) {
            perdaDAO.perda(req.body)
                .then((value) => { res.status(200).send(value) })
                .catch((err) => { res.status(404).send(err) })
        } else res.status(400).send(`Precisa informar os dados a serem cadastrados`)
    }

    ///Quando o usuario quer devolver um produto
    controller.SeDevolucao = (req, res) => {
        if (req.body != undefined) {
            devolucaoDAO.devolucao(req.body)
                .then((value) => { res.status(200).send(value) })
                .catch((err) => { res.status(404).send(err) })
        } else res.status(400).send(`Precisa informar os dados a serem cadastrados`)
    }

    /// ?
    controller.SeAjuste = (req, res) => {
        if (req.body != undefined) {
            ajusteDAO.ajuste(req.body)
                .then((value) => { res.status(200).send(value) })
                .catch((err) => { res.status(404).send(err) })
        } else res.status(400).send(`Precisa informar os dados a serem cadastrados`)
    }

    ///Listar todos os depositos de uma filial
    controller.listarDepositos = (req, res) => {
        if (req.params.id == undefined) {
            dao.listar_filiais(req.params.id)
                .then((result) => {
                    res.status(200).send(result);
                })
                .catch((err) => {
                    res.status(500).send(`ERRO`);
                });
        } else res.status(400).send(`Precisa informar o id da filial`)
    }

    controller.buscarNota = (req, res) => {
        if (req.params.id != undefined) {
            dao.buscarNota(req.params.id)
                .catch((err) => { res.status(404).send(err) })
                .then((value) => { res.status(200).send(value) })
        } else req.status(400).send(`INFORME UMA ID`)
    }



    return controller;
}