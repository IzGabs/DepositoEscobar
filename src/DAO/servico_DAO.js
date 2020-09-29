const { createPool } = require('mysql');
const mysql = require('../mysql')
const connectionPool = mysql;

module.exports = () => {

    const DAO = {}


    DAO.buscarNota = async (id) => {
        try {

            const notaFiscal = await mysql.execute(`Select NotaFiscal as Info_Nota, Tipo, Data, valor from notafiscal where idNotaFiscal = ?`,
                [id]
            )

            return notaFiscal

        } catch (error) {
            throw { erro: error }
        }
    }

    ///Quando o usuario deseja realizar uma compra
    DAO.Compra = async (body) => {
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
                        console.log(`load`)
                    }

                    ///Responder com a Nota fical
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


    //Quando o usuário quer fazer uma venda
    DAO.venda = async (body) => {
        let disponiveis = []
        let indisponiveis = []

        try {

            const estoque = await mysql.execute(`Select * from estoque where idestoque  = ?`,
                [body.id_estoque])

            if (estoque[0].filial_idfilial == body.id_filial) {
                //Validar se há disponibilidade daqueles produtos no deposito
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
                    //Realizar Cotacao
                    let valorTotal = 0

                    for (const element of body.venda) {
                        valorTotal += (element.valor_unitario * element.quantidade)
                    }


                    //Gerar nota Fiscal de Saida
                    const notaFiscal = await mysql.execute(`INSERT INTO notafiscal (NotaFiscal, Tipo, valor)
                        VALUES(?,?,?)`, [
                        `Nota Fiscal de Venda solicitada por ${body.id_filial}`,
                        `1`,
                        valorTotal
                    ])


                    //Gerar pedido de venda
                    const pedidoVenda = await mysql.execute('INSERT INTO pedido_venda(' +
                        'Valor_total_venda, ' +
                        'notafiscal_idNotaFiscal)' +
                        'VALUES(?, ?)',
                        [valorTotal, notaFiscal.insertId])

                    //Inserir itens na tabela  item_venda
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
                        //Tirar itens do estoque
                        if (element.quantidade > 0) {
                            await mysql.execute('UPDATE produto ' +
                                'SET quantidade_em_estoque = (quantidade_em_estoque - ?) ' +
                                'WHERE idProduto = ?',
                                [element.quantidade, element.id_produto])
                        }
                    }

                    return { "Mensagem": 'Pedido de venda realizado com sucesso', "Nota_fiscal_venda": notaFiscal_final }

                }//Informar que nao ha aquele produto no deposito e que deve ser feita uma compra

                throw {
                    "Mensagem": "Alguns dos produtos solicitados esta em falta no estoque, realize a compra",
                    "Itens_disponiveis": disponiveis,
                    "Itens_Indisponiveis": indisponiveis
                }

            }
            else { //Enviar apenas os dados sobre disponibilidade

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
            console.log(error)
            return { error: error }
        }
    }

    ///Quando realizar uma solicitacao para consumo interno
    DAO.consumo_interno = async (body) => {

        try {

            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    ///QUando o usuario quer informar uma perda de produto
    DAO.perda = async (body) => {

        try {

            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    ///Quando o usuario quer devolver um produto
    DAO.devolucao = async (body) => {

        try {


            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    /// ?
    DAO.ajuste = async (body) => {

        try {

            const response = await mysql.execute();

            return response;

        } catch (error) {
            console.log(error)
            return { error: error }
        }

    }


    DAO.selectAll = async (param) => {
        console.log(param)
        try {
            const result = await mysql.execute(`SELECT * FROM drinks`, [])
            return result
        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    ///Listar todos os depositos de uma filial
    DAO.listar_filiais = async (id) => {
        try {

            return result;
        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    return DAO;
}