'use strict'
var express = require('express'),
    routes = require('../app/routes'),
    bodyParser = require('body-parser'),
    swaggerUi = require('swaggerize-ui'),
    cors = require('cors'),
    morgan = require('morgan');



module.exports = function () {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(cors({
        origin: true,
        credentials: true
    }));
    app.use(morgan('dev'));
    
    // Swagger routes
    app.use('/api-docs', (req, res)=>{
        res.json(require('../docs/swagger.json'));
    });

    app.use('/docs', swaggerUi({
        docs: '/api-docs'
    }));


    // Registrando as rotas
    routes.registerRoutes(app);



    return app;
}
