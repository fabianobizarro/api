'use strict';

var GrupoRepository = require('../repositories/GrupoRepository'),
    IntegranteGrupoRepository = require('../repositories/IntegranteGrupoRepository'),
    NoticiaRepository = require('../repositories/NoticiaRepository'),
    SolicitacaoRepository = require('../repositories/SolicitacaoRepository'),
    grupoService = require('../services/grupoService'),

    repository = new GrupoRepository(),
    integranteGrupoRepo = new IntegranteGrupoRepository(),
    noticiaRepo = new NoticiaRepository(),
    solicitacaoRepo = new SolicitacaoRepository(),

    models = require('../models'),
    sequelize = models.sequelize;

var env = require('../../config/env/env');

require('../services/Array');

exports.listarGrupos = function (req, res, next) {

    grupoService.obterGrupos(req.requestUser.Id, (err, grupos) => {
        if (err)
            return next(err);
        else
            res.json(grupos);
    });
}

exports.adicionarGrupo = function (req, res, next) {

    let grupo = {
        Nome: req.body.Nome,
        Descricao: req.body.Descricao,
        Publico: req.body.Publico || true
    };

    grupo.createdBy = req.requestUser.Login;

    repository.add(grupo, (err, _grupo) => {

        if (err) return next(err);

        let integrante = {
            GrupoId: _grupo.Id,
            UsuarioId: req.requestUser.Id,
            Admin: true
        };
        integrante.createdBy = req.requestUser.Login;

        integranteGrupoRepo.add(integrante, (e) => {

            if (err) return next(err);

            res.json({
                sucesso: true,
                mensagem: 'Grupo criado com sucesso.'
            });

        });

    });
}

exports.exibirGrupo = function (req, res, next) {
    res.json({
        Id: req.grupo.Id,
        Nome: req.grupo.Nome,
        Descricao: req.grupo.Descricao,
        Publico: req.grupo.Publico
    });
}

exports.alterarGrupo = function (req, res, next) {

    let novoGrupo = req.body;
    let grupo = req.grupo;

    grupo.Nome = novoGrupo.Nome || grupo.Nome;
    grupo.Descricao = novoGrupo.Descricao || grupo.Descricao;
    //grupo.grupoPublico = novoGrupo.Publico || grupo.grupoPublico;

    repository.update(grupo, null, (err) => {
        if (err)
            return next(err);
        else
            res.json({
                sucesso: true,
                mensagem: 'Os dados do grupo foram alterados com sucesso.'
            });
    });
}

exports.excluirGrupo = function (req, res, next) {

    var grupo = req.grupo;


    if (grupo.administradores.indexOf(req.requestUser._id) == -1) {
        // Usuário não está no grupo de administradores
        return next(new Error('O usuário não possui permissão para exluir este grupo pois o mesmo não é adminsitrador'));
    }
    else {
        repository.delete(grupo, (err) => {
            if (err)
                return next(err);

            res.json({
                sucesso: true,
                mensagem: 'O grupo foi excluído com sucesso.'
            });

        })
    }

}

exports.obterGrupoPorId = function (req, res, next, id) {

    repository.findById(id, (err, grupo) => {
        if (err) return next(err);
        if (!grupo) return next(new Error(`Não foi possível encontrar um grupo com o id ${id}`));

        req.grupo = grupo;
        next();
    });
}

exports.listarNoticias = function (req, res, next) {

    grupoService.obterNoticias(req.grupo.Id, req.requestUser.Id, (err, noticias) => {

        if (err) return next(err);

        noticias.forEach((i) => {
            if (i.Tags)
                i.Tags = i.Tags.trim().split(',');
            else
                i.Tags = [];
        });

        return res.json(noticias);

    });

}

exports.adicionarNoticia = function (req, res, next) {

    let noticia = {
        Titulo: req.body.Titulo,
        Alias: req.body.Alias,
        Resumo: req.body.Resumo,
        Conteudo: req.body.Conteudo,
        Data: new Date(),
        UrlImagem: req.body.UrlImagem,
        GrupoId: req.grupo.Id,
        UsuarioId: req.requestUser.Id,
        Tags: req.body.Tags
    };

    noticia.createdBy = req.requestUser.Login;

    if (req.body.Tags)
        noticia.Tags = noticia.Tags == null ? "" : req.body.Tags.toString();

    noticiaRepo.add(noticia, (err) => {

        if (err)
            return next(err);

        res.json({
            sucesso: true,
            mensagem: 'Notícias cadastrada com sucesso.'
        });
    });

}

exports.listarIntegrantes = function (req, res, next) {

    grupoService.obterIntegrantes(req.grupo.Id, (err, integrantes) => {

        if (err)
            return next(err);

        res.json(integrantes);

    });

};

