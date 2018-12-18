const os = require('os');
const fs = require('fs');
const ini = require('ini');
const database = require('./config/database');
const _server = require('./config/express');
const logService = require('./app/services/logService');
const port = 3000;
const config = require('./config/env')();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Inicializa a conexão com o banco
// database.initialize((err) => {

//     if (err) {
//         throw err;
//     }

//     console.log('Initializing application...');
//     logService.initialize();

//     var server = _server();

//     process.env.API_PORT = port;
//     process.env.API_HOST = os.hostname();

//     server.listen(port, () => {
//         console.log("Server running at port " + port);
//     });

// });

var admin = require("firebase-admin");


database.initialize
    .then(result => {
        
        let db = result.database();
        let ref = db.ref('/notificas/documents');
        
        ref.child('noticias')
            .set({
                nome: 'fabiano',
                idade: 24 
            });

        

        
        // console.log(result);
    })
    .catch(err => {
        console.error(err);
        process.exit(0);
    });