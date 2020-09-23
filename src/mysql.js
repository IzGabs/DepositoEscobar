var mysql = require('mysql');
require('dotenv/config')

const pool = mysql.createPool({
    "host": `${process.env.MYSQL_HOST}`,
    "user": `${process.env.MYSQL_USER}`,
    "password": `${process.env.MYSQL_PASSWORD}`,
    "database": `${process.env.MYSQL_DATABASE}`,
    "port": `${process.env.MYSQL_PORT}`
})

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


