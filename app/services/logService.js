'use strict';

let winston = require('winston');
require('winston-mongodb').MongoDB;

winston.add(winston.transports.File, { filename: 'log/analytics.log' });
winston.add(winston.transports.MongoDB, {
    db: 'mongodb://192.168.99.100:27017/dblog',
});

var _info = function(message, data){
    winston.info(message, data);
}

var _error = function (message, data) {
    winston.error(message, data);
};


module.exports = {
    TIPO_LOG: require('./tipoLog.js'),
    info: _info,
    error: error
}