var mysql = require('mysql');
require('dotenv/config')

let pool

exports.execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(result)
            }
        });
    })
}

module.exports = {
    getPool: function () {
        if (pool) {
            console.log(`retornando pool ja existente`)
            return pool
        }

        console.log(`criando uma nova pool para utilizar`)

        pool = mysql.createPool({
            "host": `${process.env.MYSQL_HOST}`,
            "user": `${process.env.MYSQL_USER}`,
            "password": `${process.env.MYSQL_PASSWORD}`,
            "database": `${process.env.MYSQL_DATABASE}`,
            "port": `${process.env.MYSQL_PORT}`
        })

        return pool
    }
};