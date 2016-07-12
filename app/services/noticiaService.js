'use strict';
//var BaseRepository = require('../repositories/BaseRepository');
var NoticiaRepository = require('../repositories/NoticiaRepository'),
    CurtidaRepository = require('../repositories/CurtidaRepository'),

    noticiaRepo = new NoticiaRepository(),
    curtidaRepo = new CurtidaRepository();


var formatTags = function (noticia) {
    if (noticia.Tags)
        noticia.Tags = noticia.Tags.split(',');
    else
        noticia.Tags = [];
};

exports.obterNoticiasPorDataeGrupo = function (data, idGrupo, callback) {

    let sql = `SELECT 
              N.Id, 
              N.Titulo,
              N.Alias, 
              N.Resumo, 
              N.Conteudo,
              N.Data, 
              CN.Nome as CategoriaNoticia, 
              N.Tags, 
              N.UrlImagem, 
              COUNT(C.ID) AS Curtidas, 
              COUNT(CO.ID) AS Comentarios

              FROM Noticia N

              INNER JOIN CATEGORIANOTICIA CN 
              ON N.CATEGORIANOTICIAID = CN.ID

              LEFT JOIN CURTIDA C
              ON N.ID = C.NOTICIAID

              LEFT JOIN COMENTARIO CO
              ON N.ID = CO.NOTICIAID

              WHERE date(N.DATA) = '${data}'
              AND N.GRUPOID = ${idGrupo}

              GROUP BY N.Id, N.Titulo, N.Alias, N.Resumo, N.Conteudo, N.Data, CN.Nome
              ORDER BY N.DATA DESC;`;

    NoticiaRepository.query(sql, null, (err, results) => {
        if (err) callback(err);

        results.forEach(formatTags);

        callback(null, results);

    });

}

exports.obterNoticiaPorId = function (idNoticia, callback) {
    let sql = `SELECT
                N.Id,
                N.Titulo,
                N.Alias,
                N.Resumo,
                N.Conteudo,
                N.Data,
                CN.Nome as CategoriaNoticia,
                N.Tags,
                N.UrlImagem,
                COUNT(C.ID) AS Curtidas,
                COUNT(CO.ID) AS Comentarios

                FROM Noticia N

                INNER JOIN CATEGORIANOTICIA CN
                ON N.CATEGORIANOTICIAID = CN.ID

                LEFT JOIN CURTIDA C
                ON N.ID = C.NOTICIAID

                LEFT JOIN COMENTARIO CO
                ON N.ID = CO.NOTICIAID

                WHERE N.Id = ${idNoticia}

                GROUP BY N.Id, N.Titulo, N.Alias, N.Resumo, N.Conteudo, N.Data, CN.Nome
                ORDER BY N.DATA DESC;`;

    NoticiaRepository.query(sql, null, (err, noticia) => {
        if (err) callback(err);
        noticia = noticia[0];

        if (!noticia)
            callback(new Error('Notícia não encontrada'));

        noticia.Tags = noticia.Tags == null || noticia.Tags == '' ? [] : noticia.Tags.split(',');

        callback(null, noticia);

    });

}

exports.obterCurtidas = function (idNoticia, callback) {


    let sql = `SELECT
                U.Login AS Usuario
                FROM Curtida C
                INNER JOIN Usuario U ON U.Id = C.UsuarioId
                WHERE C.NoticiaId = ${idNoticia}`;

    NoticiaRepository.query(sql, null, callback);
}

exports.obterComentarios = function (idNoticia, callback) {
    let sql = `SELECT 
                C.Id, 
                C.Conteudo, 
                C.Data, 
                U.Login as Usuario

                FROM Comentario C 
                INNER JOIN Usuario U 
                ON U.Id = C.UsuarioId
                
                WHERE NoticiaId = ${idNoticia}`;

    NoticiaRepository.query(sql, null, callback);
}