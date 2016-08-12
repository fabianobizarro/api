'use strict';
var NoticiaRepository = require('../repositories/NoticiaRepository'),
    GrupoRepository = require('../repositories/GrupoRepository'),
    ComentarioRepository = require('../repositories/ComentarioRepository'),
    CurtidaRepository = require('../repositories/CurtidaRepository'),

    noticiaService = require('../services/noticiaService'),

    repository = new NoticiaRepository(),
    grupoRepo = new GrupoRepository(),
    comentarioRepo = new ComentarioRepository(),
    curtidaRepo = new CurtidaRepository(),

    ObjectId = require('mongoose').Types.ObjectId,
    dateService = require('../services/dateService'),
    models = require('../models');



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
    return res.json(req.noticia);
};

exports.obterNoticiaPorId = function (req, res, next, idNoticia) {

    noticiaService.obterNoticiaPorId(idNoticia, (err, noticia) => {
        if (err) return next(err);
        if (!noticia) return next(new Error('Não foi possível encontrar uma notícia com o id ' + idNoticia));

        req.noticia = noticia;
        return next();
    });
};

exports.excluirNoticia = function (req, res, next) {

    repository.delete({ where: { Id: req.noticia.Id } }, (err) => {
        if (err)
            return next(err);


        res.json({
            sucesso: true,
            mensagem: 'A notícia foi excluída com sucesso.'
        });

        // grupoRepo.findOneAndUpdate(req.grupo._id, {
        //     '$pull': { 'noticias': req.noticia._id }
        // }, (err) => {

        //     res.json({
        //         sucesso: true,
        //         mensagem: 'A notícia foi excluída com sucesso.'
        //     });
        // })
    });
};

