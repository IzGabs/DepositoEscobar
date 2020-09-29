const { createPool } = require('mysql');
const mysql = require('../../mysql')
const connectionPool = mysql;

module.exports = () => {
    const thisDAO = {}

    ///Quando o usuario quer devolver um produto
    thisDAO.devolucao = async (body) => {

        try {

            let quantidade = 0
            let itens = []


            const devolucao = await mysql.execute('Insert into devolucao(motivo) Values (?)', [body.motivo])


            for (const element of body.itens) {
                const produto = await mysql.execute('Select * from produto where idProduto   = ? ', [element.id_produto]);

                if (produto[0].estoque_filial_idfilial != body.id_filial) throw `Apenas a filial dona do deposito pode informar a devolucao`


                const item_pedido = await mysql.execute('INSERT INTO item_pedido(produto_idProduto, quantidade, devolucao_idDevolucao )  Values (?, ?, ?)',
                    [produto[0].idProduto, element.quantidade, devolucao.insertId]
                );

                quantidade += element.quantidade

                itens.push({
                    "id_produto": produto[0].idProduto,
                    "Nome_produto": produto[0].nome,
                    "Quantidade": element.quantidade,
                })

            }

            const json = [{
                "informe": `Devolucao informada por id_filial ${body.id_filial}`,
                "itens": itens
            }]

            await mysql.execute('Update devolucao SET quantidade = ?, documento = ?',
                [
                    itens.length,
                    JSON.stringify(json)
                ]
            )


            for (const element of body.itens) {
                if (element.quantidade > 0) {
                    await mysql.execute('UPDATE produto ' +
                        'SET quantidade_em_estoque = (quantidade_em_estoque + ?) ' +
                        'WHERE idProduto = ?',
                        [element.quantidade, element.id_produto])
                }
            }


            const jsonResponse = {
                'Id_Solicitacao': devolucao.insertId,
                "Solicitante: ": `Devolucao informada por ${body.id_filial}`,
                "itens_devolvidos": itens
            }
            return jsonResponse;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }
    return thisDAO
}