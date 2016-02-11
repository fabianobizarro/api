/// <reference path="./BaseRepository.js" /> 
"use strict";
var Usuario = require('mongoose').model('Usuario'),
    BaseRepository = require('./BaseRepository');

class CategoriaNoticiaRepository extends BaseRepository {
    constructor() {
        super('Usuario', Usuario)
    }
}

module.exports = CategoriaNoticiaRepository;
