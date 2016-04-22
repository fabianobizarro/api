'use strict';
var CategoriaNoticiaRepository = require('../repositories/CategoriaNoticiaRepository'),
    repository = new CategoriaNoticiaRepository();

exports.obterCategoriaNoticia = function (req, res) {
    res.json(req.categoriaNoticia);
}

exports.listarCategoriaNoticias = function (req, res) {
    repository.getAll((err, docs) => {
        res.json(docs);
    });
}

exports.adicionarCategoria = function (req, res, next) {
    let categoriaNoticia = req.body;

    repository.add(categoriaNoticia, (err) => {
        if (err) {
            return next(err);
        }
        else
            res.json({
                resposta: 'Categoria de noícia inserida com sucesso'
            });
    });
}

exports.atualizarCategoria = function (req, res, next) {

    var categoriaNoticia = req.categoriaNoticia;

    categoriaNoticia.nome = req.body.nome;
    categoriaNoticia.descricao = req.body.descricao;   

    repository.update(categoriaNoticia, (err) => {
        if (err)
            return next(err);

        res.json({
            mensagem: 'Categoria de notícia atualizada com sucesso.'
        });
    });
}

exports.excluirCategoria = function (req, res, next) {

    var categoriaNoticia = req.categoriaNoticia;

    repository.delete(categoriaNoticia, (err) => {
        if (err)
            return next(err);

        res.json({
            mensagem: 'Categoria de notícia excluída com sucesso.'
        });
    });

}

exports.categoriaNoticiaPorId = function (req, res, next, id) {

    repository.findById(id, (err, doc) => {

        if (err)
            return next(err);

        if (doc) {
            req.categoriaNoticia = doc;
            next();
        }
        else {
            return next(new Error('Não foi possível encontrar um registro com o id ' + id));
        }
    });
}

exports.pesquisaCategoriaNoticia = function (req, res, next) {

    var search = req.params.q;
    console.log(search)
    console.log([search])
    let query;
    if (search == '') {
        query = {};
    }
    else {
        query = {
            "$or": [
                { "nome": { "$regex": new RegExp(search), '$options': 'i' } },
                { "descricao": { "$regex": new RegExp(search), '$options': 'i' } },
                { "tags": search }
            ]
        };
    }
    console.log(query);

    repository.find(query, (err, data) => {

        if (err)
            return next(err);

        res.json(data);
    });

}