'use strict'


module.exports = function(){
    
    let express = require("express");    
    let controller = require("../controllers/authController");
    var rotas = express.Router();
    
    rotas.post('/signIn', controller.signIn);
 
    return rotas;   
}