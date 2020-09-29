const { json } = require('express');
const { createPool } = require('mysql');
const mysql = require('../../mysql')
const connectionPool = mysql;

module.exports = () => {
    const thisDAO = {}

    ///QUando o usuario quer informar uma perda de produto
    thisDAO.perda = async (body) => {

        try {
            let quantidade = 0
            let itens = []

            // Gerar ~perda
            const perda = await mysql.execute('Insert into perda(motivo) Values (?)', [body.motivo])

            //Pegar os itens perdidos e inserir na tabela item_pedido (com id perda)
            for (const element of body.itens) {
                const produto = await mysql.execute('Select * from produto where idProduto   = ? ', [element.id_produto]);

                if (produto[0].estoque_filial_idfilial != body.id_filial) throw `Apenas a filial dona do deposito pode informar a perda`

                //gerar item_pedido
                const item_pedido = await mysql.execute('INSERT INTO item_pedido(produto_idProduto, quantidade, perda_idPerda)  Values (?, ?, ?)',
                    [produto[0].idProduto, element.quantidade, perda.insertId]
                );

                quantidade += element.quantidade

                itens.push({
                    "id_produto": produto[0].idProduto,
                    "Nome_produto": produto[0].nome,
                    "Quantidade": element.quantidade,
                })

            }

            //Update na tabela perda com a quantidade e documento
            await mysql.execute('Update perda SET quantidade = ?, documento = ?',
                [
                    itens.length,
                    `Perda informada por id_filial ${body.id_filial}, itens: ${itens}`
                ]
            )

            //Tirar os itens do banco
            for (const element of body.itens) {
                if (element.quantidade > 0) {
                    await mysql.execute('UPDATE produto ' +
                        'SET quantidade_em_estoque = (quantidade_em_estoque - ?) ' +
                        'WHERE idProduto = ?',
                        [element.quantidade, element.id_produto])
                }
            }

            //retornar o Json da perda
            const jsonResponse = {
                'Id_Solicitacao': perda.insertId,
                "Solicitante: ": `Solicitado por id_filial ${body.id_filial}`,
                "itens_perdidos": itens
            }
            return jsonResponse;

        } catch (error) {
            console.log(error)
            throw { error: error }
        }
    }

    return thisDAO
}