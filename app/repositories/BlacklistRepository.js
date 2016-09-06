"use strict";
/// <reference path="./BaseRepository.js" /> 
var BaseRepository = require('./BaseRepository');

class BlacklistRepository extends BaseRepository {
    constructor() {
        super('Blacklist');
    }

    findAll(option, callback) {

        let sql = 'SELECT Palavra FROM sn.Blacklist ORDER BY Palavra';

        BlacklistRepository.query(sql, null, callback);
    }
}

module.exports = BlacklistRepository;
