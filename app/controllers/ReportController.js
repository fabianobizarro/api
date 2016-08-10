var dateService = require('../services/dateService');
var reportService = require('../services/reportService');
require('../services/Array');

exports.index = function (req, res, next) {
    res.end('Index');
};

exports.qt_noticiasPorCategoria = function (req, res, next) {

    return res.json([]);

    // var dataInicio = dateService.dataFormatada(req.params.dti);
    // var dataTermino = dateService.dataFormatada(req.params.dtt);

    // console.log(dataInicio)
    // console.log(dataTermino)

    // if (dataInicio && dataTermino) {

    //     dataInicio = new Date(dataInicio.ano, dataInicio.mes - 1, dataInicio.dia);
    //     dataTermino = new Date(dataTermino.ano, dataTermino.mes - 1, dataTermino.dia);


    //     categoriaRepo.getAll((err, categorias) => {

    //         if (err) return next(err);

    //         categorias = categorias.map(item => {
    //             return {
    //                 _id: item._id, nome: item.nome
    //             }
    //         });
    //         console.log(dataInicio)
    //         console.log(dataTermino)
    //         reportService.quanditateNoticiaPorCategoria(dataInicio, dataTermino, (err, result) => {
    //             if (err)
    //                 return next(err);

    //             console.log(categorias)
    //             console.log(result)

    //             result.forEach(item => {
    //                 item.nome = categorias.where(i => { return i._id == item._id })[0].nome;
    //             });

    //             console.log(result);
    //             res.json(result);
    //         });

    //     });

    // }
    // else
    //     return next(new Error('A requisição possui parâmetros inválidos'));

};
