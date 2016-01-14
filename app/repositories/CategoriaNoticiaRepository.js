"use strict";
var CategoriaNoticiaRepository = (function(){
    
    var CategoriaNoticia = require('mongoose').model('CategoriaNoticia');
    var BaseRepository = require('./BaseRepository');

    class CategoriaNoticiaRepository extends BaseRepository {
        constructor() {
            //super('categoriaNoticia')
            super(CategoriaNoticia)
        }
    }
    
    return CategoriaNoticiaRepository;
        
})()


module.exports = CategoriaNoticiaRepository;