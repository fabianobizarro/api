'use strict'
var express = require('express'),
    routeService = require('../app/routes'),
    bodyParser = require('body-parser'),
    swaggerUi = require('swaggerize-ui');
    


module.exports = function () {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    // Swagger routes
    app.use('/api-docs', (req, res)=>{
        res.json(require('../docs/swagger.json'));
    });
    
    app.use('/docs', swaggerUi({
        docs: '/api-docs'
    }));
    
    // Registrando as rotas
    routeService.registerRoutes(app);
    


    return app;
}