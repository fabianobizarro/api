'use strict'
var express = require('express'),
    database = require('./mongoose.js'),
    repositories = require('../app/repositories'),
    services = require('../app/services');

var app = express();

database.initialize();
//Teste
app.get('/', function (req, res) {

//     let _repo = repositories().CategoriaNoticiaRepository;
//     let service = new services.CategoriaNoticiaService(new _repo());
// 
//     service.getAll(function (err, results) {
// 
//         console.log(results);
// 
//         res.json(results);
//     });

    res.end('Hellow World!');
});

module.exports = app;