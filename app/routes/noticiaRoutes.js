'use strict';

module.exports = function(){
    
    let controller = require('../controllers/NoticiaController');
    let grupoController = require('../controllers/GrupoController');
    
    var router = require("express").Router();
    
    router.route('/grupo/:idGrupo/noticia')
        .get(controller.listarNoticias)
        .post(controller.adicionarNoticia);
        
    router.route('/grupo/:idGrupo/noticia/:idNoticia')
        .get(controller.exibirNoticia)
        .put(controller.alterarNoticia)
        .delete(controller.excluirNoticia);
        
    
    router.param('idGrupo', grupoController.obterGrupoPorId);
    router.param('idNoticia', controller.obterNoticiaPorId);
    
    return router;
}