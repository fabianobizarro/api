'use strict';

var NoticiaRepository = require('../repositories/NoticiaRepository'),
  repository = new NoticiaRepository(),
  config = require('../../config/config');


exports.listarNoticiasUnileste = function (req, res, next) {
  repository.find({ grupoId: config.unilesteId }, (err, result) => {
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

exports.exibirNoticia = function (req, res, next) {
  res.json(req.noticia);
};

exports.alterarNoticia = function (req, res, next) {
  res.end('Not implemented');
};

exports.excluirNoticia = function (req, res, next) {
  res.end('Not implemented');
};

exports.noticiaPorId = function (req, res, next, idNoticia) {
  console.log(idNoticia);
  repository.findById(idNoticia, (err, noticia) => {
    if (err) {
      res.statusCode = 500;
      return next(err);
    }
    else if (noticia) {
      req.noticia = noticia;
      next();
    }
    else {
      res.statusCode = 404;
      return next(new Error('Não foi possível encontrar uma notícia com o id ' + idNoticia));
    }

  });
};