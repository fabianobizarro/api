

module.exports = function () {
    
    var passport = require('passport'),
    UsuarioRepository = require('../app/repositories/UsuarioRepository.js'),
        repository = new UsuarioRepository();

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        repository.findById(id, (err, usuario) => {
            done(err, usuario);
        })
    });

    require('./strategies/local.js')();

}