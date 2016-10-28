'use strict';

var env = require('../../config/env/env'),
    BlacklistRepository = require('../repositories/BlacklistRepository'),
    logService = require('../services/logService');

require('../services/Array');

var repo = new BlacklistRepository();


exports.adicionarPalavra = function (req, res, next) {

    let palavra = req.body.palavra;

    if (!palavra) {
        return res.status(400)
            .json({
                sucesso: false,
                mensagem: 'A palavra não foi informada'
            });
    }
    else {

        let blacklist = {
            Palavra: palavra,
            createdBy: req.requestUser.Login
        };

        repo.add(blacklist, (err) => {
            if (err) {
                logService.error(logService.TIPO_LOG.BlackListAdicionado, { erro: err, palavra: palavra, usuario: req.requestUser.Login });
                return next(err);
            }

            logService.info(logService.TIPO_LOG.BlackListAdicionado, { palavra: palavra, usuario: req.requestUser.Login });
            return res.json({
                sucesso: true,
                mensagem: 'Palavra adicionada com sucesso'
            });
        })

    }


};

exports.listarPalavras = function (req, res, next) {


    repo.findAll(null, (err, results) => {
        if (err) return next(err);


        results = results.map((w) => { return w.Palavra });

        return res.json(results);
    });

};

exports.removerPalavra = function (req, res, next) {

    let palavra = req.params.palavra;

    if (!palavra) {
        return res.status(400)
            .json({
                sucesso: false,
                mensagem: 'A palavra não foi informada.'
            });
    }
    else {

        repo.delete({ where: { Palavra: palavra } }, (err, rows) => {

            if (err) {
                logService.error(logService.TIPO_LOG.BlackListRemovido, { erro: err, palavra: palavra, usuario: req.requestUser.Login });
                return next(err);
            }

            logService.info(logService.TIPO_LOG.BlackListRemovido, { palavra: palavra, usuario: req.requestUser.Login });
            if (rows == 1) {
                return res.json({
                    sucesso: true,
                    mensagem: 'Palavra removida da lista.',
                });
            }
            else {
                return res.json({
                    sucesso: false,
                    mensagem: 'Esta palavra não está cadastrada.',
                });
            }


        })

    }




};
