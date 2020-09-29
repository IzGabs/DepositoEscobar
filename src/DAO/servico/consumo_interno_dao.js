const { createPool } = require('mysql');
const mysql = require('../../mysql')
const connectionPool = mysql;

module.exports = () => {
    const thisDAO = {}


    ///Quando realizar uma solicitacao para consumo interno
    thisDAO.consumo_interno = async (body) => {
        try {
            let itens = []

            //Gerar consumointerno
            const consumo_interno = await mysql.execute('INSERT INTO consumointerno(quantidade) VALUES (?)', [0]);


            //Select do produto //Validar se ele pertence a aquela filial
            for (const element of body.consumo_interno) {
                const produto = await mysql.execute('Select * from produto where idProduto   = ? ', [element.id_produto]);
                if (produto[0].estoque_filial_idfilial != body.id_filial) throw `Voce nao tem permissao para adquirir um dos itens`

                //gerar item_pedido
                const item_pedido = await mysql.execute('INSERT INTO item_pedido(produto_idProduto, quantidade, consumointerno_idConsumoInterno)  Values (?, ?, ?)',
                    [produto[0].idProduto, element.quantidade, consumo_interno.insertId]
                );

                itens.push({
                    "id_produto": produto[0].idProduto,
                    "Nome_produto": produto[0].nome,
                    "Quantidade": element.quantidade,
                })
            }

            //Gerar o documento
            await mysql.execute('Update consumointerno SET quantidade = ?, documento = ?',
                [
                    itens.length,
                    `Solicitado por id_filial ${body.id_filial}, itens: ${itens}`
                ]
            )

            //Tirar os itens do banco
            for (const element of body.consumo_interno) {
                if (element.quantidade > 0) {
                    await mysql.execute('UPDATE produto ' +
                        'SET quantidade_em_estoque = (quantidade_em_estoque - ?) ' +
                        'WHERE idProduto = ?',
                        [element.quantidade, element.id_produto])
                }
            }

            return {
                'Id_Solicitacao': consumo_interno.insertId,
                "Solicitante: ": `Solicitado por id_filial ${body.id_filial}`,
                "itens": itens
            };

        } catch (error) {
            console.log(error)
            throw { error: error }
        }
    }

    return thisDAO
}