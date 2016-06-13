
var dateService = require('../services/dateservice');
var categoriaNoticiaRepository = require('../repositories/CategoriaNoticiaRepository');
var NoticiaRepository = require('../repositories/NoticiaRepository');

exports.index = function (req, res, next) {
    res.end('Index');
};

exports.qt_noticiasPorCategoria = function (req, res, next) {

    var categoriaRepo = new categoriaNoticiaRepository();
    var noticiaRepo = new NoticiaRepository();

    var dataInicio = dateService.dataFormatada(req.params.dti);
    var dataTermino = dateService.dataFormatada(req.params.dtt);

    if (dataInicio && dataTermino) {

        categoriaRepo.getAll((err, categorias) => {
            if (err)
                return next(err);

            res.json(categorias);
        });


        // res.json({
        //     dataInicio: req.params.dti,
        //     dataTermino: req.params.dtt
        // });

    }
    else {

        return next(new Error('A requisição possui parâmetros inválidos'));
    }

};