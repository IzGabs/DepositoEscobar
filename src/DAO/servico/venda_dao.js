const { createPool } = require('mysql');
const mysql = require('../../mysql')
const connectionPool = mysql;


module.exports = () => {
    const thisDAO = {}


    //Quando o usuário quer fazer uma venda
    thisDAO.venda = async (body) => {
        let disponiveis = []
        let indisponiveis = []
        try {
            const estoque = await mysql.execute(`Select * from estoque where idestoque  = ?`,
                [body.id_estoque])

            if (estoque[0].filial_idfilial == body.id_filial) {
                for (const element of body.venda) {
                    const disponibilidade = await mysql.execute(
                        'SELECT quantidade_em_estoque ' +
                        'FROM PRODUTO P ' +
                        'INNER JOIN ESTOQUE E ' +
                        'ON P.estoque_idestoque  = E.idestoque ' +
                        'WHERE p.estoque_idestoque = ? AND p.nome = ?',
                        [body.id_estoque, element.nome_item]
                    )

                    if (disponibilidade[0] != undefined) {
                        if (disponibilidade[0].quantidade_em_estoque >= element.quantidade) {
                            disponiveis.push(element);
                        }
                        else {

                            indisponiveis.push(
                                {
                                    "nome_item": element.nome_item,
                                    "quantidade_estoque": disponibilidade[0].quantidade_em_estoque,
                                    "quantidade_necessaria_compra": element.quantidade,
                                    "Quantidade_a_comprar": (element.quantidade - disponibilidade[0].quantidade_em_estoque)
                                }
                            )
                        }
                    }
                }//FOR OF

                if (indisponiveis.length == 0) {

                    let valorTotal = 0

                    for (const element of body.venda) {
                        valorTotal += (element.valor_unitario * element.quantidade)
                    }



                    const notaFiscal = await mysql.execute(`INSERT INTO notafiscal (NotaFiscal, Tipo, valor)
                    VALUES(?,?,?)`, [
                        `Nota Fiscal de Venda solicitada por ${body.id_filial}`,
                        `1`,
                        valorTotal
                    ])

                    const pedidoVenda = await mysql.execute('INSERT INTO pedido_venda(' +
                        'Valor_total_venda, ' +
                        'notafiscal_idNotaFiscal)' +
                        'VALUES(?, ?)',
                        [valorTotal, notaFiscal.insertId])


                    for (const element of body.venda) {
                        const insertElementVenda = await mysql.execute(
                            'INSERT INTO item_venda(' +
                            'quantidade, pedido_venda_idvenda, pedido_venda_notafiscal_idNotaFiscal,' +
                            'produto_idProduto)' +
                            ' VALUES( ?, ?, ?, ?)',
                            [element.quantidade, pedidoVenda.insertId, notaFiscal.insertId, element.id_produto]
                        )
                    }


                    const data = new Date()
                    const notaFiscal_final = {
                        "id_nota": notaFiscal.insertId,
                        "Nota_text": `Nota Fiscal de Venda solicitada por ${body.id_filial} no valor de  R$ ${valorTotal}`,
                        "Tipo": "Venda - 1",
                        "Data": data.toLocaleDateString('pt-BR', {
                            timeZone: 'America/Sao_Paulo'
                        }),
                        "Valor": `R$ ${valorTotal}`
                    }

                    for (const element of body.venda) {
                        if (element.quantidade > 0) {
                            await mysql.execute('UPDATE produto ' +
                                'SET quantidade_em_estoque = (quantidade_em_estoque - ?) ' +
                                'WHERE idProduto = ?',
                                [element.quantidade, element.id_produto])
                        }
                    }

                    return { "Mensagem": 'Pedido de venda realizado com sucesso', "Nota_fiscal_venda": notaFiscal_final }

                }

                throw {
                    "Mensagem": "Alguns dos produtos solicitados esta em falta no estoque, realize a compra",
                    "Itens_disponiveis": disponiveis,
                    "Itens_Indisponiveis": indisponiveis
                }

            }
            else {

                for (const element of body.venda) {
                    const disponibilidade2 = await mysql.execute(
                        'SELECT quantidade_em_estoque ' +
                        'FROM PRODUTO P ' +
                        'INNER JOIN ESTOQUE E ' +
                        'ON P.estoque_idestoque  = E.idestoque ' +
                        'WHERE p.estoque_idestoque = ? AND p.nome = ?',
                        [body.venda.id_estoque, element.nome_item]
                    )

                    if (disponibilidade2[0].quantidade_em_estoque >= element.quantidade)
                        disponiveis.push(element)
                    else {
                        indisponiveis.push(
                            {
                                "nome_item": element.nome_item,
                                "quantidade_estoque": disponibilidade2[0].quantidade_em_estoque,
                                "quantidade_necessaria_compra": element.quantidade,
                                "Quantidade_a_comprar": (element.quantidade - disponibilidade2[0].quantidade_em_estoque)
                            }
                        )
                    }

                }

                throw {
                    'mensagem': 'Voce nao tem permissao para vender esse produto, porem pode checar a disponibilidade',
                    'itens_disponiveis': disponiveis,
                    'itens_indisponiveis': indisponiveis
                }

            }

        } catch (error) {
            throw { error: error }
        }
    }

    return thisDAO
}