exports.join = function (req, res, next) {

    let grupoId = req.grupo.Id;
    let usuarioId = req.requestUser.Id;

    /**
     * TO DO:
     * Verificar se o usuário já faz parte do grupo
     * Não existe no grupo - Grupo Público => Adiciona no grupo
     * Não existe no grupo - Grupo Privado => Adiciona solicitação pendente
     * */
    grupoService.usuarioNoGrupo(req.grupo.Id, req.requestUser.Id,
        (err, eIntegrante) => {

            if (err) return next(err);

            if (eIntegrante == false) {

                // Adiciona o usuário ao grupo
                if (req.grupo.Publico) {

                    let integrante = {
                        GrupoId: req.grupo.Id,
                        UsuarioId: req.requestUser.Id,
                        Admin: false
                    };
                    integrante.createdBy = req.requestUser.Login;

                    integranteGrupoRepo.add(integrante, (err) => {
                        if (err) return next(err);

                        return res.json({
                            sucesso: true,
                            pendente: false,
                            mensagem: 'Usuário adicionado ao grupo'
                        });
                    });



                }
                else { //Adiciona o usuário às solicitações pendentes

                    let solicitacao = {
                        GrupoId: grupoId,
                        UsuarioId: usuarioId,
                        createdBy: req.requestUser.Login
                    };
                    solicitacaoRepo.add(solicitacao, (err) => {
                        if (err) return next(err);

                        return res.json({
                            sucesso: true,
                            pendente: true,
                            mensagem: 'Solicitação enviada'
                        });
                    })

                }

            } else {
                return res.status(200).json({
                    mensagem: 'Usuário já faz parte do grupo'
                });

            }
        });

}

exports.exit = function (req, res, next) {

    let grupoId = req.grupo.Id;
    let usuarioId = req.requestUser.Id;

    /**
     * Verifica se o usuário existe no grupo
     * Existe no grupo && somente ele é admin => Informa que deve haver pelo menos um administrador no grupo
     * Existe no grupo && existe mais de um admin => Remove o usuário do grupo
     * Existe no grupo && não é admin => remove o usuário do grupo 
     */

    integranteGrupoRepo.findOne({ where: { GrupoId: grupoId, UsuarioId: usuarioId } }, (err, integrante) => {
        if (err) return next(err);


        if (integrante.Admin) {

            grupoService.obterIntegrantes(grupoId, (err, integrantes) => {
                if (err) return next(err);

                let adminCount = integrantes.where((i) => { return i.Admin == true; }).length;

                if (adminCount == 1) { // Não pode remover o único usuário admin do grupo
                    return res.json({
                        sucesso: false,
                        mensagem: 'Não é possível sair do grupo, só existe 1 usuário administrador no grupo.'
                    });
                }
                else { // há mais de 1 usuário admin no grupo

                    integranteGrupoRepo.delete({ where: { GrupoId: grupoId, UsuarioId: usuarioId } }, (err) => {
                        if (err) return next(err);

                        return res.json({
                            sucesso: true,
                            mensagem: 'Usuário removido do grupo'
                        });

                    });

                }

            });

        }
        else {
            integranteGrupoRepo.delete({ where: { GrupoId: grupoId, UsuarioId: usuarioId } }, (err) => {
                if (err) return next(err);

                return res.json({
                    sucesso: true,
                    mensagem: 'Usuário removido do grupo'
                });

            });
        }


    })
}

exports.listarSolicitacoesPendentes = function (req, res, next) {
    let grupoId = req.grupo.Id;

    grupoService.obterSolicitacoesPendentes(grupoId, (err, results) => {
        if (err) return next(err);

        return res.json(results);
    })
}

exports.aceitarSolicitacao = function (req, res, next) {

    let grupoId = req.grupo.Id;
    let usuarioId = req.params.idUsuario;

    solicitacaoRepo.delete({ where: { GrupoId: grupoId, UsuarioId: usuarioId } }, (err, linhasAfetadas) => {

        if (linhasAfetadas == 1) {
            let integrante = {
                GrupoId: grupoId,
                UsuarioId: usuarioId,
                Admin: false,
                createdBy: req.requestUser.Login
            };
            integranteGrupoRepo.add(integrante, (err) => {
                if (err) return next(err);

                return res.json({
                    sucesso: true,
                    mensagem: 'Usuário adicionado ao grupo'
                });
            })
        }
        else {
            return res.json({
                sucesso: false,
                mensagem: 'Não existe solicitação pendente para o usuário informado'
            });
        }
    })


}

exports.recusarSolicitacao = function (req, res, next) {

    let usuarioId = req.params.idUsuario;

    solicitacaoRepo.delete({ where: { UsuarioId: usuarioId } }, (err, linhasExcluidas) => {
        if (err) return next(err);

        if (linhasExcluidas == 0)
            return res.json({
                sucesso: false,
                mensagem: 'Não existe solicitação pendente para o usuário informado'
            });
        else
            return res.json({
                sucesso: true,
                mensagem: 'Solicitação removida com sucesso'
            });
    });

}

