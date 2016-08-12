'use strict';

var GrupoRepository = require('../repositories/GrupoRepository'),

    grupoRepo = new GrupoRepository(),
    env = require('../../config/env/env');




exports.obterGrupos = function (usuarioId, callback) {

    let sql = `
    SELECT G.Id, G.Nome, G.Descricao, G.Publico
    FROM GRUPO G
    INNER JOIN INTEGRANTEGRUPO IG ON G.ID = IG.GRUPOID
    WHERE IG.USUARIOID = ${usuarioId} AND GRUPOID <> ${env.unilesteId}`;

    GrupoRepository.query(sql, null, callback);

};

exports.obterIntegrantes = function (grupoId, callback) {

    let sql = `SELECT U.Login, IG.Admin
                FROM integrantegrupo IG INNER JOIN usuario U
                ON IG.UsuarioId = U.Id
                WHERE IG.GrupoId = ${grupoId}`;

    GrupoRepository.query(sql, null, callback);
};

exports.obterNoticias = function (grupoId, usuarioId, callback) {

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
        (SELECT COUNT(*) FROM Curtida WHERE NoticiaId = N.Id) as Curtidas,
        (SELECT COUNT(*) FROM Comentario WHERE NoticiaId = N.Id) as Comentarios,
        (SELECT 1 FROM Curtida WHERE UsuarioId = ${usuarioId} AND NoticiaId = N.Id LIMIT 1) as Curtiu
    FROM Noticia N
    WHERE N.GrupoId = ${grupoId}
    ORDER BY N.Data DESC`;

    GrupoRepository.query(sql, null, callback);

};

exports.obterSolicitacoesPendentes = function (grupoId, callback) {

    let sql = `
    SELECT u.Id, u.Login
    FROM Solicitacaogrupopendente SP
        INNER JOIN Usuario U
        ON SP.UsuarioId = U.Id
    WHERE SP.GrupoId = ${grupoId}`;

    GrupoRepository.query(sql, null, callback);

}

exports.usuarioNoGrupo = function (grupoId, usuarioId, callback) {

    let sql = `
    SELECT 1 AS Integrante
    FROM INTEGRANTEGRUPO
    WHERE GRUPOID = ${grupoId} AND USUARIOID = ${usuarioId}`;

    GrupoRepository.query(sql, null, (err, result, res) => {
        if (err) callback(err);

        if (result.length == 0)
            callback(null, false);
        else {
            let r = result[0].Integrante == 1;

            callback(null, r);
        }

    })

};

exports.pesquisarGrupos = function (textoPesquisa, idUsuario, callback) {

    let sql = `
    SELECT 
        G.Id,
        G.Nome,
        G.Descricao,
        G.Publico,
        (SELECT 1 FROM integrantegrupo WHERE GrupoId = G.Id AND UsuarioId = ${idUsuario} LIMIT 1) AS Integrante
    FROM GRUPO G
    WHERE
        G.Nome LIKE '%${textoPesquisa}%'
        OR G.Descricao LIKE '%${textoPesquisa}%'
        AND G.Id <> ${env.unilesteId}`;

    GrupoRepository.query(sql, null, callback);

}