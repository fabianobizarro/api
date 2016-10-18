'use strict'
var crypto = require('crypto');
var UsuarioRepository = require('../repositories/UsuarioRepository'),
    authService = require("../services/authService"),
    emailService = require('../services/emailService');

require('../services/dateService'); //Date methods

exports.signIn = function (req, res, next) {

    let repo = new UsuarioRepository();
    let usuario = req.body.login;
    let senha = req.body.senha;

    repo.findOne({ where: { Login: usuario } }, (err, usuario) => {

        if (err)
            return next(err);

        if (!usuario) { // Verifica se o usuário existe
            res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário/Senha inválidos.'
            });
        }
        else {

            if (usuario.Senha !== usuario.hashPassword(senha)) // Verifica se a senha está correta
            {
                res.status(401).json({
                    sucesso: false,
                    mensagem: 'Usuário/Senha inválidos.'
                });
            }
            else {
                // se tudo estiver ok, gera o token e retorna ao usuário

                var _user = getUserData(usuario);

                let token = authService.signIn(_user);

                res.status(200).json({
                    sucesso: true,
                    mensagem: 'Usuário autenticado com sucesso.',
                    token: token
                });
            }
        }
    });
}

exports.signInAdmin = function (req, res, next) {
    let repo = new UsuarioRepository();
    let usuario = req.body.login;
    let senha = req.body.senha;


    repo.findOne({ login: usuario }, (err, usuario) => {

        if (err)
            return next(err);

        if (!usuario) // Verifica se o usuário existe
            return next(new Error('Usuário/Senha inválidos.'));
        else {
            if (usuario.Senha !== usuario.hashPassword(senha)) // Verifica se a senha está correta
            {
                return next(new Error('Usuário/Senha inválidos.'))
            }
            else {

                if (usuario.Admin) {
                    // se tudo estiver ok, gera o token e retorna ao usuário

                    var _user = getUserData(usuario);

                    let token = authService.signIn(_user);

                    res.json({
                        sucesso: true,
                        mensagem: 'Usuário autenticado com sucesso.',
                        token: token
                    });
                }
                else {
                    res.status(401)
                        .json({
                            sucesso: false,
                            mensagem: 'Acesso negado.'
                        });
                }
            }
        }
    });
};

exports.signUp = function (req, res, next) {

    let repo = new UsuarioRepository();

    let novoUsuario = {
        Login: req.body.login || req.body.Login,
        Senha: req.body.senha || req.body.Senha,
        Email: req.body.email || req.body.Email,
        Nome: req.body.nome || req.body.Nome,
        Telefone: req.body.telefone || req.body.Telefone,
    }

    novoUsuario.createdBy = novoUsuario.Login;


    repo.add(novoUsuario, (err, usuario) => {

        if (err)
            return next(err);

        var _user = getUserData(usuario);

        let token = authService.signIn(_user);

        res.json({
            sucesso: true,
            mensagem: 'Usuário criado com sucesso',
            token: token
        });
    });
};

exports.checkToken = function (req, res, next) {

    var token = req.body.snt || req.query.snt || req.headers['snt'];

    if (token) {

        authService.verifyToken(token, (err, decoded) => {
            if (err) {
                res.status(403).json({ sucesso: false, mensagem: 'Falha na autenticação do token.' })
            }
            else {
                req.decoded = decoded
                if (!decoded._doc)
                    req.requestUser = decoded;
                else
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
};

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
};

var getUserData = function (user) {
    return {
        Id: user.Id,
        Nome: user.Nome,
        Telefone: user.Telefone,
        Login: user.Login,
        Email: user.Email,
        Admin: user.Admin
    };
};

exports.enviarLinkAlteracaoSenha = function (req, res, next) {

    let repo = new UsuarioRepository();
    let email = req.body.Email;

    if (!email) {
        return res.status(400)
            .json({
                sucesso: false,
                mensagem: 'Endereço de Email não informado'
            });
    }

    repo.findOne({ where: { Email: email } }, (err, usuario) => {

        if (err) return next(err);

        if (!usuario) {
            return res.status(404)
                .json({
                    sucesso: false,
                    mensagem: 'Endereço de Email não encontrado'
                });
        }

        crypto.randomBytes(43, (err, buffer) => {
            let token = buffer.toString('hex');
            let dataExp = new Date().addDays(2).toLocaleString();

            usuario.TokenSenha = token;
            usuario.TokenSenhaExp = dataExp;
            usuario.updatedBy = usuario.Login;

            repo.update(usuario, null, (err, ok) => {

                if (err) return next(err);

                /**
                 * TODO: Enviar email com o token para o usuário
                 * link: admin.sharenews.com/senha?t={token}
                 */
                //emailService.sendMail({});

                res.json({
                    sucesso: true,
                    mensagem: 'Email enviado para alteração de senha',
                    email: usuario.Email,
                    token: token,
                    dataExp: dataExp
                });

            });

        });
    });
};
