'use strict';
module.exports = function () {

    let express = require('express');
    let controller = require('../controllers/unilesteController');
    let rotas = express.Router();

    rotas.route('/unileste')
        .get(controller.listarNoticiasUnileste)
        .post(controller.cadastrarNoticiaUnileste);
    // rotas.route('/grupo/:idGrupo')
    //     .get(controller.exibirGrupo)
    //     .put(controller.alterarGrupo)
    //     .delete(controller.excluirGrupo);

    // rotas.param('idGrupo', controller.obterGrupoPorId);

    return rotas;
};
