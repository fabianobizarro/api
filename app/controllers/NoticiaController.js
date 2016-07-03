'use strict';
var NoticiaRepository = require('../repositories/NoticiaRepository'),
    GrupoRepository = require('../repositories/GrupoRepository'),
    ComentarioRepository = require('../repositories/ComentarioRepository'),
    CurtidaRepository = require('../repositories/CurtidaRepository'),


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

    res.json({
        Id: req.noticia.Id,
        Titulo: req.noticia.Titulo,
        Alias: req.noticia.Alias,
        Resumo: req.noticia.Resumo,
        Conteudo: req.noticia.Conteudo,
        Tags: req.noticia.Tags.split(','),
        UrlImagem: req.noticia.UrlImagem,
        CategoriaNoticiaId: req.noticia.CategoriaNoticiaId,
        GrupoId: req.noticia.GrupoId,
        Data: req.noticia.Data
    });
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

    noticia.Titulo = newNoticia.Titulo || noticia.Titulo;
    noticia.Resumo = newNoticia.Resumo || noticia.Resumo;
    noticia.Conteudo = newNoticia.Conteudo || noticia.Conteudo;
    noticia.Alias = newNoticia.Alias || noticia.Alias;
    noticia.Tags = newNoticia.Tags || noticia.Tags;

    if (typeof noticia.Tags == 'object')
        noticia.Tags = noticia.Tags.toString();

    repository.update(noticia, {}, (err) => {

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

    req.noticia.createComentario(comentario)
        .then(function (result) {
            res.json({
                sucesso: true,
                mensagem: 'Comentário adicionado com sucesso',
                comentario: comentario
            });
        }, function (err) {
            return next(err);
        });
};

exports.exibirComentarios = function (req, res, next) {

    req.noticia.getComentarios({
        attributes: ['Id', 'Conteudo', 'Data'],
        include: [
            {
                model: models.Usuario,
                as: 'Usuario',
                where: { Id: models.sequelize.col('UsuarioId') },
                attributes: ['Login']
            }
        ]
    })
        .then(function (results) {
            res.json(results);
        }, function (err) {
            return next(err);
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
        req.noticia.createCurtida(curtida)
            .then((r) => {
                res.json({
                    sucesso: true,
                    curtir: curtir,
                    mensagem: 'Curtida adicionada/removida com sucesso.'
                });
            }, (err) => {
                return next(err);
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

    req.noticia.getCurtidas({ where: { UsuarioId: idUsuario } })
        .then((results) => {
            if (results.length == 0)
                addCurtida();
            else
                removeCurida();
        }, (err) => {
            return next(err);
        });
};

exports.obterCurtidas = function (req, res, next) {

    let options = {
        attributes:['UsuarioId'],
        include: [
            {
                model: models.Usuario,
                as: 'Usuario',
                where: { Id: models.sequelize.col('NoticiaId') },
                attributes: ['Login']
            }
        ]
    }

    req.noticia.getCurtidas(options)
        .then((results) => {

            results = results.map((i)=>{
                return i.Usuario.Login; 
            });

            res.json(results);
        }, (err) => {
            return next(err);
        });

};

exports.pesquisarNoticias = function (req, res, next) {

    let query = queryPesquisa(req);

    let include = [
        {
            model: models.Comentario,
            as: 'Comentarios',
            where: { NoticiaId: models.sequelize.col('Noticia.Id') },
            required: false
        },
        {
            model: models.Curtida,
            as: 'Curtidas',
            where: { NoticiaId: models.sequelize.col('Noticia.Id') },
            required: false
        }
    ]
    let attributes = [
        'Id',
        'Titulo',
        'Alias',
        'Resumo',
        'Conteudo',
        'Data',
        'UrlImagem',
        'Tags',
    ];

    repository.find({ attributes: attributes, where: query, include: include }, null, (err, results) => {
        if (err)
            return next(err);

        results.forEach((i) => {
            if (i.Tags)
                i.Tags = i.Tags.split(',');
        });

        res.json(results);
    });

};

var queryPesquisa = function (req) {

    var query = {};
    //query['$or'] = [];


    if (req.body.CategoriaNoticia)
        query['CategoriaNoticiaId'] = req.body.CategoriaNoticia;
    //query['$or'].push({ categoriaNoticia: new ObjectId(req.body.categoriaNoticia) });

    if (req.body.Titulo)
        query['Titulo'] = { $like: `%${req.body.Titulo}%` };
    //query['$or'] = { titulo: { '$regex': RegExp(req.body.titulo), "$options": 'i' } };

    if (req.body.Resumo)
        query['Resumo'] = { $like: `%${req.body.Resumo}%` };
    //query['$or'] = { titulo: { '$regex': RegExp(req.body.resumo), "$options": 'i' } };

    if (req.body.Conteudo)
        query['Conteudo'] = { $like: `%${req.body.Conteudo}%` };

    //query['$or'] = { titulo: { '$regex': RegExp(req.body.conteudo), "$options": 'i' } };



    if (req.body.DataInicio || req.body.DataTermino) {

        // formata as datas de 00/00/00 para um objeto => { dia: 00, mes: 00, ano: 0000 }
        var dataInicioFormatada = dateService.dataFormatada(req.body.DataInicio || Date());
        var dataTerminoFormatada = dateService.dataFormatada(req.body.DataTermino || Date());

        if (req.body.DataInicio && req.body.DataTermino) {
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