exports.admin = function (req, res, next) {

    let grupoId = req.grupo.Id;
    let usuarioId = req.params.idUsuario;

    /**
     * Usuário não é admin => Define como adminsitrador
     * Usuário é admin => Remove administrador delete
     *      Validar se é o unico admin do grupo
     */

    grupoService.obterIntegrantes(grupoId, (err, integrantes) => {

        if (err) return next(err);

        let integrante = integrantes.where((i) => { return i.Id == usuarioId }).first();

        if (!integrante) { // Integrante do grupo não encontrado
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Integrante do grupo não encontrado'
            });
        }
        else {
            if (integrante.Admin == true) { // integrante já é admin

                let adminCount = integrantes.count((i) => { return i.Admin });

                if (adminCount == 1) {
                    return res.status(401).json({
                        sucesso: false,
                        mensagem: 'Não é possível sair do grupo, só existe 1 usuário administrador no grupo.'
                    });
                }
                else {
                    let options = {
                        where: { GrupoId: grupoId, UsuarioID: usuarioId }
                    }

                    integranteGrupoRepo.update({ Admin: false, updatedBy: req.requestUser.Login }, options,
                        (err) => {
                            if (err) return next(err);

                            return res.json({
                                sucesso: true,
                                mensagem: 'O usuário agora não é mais Administrador do grupo',
                                admin: false
                            });
                        });
                }

            }
            else {

                integrante.Admin = true;
                let options = {
                    where: { GrupoId: grupoId, UsuarioID: usuarioId }
                }
                integranteGrupoRepo.update({ Admin: true, updatedBy: req.requestUser.Login }, options,
                    (err) => {
                        if (err) return next(err);

                        return res.json({
                            sucesso: true,
                            mensagem: 'O usuário agora é Administrador do grupo',
                            admin: true
                        });
                    });
            }
        }

    });

};

exports.pesquisarGrupos = function (req, res, next) {
    let pesquisa = req.query.q;
    let usuarioId = req.requestUser.Id;

    let QUANTIDADE_MINIMA_CARACTERES = 2;

    if (!pesquisa) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O parâmetro `q` deve ser informado na url'
        });
    } else
        if (pesquisa.length < QUANTIDADE_MINIMA_CARACTERES) {
            return res.status(400).json({
                mensagem: `O termo de pesquisa deve conter no mínimo ${QUANTIDADE_MINIMA_CARACTERES} caracteres`
            });
        }

    grupoService.pesquisarGrupos(pesquisa, usuarioId, (err, results) => {
        if (err) return next(err);

        return res.json(results);
    })
}


exports.removerUsuarioDoGrupo = function (req, res, next) {

    let grupoId = req.grupo.Id;
    let usuarioId = parseInt(req.params.idUsuario);

    grupoService.removerUsuario(grupoId, usuarioId, (err, removido) => {

        if (err)
            return next(err);

        return res.json({
            sucesso: true,
            mensagem: 'Usuário removido do grupo.'
        });
    });


};


exports.trocarVisibilidadeGrupo = function (req, res, next) {

    let grupo = req.grupo;
    let msg = '';

    grupo.Publico = !grupo.Publico;
    grupo.updatedBy = req.requestUser.Login;

    repository.update(grupo, null, (err) => {
        if (err) return next(err);

        if (grupo.Publico)
            msg = "Este grupo agora é público";
        else
            msg = 'Este grupo agora é privado';

        return res.json({
            sucesso: true,
            mensagem: msg,
            publico: grupo.Publico

        });

    });

};


// Middleware de validação

exports.usuarioIntegranteGrupo = function (req, res, next) {

    grupoService.obterIntegrantes(req.grupo.Id, (err, integrantes) => {

        if (err) return next(err);

        for (var i in integrantes) {
            let integrante = integrantes[i];

            if (integrante.Login === req.requestUser.Login)
                return next();
        }

        return res.status(403).json({
            sucesso: false,
            mensagem: 'Usuário não faz parte do grupo'
        });

    });

};

exports.usuarioAdminGrupo = function (req, res, next) {

    grupoService.obterIntegrantes(req.grupo.Id, (err, integrantes) => {

        if (err) return next(err);

        for (var i in integrantes) {
            let integrante = integrantes[i];

            if (integrante.Login == req.requestUser.Login && integrante.Admin == true)
                return next();
        }

        return res.status(403).json({
            sucesso: false,
            mensagem: 'Usuário não é administrador ou não faz parte do grupo'
        });

    });

}

exports.grupoPublico = function (req, res, next) {

    if (req.grupo.Publico)
        return next();
    else {
        return res.status(403)
            .json({
                sucesso: false,
                mensagem: 'Este grupo é privado.'
            });
    }


}

exports.solicitacaoGrupoPendente = function (req, res, next) {
    let grupoId = req.grupo.Id;
    let usuarioId = req.requestUser.Id;

    let where =
        {
            GrupoId: grupoId,
            UsuarioId: usuarioId
        };

    solicitacaoRepo.findOne({ where: where }, (err, result) => {

        if (err) return next(err);

        if (!result) {
            return next();
        }
        else {
            return res.json({
                sucesso: false,
                mensagem: 'Usuário já possui uma solicitação pendente'
            });
        }
    })
}
