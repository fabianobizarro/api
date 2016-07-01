"use strict";
/// <reference path="./BaseRepository.js" /> 
var BaseRepository = require('./BaseRepository');

class AdminGrupoRepository extends BaseRepository {
    constructor() {
        super('AdminGrupo');
    }
}

module.exports = AdminGrupoRepository;