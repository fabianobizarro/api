'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/ReportController');
    let Usuariocontroller = require('../controllers/UsuarioController');
    let rotas = express.Router();

    rotas.route('/report/')
        .get(controller.index);

    rotas.route('/report/tags/:dtInicio/:dtFim')
        .get([Usuariocontroller.requestUserIsAdmin, controller.tags])

    return rotas;
}
