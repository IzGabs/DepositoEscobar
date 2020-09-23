const mysql = require('../mysql')
const connectionPool = mysql.getPool()
const dao = require('../DAO/start_DAO')()

module.exports = () => {

    const controller = {}

    controller.initPage = (req, res) => {
        connectionPool.getConnection((error, conn) => {
            if (error) { return res.status(500).send({ error: error }) }
            conn.query(
                'SELECT * FROM drinks',
                (error, result, fields) => {
                    if (error) { return res.status(500).send({ error: error }) }
                    return res.status(200).send({ response: result });
                }
            )
        })
    }

    controller.Informar_Disponibilidade = (req, res) => {
        if (req.params.id!=undefined) { return res.status(200).send({ error: error }) }
        dao.Disponibilidade()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(`ERRO`);
        });

    }

    controller.Produtos_Armazenados = (req, res) => {
        if (req.params.id!=undefined) { return res.status(200).send({ error: error }) }
    }

    controller.Cotacao_Produto = (req, res) => {
        if (req.params.id!=undefined) { return res.status(200).send({ error: error }) }
    }

    controller.Compra_Produto = (req, res) => {
        if (req.params.id!=undefined) { return res.status(200).send({ error: error }) }
    }

    controller.Encaminhar_Produto = (req, res) => {
        if (req.params.id!=undefined) { return res.status(200).send({ error: error }) }
    }
    controller.Informar_Quantidade = (req, res) => {
        if (req.params.id!=undefined) { return res.status(200).send({ error: error }) }
    }
    

    controller.Registrar_Produto = (req, res) => {
        
    }

    return controller;
}