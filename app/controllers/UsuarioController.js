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

    repository.getAll((err, usuarios) => {
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
    usuario.senha = req.body.senha || usuario.senha;

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
            _id: user._id,
            nome: user.nome,
            email: user.email,
            login: user.login
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
};

exports.alternarAdminUsuario = function (req, res, next) {

    var _atualizarUsuario = function () {
        repository.update(req.usuario, (err) => {
            if (err) {
                req.statusCode = 500;
                return next(err);
            }

            res.json({
                sucesso: true,
                mensagem: 'Operação realizada com sucesso',
                admin: req.usuario.admin
            });
        });
    };

    if (req.requestUser.admin === false) {
        res.statusCode = 401;
        return next(new Error('Você não tem permissão para realizar esta operação'));
    }

    req.usuario.admin = !req.usuario.admin;

    if (req.usuario.admin === false) {
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

