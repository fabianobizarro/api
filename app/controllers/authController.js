'use strict'
var UsuarioRepository = require('../repositories/UsuarioRepository'),
    authService = require("../services/authService");

exports.signIn = function(req, res, next) {

    let repo = new UsuarioRepository();
    let usuario = req.body.login;
    let senha = req.body.senha;

    // if (usuario == '' || usuario == null || usuario == undefined) {
    //     res.statusCode = 400;
    //     return next(new Error("O login do usuário deve ser informado."));
    // }

    // if (senha == '' || senha == null || senha == undefined) {
    //     res.statusCode = 400;
    //     return next(new Error("A senha do usuário deve ser informado."));
    // }


    repo.findOne({ login: usuario }, (err, usuario) => {

        if (err)
            return next(err);

        if (!usuario) { // Verifica se o usuário existe
            res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário/Senha inválidos.'
            });
        }
        else {
            if (usuario.senha !== usuario.hashPassword(senha)) // Verifica se a senha está correta
            {
                res.status(401).json({
                    sucesso: false,
                    mensagem: 'Usuário/Senha inválidos.'
                });
            }
            else {
                // se tudo estiver ok, gera o token e retorna ao usuário
                let token = authService.signIn(usuario);

                res.status(200).json({
                    sucesso: true,
                    mensagem: 'Usuário autenticado com sucesso.',
                    token: token
                });
            }
        }
    });
}

exports.signInAdmin = function(req, res, next) {
    let repo = new UsuarioRepository();
    let usuario = req.body.login;
    let senha = req.body.senha;


    repo.findOne({ login: usuario }, (err, usuario) => {

        if (err)
            return next(err);

        if (!usuario) // Verifica se o usuário existe
            return next(new Error('Usuário/Senha inválidos.'));
        else {
            if (usuario.senha !== usuario.hashPassword(senha)) // Verifica se a senha está correta
            {
                return next(new Error('Usuário/Senha inválidos.'))
            }
            else {

                if (usuario.admin) {
                    // se tudo estiver ok, gera o token e retorna ao usuário
                    let token = authService.signIn(usuario);

                    res.json({
                        sucesso: true,
                        mensagem: 'Usuário autenticado com sucesso.',
                        token: token
                    });
                }
                else {
                    return next(new Error('Usuário não possui permissão.'))
                }
            }
        }
    });
}

exports.signUp = function(req, res, next) {

    let repo = new UsuarioRepository();

    let novoUsuario = {
        login: req.body.login,
        senha: req.body.senha,
        email: req.body.email,
        nome: req.body.nome
    }

    repo.add(novoUsuario, (err, usuario) => {

        if (err)
            return next(err);

        let token = authService.signIn(usuario);

        res.json({
            sucesso: true,
            mensagem: 'Usuário criado com sucesso',
            token: token
        });
    });
}

exports.checkToken = function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        authService.verifyToken(token, (err, decoded) => {
            if (err) {
                res.json({ sucesso: false, mensagem: 'Falha na autenticação do token.' })
            }
            else {
                req.decoded = decoded
                req.requestUser = decoded._doc;
                next();
            }
        });
    }
    else {
        res.status(403).send({
            sucesso: false,
            mensagem: 'Nenhum token foi informado'
        });
    }
}

exports.validarUsuarioSenha = function (req, res, next) {
    let usuario = req.body.login;
    let senha = req.body.senha;

    if (usuario == '' || usuario == null || usuario == undefined) {
        res.statusCode = 400;
        return next(new Error("O login do usuário deve ser informado."));
    }
    else
        if (senha == '' || senha == null || senha == undefined) {
            res.statusCode = 400;
            return next(new Error("A senha do usuário deve ser informado."));
        }
    return next();
}