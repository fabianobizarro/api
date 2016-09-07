'use strict'
var BlacklistRepository = require('../repositories/BlacklistRepository');
let repo = new BlacklistRepository();

exports.comentarioValido = function (comentario, callback) {

    createBlacklistRegex((err, regex) => {
        if (err) callback(err);

        let valid = !regex.test(comentario);

        callback(null, valid);

    })

};

var createBlacklistRegex = function (callback) {

    repo.findAll(null, (err, results) => {

        if (err) callback(err);

        let arrayPalavras = results.map(w => { return w.Palavra }).join('|');

        let regexStr = `(${arrayPalavras})`;

        let regex = new RegExp(regexStr);

        callback(null, regex);

    });
};
