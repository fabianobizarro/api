'use strict'
var express = require('express'),
    routeService = require('../app/routes'),
    bodyParser = require('body-parser');


module.exports = function () {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    // Registrando as rotas
    routeService.registerRoutes(app);

    return app;
}