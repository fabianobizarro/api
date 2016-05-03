'use strict';

var NoticiaRepository = require('../repositories/NoticiaRepository'),
    repository = new NoticiaRepository(),
    config = require('../../config/config');


exports.listarNoticiasUnileste = function(req, res, next){
    repository.find({ _id : config.unilesteId }, (err, result)=>{
      if (err)
        return next(err);

      res.json(result);
    });
}

exports.cadastrarNoticiaUnileste = function(req, res, next){

  var noticia = req.body;
  noticia.grupoId = config.unilesteId;

  repository.add(noticia, (err, result)=>{

    if (err){
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

  //res.json(noticia);

};
