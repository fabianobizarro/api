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

exports.listarUsuarios = function(req, res, next) {
    repository.getAll((err, usuarios)=>{
        if (err) return next(err);
        
        res.json(usuarios);
    })
}