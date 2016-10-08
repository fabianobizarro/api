'use strict';
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

exports.obterNoticiasPorGrupo = function (idGrupo, idUsuarioToken, skip, page, callback) {

    let sql = `SELECT
                
                N.Id,
                N.Titulo,
                N.Alias,
                N.Resumo,
                N.Conteudo,
                N.Data,
                N.Tags,
                N.UrlImagem,
                (SELECT COUNT(*) FROM Curtida WHERE NoticiaId = N.Id) as Curtidas,
                (SELECT COUNT(*) FROM Comentario WHERE NoticiaId = N.Id) as Comentarios,
                (SELECT 1 FROM Curtida WHERE UsuarioId = ${idUsuarioToken} AND NoticiaId = N.Id LIMIT 1) as Curtiu

                FROM
                    Noticia N

                WHERE N.GrupoId = ${idGrupo}
                ORDER BY N.DATA DESC
                LIMIT ${skip}, ${page};`;


    NoticiaRepository.query(sql, null, (err, results) => {
        if (err) callback(err);

        results.forEach(formatTags);

        callback(null, results);
    });
}

exports.obterNoticiasPorDataeGrupo = function (data, idGrupo, idUsuarioToken, callback) {

    idUsuarioToken = idUsuarioToken || null;

    let sql = `SELECT
                
                N.Id,
                N.Titulo,
                N.Alias,
                N.Resumo,
                N.Conteudo,
                N.Data,
                N.Tags,
                N.UrlImagem,
                (SELECT COUNT(*) FROM Curtida WHERE NoticiaId = N.Id) as Curtidas,
                (SELECT COUNT(*) FROM Comentario WHERE NoticiaId = N.Id) as Comentarios,
                (SELECT 1 FROM Curtida WHERE UsuarioId = ${idUsuarioToken} AND NoticiaId = N.Id LIMIT 1) as Curtiu

                FROM
                    Noticia N

                WHERE date(N.Data) = DATE('${data}')
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
                N.Tags,
                N.UrlImagem,
                N.GrupoId

                FROM
                Noticia N

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

exports.pesquisarNoticia = function (texto, dataInicio, dataTermino, idUsuario, idUnileste, callback) {

    let sql = `
        SELECT
        N.Id,
        N.Titulo,
        N.Alias,
        N.Resumo,
        N.Conteudo,
        N.Data,
        N.Tags,
        N.UrlImagem,
        G.NOME AS Grupo,
        (SELECT COUNT(*) FROM Curtida WHERE NoticiaId = N.Id) as Curtidas,
        (SELECT COUNT(*) FROM Comentario WHERE NoticiaId = N.Id) as Comentarios,
        (SELECT 1 FROM Curtida WHERE UsuarioId = ${idUsuario} AND NoticiaId = N.Id LIMIT 1) as Curtiu

        FROM
            Noticia N
            INNER JOIN GRUPO G ON G.ID = N.GRUPOID
            INNER JOIN INTEGRANTEGRUPO IG ON IG.GRUPOID = G.ID AND IG.USUARIOID = ${idUsuario} OR IG.GRUPOID = ${idUnileste}

        WHERE 
            (N.Titulo LIKE '%${texto}%' OR N.RESUMO LIKE '%${texto}%' OR N.TAGS LIKE '%${texto}%') `;


    if ((dataInicio != null && dataInicio != '') && (dataTermino != null && dataTermino != '')) {
        sql += ` AND date(N.Data) between date('${dataInicio}') and date('${dataTermino}') `;
    }
    else {
        if (dataInicio != null && dataInicio != '')
            sql += ` AND date(N.Data) > date('${dataInicio}') `;
        else
            if (dataTermino != null && dataTermino != '')
                sql += ` AND date(N.Data) < date('${dataTermino}') `;
    }


    NoticiaRepository.query(sql, null, callback);

}