"use strict";
/// <reference path="./BaseRepository.js" /> 
var BaseRepository = require('./BaseRepository');

class CategoriaNoticiaRepository extends BaseRepository {
    constructor() {
        super('CategoriaNoticia');
    }
}

module.exports = CategoriaNoticiaRepository;
