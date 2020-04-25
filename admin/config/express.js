

module.exports = function () {

    var express = require('express');
    var rotas = require('../app/routes/homeRoutes');
    var cookieParser = require("cookie-parser");
    var bodyParser = require('body-parser');
    
    var app = express();
    
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(bodyParser.json());
    
    rotas(app);
    
    app.set('views', './app/views');
	app.set('view engine', 'ejs');
    
    app.use(express.static('wwwroot'));
    
    return app;    
}