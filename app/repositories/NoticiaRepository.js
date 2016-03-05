/// <reference path="./BaseRepository.js" /> 
"use strict";
var Noticia = require('mongoose').model('Noticia'),
    BaseRepository = require('./BaseRepository');

class NoticiaRepository extends BaseRepository {
    constructor() {
        super('Noticia', Noticia)
    }
}

module.exports = NoticiaRepository;
