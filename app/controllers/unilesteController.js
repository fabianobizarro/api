'use strict';

var NoticiaRepository = require('../repositories/NoticiaRepository'),
  repository = new NoticiaRepository(),
  config = require('../../config/env'),
  sequelize = require('sequelize'),

  noticiaService = require('../services/noticiaService');

require('../services/Date');


exports.listarNoticiasUnileste = function (req, res, next) {

  var dateNow = new Date().yyyyMMdd();

  noticiaService.obterNoticiasPorDataeGrupo(dateNow, config.unilesteId, (err, noticias) => {
    if (err)
      return next(err);

    res.json(noticias);
  });

};

exports.cadastrarNoticiaUnileste = function (req, res, next) {

  var noticia = {
    Titulo: req.body.Titulo,
    Resumo: req.body.Resumo,
    Conteudo: req.body.Conteudo,
    CategoriaNoticiaId: req.body.CategoriaNoticia,
    GrupoId: config.unilesteId,
    Data: new Date(),
    UsuarioId: req.requestUser.Id,
    UrlImagem: req.body.UrlImagem,
  };

  if (req.body.Tags)
    noticia.Tags = noticia.Tags == null ? "" : req.body.Tags.toString();

  repository.add(noticia, (err, result) => {

    if (err) {
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