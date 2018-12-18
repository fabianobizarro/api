'use strict';

var NoticiaRepository = require('../repositories/NoticiaRepository'),
  repository = new NoticiaRepository(),
  config = require('../../config/env'),
  sequelize = require('sequelize'),

  noticiaService = require('../services/noticiaService'),
  logService = require('../services/logService');


require('../services/Date');

const NOTICIAS_POR_PAGINA = 3;


exports.listarNoticiaHojeUnileste = function (req, res, next) {

  var dateNow = new Date().yyyyMMdd();

  noticiaService.obterNoticiasPorDataeGrupo(dateNow, config.unilesteId, req.requestUser.Id, (err, noticias) => {
    if (err)
      return next(err);

    res.json(noticias);
  });

};

exports.listarTodasNoticiasUnileste = function (req, res, next) {

  let usuarioId = req.requestUser.Id;

  let pagina = req.params.page || 1;
  if (pagina == 0 || pagina < 0)
    pagina = 1;

  let skip = NOTICIAS_POR_PAGINA * pagina - NOTICIAS_POR_PAGINA;

  noticiaService.obterNoticiasPorGrupo(config.unilesteId, usuarioId, skip, NOTICIAS_POR_PAGINA,
    (err, noticias) => {
      if (err)
        return next(err);

      return res.json(noticias);
    });

};

exports.cadastrarNoticiaUnileste = function (req, res, next) {

  var noticia = {
    Titulo: req.body.Titulo,
    Resumo: req.body.Resumo,
    Conteudo: req.body.Conteudo,
    GrupoId: config.unilesteId,
    Data: Date(),
    UsuarioId: req.requestUser.Id,
    UrlImagem: req.body.UrlImagem,
    Tags: req.body.Tags
  };

  noticia.createdBy = req.requestUser.Login;

  if (req.body.Tags)
    noticia.Tags = noticia.Tags == null ? "" : req.body.Tags.toString();

  repository.add(noticia, (err, result) => {

    if (err) {
      logService.error(logService.TIPO_LOG.NoticiaCriada, { erro: err, usuario: req.requestUser.Login, GrupoId: noticia.GrupoId });
      res.statusCode = 500;
      return next(err);
    }
    else {
      logService.info(logService.TIPO_LOG.NoticiaCriada, {usuario: req.requestUser.Login, GrupoId: noticia.GrupoId });
      res.json({
        sucesso: true,
        mensagem: 'Notícia cadastrada com sucesso'
      });
    }

  });
};
