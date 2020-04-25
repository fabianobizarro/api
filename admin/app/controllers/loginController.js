'use strict';
var config = require('../../config/env');
var loginService = require('../services/loginService');

exports.index = function (req, res) {
    let apiUrl = `${config.protocol}//${config.hostname}:${config.port}`;
    res.render('login', { sucesso: true, usuario: '', apiUrl: apiUrl });
}

exports.signIn = function (req, res) {

    loginService.login(req.body.username, req.body.password, (err, data) => {

        try {
            var response = JSON.parse(data);

            if (err)
                throw err;

            if (response.sucesso) {

                var day = 3600000 * 24;
                var expires = day * 30;

                expires = 2629746000;
                res.cookie('snt', response.token, { maxAge: expires });
                res.redirect('/');
            }
            else {
                res.status(400).render('login', {
                    sucesso: false,
                    usuario: req.body.username,
                    mensagem: response.erro,
                    apiUrl: ''
                });
            }
        }
        catch (err) {
            res.status(400).render('login', {
                sucesso: false,
                usuario: req.body.username,
                mensagem: 'Não foi possível realizar o login. Tente novamente mais tarde.',
                apiUrl: ''
            });
        }


    });
}

exports.logout = function (req, res) {
    res.clearCookie('snt');
    res.clearCookie('snUserInfo');
    res.redirect('/login');
}

exports.trocarSenha = function (req, res) {

    let token = req.query.t;
    let apiUrl = `${config.protocol}//${config.hostname}:${config.port}`;

    if (!token)
        return res.redirect('/');

    res.render('senha', { t: token, apiUrl: apiUrl });
}