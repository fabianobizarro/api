/// <reference path="./BaseRepository.js" /> 
"use strict";
var Grupo = require('mongoose').model('Grupo'),
    BaseRepository = require('./BaseRepository');

class GrupoRepository extends BaseRepository {
    constructor() {
        super('Grupo', Grupo)
    }
}

module.exports = GrupoRepository;
