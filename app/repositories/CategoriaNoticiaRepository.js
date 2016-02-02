/// <reference path="./BaseRepository.js" /> 
"use strict";
var CategoriaNoticia = require('mongoose').model('CategoriaNoticia'),
    BaseRepository = require('./BaseRepository');

class CategoriaNoticiaRepository extends BaseRepository {
    constructor() {
        super('CategoriaNoticia', CategoriaNoticia)
    }
}

module.exports = CategoriaNoticiaRepository;