exports.alterarNoticia = function (req, res, next) {

    var noticia = req.noticia;
    var newNoticia = req.body;

    noticia.Titulo = newNoticia.Titulo || noticia.Titulo;
    noticia.Resumo = newNoticia.Resumo || noticia.Resumo;
    noticia.Conteudo = newNoticia.Conteudo || noticia.Conteudo;
    noticia.Alias = newNoticia.Alias || noticia.Alias;
    noticia.Tags = newNoticia.Tags || noticia.Tags;

    if (typeof noticia.Tags == 'object')
        noticia.Tags = noticia.Tags.toString();

    repository.update(noticia, { where: { Id: req.noticia.Id } }, (err) => {

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

    var descComentario = req.body.Comentario;
    if (!descComentario) {
        res.status(400)
            .json({
                sucesso: false,
                mensagem: 'O comentário é obrigatório'
            });
    }

    var comentario = {
        UsuarioId: req.requestUser.Id,
        NoticiaId: req.noticia.Id,
        Conteudo: descComentario,
        Data: Date.now()
    };

    comentarioRepo.add(comentario, (err) => {
        if (err) return next(err);

        return res.json({
            sucesso: true,
            mensagem: 'Comentário adicionado com sucesso',
            comentario: comentario
        });
    });
};

exports.exibirComentarios = function (req, res, next) {

    noticiaService
        .obterComentarios(req.noticia.Id, (err, comentarios) => {
            if (err) return next(err);

            return res.json(comentarios);
        });
}

exports.removerComentario = function (req, res, next) {

    var idNoticia = req.params.idNoticia;
    var idComentario = req.params.idComentario;

    let where = {
        Id: idComentario,
        NoticiaId: idNoticia
    };

    comentarioRepo.delete({ where: where }, (err, result) => {
        if (err)
            return next(err);

        if (result == 0) {
            res.status(404).json({
                sucesso: false,
                mensagem: 'Comentário não encontrado'
            });
        }
        else {
            res.json({
                sucesso: true,
                mensagem: 'Comentário excluído com sucesso.'
            });
        }

    });
};

exports.curtirNoticia = function (req, res, next) {

    var idNoticia = req.params.idNoticia;
    var idUsuario = req.requestUser.Id;
    var curtir = null;

    var addCurtida = function () {

        var curtida = {
            Data: Date(),
            NoticiaId: idNoticia,
            UsuarioId: idUsuario
        };
        curtir = true;
        curtidaRepo.add(curtida, (err) => {
            if (err)
                return next(err);

            return res.json({
                sucesso: true,
                curtir: curtir,
                mensagem: 'Curtida adicionada/removida com sucesso.'
            });
        });
    };

    var removeCurida = function () {
        curtir = false;
        let condition = {
            UsuarioId: idUsuario,
            NoticiaId: idNoticia
        };
        curtidaRepo.delete({ where: condition }, (err, rows) => {
            if (err) return next(err);

            res.json({
                sucesso: true,
                curtir: curtir,
                mensagem: 'Curtida adicionada/removida com sucesso.'
            });
        });

    };

    noticiaService.obterCurtidas(idNoticia, (err, results) => {

        if (err)
            return next(err);

        let usuarioCurtiu = results.where(n => n.Usuario == req.requestUser.Login).length;
        if (usuarioCurtiu == 0)
            addCurtida();
        else
            removeCurida();
    });
};

exports.obterCurtidas = function (req, res, next) {

    let options = {
        attributes: ['UsuarioId'],
        include: [
            {
                model: models.Usuario,
                as: 'Usuario',
                where: { Id: models.sequelize.col('NoticiaId') },
                attributes: ['Login']
            }
        ]
    }

    noticiaService.obterCurtidas(req.noticia.Id, (err, curtidas) => {
        if (err) return next(err);

        curtidas = curtidas.map((i) => {
            return i.Usuario;
        });

        return res.json(curtidas)
    });
};

exports.pesquisarNoticias = function (req, res, next) {

    // let query = queryPesquisa(req);

    // let attributes = [
    //     'Id',
    //     'Titulo',
    //     'Alias',
    //     'Resumo',
    //     'Conteudo',
    //     'Data',
    //     'UrlImagem',
    //     'Tags'
    // ];

    // repository.find({ attributes: attributes, where: query }, null, (err, results) => {
    //     if (err)
    //         return next(err);

    //     results.forEach((i) => {
    //         if (i.Tags)
    //             i.Tags = i.Tags.trim().split(',');
    //     });

    //     res.json(results);
    // });

    /**
     * TO DO:
     * Validar o parametro 'q' da query string
     * Tamanho > 3
     * Not null
     */

    let texto = req.query.q || '';
    let dataInicio = req.query.dataInicio || req.query.DataInicio;
    let dataTermino = req.query.dataTermino || req.query.DataTermino;
    let idUsuario = req.requestUser.Id;

    noticiaService.pesquisarNoticia(texto, dataInicio, dataTermino, idUsuario,
        (err, noticias) => {
            if (err) return next(err);

            noticias.forEach((i) => {
                if (i.Tags)
                    i.Tags = i.Tags.trim().split(',');
            });

            res.json(noticias);

            });

        };

    var queryPesquisa = function (req) {

        var query = {};

        let pesquisa = req.query.q || '';

        query['$or'] = [
            {
                Titulo: { $like: `%${pesquisa}%` }
            },
            {
                Resumo: { $like: `%${pesquisa}%` }
            },
            {
                Tags: { $like: `%${pesquisa}%` }
            }
        ]

        if (req.query.dataInicio || req.query.dataTermino) {

            // formata as datas de 00/00/00 para um objeto => { dia: 00, mes: 00, ano: 0000 }
            var dataInicioFormatada = dateService.dataFormatada(req.query.dataInicio || Date());
            var dataTerminoFormatada = dateService.dataFormatada(req.query.dataTermino || Date());

            if (req.query.dataInicio && req.query.dataTermino) {
                query['Data'] =
                    {
                        '$gte': new Date(dataInicioFormatada.ano, (dataInicioFormatada.mes - 1), dataInicioFormatada.dia),
                        '$lte': new Date(dataTerminoFormatada.ano, (dataTerminoFormatada.mes - 1), dataTerminoFormatada.dia)
                    };
            } else
                if (req.body.dataInicio) {
                    query['Data'] = { '$gte': new Date(dataInicioFormatada.ano, (dataInicioFormatada.mes - 1), dataInicioFormatada.dia) };
                }
                else if (req.body.dataTermino) {
                    query['Data'] = { '$gte': new Date(dataTerminoFormatada.ano, (dataTerminoFormatada.mes - 1), dataTerminoFormatada.dia) };
                }
        }

        return query;

    };
