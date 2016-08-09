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


exports.obterIntegrantes = function(grupoId, callback) {

    let sql = `SELECT U.Login, IG.Admin
                FROM integrantegrupo IG INNER JOIN usuario U
                ON IG.UsuarioId = U.Id
                WHERE IG.GrupoId = ${grupoId}`;

    GrupoRepository.query(sql, null, callback);
};
