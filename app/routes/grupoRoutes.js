'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/GrupoController');
    let rotas = express.Router();

    rotas.route('/grupo')
        .get(controller.listarGrupos)
        .post(controller.adicionarGrupo);

    rotas.route('/grupo/:idGrupo')
        .get(controller.exibirGrupo)
        .put(controller.alterarGrupo)
        .delete(controller.excluirGrupo);

    router.route('/grupo/:idGrupo/noticia')
        .get(controller.listarNoticias)
        .post(controller.adicionarNoticia);

    rotas.param('idGrupo', controller.obterGrupoPorId);

    return rotas;
}