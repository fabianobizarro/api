'use strict';

var NoticiaRepository = require('../repositories/NoticiaRepository'),
  repository = new NoticiaRepository(),
  config = require('../../config/config');

require ('../services/Date');


exports.listarNoticiasUnileste = function (req, res, next) {

  var dateNow = new Date().date();

  repository.find(
    {
      grupoId: config.unilesteId,
      data: { '$gte': dateNow }
    }, null,
    {
      sort: { data: -1 }
    },
    (err, result) => {
      if (err)
        return next(err);

      res.json(result);
    });
};

exports.cadastrarNoticiaUnileste = function (req, res, next) {

  var noticia = req.body;
  noticia.grupoId = config.unilesteId;

  repository.add(noticia, (err, result) => {

    if (err) {
      console.log(err);
      res.statusCode = 500;
      return next(err);
    }
    else {
      res.json({
        sucesso: true,
        mensagem: 'Notícia cadastrada com sucesso'
      });
    }

  });
};