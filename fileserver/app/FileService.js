'use strict';

const fs = require('fs');
var env = require('./env');
const crypto = require('crypto');


const regexExtensao = /\.[\d\w]{1,}$/;

var basePath = env.filesDir + '/';

exports.salvarArquivo = function (nome, arquivo, callback) {

    let filename = basePath + nome;

    fs.writeFile(filename, arquivo, callback);
};

exports.lerArquivo = function (nomeArquivo, callback) {

    var filePath = basePath + nomeArquivo;
    fs.readFile(filePath, (err, data) => {

        if (err) {
            if (err.code == 'ENOENT')
                callback(null, null);
            else
                callback(err);
        }
        else
            callback(null, data);

    });

};

exports.hashArquivo = function (arquivo) {

    let hash = crypto.createHash('sha256');
    hash.update(arquivo);

    return hash.digest('hex');

};

exports.extensaoArquivo = function (nomeArquivo) {

    let ok = regexExtensao.test(nomeArquivo);
    let  extensao
    if (ok)
        extensao = regexExtensao.exec(nomeArquivo)[0];
    else
        extensao = '';

    return extensao;

};