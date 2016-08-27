'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/UnilesteController');
    let rotas = express.Router();

    rotas.route('/unileste')
        .post(controller.cadastrarNoticiaUnileste);

    rotas.route('/unileste/hoje')
        .get(controller.listarNoticiaHojeUnileste);

    rotas.route('/unileste/:page?')
        .get(controller.listarTodasNoticiasUnileste);

    return rotas;
};
