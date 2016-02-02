'use strict';

var CategoriaNoticiaRepository = require('../repositories/CategoriaNoticiaRepository'),
    repository = new CategoriaNoticiaRepository();

exports.listarCategoriaNoticias = function (req, res) {

    repository.getAll((err, docs) => {
        res.json(docs);
    });
}

exports.adicionarCategoria = function (req, res) {
}

exports.atualizarCategoria = function (req, res) {
}

exports.excluirCategoria = function (req, res) {
}
