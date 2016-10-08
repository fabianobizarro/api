'use strict';
var NoticiaRepository = require('../repositories/NoticiaRepository'),
    GrupoRepository = require('../repositories/GrupoRepository'),
    ComentarioRepository = require('../repositories/ComentarioRepository'),
    CurtidaRepository = require('../repositories/CurtidaRepository'),

    noticiaService = require('../services/noticiaService'),
    blacklistService = require('../services/blacklistService'),
    grupoService = require('../services/grupoService'),

    repository = new NoticiaRepository(),
    grupoRepo = new GrupoRepository(),
    comentarioRepo = new ComentarioRepository(),
    curtidaRepo = new CurtidaRepository(),

    env = require('../../config/env/env'),

    ObjectId = require('mongoose').Types.ObjectId,
    dateService = require('../services/dateService'),
    models = require('../models');

require('../services/Array');


exports.listarNoticias = function (req, res, next) {

    var _grupoId = req.grupo._id;

    repository.find({ grupoId: _grupoId },
        (err, noticias) => {

            if (err)
                return next(err);

            res.json(noticias);
        });
}

// exports.adicionarNoticia = function (req, res, next) {

//     var noticia = req.body;

//     noticia.GrupoId = req.grupo._id;
//     noticia.createdBy = req.requestUser.Login;

//     //Adiciona a notícia na coleção
//     repository.add(noticia, (err, noti) => {

//         if (err)
//             return next(err);

//         var grupo = req.grupo;

//         // Atualiza o registro do grupo
//         //Adiciona o ID da notícia cadastrada na coleção de notícias do grupo
//         grupoRepo.findOneAndUpdate(grupo._id,
//             { '$addToSet': { noticias: noti._id } },
//             (err) => {


//                 if (err)
//                     return next(err);

//                 res.json({
//                     sucesso: true,
//                     mensagem: 'Notícia cadastrada com sucesso.'
//                 });


//             });

//         grupoRepo.update(grupo, (err) => {


//         });
//     });
// }

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
    noticia.UrlImagem = newNoticia.UrlImagem || noticia.UrlImagem;
    noticia.updatedBy = req.requestUser.Login;

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

    var descComentario = req.body.comentario;
    if (!descComentario) {
        res.status(400)
            .json({
                sucesso: false,
                mensagem: 'O comentário é obrigatório'
            });
    }

    blacklistService.comentarioValido(descComentario, (err, valido) => {
        if (err) return next(new Error('Ocorreu um erro e não foi possível validar o comentário'));

        if (valido) {
            var comentario = {
                UsuarioId: req.requestUser.Id,
                NoticiaId: req.noticia.Id,
                Conteudo: descComentario,
                Data: Date.now()
            };

            comentario.createdBy = req.requestUser.Login;

            comentarioRepo.add(comentario, (err, comment) => {
                if (err) return next(err);

                comentario.Id = comment.Id;

                return res.json({
                    sucesso: true,
                    mensagem: 'Comentário adicionado com sucesso',
                    comentario: comentario,
                });
            });
        }
        else {
            return res.status(406).json({
                sucesso: false,
                mensagem: 'O comentário possui uma ou mais palavras que são proibidas. Não será possível adicionar este comentário',
                comentario: descComentario
            });
        }
    })


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
        curtida.createdBy = req.requestUser.Login;
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

    let texto = req.query.q || '';
    let dataInicio = req.query.dataInicio || req.query.DataInicio;
    let dataTermino = req.query.dataTermino || req.query.DataTermino;
    let idUsuario = req.requestUser.Id;

    if (!texto) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe o parâmetro de busca'
        });
    }
    if (texto.length < 3) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O tamanho mínimo do parâmetro de busca é de 3 caracteres'
        });
    }

    noticiaService.pesquisarNoticia(texto, dataInicio, dataTermino, idUsuario, env.unilesteId,
        (err, noticias) => {
            if (err) return next(err);

            noticias.forEach((i) => {
                if (i.Tags)
                    i.Tags = i.Tags.trim().split(',');
                else
                    i.Tags = [];
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


// middlewares de validação

exports.podeRemoverComentario = function (req, res, next) {
    /**
     * Que pode remover o comentáio
     * - Próprio autor
     * - Adminstrador do grupo
     * - Adminstrador da aplicação (Unileste)
     */

    let comentarioId = parseInt(req.params.idComentario);
    let noticiaId = req.noticia.Id;
    let usuarioId = req.requestUser.Id;
    let usuario = req.requestUser.Login;
    let grupoId = req.noticia.GrupoId;


    // validar se o requestUser é o auator do comentário
    noticiaService.obterComentarios(noticiaId, (err, comments) => {
        if (err) return next(err);

        let c = comments.where(p => { return p.Id == comentarioId; }).first();

        if (c.Usuario != usuario) { // Usuário da requisição não é o mesmo autor do comentário

            // valiar se o requestUser é administrador do grupo da notícia
            grupoService.obterUsuariosAdministradores(grupoId, (err, admins) => {
                if (err) return next(err);

                let isAdmin = admins.count(p => { return p.Id == usuarioId }) > 0;

                if (isAdmin) {
                    next();
                }
                else {
                    // validar se o usuário é administrador do unileste
                    if (grupoId == env.unilesteId && usuario.Admin){
                        next();
                    }
                    else 
                        return res.status(403)
                            .json({
                                sucesso: false,
                                mensagem: 'Não foi possível remover este comentário.',
                                erro: 'Você não tem permissão para realizar esta operação.'
                            });
                }

            });
        }
        else {
            next();
        }

    });
}