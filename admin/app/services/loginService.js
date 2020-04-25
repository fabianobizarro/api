var http = require('http');
var queryString = require('querystring');
var env = require('../../config/env');

exports.login = function (usuario, senha, callback) {

    var data = queryString.stringify({
        login: usuario,
        senha: senha
    });

    var options = {
        protocol: env.protocol,
        hostname: env.hostname,
        port: env.port,
        path: env.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };

    var request = http.request(options, (postResponse) => {

        var _data = '';

        postResponse.setEncoding('utf8');

        postResponse.on('data', (data) => {
            _data += data;
        });
        postResponse.on('end', () => {
            callback(null, _data);
        })
    });

    request.on('error', (e) => {
        callback(e);
    });

    request.write(data);


}