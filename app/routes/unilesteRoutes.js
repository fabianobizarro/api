'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/unilesteController');
    let rotas = express.Router();

    rotas.route('/unileste')
        .get(controller.listarNoticiasUnileste)
        .post(controller.cadastrarNoticiaUnileste);
    return rotas;
};
