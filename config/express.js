'use strict'
var express = require('express'),
    routeService = require('../app/routes'),
    bodyParser = require('body-parser');
    

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Registrando as rotas
routeService.registerRoutes(app);


module.exports = app;
