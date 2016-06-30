'use strict';

var NoticiaRepository = require('../repositories/NoticiaRepository'),
  repository = new NoticiaRepository(),
  config = require('../../config/env'),
  sequelize = require('sequelize');

require('../services/Date');


exports.listarNoticiasUnileste = function (req, res, next) {

  var dateNow = new Date().yyyyMMdd();

  var sql = `SELECT 
              N.Id, N.Titulo, N.Alias, N.Resumo, N.Conteudo, N.Data, CN.Nome as CategoriaNoticia, N.Tags, COUNT(C.ID) AS Curtidas, COUNT(CO.ID) AS Comentarios

              FROM Noticia N

              INNER JOIN CATEGORIANOTICIA CN 
              ON N.CATEGORIANOTICIAID = CN.ID

              LEFT JOIN CURTIDA C
              ON N.ID = C.NOTICIAID

              LEFT JOIN COMENTARIO CO
              ON N.ID = CO.NOTICIAID

              WHERE date(N.DATA) = '${dateNow}'
              AND N.GRUPOID = ${config.unilesteId}

              GROUP BY N.Id, N.Titulo, N.Alias, N.Resumo, N.Conteudo, N.Data, CN.Nome
              ORDER BY N.DATA DESC;`;

  repository.query(sql, null, (err, result) => {
    if (err)
      return next(err);

    result.forEach((i) => {
      if (i.Tags)
        i.Tags = i.Tags.split(',');
    });

    res.json(result);
  })
};

exports.cadastrarNoticiaUnileste = function (req, res, next) {

  var noticia = {
    Titulo: req.body.titulo,
    Resumo: req.body.resumo,
    Conteudo: req.body.conteudo,
    CategoriaNoticiaId: req.body.categoriaNoticia,
    GrupoId: config.unilesteId,
    Data: new Date(),
    UsuarioId: req.requestUser.Id
  };

  if (req.body.tags)
    noticia.Tags = req.body.tags.toString();

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