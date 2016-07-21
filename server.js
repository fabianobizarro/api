var port = 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var database = require('./config/database'),
    _server = require('./config/express'),
    os = require('os');

//Inicializa a conexão com o banco
database.initialize((err) => {

    if (err) {
        throw err;
    }

    console.log('Initializing application...');

    var server = _server();

    process.env.API_PORT = port;
    process.env.API_HOST = os.hostname();

    server.listen(port, () => {
        console.log("Server running at port " + port);
    });

});