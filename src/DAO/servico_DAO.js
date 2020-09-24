const mysql = require('../mysql')
const connectionPool = mysql;

module.exports = () => {

    const DAO = {}

    ///Quando o usuario deseja realizar uma compra
    DAO.Compra = async (body) => {
        try {

            const fornecedor = await mysql.execute(`SELECT * 
            FROM FORNECEDOR WHERE IDFORNECEDOR= ?`, [body.id_fornecedor]);

            if (fornecedor.length > 0) {
                const deposito = await mysql.execute(`SELECT * 
                FROM estoque WHERE IDESTOQUE= ?`, [body.id_estoque])

                console.log(1);

                if (deposito.length > 0) {

                    console.log(body.compra.length);
                    for (let index = 0; index < body.compra.length; index++) {
                        const element = body.compra[index]

                        const produto = await mysql.execute(
                            `SELECT * FROM PRODUTO WHERE IDPRODUTO= ?`, [element.id_produto])


                        const valorTotal = (produto[0].preco_compra * element.quantidade)

                        await mysql.execute('INSERT INTO compra' +
                            '(Fornecedor_idFornecedor, quantidade, ValorTotal)' +
                            `VALUES(${body.id_fornecedor}, ${element.quantidade},${valorTotal})`)

                    }
                    ///GERAR NFC
                    return { "message": `PEDIDO ENVIADO PARA O FORNECEDOR` }
                } else { throw `Esse deposito nao existe` }
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