"use strict";
/// <reference path="./BaseRepository.js" /> 
var BaseRepository = require('./BaseRepository');

class SolicitacaoRepository extends BaseRepository {
    constructor() {
        super('SolicitacaoGrupoPendente');
    }
}

module.exports = SolicitacaoRepository;
