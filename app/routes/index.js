'use strict';

exports.registerRoutes = function (app) {
    let authController =    require('../controllers/authController');
    let errorService =      require('../services/errorService');
    let authRoutes = require('./authRoutes');
    
    let categoriaNoticiaRotas = require('./categoriaNoticiaRoutes')();
    let usuarioRotas = require('./usuarioRoutes')();
    let grupoRotas = require('./grupoRoutes')();
    let noticiaRotas = require('./noticiaRoutes')();
    

    app.get('/', (req, res) => { 
        res.json({
            API: "ShareNews"
        })
    });

    // Registrar todas as rotas    

    app.use('/auth', authRoutes(app));
    
    // Middleware para validar o token antes das rotas
    app.use(authController.checkToken);
    
    app.use('/api', [
        categoriaNoticiaRotas, 
        usuarioRotas,
        grupoRotas,
        noticiaRotas
    ]);
    
    // Handler de erros padrão
    app.use((err, req, res, next) => {
        var statusCode = res.statusCode || 500;
        return res
            .status(statusCode)
            .json({
                sucesso: false, 
                erro: 'Não foi possível completar a requisição.',
                mensagem: errorService.getErrorMessage(err)
            });
    });
}