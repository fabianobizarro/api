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
};

exports.listarUsuarios = function (req, res, next) {

    repository.getAll(['Id', 'Nome', 'Login', 'Email', 'Telefone', 'UrlFoto'], (err, usuarios) => {
        if (err) return next(err);

        res.json(usuarios);
    })
};

exports.dadosUsuario = function (req, res, next) {
    res.json(req.usuario);
};

exports.alterarUsuario = function (req, res, next) {

    var usuario = req.usuario;

    usuario.nome = req.body.nome || usuario.nome;
    usuario.email = req.body.email || usuario.email;
    usuario.login = req.body.login || usuario.login;

    repository.update(usuario, (err) => {

        if (err) {
            res.statusCode = 500;
            return next(err);
        }

        res.json({
            sucesso: true,
            mensagem: 'Cadastro do usuário atualizado com sucesso.'
        });
    });
};

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
};

exports.infoUsuario = function (req, res, next) {

    if (!req.requestUser) {
        res.statusCode = 403;
        res.json({
            sucesso: false,
            mensagem: "Operação não autorizada. É obrigatório o token."
        });
    }
    else {
        let user = req.requestUser;

        res.json({
            Id: user.Id,
            Nome: user.Nome,
            Email: user.Email,
            Login: user.Login
        });
    }

};

exports.pesquisaUsuario = function (req, res, next) {

    var pesquisa = req.params.pesquisa;
    var query = {
        '$or': [
            { nome: { '$regex': new RegExp(pesquisa), '$options': 'i' } },
            { login: { '$regex': new RegExp(pesquisa), '$options': 'i' } },
        ]
    };

    repository.find(query, (err, usuarios) => {

        if (err) {
            res.statusCode = 500;
            return next(err);
        }

        res.json(usuarios);

    });

};

exports.obterUsuarioPorId = function (req, res, next, id) {

    repository.findOne({
        attributes: ['Id', 'Nome', 'Login', 'Email', 'Telefone', 'UrlFoto', 'Admin'],
        where: { Id: id }
    }, (err, usuario) => {

        if (err)
            return next(err);

        if (usuario) {
            req.usuario = usuario;
            next();
        }
        else
            return next(new Error(`Não foi possível encontrar um registro com o id ${id}`));
    });
};

exports.alternarAdminUsuario = function (req, res, next) {

    var _atualizarUsuario = function () {
        repository.findOneAndUpdate(
            { _id: req.usuario._id },
            { '$set': { admin: !req.usuario.admin } },
            (err) => {
                if (err) {
                    res.statusCode = 500;
                    return next(err);
                }

                res.json({
                    sucesso: true,
                    mensagem: 'Operação realizada com sucesso',
                    admin: !req.usuario.admin
                });
            });
    };

    if (req.requestUser.admin === false) {
        res.statusCode = 401;
        return next(new Error('Você não tem permissão para realizar esta operação'));
    }

    //req.usuario.admin = !req.usuario.admin;

    if (req.usuario.admin === true) {
        repository.count({ admin: true }, (err, count) => {

            if (count == 1) {
                res.statusCode = 403;
                return next(new Error('Você não pode remover o provilégio de administrador deste usuário, pois atualmente ele é o único usuário administrador do sistema.'));
            }
            _atualizarUsuario();


        });
    }
    else {
        _atualizarUsuario();
    }


};

exports.alterarSenha = function (req, res, next) {

    if (req.requestUser._id != req.usuario._id) {
        res.statusCode = 403;
        res.json({
            sucesso: false,
            mensagem: 'Você não tem permissão para alterar a senha deste usuário'
        });
    }

    var user = req.usuario;
    user.senha = req.body.senha;

    repository.update(user, (err) => {

        if (err) {
            res.statusCode = 500;
            return next(err);
        }

        res.json({
            sucesso: true,
            mensagem: 'A senha foi alterada com sucesso.'
        });

    });
};