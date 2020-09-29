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

    return DAO;
}