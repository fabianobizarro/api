"use strict";
/// <reference path="./BaseRepository.js" /> 
var BaseRepository = require('./BaseRepository');

class CurtidaRepository extends BaseRepository {
    constructor() {
        super('Curtida');
    }
}

module.exports = CurtidaRepository;
