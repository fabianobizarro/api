'use strict'
var express = require('express'),
    services = require('../app/services');

var app = express();

app.get('/', function (req, res) {

    var CategoriaNoticiaService = services.CategoriaNoticia,
        service = new CategoriaNoticiaService();

    service.getAll(function (err, docs) {
        
        if (err)
            res.jsonp(err)
        else
            res.json(docs);    
     });

    
});

module.exports = app;
