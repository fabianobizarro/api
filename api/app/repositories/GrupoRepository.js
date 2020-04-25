/// <reference path="./BaseRepository.js" /> 
"use strict";
var BaseRepository = require('./BaseRepository');

class GrupoRepository extends BaseRepository {
    constructor() {
        super('Grupo');
    }
}

module.exports = GrupoRepository;
