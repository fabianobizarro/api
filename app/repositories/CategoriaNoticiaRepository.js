/// <reference path="./BaseRepository.js" /> 
"use strict";
//var CategoriaNoticia = require('mongoose').model('CategoriaNoticia'),
var BaseRepository = require('./BaseRepository');

class CategoriaNoticiaRepository extends BaseRepository {
    constructor() {
        super('CategoriaNoticia');
    }
}

module.exports = CategoriaNoticiaRepository;
