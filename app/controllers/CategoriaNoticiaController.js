'use strict';
var CategoriaNoticiaRepository = require('../repositories/CategoriaNoticiaRepository'),
    repository = new CategoriaNoticiaRepository(),
    NoticiaRepository = require('../repositories/NoticiaRepository'),
    noticiaRepo = new NoticiaRepository();

exports.obterCategoriaNoticia = function (req, res) {
    res.json(req.categoriaNoticia);
};

exports.listarCategoriaNoticias = function (req, res) {
    repository.getAll((err, docs) => {
        res.json(docs);
    });
};

exports.adicionarCategoria = function (req, res, next) {
    let categoriaNoticia = req.body;

    repository.add(categoriaNoticia, (err) => {
        if (err) {
            return next(err);
        }
        else
            res.json({
                resposta: 'Categoria de notícia inserida com sucesso'
            });
    });
};

exports.atualizarCategoria = function (req, res, next) {

    var categoriaNoticia = req.categoriaNoticia;

    categoriaNoticia.nome = req.body.nome;
    categoriaNoticia.descricao = req.body.descricao;

    repository.update(categoriaNoticia, (err) => {
        if (err)
            return next(err);

        res.json({
            sucesso: true,
            mensagem: 'Categoria de notícia atualizada com sucesso.'
        });
    });
};

exports.excluirCategoria = function (req, res, next) {

    var categoriaNoticia = req.categoriaNoticia;

    noticiaRepo.count({ categoriaNoticia: categoriaNoticia._id }, (err, count) => {

        if (count > 0) {
            res.status(401)
                .json({
                    sucesso: false,
                    mensagem: 'Não é possível exlcluir esta categoria pois existem notícias vinculadas'
                });
        }
        else {
            repository.delete(categoriaNoticia, (err) => {
                if (err)
                    return next(err);

                res.json({
                    sucesso: true,
                    mensagem: 'Categoria de notícia excluída com sucesso'
                });
            })
        }
    });

    // repository.delete(categoriaNoticia, (err) => {
    //     if (err)
    //         return next(err);

    //     res.json({
    //         mensagem: 'Categoria de notícia excluída com sucesso.'
    //     });
    // });
};

exports.categoriaNoticiaPorId = function (req, res, next, id) {

    repository.findById(id, (err, doc) => {

        if (err) {
            res.statusCode = 500;
            return next(err);
        }

        if (!doc) {
            res.statusCode = 404;
            return next(new Error('Não foi possível encontrar um registro com o id ' + id));
        }
        else {
            req.categoriaNoticia = doc;
            next();
        }
    });
};

exports.pesquisaCategoriaNoticia = function (req, res, next) {

    var search = req.params.q;
    var query;
    if (search == '') {
        query = {};
    }
    else {
        query = {
            "$or": [
                { "_id": { "$regex": new RegExp(search), '$options': 'i' } },
                { "descricao": { "$regex": new RegExp(search), '$options': 'i' } },
                { "tags": search }
            ]
        };
    }

    repository.find(query, (err, data) => {

        if (err)
            return next(err);

        res.json(data);
    });

};