var dateService = require('../services/dateService');
var reportService = require('../services/reportService');
require('../services/Array');
var MongoClient = require('mongodb').MongoClient;
var env = require('../../config/env/env');



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

exports.dadosAnaliticos = function (req, res, next) {

    let dataInicio = req.query.dataInicio;
    let dataFim = req.query.dataFim;
    let noticia = req.noticia;

    let query = {
        "message": "noticia visualizada",
        "meta.noticiaId": noticia.Id
    };

    let projection = {
        "_id": 0,
        "timestamp": 1,
        "meta.noticiaId": 1,
        "meta.usuario": 1
    };

    if (dataInicio && dataFim) {
        query.timestamp = {
            $gte: new Date(dataInicio),
            $lt: new Date(dataFim)
        }
    }

    MongoClient.connect(env.dbLogUri, (err, db) => {
        if (err) return next(err);


        db.collection('log').find(query).project(projection).toArray((err, docs) => {
            if (err) return next(err);

            db.close();

            var report = dadosFormatados(docs);

            var dados = {
                noticiaId: noticia.Id,
                titulo: noticia.Titulo,
                periodo: dataInicio && dataInicio ? dataInicio + ' à ' + dataFim : "Todos",
                dados: report
            }

            res.json(dados);

        });
    });
}


var dadosFormatados = function (dados) {

    var report = {};

    dados = dados.map(d => {
        d.timestamp = d.timestamp.toLocaleDateString();
        return d;
    });

    dados.forEach((d) => {

        let dataReport = report[d.timestamp];

        if (dataReport) {

            dataReport.quantidadeAcessos++;

            if (dataReport.usuarios.indexOf(d.meta.usuario) == -1) {
                dataReport.usuarios.push(d.meta.usuario);
                dataReport.quantidadeUsuarios++;
            }


        }
        else {
            report[d.timestamp] = {
                quantidadeAcessos: 1,
                quantidadeUsuarios: 1,
                usuarios: [d.meta.usuario]
            };
        }

    });

    return report;

}

