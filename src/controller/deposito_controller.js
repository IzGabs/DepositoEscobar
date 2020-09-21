const mysql = require('../mysql')
//const connectionPool = mysql.getPool()

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
        if (req.params.id != undefined && req.params.id != "") {
            res.send(req.params.id)
        } else res.status(404).send('Você precisa passar uma id para poder verificar a disponibilidade')

    }

    controller.Produtos_Armazenados = (req, res) => {

    }

    controller.Cotacao_Produto = (req, res) => {

    }

    controller.Compra_Produto = (req, res) => {

    }

    controller.Encaminhar_Produto = (req, res) => {

    }
    controller.Informar_Quantidade = (req, res) => {

    }

    controller.Registrar_Produto = (req, res) => {

    }

    return controller;
}

// if (req.params.id != null && req.params.id != "") { 

// } else {

//  }