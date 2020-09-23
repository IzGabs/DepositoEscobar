const bodyParser = require('body-parser')
const express = require('express')
const app = express()
require('dotenv/config')

const PORT = process.env.PORT || 3333;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const startRoutesConfig = require('./routes/start_routes')
const servicosRoute = require('./routes/servico_routes')
const depositoRoutes = require('./routes/deposito_routes')

app.listen(PORT, () => { console.log(`Server running in http://localhost:${PORT}`) })

app.use(express.json())
app.use('/', startRoutesConfig)
app.use('/servico', servicosRoute)
app.use('/deposito', depositoRoutes)

app.use((req, res, next) => {
    console.log("Não encontrado")
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});