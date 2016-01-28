/// <reference path="./BaseRepository.js" /> 
"use strict";

var CategoriaNoticiaRepository = (function(){
    var CategoriaNoticia = require('mongoose').model('CategoriaNoticia'),
        BaseRepository = require('./BaseRepository');

    class CategoriaNoticiaRepository extends BaseRepository {
        constructor() {
            super('CategoriaNoticia', CategoriaNoticia)
        }
    }
    
    return CategoriaNoticiaRepository;
})()

module.exports = CategoriaNoticiaRepository;
