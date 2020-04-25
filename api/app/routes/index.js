'use strict';

exports.registerRoutes = function (app) {
    let authController = require('../controllers/authController');
    let errorService = require('../services/errorService');
    let authRoutes = require('./authRoutes');

    let usuarioRoutes = require('./usuarioRoutes')();
    let grupoRoutes = require('./grupoRoutes')();
    let noticiaRoutes = require('./noticiaRoutes')();
    let unilesteRoutes = require('./unilesteRoutes')();
    let reportsRoutes = require('./reportRoutes')();
    let blacklistRoutes = require('./blacklistRoutes')();

    let log = require("../services/logService");


    app.get('/', (req, res) => {
        res.json({
            API: "ShareNews"
        })
    });

    app.use('/auth', authRoutes(app));

    // Middleware para validar o token antes das rotas
    app.use(authController.checkToken);

    // app.use((req, res, next) => {
    //     setTimeout(() => {
    //         return next();
    //     }, 3000);
    // });

    app.use('/api', [
        usuarioRoutes,
        grupoRoutes,
        noticiaRoutes,
        unilesteRoutes,
        reportsRoutes,
        blacklistRoutes
    ]);

    // Error handler
    app.use((err, req, res, next) => {

        log.error('Erro', errorService.getErrorMessage(err));
        
        var statusCode = 500;
        return res
            .status(statusCode)
            .json({
                sucesso: false,
                mensagem: 'Não foi possível completar a requisição.',
                erro: errorService.getErrorMessage(err)
            });
    });
}