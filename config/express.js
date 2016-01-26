'use strict'
var express = require('express'),
    database = require('./database.js'),
    repositories = require('../app/repositories'),
    services = require('../app/services');

var app = express();

//Initialize database connection
database.initialize((err, database) => {
    
    
    app.get('/', function (req, res) {
        res.json({message:'Hello World'});
    });
    
});

module.exports = app;