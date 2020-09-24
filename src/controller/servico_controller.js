const mysql = require('../mysql')
const dao = require('../DAO/servico_DAO')()

module.exports = () => {

    const controller = {}

    ///Quando o usuario deseja realizar uma compra
    controller.SeCompra = (req, res) => {
        if (req.body != undefined) {
            if (req.body.id_fornecedor != null && req.body.id_estoque != null) {
                dao.Compra(req.body)
                    .catch((err) => { res.status(404).send(err) })
                    .then((value) => { res.status(200).send(value) })
            } else res.status(400).send(`Precisa do ID do produto`)
        } else res.status(400).send(`Precisa passar os itens que precisa comprar`)
    }


    ///Quando o usuário quer fazer uma venda
    controller.SeVenda = (req, res) => {
        if (req.body != undefined) {
            res.send(`sucess`)
        } else res.status(400).send(`Precisa informar os dados a serem cadastrados`)
    }

    ///Quando realizar uma solicitacao para consumo interno
    controller.SeConsumoInterno = (req, res) => {
        if (req.body != undefined) {
            res.send(`sucess`)
        } else res.status(400).send(`Precisa informar os dados a serem cadastrados`)
    }


    ///QUando o usuario quer informar uma perda de produto
    controller.SePerda = (req, res) => {
        if (req.body != undefined) {
            res.send(`sucess`)
        } else res.status(400).send(`Precisa informar os dados a serem cadastrados`)
    }

    ///Quando o usuario quer devolver um produto
    controller.SeDevolucao = (req, res) => {
        if (req.body != undefined) {
            res.send(`sucess`)
        } else res.status(400).send(`Precisa informar os dados a serem cadastrados`)
    }

    /// ?
    controller.SeAjuste = (req, res) => {
        if (req.body != undefined) {
            res.send(`sucess`)
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


    return controller;
}