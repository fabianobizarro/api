'use strict'
var UsuarioRepository = require('../repositories/UsuarioRepository'),
    authService = require("../services/authService");

exports.signIn = function (req, res, next) {

    let repo = new UsuarioRepository();
    let usuario = req.body.login;
    let senha = req.body.senha;

    repo.findOne({ login: usuario }, (err, usuario) => {

        if (err)
            return next(err);

        if (!usuario) // Verifica se o usuário existe
            return next(new Error('Usuário não encontrado.'));
        else {
            if (usuario.senha !== usuario.hashPassword(senha)) // Verifica se a senha está correta
            {
                return next(new Error('Usuário e/ou senha inválidos.'))
            }
            else {
                // se tudo estiver ok, gera o token e retorna ao usuário
                let token = authService.signIn(usuario);

                res.json({
                    sucesso: true,
                    mensagem: 'Usuário autenticado com sucesso.',
                    token: token
                });
            }
        }
    });
}

exports.checkToken = function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        authService.verifyToken(token, (err, decoded) => {
            if (err) {
                res.json({ sucesso: false, mensagem: 'Falha na autenticação do token.' })
            }
            else
            {
                req.decoded = decoded
                req.userToken = decoded._doc;
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