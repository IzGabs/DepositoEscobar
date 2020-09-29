const { createPool } = require('mysql');
const mysql = require('../../mysql')
const connectionPool = mysql;


module.exports = () => {
    const thisDAO = {}


    ///Quando o usuario deseja realizar uma compra
    thisDAO.Compra = async (body) => {
        try {

            const fornecedor = await mysql.execute(`SELECT * 
            FROM FORNECEDOR WHERE IDFORNECEDOR= ?`, [body.id_fornecedor]);

            if (fornecedor.length > 0) {
                const deposito = await mysql.execute(`SELECT * 
                FROM estoque WHERE IDESTOQUE= ?`, [body.id_estoque])

                if (deposito.length > 0 && deposito[0].filial_idfilial == body.id_filial) {



                    let valorTotal = 0
                    body.compra.forEach(element => { valorTotal += (element.quantidade * element.valor_unitario) })

                    ///Gerar nfc
                    const notaFiscal = await mysql.execute(`INSERT INTO notafiscal (NotaFiscal, Tipo, valor)
                        VALUES(?,?,?)`, [
                        `Essa Nota fiscal foi solicitada por ${body.id_filial} e o pedido está
                        sendo enviado para ${fornecedor[0].nome} no valor de ${valorTotal}`,
                        `0`,
                        valorTotal
                    ])




                    ///Gerar pedido_compra
                    const pedidoCompra = await mysql.execute('INSERT INTO pedido_compra(' +
                        'notafiscal_idNotaFiscal,' +
                        'fornecedor_idFornecedor,' +
                        'estoque_idestoque,' +
                        'estoque_filial_idfilial,' +
                        'estoque_local_idlocal)' +
                        'VALUES(?, ?, ?, ?, ?)',
                        [notaFiscal.insertId,
                        fornecedor[0].idFornecedor,
                        deposito[0].idestoque,
                        deposito[0].filial_idfilial,
                        deposito[0].local_idlocal1])




                    ///Gerar todos os item_compra
                    for (const element of body.compra) {
                        await mysql.execute(`INSERT INTO item_compra
                        (quantidade,
                        produto_idProduto,
                        pedido_compra_idPedido_compra,
                        pedido_compra_notafiscal_idNotaFiscal,
                        pedido_compra_fornecedor_idFornecedor)
                        VALUES( ?, ?, ?, ?, ?)`, [
                            element.quantidade,
                            element.id_produto,
                            pedidoCompra.insertId,
                            notaFiscal.insertId,
                            body.id_fornecedor
                        ])
                    }

                    const data = new Date();
                    const notaFiscal_final = {
                        "id_nota": notaFiscal.insertId,
                        "Nota_text": `Essa Nota fiscal foi solicitada por ${body.id_filial} e o pedido está sendo enviado para ${fornecedor[0].nome} no valor de ${valorTotal}`,
                        "Tipo": "Compra - 0",
                        "Data": data.toLocaleDateString('pt-BR', {
                            timeZone: 'America/Sao_Paulo'
                        }),
                        "Valor": valorTotal

                    }

                    for (const element of body.compra) {
                        await mysql.execute('UPDATE produto SET ' +
                            'preco_compra = ?, ' +
                            'quantidade_em_estoque = (quantidade_em_estoque + ?) ' +
                            'WHERE idProduto = ?',
                            [
                                element.valor_unitario,
                                element.quantidade,
                                element.id_produto
                            ])
                    }

                    return {
                        "message": `PEDIDO ENVIADO PARA O FORNECEDOR`,
                        "NOTA_FISCAL": notaFiscal_final,
                    }

                } else { throw `Esse deposito nao existe ou voce nao tem permissao para fazer um pedido para ele` }
            } else { throw `Nao existe esse fornecedor` }

        } catch (error) {
            console.log(`ERRAO ${error}`)
            throw { error: error }
        }
    }

    return thisDAO
}