'use strict';

const BaseRepository = require('../repositories/BaseRepository');
const arrayService = require('./Array');

exports.tags = function (dataInicio, dataTermino, callback) {

    obterTodasTags(dataInicio, dataTermino, (err, tags) => {
        if (err) callback(err);

        tags = tags || [];

        obterNoticias(dataInicio, dataTermino, (err, noticias) => {
            if (err) callback(err);


            if (noticias.length == 0) {
                return callback(null, {
                    totalTags: 0,
                    totalTagsDiferentes: 0,
                    percentagemTotal: 0,
                    resultados: [],
                    mensagem: 'Não foram encontrados registros para o relatório'
                });
            }

            let totalTags = tags.length;
            let resultados = [];
            let percentagemTotal = 0;
            tags = tags.distinct();

            tags.forEach(function (tag) {

                let count = 0;
                noticias.forEach(function (noticia) {

                    if (noticia.Tags.indexOf(tag) != -1) {
                        count++;
                    }
                }, this);

                let percent = (count * 100) / totalTags;

                resultados.push({ tag: tag, total: count, percentagem: percent });
                percentagemTotal += percent;

            }, this);


            resultados = orderByTotal(resultados);

            let report = {
                totalTags: totalTags,
                totalTagsDiferentes: tags.length,
                percentagemTotal: percentagemTotal,
                resultados
            }

            callback(null, report);

        });
    });
}


let obterTodasTags = function (dtInicio, dtFim, callback) {
    let sql =
        `select group_concat(Tags SEPARATOR ',') as Tags 
    from noticia
    where Data between date('${dtInicio}') and date('${dtFim}')`;

    BaseRepository.query(sql, null, (err, result) => {
        if (err) callback(err);

        let tags = result[0].Tags;
        tags = tags || "";
        tags = tags.split(',');

        callback(null, tags);
    });
}

let obterNoticias = function (dtInicio, dtFim, callback) {
    let sql =
        `select Id, Data, Tags 
    from noticia
    where Data between date('${dtInicio}') and date('${dtFim}');`;

    BaseRepository.query(sql, null, (err, noticias) => {

        if (err) callback(err);

        noticias = noticias.map((n) => {
            if (n.Tags) n.Tags = n.Tags.split(',');
            else n.Tags = [];
            return n;
        });

        callback(null, noticias);

    });
}

let orderByTotal = function (resultados) {
    return resultados.sort((a, b) => {
        if (a.total > b.total)
            return -1;

        if (a.total < b.total)
            return 1;

        return 0;
    });
}