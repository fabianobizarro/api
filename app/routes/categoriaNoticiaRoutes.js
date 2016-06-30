'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/CategoriaNoticiaController');
    let usuarioController = require('../controllers/UsuarioController');
    let rotas = express.Router();

    rotas.route('/categoriaNoticia/q/:q')
        .get(controller.pesquisaCategoriaNoticia);

    rotas.route('/categoriaNoticia')
        .get(controller.listarCategoriaNoticias)
        .post([usuarioController.requestUserIsAdmin, controller.adicionarCategoria]);

    rotas.route('/categoriaNoticia/:idCategoriaNoticia')
        .get(controller.obterCategoriaNoticia)
        .put([usuarioController.requestUserIsAdmin, controller.atualizarCategoria])
        .delete([usuarioController.requestUserIsAdmin, controller.excluirCategoria]);


    rotas.param('idCategoriaNoticia', controller.categoriaNoticiaPorId);

    return rotas;
}
