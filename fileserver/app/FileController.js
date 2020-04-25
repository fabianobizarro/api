'use strict';
var fileService = require('./FileService');
var env = require('./env');
const log = console.log;

exports.adicionarArquivo = function (req, res, next) {


    let file = req.file;

    let fileName = file.originalname;
    let extensao = fileService.extensaoArquivo(fileName);
    var hash = fileService.hashArquivo(file.buffer);
    var nomeArquivo = hash + extensao;

    fileService.lerArquivo(nomeArquivo, (err, data) => {

        if (err)
            return res.status(500).json(err);

        if (data == null) { // Arquivo não existe / Salvar no servidor

            fileService.salvarArquivo(nomeArquivo, file.buffer, (err) => {
                if (err)
                    return res.status(500).json(err);


                return res.json({
                    mensagem: 'Arquivo cadastrado',
                    url: env.url() + '/' + nomeArquivo
                });
            })


        }
        else { // Arquivo já existe
            return res.json({
                mensagem: 'Arquivo já existe',
                url: env.url() + '/' + nomeArquivo
            });
        }


    });

}

exports.obterArquivo = function (req, res, next) {

    let id = req.params.id;

    if (!id) {
        return res.status(400).json({
            mensage: 'O id do arquivo precisa ser informado'
        });
    }
}