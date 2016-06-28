/// <reference path="./BaseRepository.js" /> 
"use strict";
//var Noticia = require('mongoose').model('Noticia'),
var BaseRepository = require('./BaseRepository');

class NoticiaRepository extends BaseRepository {
    constructor() {
        super('Noticia');
    }
}

module.exports = NoticiaRepository;
