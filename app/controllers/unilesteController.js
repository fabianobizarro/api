'use strict';

var GrupoRepository = require('../repositories/NoticiaRepository'),
    repository = new GrupoRepository();
    
    
    
exports.listarNoticiasUnileste = function(req, res, next){
    res.end('UNILESTE MG');   
}