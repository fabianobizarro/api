'use strict';

module.exports = function (app) {
    let  controller = require('../controllers/UsuarioController');
    
    app.route('/usuario')
        .get(controller.listarUsuarios)
        .post(controller.adicionarUsuario);

}