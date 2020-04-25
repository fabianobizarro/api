/// <reference path="./BaseRepository.js" /> 
"use strict";
var BaseRepository = require('./BaseRepository');

class UsuarioRepository extends BaseRepository {
    constructor() {
        super('Usuario');
    }
}

module.exports = UsuarioRepository;
