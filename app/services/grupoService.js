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
