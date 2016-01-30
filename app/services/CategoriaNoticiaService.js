/// <reference path="BaseService.js" />
'use strict';
var CategoriaNoticiaService = (function(){
 
    var CategoriaNoticiaRepository = require('../repositories/CategoriaNoticiaRepository'),
        BaseService = require('./BaseService');
 
    class CategoriaNoticiaService extends BaseService {
    
        constructor() {
            super(new CategoriaNoticiaRepository())
        }    
    }
    
    return CategoriaNoticiaService;    
})()

module.exports = CategoriaNoticiaService;