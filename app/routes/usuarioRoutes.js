'use strict';
module.exports = function () {

    let express = require("express");
    let controller = require('../controllers/UsuarioController');

    let rotas = express.Router();

    rotas.route('/usuario')
        .get([controller.requestUserIsAdmin, controller.listarUsuarios]);

    rotas.route('/usuario/info')
        .get(controller.infoUsuario);

    rotas.route('/usuario/:idUsuario')
        .get(controller.dadosUsuario)
        .put([controller.requestUserIsTheOwn, controller.alterarUsuario])
        .delete([controller.requestUserIsTheOwn, controller.excluirUsuario]);

    rotas.route('/usuario/pesquisa/:pesquisa')
        .get(controller.pesquisaUsuario);

    rotas.route('/usuario/:idUsuario/tAdmin')
        .post([controller.requestUserIsAdmin, controller.countAdminUsers, controller.alternarAdminUsuario]);

    rotas.route('/usuario/:idUsuario/senha')
        .put([controller.requestUserIsTheOwn, controller.alterarSenha]);

    rotas.route('/usuario/:idUsuario/historico')
        .get(controller.historicoUsuario);

    rotas.param('idUsuario', controller.obterUsuarioPorId);

    return rotas;
}