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

exports.obterNoticiasPorDataeGrupo = function (data, idGrupo, idUsuarioToken, callback) {

    idUsuarioToken = idUsuarioToken || null;

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
                (SELECT COUNT(*) FROM Curtida WHERE NoticiaId = N.Id) as Curtidas,
                (SELECT COUNT(*) FROM Comentario WHERE NoticiaId = N.Id) as Comentarios,
                (SELECT 1 FROM Curtida WHERE UsuarioId = ${idUsuarioToken} AND NoticiaId = N.Id LIMIT 1) as Curtiu

                FROM
                    Noticia N

                    INNER JOIN CategoriaNoticia CN
                    ON N.CategoriaNoticiaId = CN.ID

                WHERE date(N.Data) = '${data}'
                    AND N.GrupoId = ${idGrupo}
                ORDER BY N.DATA DESC;`;

    NoticiaRepository.query(sql, null, (err, results) => {
        if (err) callback(err);

        results.forEach(formatTags);

        callback(null, results);

    });

}

exports.obterNoticiaPorId = function (idNoticia, callback) {
    let sql = `SELECT
                (SELECT COUNT(*) FROM Curtida WHERE NoticiaId = N.Id) as Curtidas,
                (SELECT COUNT(*) FROM Comentario WHERE NoticiaId = N.Id) as Comentarios,
                N.Id,
                N.Titulo,
                N.Alias,
                N.Resumo,
                N.Conteudo,
                N.Data,
                CN.Nome as CategoriaNoticia,
                N.Tags,
                N.UrlImagem

                FROM
                Noticia N

                INNER JOIN CategoriaNoticia CN
                ON N.CategoriaNoticiaId = CN.ID

                WHERE N.Id = ${idNoticia}
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