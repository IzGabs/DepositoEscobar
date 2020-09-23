const mysql = require('../mysql')
const connectionPool = mysql;

module.exports = () => {

    const DAO = {}

    ///Quando o usuario deseja realizar uma compra
    DAO.Compra = async (produtos) => {
        try {
            const listProdutos = []

            return result
        } catch (error) {
            console.log(error)
            return { error: error }
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