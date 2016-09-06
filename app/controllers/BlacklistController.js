'use strict';

var env = require('../../config/env/env'),
    BlacklistRepository = require('../repositories/BlacklistRepository');

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

        repo.add({ Palavra: palavra }, (err) => {
            if (err) return next(err);

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

    let palavra = req.body.palavra;

    if (!palavra) {
        return res.status(400)
            .json({
                sucesso: false,
                mensagem: 'A palavra não foi informada.'
            });
    }
    else {

        repo.delete({ where: { Palavra: palavra } }, (err, rows) => {

            if (err) return next(err);

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
