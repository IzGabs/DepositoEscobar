const { createPool } = require('mysql');
const mysql = require('../../mysql')
const connectionPool = mysql;

module.exports = () => {
    const thisDAO = {}

    ///Quando o usuario quer devolver um produto
    thisDAO.devolucao = async (body) => {

        try {


            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }
    return thisDAO
}