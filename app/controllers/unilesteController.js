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

exports.exibirNoticia = function (req, res, next) {
  res.json(req.noticia);
};

exports.alterarNoticia = function (req, res, next) {


  var noticia = req.noticia;
  var newNoticia = req.body;

  noticia.titulo = newNoticia.titulo || noticia.titulo;
  noticia.resumo = newNoticia.resumo || noticia.resumo;
  noticia.conteudo = newNoticia.conteudo || noticia.conteudo;
  noticia.tags = newNoticia.tags || noticia.tags;
  noticia.categoriaNoticia = newNoticia.categoriaNoticia || noticia.categoriaNoticia;

  repository.update(noticia, (err) => {

    if (err)
      return next(err);

    res.json({
      sucesso: true,
      mensagem: 'A notícia foi alterada com sucesso!'
    });
  });

};

exports.excluirNoticia = function (req, res, next) {

  repository.delete(req.noticia, (err) => {
    if (err) {
      res.statusCode = 500;
      return next(err);
    }

    res.json({
      sucesso: true,
      mensagem: 'A notícia foi excluída com sucesso.'
    });

  });
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