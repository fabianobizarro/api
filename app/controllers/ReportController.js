var dateService = require('../services/dateService');
var reportService = require('../services/reportService');
require('../services/Array');

exports.index = function (req, res, next) {
    res.end('Index');
};

exports.tags = function (req, res, next) {

    let dtInicio = req.params.dtInicio;
    let dtFim = req.params.dtFim;



    if (!dtInicio || !dtFim) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'As datas de início e término do preíodo são obrigatórias'
        })
    };

    if (new Date(dtInicio) > new Date(dtFim)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'A data de início tem que ser menor do que a data término do preíodo'
        });
    }

    reportService.tags(dtInicio, dtFim, (err, resultados) => {

        if (err) {
            return next(err);
        }
        else {
            return res.json(resultados);
        }

    });


};

