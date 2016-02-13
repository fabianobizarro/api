'use strict';

var getErrorMessage = function (err) {
    if (err.errors) {

        let messages = [];
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                messages.push(err.errors[errName].message);
                //return err.errors[errName].message;
        }
        return messages;
    }
    else if (err.message) {
        return err.message;
    }
    else {
        return 'Unknown server error';
    }
};

exports.registerRoutes = function (app) {

    app.get('/', (req, res) => { 
        res.json({
            API: "ShareNews"
        })
    });

    require('./categoriaNoticiaRoutes')(app);
    require('./usuarioRoutes')(app);
    // Registrar todas as rotas    
    
    // Handler de erros padrão
    app.use((err, req, res, next) => {
        return res
            .status(500)
            .json({
                sucesso: false, 
                erro: 'Não foi possível completar a requisição.',
                mensagem: getErrorMessage(err)
            });
    });
}