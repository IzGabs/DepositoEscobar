const mysql = require('../mysql')
const connectionPool = mysql;

module.exports = () => {

    const DAO = {}

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
    
    return DAO;
}