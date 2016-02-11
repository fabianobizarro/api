var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    UsuarioRepository = require('../../app/repositories/UsuarioRepository');

module.exports = function () {

    var repository = new UsuarioRepository();

    passport.use(new LocalStrategy(function (username, password, done) {
        repository.findOne({ login: username }, (err, usuario) => {

            if (err)
                return done(err);

            if (!usuario) {
                return done(null, false, {
                    message: 'Usuário não encontrado'
                })
            }

            return done(null, usuario);

        });
    }));
};