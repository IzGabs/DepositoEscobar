const { createPool } = require('mysql');
const mysql = require('../../mysql')
const connectionPool = mysql;

module.exports = () => {
    const thisDAO = {}

    ///QUando o usuario quer informar uma perda de produto
    thisDAO.perda = async (body) => {

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