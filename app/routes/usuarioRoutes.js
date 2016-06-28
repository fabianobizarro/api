'use strict';
module.exports = function () {

    let express = require("express");
    let controller = require('../controllers/UsuarioController');

    let rotas = express.Router();

    rotas.route('/usuario')
        .get(controller.listarUsuarios);
    //.post(controller.adicionarUsuario);

    rotas.route('/usuario/info')
        .get(controller.infoUsuario);

    rotas.route('/usuario/:idUsuario')
        .get(controller.dadosUsuario)
        .put([controller.requestUserIsTheOwn, controller.requestUserIsAdmin, controller.alterarUsuario])
        .delete([controller.requestUserIsTheOwn, controller.requestUserIsAdmin, controller.excluirUsuario]);

    rotas.route('/usuario/pesquisa/:pesquisa')
        .get(controller.pesquisaUsuario);

    rotas.route('/usuario/:idUsuario/tAdmin')
        .post([controller.requestUserIsAdmin, controller.countAdminUsers, controller.alternarAdminUsuario]);

    rotas.route('/usuario/:idUsuario/alterarSenha')
        .post([controller.requestUserIsTheOwn, controller.alterarSenha]);



    rotas.param('idUsuario', controller.obterUsuarioPorId);

    return rotas;
}