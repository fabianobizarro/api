
var mongoose = require('mongoose');

exports.quanditateNoticiaPorCategoria = function (dataInicio, dataTermino, callback) {

    var pipeline = [
        {
            $match: {
                data: {
                    '$gte': dataInicio,
                    '$lte': dataTermino
                }
            }
        },
        {
            $project: { _id: 0, categoriaNoticia: 1 }
        },
        {
            $group: { _id: '$categoriaNoticia', count: { $sum: 1 } }
        }
    ];

    mongoose.model('Noticia').aggregate(pipeline, callback);
}