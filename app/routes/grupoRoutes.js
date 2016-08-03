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

    rotas.route('/grupo/:idGrupo/noticia')
        .get([controller.usuarioIntegranteGrupo, controller.listarNoticias])
        .post([controller.usuarioAdminGrupo, controller.adicionarNoticia]);

    rotas.param('idGrupo', controller.obterGrupoPorId);

    return rotas;
}