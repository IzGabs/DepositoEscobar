const { createPool } = require('mysql');
const mysql = require('../mysql')
const connectionPool = mysql;

module.exports = () => {

    const DAO = {}


    DAO.buscarNota = async (id) => {
        try {

            const notaFiscal = await mysql.execute(`Select NotaFiscal as Info_Nota, Tipo, Data, valor from notafiscal where idNotaFiscal = ?`,
                [id]
            )

            return notaFiscal

        } catch (error) {
            throw { erro: error }
        }
    }

    ///Quando o usuario deseja realizar uma compra
    DAO.Compra = async (body) => {
        try {

            const fornecedor = await mysql.execute(`SELECT * 
            FROM FORNECEDOR WHERE IDFORNECEDOR= ?`, [body.id_fornecedor]);

            console.log('Fornecedor')

            if (fornecedor.length > 0) {
                const deposito = await mysql.execute(`SELECT * 
                FROM estoque WHERE IDESTOQUE= ?`, [body.id_estoque])

                if (deposito.length > 0 && deposito[0].filial_idfilial == body.id_filial) {



                    let valorTotal = 0
                    body.compra.forEach(element => { valorTotal += (element.quantidade * element.valor_unitario) })

                    ///Gerar nfc
                    const notaFiscal = await mysql.execute(`INSERT INTO notafiscal (NotaFiscal, Tipo, valor)
                        VALUES(?,?,?)`, [
                        `Essa Nota fiscal foi solicitada por ${body.id_filial} e o pedido está
                        sendo enviado para ${fornecedor[0].nome} no valor de ${valorTotal}`,
                        `0`,
                        valorTotal
                    ])




                    ///Gerar pedido_compra
                    const pedidoCompra = await mysql.execute('INSERT INTO pedido_compra(' +
                        'notafiscal_idNotaFiscal,' +
                        'fornecedor_idFornecedor,' +
                        'estoque_idestoque,' +
                        'estoque_filial_idfilial,' +
                        'estoque_local_idlocal)' +
                        'VALUES(?, ?, ?, ?, ?)',
                        [notaFiscal.insertId,
                        fornecedor[0].idFornecedor,
                        deposito[0].idestoque,
                        deposito[0].filial_idfilial,
                        deposito[0].local_idlocal1])




                    ///Gerar todos os item_compra
                    for (const element of body.compra) {
                        await mysql.execute(`INSERT INTO item_compra
                        (quantidade,
                        produto_idProduto,
                        pedido_compra_idPedido_compra,
                        pedido_compra_notafiscal_idNotaFiscal,
                        pedido_compra_fornecedor_idFornecedor)
                        VALUES( ?, ?, ?, ?, ?)`, [
                            element.quantidade,
                            element.id_produto,
                            pedidoCompra.insertId,
                            notaFiscal.insertId,
                            body.id_fornecedor
                        ])
                        console.log(`load`)
                    }

                    ///Responder com a Nota fical
                    const data = new Date();
                    const notaFiscal_final = {
                        "id_nota": notaFiscal.insertId,
                        "Nota_text": `Essa Nota fiscal foi solicitada por ${body.id_filial} e o pedido está sendo enviado para ${fornecedor[0].nome} no valor de ${valorTotal}`,
                        "Tipo": "Compra - 0",
                        "Data": data.toLocaleDateString('pt-BR', {
                            timeZone: 'America/Sao_Paulo'
                        }),
                        "Valor": valorTotal

                    }

                    return {
                        "message": `PEDIDO ENVIADO PARA O FORNECEDOR`,
                        "NOTA_FISCAL": notaFiscal_final,
                    }

                } else { throw `Esse deposito nao existe ou voce nao tem permissao para fazer um pedido para ele` }
            } else { throw `Nao existe esse fornecedor` }

        } catch (error) {
            console.log(`ERRAO ${error}`)
            throw { error: error }
        }
    }


    ///Quando o usuário quer fazer uma venda
    DAO.venda = async (body) => {

        try {

            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    ///Quando realizar uma solicitacao para consumo interno
    DAO.consumo_interno = async (body) => {

        try {

            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    ///QUando o usuario quer informar uma perda de produto
    DAO.perda = async (body) => {

        try {

            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    ///Quando o usuario quer devolver um produto
    DAO.devolucao = async (body) => {

        try {


            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    /// ?
    DAO.ajuste = async (body) => {

        try {

            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }

    }


    DAO.selectAll = async (param) => {
        console.log(param)
        try {
            const result = await mysql.execute(`SELECT * FROM drinks`, [])
            return result
        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    ///Listar todos os depositos de uma filial
    DAO.listar_filiais = async (id) => {
        try {

            return result;
        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    return DAO;
}