"use strict";
/// <reference path="./BaseRepository.js" /> 
var BaseRepository = require('./BaseRepository');

class ComentarioRepository extends BaseRepository {
    constructor() {
        super('Comentario');
    }
}

module.exports = ComentarioRepository;
