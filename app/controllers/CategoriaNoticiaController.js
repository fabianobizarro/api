'use strict';
var CategoriaNoticiaRepository = require('../repositories/CategoriaNoticiaRepository'),
    repository = new CategoriaNoticiaRepository();


exports.obterCategoriaNoticia = function (req, res) {
    res.json({
        Id: req.categoriaNoticia.Id,
        Nome: req.categoriaNoticia.Nome,
        Descricao: req.categoriaNoticia.Descricao
    });
};

exports.listarCategoriaNoticias = function (req, res) {
    repository.getAll({ attributes: ['Id', 'Nome', 'Descricao'] }, (err, docs) => {
        res.json(docs);
    });
};

exports.adicionarCategoria = function (req, res, next) {

    let categoriaNoticia = {
        Nome: req.body.Nome,
        Descricao: req.body.Descricao
    };

    repository.add(categoriaNoticia, (err) => {
        if (err) {
            return next(err);
        }
        else
            res.json({
                sucesso: true,
                mensagem: 'Categoria de notícia cadastrada com sucesso'
            });
    });
};

exports.atualizarCategoria = function (req, res, next) {

    var categoriaNoticia = req.categoriaNoticia;

    categoriaNoticia.Nome = req.body.Nome || categoriaNoticia.Nome;
    categoriaNoticia.Descricao = req.body.Descricao || categoriaNoticia.Descricao;

    repository.update(categoriaNoticia, null, (err) => {

        if (err) return next(err);

        res.json({
            sucesso: true,
            mensagem: 'Categoria de notícia atualizada com sucesso.'
        });
    });
};

exports.excluirCategoria = function (req, res, next) {

    var categoriaNoticia = req.categoriaNoticia;

    repository.delete({ where: { Id: categoriaNoticia.Id } }, (err) => {
        if (err)
            return next(err);

        res.json({
            sucesso: true,
            mensagem: 'Categoria de notícia excluída com sucesso'
        });
    });
};

exports.categoriaNoticiaPorId = function (req, res, next, id) {

    repository.findOne({ where: { Id: id } }, (err, doc) => {

        if (err) {
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