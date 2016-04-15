'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/CategoriaNoticiaController');
    let rotas = express.Router();

    rotas.route('/categoriaNoticia/q/:q')
        .get(controller.pesquisaCategoriaNoticia);

    rotas.route('/categoriaNoticia')
        .get(controller.listarCategoriaNoticias)
        .post(controller.adicionarCategoria);

    rotas.route('/categoriaNoticia/:idCategoriaNoticia')
        .get(controller.obterCategoriaNoticia)
        .put(controller.atualizarCategoria)
        .delete(controller.excluirCategoria);


    rotas.param('idCategoriaNoticia', controller.categoriaNoticiaPorId);

    return rotas;
}
