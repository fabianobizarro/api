'use strict';

module.exports = function () {

    let controller = require('../controllers/NoticiaController');

    var router = require("express").Router();

    router.route('/noticia/pesquisa')
        .get(controller.pesquisarNoticias);

    router.route('/noticia/:idNoticia')
        .get(controller.exibirNoticia)
        .put(controller.alterarNoticia)
        .delete(controller.excluirNoticia);

    router.route('/noticia/:idNoticia')
        .get(controller.exibirNoticia);

    router.route('/noticia/:idNoticia/comentarios')
        .get(controller.exibirComentarios)
        .post(controller.adicionarComentario);

    router.route('/noticia/:idNoticia/comentarios/:idComentario')
        .delete(controller.removerComentario);

    router.route('/noticia/:idNoticia/curtir')
        .post(controller.curtirNoticia);

    router.route('/noticia/:idNoticia/curtidas')
        .get(controller.obterCurtidas);



    router.param('idNoticia', controller.obterNoticiaPorId);

    return router;
};