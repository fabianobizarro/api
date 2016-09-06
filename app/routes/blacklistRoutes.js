'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/BlackListController');
    let usuarioController = require('../controllers/UsuarioController');
    let rotas = express.Router();

    rotas.route('/blacklist')
        .get([usuarioController.requestUserIsAdmin, controller.listarPalavras])
        .post(usuarioController.requestUserIsAdmin, [controller.adicionarPalavra])
        .delete([usuarioController.requestUserIsAdmin, controller.removerPalavra]);

    return rotas;
}