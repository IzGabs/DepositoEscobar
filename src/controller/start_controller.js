const dao = require('../DAO/start_DAO')()

module.exports = () => {

    const controller = {}

    controller.initPage = (req, res) => {

        dao.selectAll(`Um param daora`)
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                res.status(500).send(`ERRO`);
            });
    }

    //alo

    return controller;
}