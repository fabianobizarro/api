'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/GrupoController');
    let rotas = express.Router();

    rotas.route('/grupo/pesquisa')
        .get(controller.pesquisarGrupos);
        
    rotas.route('/grupo')
        .get(controller.listarGrupos)
        .post(controller.adicionarGrupo);

    rotas.route('/grupo/:idGrupo')
        .get([controller.usuarioIntegranteGrupo, controller.exibirGrupo])
        .put(controller.alterarGrupo)
        .delete(controller.excluirGrupo);

    rotas.route('/grupo/:idGrupo/publico')
        .post([controller.usuarioAdminGrupo, controller.trocarVisibilidadeGrupo]);

    rotas.route('/grupo/:idGrupo/noticia')
        .get([controller.usuarioIntegranteGrupo, controller.listarNoticias])
        .post([controller.usuarioAdminGrupo, controller.adicionarNoticia]);

    rotas.route('/grupo/:idGrupo/integrantes')
        .get([controller.usuarioIntegranteGrupo, controller.listarIntegrantes]);

    rotas.route('/grupo/:idGrupo/integrantes/:idUsuario/admin')
        .post([controller.usuarioAdminGrupo, controller.admin]);

    rotas.route('/grupo/:idGrupo/integrantes/:idUsuario')
        .delete([controller.usuarioAdminGrupo, controller.removerUsuarioDoGrupo]);

    rotas.route('/grupo/:idGrupo/join')
        .post([controller.solicitacaoGrupoPendente, controller.join]);

    rotas.route('/grupo/:idGrupo/exit')
        .post([controller.usuarioIntegranteGrupo, controller.exit]);

    rotas.route('/grupo/:idGrupo/solicitacoes')
        .get([controller.usuarioAdminGrupo, controller.listarSolicitacoesPendentes]);

    rotas.route('/grupo/:idGrupo/solicitacoes/:idUsuario')
        .post([controller.usuarioAdminGrupo, controller.aceitarSolicitacao])
        .delete([controller.usuarioAdminGrupo, controller.recusarSolicitacao]);


    rotas.param('idGrupo', controller.obterGrupoPorId);

    return rotas;
}