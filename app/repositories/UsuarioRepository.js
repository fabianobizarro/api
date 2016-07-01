/// <reference path="./BaseRepository.js" /> 
"use strict";
var BaseRepository = require('./BaseRepository');

class CategoriaNoticiaRepository extends BaseRepository {
    constructor() {
        super('Usuario');
    }
}

module.exports = CategoriaNoticiaRepository;
