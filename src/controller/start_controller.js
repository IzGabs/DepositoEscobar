const mysql = require('../mysql')
const connectionPool = mysql.getPool()

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

    return controller;
}