'use strict';
var UsuarioRepository = require('../repositories/UsuarioRepository'),
    repository = new UsuarioRepository();


exports.adicionarUsuario = function (req, res, next) {
    var usuario = req.body;

    repository.add(usuario, (err) => {

        if (err)
            return next(err);

        res.json({
            mensagem: 'O usuário foi cadastrado com sucesso!'
        })
    });
}

exports.listarUsuarios = function (req, res, next) {
    repository.getAll((err, usuarios) => {
        if (err) return next(err);

        res.json(usuarios);
    })
}

exports.dadosUsuario = function (req, res, next) {
    res.json(req.usuario);
}

exports.alterarUsuario = function (req, res, next) {

    var usuario = req.usuario;

    usuario.nome = req.body.nome || usuario.nome;
    usuario.email = req.body.email || usuario.email;
    usuario.login = req.body.login || usuario.login;
    usuario.senha = req.body.senha || usuario.senha;
    usuario.admin = req.body.admin || usuario.admin;

    repository.update(usuario, (err) => {
        if (err)
            return next(err);

        res.json({
            sucesso: true,
            mensagem: 'Cadastro do usuário atualizado com sucesso.'
        });
    });
}

exports.excluirUsuario = function (req, res, next) {
    var usuario = req.usuario;

    repository.delete(usuario, (err) => {
        if (err)
            return next(err);

        res.json({
            sucesso: true,
            mensagem: 'Usuário excluído com sucesso!'
        })
    });
}

exports.obterUsuarioPorId = function (req, res, next, id) {

    repository.findById(id, (err, usuario) => {

        if (err)
            return next(err);

        if (usuario) {
            req.usuario = usuario;
            next();
        }
        else
            return next(new Error('Não foi possível encontrar um registro com o id + ' + id));
    });
}
