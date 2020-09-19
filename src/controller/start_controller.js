module.exports = () => {

    const controller = {}

    controller.initPage = (req, res) => {
        return res.send('Alguma coisa ')
    }

    return controller;
}