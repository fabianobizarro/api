/// <reference path="./BaseRepository.js" /> 
"use strict";
//var Grupo = require('mongoose').model('Grupo'),
var BaseRepository = require('./BaseRepository');

class GrupoRepository extends BaseRepository {
    constructor() {
        super('Grupo');
    }
}

module.exports = GrupoRepository;
