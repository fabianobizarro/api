'use strict';
module.exports = function (app) {

    let controller = require('../controllers/UsuarioController');

    app.route('/usuario')
        .get(controller.listarUsuarios)
        .post(controller.adicionarUsuario);

    app.route("/usuario/:idUsuario")
        .get(controller.dadosUsuario)
        .put(controller.alterarUsuario)
        .delete(controller.excluirUsuario);

    app.param('idUsuario', controller.obterUsuarioPorId);
}