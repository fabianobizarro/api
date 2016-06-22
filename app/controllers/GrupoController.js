'use strict';

var GrupoRepository = require('../repositories/GrupoRepository'),
    repository = new GrupoRepository();


exports.listarGrupos = function (req, res, next) {
    repository.getAll((err, grupos) => {
        if (err)
            return next(err);
        else
            res.json(grupos);
    });
}

exports.adicionarGrupo = function (req, res, next) {

    let grupo = req.body;

    grupo.administradores = [];
    grupo.integrantes = [];
    grupo.administradores.push(req.requestUser._id);
    grupo.integrantes.push(req.requestUser._id);

    repository.add(grupo, (err) => {
        if (err)
            return next(err);
        else
            res.json({
                sucesso: true,
                mensagem: 'Grupo criado com sucesso.'
            })
    });
}

exports.exibirGrupo = function (req, res, next) {
    res.json(req.grupo);
}

exports.alterarGrupo = function (req, res, next) {

    let novoGrupo = req.body;
    let grupo = req.grupo;

    grupo.nome = novoGrupo.nome || grupo.nome;
    grupo.descricao = novoGrupo.descricao || grupo.descricao;
    grupo.grupoPublico = novoGrupo.grupoPublico || grupo.grupoPublico;

    repository.update(grupo, (err) => {
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


exports.listarNoticias = function(req, res, next){
    res.status(501).end('Not Implemented');
}

exports.adicionarNoticia = function (req, res, next) {
    res.status(501).end("Not Implemented");
}