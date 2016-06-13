'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/ReportController');
    let rotas = express.Router();

    rotas.route('/report/')
        .get(controller.index);

    rotas.route('/report/qt_noticias_categoria/:dti/:dtt')
        .get(controller.qt_noticiasPorCategoria)

    return rotas;
}
