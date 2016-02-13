'use strict';
module.exports = function (app) {

    let controller = require('../controllers/CategoriaNoticiaController');

    app.route('/categoriaNoticia')
        .get(controller.listarCategoriaNoticias)
        .post(controller.adicionarCategoria);

    app.route('/categoriaNoticia/:idCategoriaNoticia')
        .get(controller.obterCategoriaNoticia)
        .put(controller.atualizarCategoria)
        .delete(controller.excluirCategoria);

    app.param('idCategoriaNoticia', controller.categoriaNoticiaPorId);
}