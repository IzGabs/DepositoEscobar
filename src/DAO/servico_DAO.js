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

    ///Listar todos os depositos de uma filial
    DAO.listar_filiais = async (id) => {
        try {

            return result;
        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    DAO.Cotacao_Produto = async () => {
        try {
            const query = `UPDATE mydb.Produto SET preco_venda = preco_compra*1.1 WHERE idproduto = ?;`;
            const result = await mysql.execute(query, [req.params.idproduto])
            return result
        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }
    
    DAO.Preco_Medio = async () => {
        try {
            const query = `SELECT nome, AVG(preco_venda) AS preco_medio FROM produto WHERE nome = ?;`;
            const result = await mysql.execute(query, [req.body.nome])
            return result
        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    return DAO;
}