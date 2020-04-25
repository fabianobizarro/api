'use strict';

let winston = require('winston');
require('winston-mongodb').MongoDB;
var env = require('../../config/env/env');



var _init = function(){
    winston.add(winston.transports.File, { filename: 'log/analytics.log' });
    winston.add(winston.transports.MongoDB, {
        db: env.dbLogUri
    });
    console.log('Log Services Ok');
}


var _info = function(message, data){
    winston.info(message, data);
}

var _error = function (message, data) {
    winston.error(message, data);
};


module.exports = {
    TIPO_LOG: require('./tipoLog.js'),
    info: _info,
    error: _error,
    initialize: _init
}