'use strict';

var express = require('express');
var cors = require('cors');
var multer = require('multer');
var upload = multer();

let port = process.env.PORT = 5000;

var fileController = require('./app/FileController');
var app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.post('/f/', upload.single('file'), fileController.adicionarArquivo);

app.use('/f', express.static(__dirname + '/files'));

app.listen(port, () => {
    console.log('Server runnign at *:' + port)
})

