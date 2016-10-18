'use strict'


module.exports = function(){
    
    let express = require("express");    
    let controller = require("../controllers/authController");
    var rotas = express.Router();
    
    rotas.post('/signIn', [controller.validarUsuarioSenha, controller.signIn]);
    rotas.post('/signIn/admin', [controller.validarUsuarioSenha, controller.signInAdmin]);
    rotas.post('/signUp', controller.signUp);
    rotas.post('/resetPasswdLink', controller.enviarLinkAlteracaoSenha);
 
    return rotas;   
}