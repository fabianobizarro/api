
var getErrorMessage = function(err)
{
	if (err.errors)
	{
        
		for (var errName in err.errors)
		{
			if (err.errors[errName].message)
				return err.errors[errName].message;
		}
	}
    else if (err.message)
    {
        return err.message;
    }
	else
	{
		return 'Unknown server error';	
	}
};

exports.registerRoutes = function (app) {

    require('./categoriaNoticiaRoutes')(app);    
    // Registrar todas as rotas    
    
    // Handler de erros padrão
    app.use((err, req, res, next) => { 
        return res
                .status(500)
                .json({
                    erro: 'Não foi possível completar a requisição.',
                    mensagem: getErrorMessage(err)
                });
    });
}