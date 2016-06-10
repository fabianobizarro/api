'use strict';
var NoticiaRepository = require('../repositories/NoticiaRepository'),
    GrupoRepository = require('../repositories/GrupoRepository'),
    repository = new NoticiaRepository(),
    grupoRepo = new GrupoRepository(),
    ObjectId = require('mongoose').Types.ObjectId,
    dateService = require('../services/dateService');


exports.listarNoticias = function (req, res, next) {

    var _grupoId = req.grupo._id;

    repository.find({ grupoId: _grupoId },
        (err, noticias) => {

            if (err)
                return next(err);

            res.json(noticias);
        });
}

exports.adicionarNoticia = function (req, res, next) {

    var noticia = req.body;

    noticia.grupoId = req.grupo._id;

    //Adiciona a notícia na coleção
    repository.add(noticia, (err, noti) => {

        if (err)
            return next(err);

        var grupo = req.grupo;

        // Atualiza o registro do grupo
        //Adiciona o ID da notícia cadastrada na coleção de notícias do grupo
        grupoRepo.findOneAndUpdate(grupo._id,
            { '$addToSet': { noticias: noti._id } },
            (err) => {


                if (err)
                    return next(err);

                res.json({
                    sucesso: true,
                    mensagem: 'Notícia cadastrada com sucesso.'
                });


            });

        grupoRepo.update(grupo, (err) => {


        });
    });
}

exports.exibirNoticia = function (req, res, next) {
    res.json(req.noticia);
};

exports.obterNoticiaPorId = function (req, res, next, idNoticia) {

    //console.log(idNoticia);

    repository.findById(idNoticia, (err, noticia) => {
        if (err) return next(err);
        if (!noticia) return next(new Error('Não foi possível encontrar uma notícia com o id ' + idNoticia));

        req.noticia = noticia;
        return next();
    });
};

exports.excluirNoticia = function (req, res, next) {

    repository.delete(req.noticia, (err) => {
        if (err)
            return next(err);


        grupoRepo.findOneAndUpdate(req.grupo._id, {
            '$pull': { 'noticias': req.noticia._id }
        }, (err) => {

            res.json({
                sucesso: true,
                mensagem: 'A notícia foi excluída com sucesso.'
            });
        })
    });
};

exports.alterarNoticia = function (req, res, next) {

    var noticia = req.noticia;
    var newNoticia = req.body;

    noticia.titulo = newNoticia.titulo || noticia.titulo;
    noticia.resumo = newNoticia.resumo || noticia.resumo;
    noticia.conteudo = newNoticia.conteudo || noticia.conteudo;

    repository.update(noticia, (err) => {

        if (err) {
            res.statusCode = 500;
            return next(err);
        }

        res.json({
            sucesso: true,
            mensagem: 'A notícia foi alterada com sucesso!'
        });
    });
};

exports.adicionarComentario = function (req, res, next) {

    var descComentario = req.body.comentario;
    if (!descComentario) {
        res.statusCode = 400;
        return next(new Error('O comentário é obrigatório'));
    }

    var comentario = {
        _id: new ObjectId(),
        usuario: req.requestUser.login,
        comentario: descComentario,
        data: Date.now()
    };

    repository.findOneAndUpdate({ _id: req.noticia._id },
        { '$addToSet': { comentarios: comentario } },
        (err, model) => {
            if (err) {
                res.statusCode = 500;
                return next(err);
            }
            res.json({
                sucesso: true,
                mensagem: 'Comentário adicionado com sucesso',
                comentario: comentario
            });
        });
};

exports.removerComentario = function (req, res, next) {
    var idNoticia = req.params.idNoticia;
    var idComentario = req.params.idComentario;

    repository.findOneAndUpdate(
        { _id: idNoticia },
        { '$pull': { comentarios: { _id: idComentario } } },
        (err) => {
            if (err) {
                res.statusCode = 500;
                return next(err);
            }

            res.json({
                sucesso: true,
                mensagem: 'Comentário excluído com sucesso.'
            });
        });
};

exports.curtirNoticia = function (req, res, next) {

    var idNoticia = req.params.idNoticia;
    var idUsuario = req.requestUser._id;
    var updateStatement = {};
    var curtir = null;

    if (req.noticia.curtidas.indexOf(idUsuario) == -1) {
        // Notícia não foi curtida pelo usuário
        updateStatement = { '$addToSet': { curtidas: idUsuario } };
        curtir = true;
    }
    else {
        // notícia já foi curtida pelo usuário
        updateStatement = { '$pull': { curtidas: idUsuario } };
        curtir = false;
    }

    repository.findOneAndUpdate(
        { _id: idNoticia },
        updateStatement,
        (err) => {

            if (err) {
                res.statusCode = 500;
                return next(err);
            }

            res.json({
                sucesso: true,
                curtir: curtir,
                mensagem: 'Curtida adicionada/removida com sucesso.'
            });
        });
};

exports.pesquisarNoticias = function (req, res, next) {

    var query = queryPesquisa(req);

    repository.find(query, (err, results) => {
        if (err)
            return next(err);

        res.json(results);
    });

};

var queryPesquisa = function (req) {

    var query = {};
    query['$or'] = [];


    if (req.body.categoriaNoticia)
        query['$or'].push({ categoriaNoticia: new ObjectId(req.body.categoriaNoticia) });

    if (req.body.titulo)
        query['$or'] = { titulo: { '$regex': RegExp(req.body.titulo), "$options": 'i' } };

    if (req.body.resumo)
        query['$or'] = { titulo: { '$regex': RegExp(req.body.resumo), "$options": 'i' } };

    if (req.body.conteudo)
        query['$or'] = { titulo: { '$regex': RegExp(req.body.conteudo), "$options": 'i' } };



    if (req.body.dataInicio || req.body.dataTermino) {

        // formata as datas de 00/00/00 para um objeto => { dia: 00, mes: 00, ano: 0000 }
        var dataInicioFormatada = dateService.dataFormatada(req.body.dataInicio || Date());
        var dataTerminoFormatada = dateService.dataFormatada(req.body.dataTermino || Date());

        if (req.body.dataInicio && req.body.dataTermino) {
            query['data'] =
                {
                    '$gte': new Date(dataInicioFormatada.ano, (dataInicioFormatada.mes - 1), dataInicioFormatada.dia),
                    '$lte': new Date(dataTerminoFormatada.ano, (dataTerminoFormatada.mes - 1), dataTerminoFormatada.dia)
                };
        } else
            if (req.body.dataInicio) {
                query['data'] = { '$gte': new Date(dataInicioFormatada.ano, (dataInicioFormatada.mes - 1), dataInicioFormatada.dia) };
            }
            else if (req.body.dataTermino) {
                query['data'] = { '$gte': new Date(dataTerminoFormatada.ano, (dataTerminoFormatada.mes - 1), dataTerminoFormatada.dia) };
            }
    }

    return query;

};