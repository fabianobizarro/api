"use strict";
/// <reference path="./BaseRepository.js" /> 
//var CategoriaNoticia = require('mongoose').model('CategoriaNoticia'),
var BaseRepository = require('./BaseRepository');

class CategoriaNoticiaRepository extends BaseRepository {
    constructor() {
        super('CategoriaNoticia');
    }
}

module.exports = CategoriaNoticiaRepository;
