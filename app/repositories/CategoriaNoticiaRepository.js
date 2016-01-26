"use strict";

module.exports = function(database){
    //var CategoriaNoticia = require('mongoose').model('CategoriaNoticia');
    var BaseRepository = require('./BaseRepository')(database);

    class CategoriaNoticiaRepository extends BaseRepository {
        constructor() {
            super('categoriaNoticia')
        }
    }
    
    return CategoriaNoticiaRepository;
}