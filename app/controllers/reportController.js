var dateService = require('../services/dateservice');
var categoriaNoticiaRepository = require('../repositories/CategoriaNoticiaRepository');
var reportService = require('../services/reportService');
require('../services/arrayService');

exports.index = function (req, res, next) {
    res.end('Index');
};

exports.qt_noticiasPorCategoria = function (req, res, next) {

    var categoriaRepo = new categoriaNoticiaRepository();

    var dataInicio = dateService.dataFormatada(req.params.dti);
    var dataTermino = dateService.dataFormatada(req.params.dtt);

    if (dataInicio && dataTermino) {

        dataInicio = new Date(dataInicio.ano, dataInicio.mes, dataInicio.dia);
        dataTermino = new Date(dataTermino.ano, dataTermino.mes, dataTermino.dia);


        categoriaRepo.getAll((err, categorias) => {

            if (err) return next(err);

            categorias = categorias.map(item => {
                return {
                    _id: item._id, nome: item.nome
                }
            });

            reportService.quanditateNoticiaPorCategoria(dataInicio, dataTermino, (err, result) => {
                if (err)
                    return next(err);

                console.log(categorias)

                result.forEach(item => {
                    item.nome = categorias.where(i => {return i._id == item._id} )[0].nome;
                });

                res.json(result);
            });

        });

    }
    else
        return next(new Error('A requisição possui parâmetros inválidos'));

};