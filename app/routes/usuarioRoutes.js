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

    rotas.route("/usuario/:idUsuario")
        .get(controller.dadosUsuario)
        .put(controller.alterarUsuario)
        .delete(controller.excluirUsuario);

    rotas.route('/usuario/pesquisa/:pesquisa')
        .get(controller.pesquisaUsuario);

    rotas.route('/usuario/:idUsuario/tAdmin')
        .post(controller.alternarAdminUsuario);

    rotas.route('/usuario/:idUsuario/alterarSenha')
        .post(controller.alterarSenha);


    rotas.param('idUsuario', controller.obterUsuarioPorId);

    return rotas;
}