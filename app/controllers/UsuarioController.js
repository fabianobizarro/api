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

    let fields = {
        attributes: ['Id', 'Nome', 'Login', 'Email', 'Telefone', 'UrlFoto']
    };

    repository.getAll(fields, (err, usuarios) => {
        if (err) return next(err);

        res.json(usuarios);
    });
};

exports.dadosUsuario = function (req, res, next) {
    res.json({
        Nome: req.usuario.Nome,
        Login: req.usuario.Login,
        Email: req.usuario.Email,
        Telefone: req.usuario.Telefone,
        UrlFoto: req.usuario.UrlFoto,
        Admin: req.usuario.Admin
    });
};

exports.alterarUsuario = function (req, res, next) {

    var usuario = req.usuario;

    usuario.Nome = req.body.Nome || usuario.Nome;
    usuario.Telefone = req.body.Telefone || usuario.Telefone;
    usuario.UrlFoto = req.body.UrlFoto || usuario.UrlFoto;

    usuario.updatedBy = usuario.Login;

    repository.update(usuario, null, (err) => {

        if (err) {
            return next(err);
        }

            res.json({
            sucesso: true,
            mensagem: 'Dados do usuário atualizados com sucesso.'
        });
    });
};

exports.excluirUsuario = function (req, res, next) {
    var usuario = req.usuario;

    let options = {
        where: { Id: usuario.Id },
        validate: false,
        hooks: false
    }

    repository.update({ Ativo: false }, options, (err) => {
        if (err)
            return next(err);

        res.json({
            sucesso: true,
            mensagem: 'Usuário excluído com sucesso'
        });
    })
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
            Login: user.Login,
            UrlFoto: user.UrlFoto,
            Telefone: user.Telefone
        });
    }

};

exports.pesquisaUsuario = function (req, res, next) {

    var pesquisa = req.params.pesquisa;

    if (pesquisa && pesquisa.lenght <= 2) {
        return res.status(400)
            .json({
                sucesso: true,
                mensagem: 'Informe no míniomo 3 caracteres para a busca'
            });
    }

    var options = {
        where: {
            '$or': [
                { Nome: { "$like": `%${pesquisa}%` } },
                { Login: { "$like": `%${pesquisa}%` } },
            ]
        },
        attributes: ['Id', 'Login', 'Nome', 'UrlFoto']
    }

    repository.find(options, null, (err, usuarios) => {

        if (err) {
            res.statusCode = 500;
            return next(err);
        }

        res.json(usuarios);

    });

};

exports.obterUsuarioPorId = function (req, res, next, id) {

    repository.findOne({
        where: { '$and': { Id: id, Ativo: true } }
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

    let usuario = req.usuario;

    usuario.Admin = !usuario.Admin;


    var query = {
        where: { Id: usuario.Id },
        validate: false,
        hooks: false
    };

    repository.update({ Admin: usuario.Admin, updatedBy: req.requestUser.Login }, query, (err) => {

        if (err) {
            return next(err);
        }

        res.json({
            sucesso: true,
            mensagem: 'Operação realizada com sucesso',
            admin: usuario.Admin
        });
    });

};

exports.alterarSenha = function (req, res, next) {

    var usuario = req.usuario;

    let senhaAtual = req.body.senhaAtual;
    let novaSenha = req.body.novaSenha;

    if (!senhaAtual) {
        return res.status(400)
            .json({
                sucesso: false,
                mensagem: 'Informe sua senha atual'
            });
    }

    if (!novaSenha) {
        return res.status(401)
            .json({
                sucesso: false,
                mensagem: 'Informe sua nova senha'
            });
    }

    if (usuario.hashPassword(senhaAtual) == usuario.Senha){
        
        usuario.Senha = novaSenha;

        usuario.updatedBy = usuario.Login;
        
        repository.update(usuario, null, (err) => {

            if (err)
                return next(err);

            res.json({
                sucesso: true,
                mensagem: 'A senha foi alterada com sucesso.'
            });

        });

    }
    else {
        return res.status(400)
            .json({
                sucesso: false,
                mensagem: 'A senha atual informada é inválida'
            });
    }

};

/* --- Middlewares para validação --- */

exports.countAdminUsers = function (req, res, next) {

    let usuario = req.usuario;

    if (usuario.Admin == true) {

        repository.count({ where: { Admin: true } }, (err, count) => {

            if (err)
                return next(err);

            if (count == 1) {
                res.status(403)
                    .json({
                        sucesso: false,
                        mensagem: 'No momento, você não pode remover o provilégio de administrador deste usuário.',
                    });
            }
            else
                next();
        });
    }
    else
        next();

};

exports.requestUserIsAdmin = function (req, res, next) {

    if (req.requestUser.Admin == true)
        next();
    else
        res.status(401)
            .json({
                sucesso: false,
                mensagem: 'Você não tem permissão para realizar esta operação'
            });
};

exports.requestUserIsTheOwn = function (req, res, next) {

    if (req.requestUser.Id != req.usuario.Id) {
        res.status(403)
            .json({
                sucesso: false,
                mensagem: 'Você não tem permissão para alterar a senha deste usuário'
            });
    }
    else
        next();
};