'use strict';
module.exports = function () {

    let express = require("express");
    let controller = require('../controllers/UsuarioController');

    let rotas = express.Router();

    rotas.route('/usuario')
        .get(controller.listarUsuarios)
        .post(controller.adicionarUsuario);
        
    rotas.route('/usuario/info')
        .get(controller.infoUsuario);

    rotas.route("/usuario/:idUsuario")
        .get(controller.dadosUsuario)
        .put(controller.alterarUsuario)
        .delete(controller.excluirUsuario);



    rotas.param('idUsuario', controller.obterUsuarioPorId);

    return rotas;
}