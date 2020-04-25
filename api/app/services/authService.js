var config = require('../../config/env/env'),
    jwt = require('jsonwebtoken');

var defaultOptions = {
    expiresIn: 86400 // tempo em segundos (24horas)
};


exports.signIn = function (usuario, options) {
    options = options || defaultOptions;
    
    var token = jwt.sign(usuario, config.secret, options);
     
    return token;    
}

exports.verifyToken = function (token, callback) {
    jwt.verify(token, config.secret, callback);
}