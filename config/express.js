'use strict'
var express = require('express'),
    routeService = require('../app/routes');
    

var app = express();

routeService.registerRoutes(app);


module.exports = app;
