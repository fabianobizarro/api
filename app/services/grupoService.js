'use strict';

var GrupoRepository = require('../repositories/GrupoRepository'),
    IntegranteGrupoRepository = require('../repositories/IntegranteGrupoRepository'),

    grupoRepo = new GrupoRepository(),
    integranteGrupoRepo = new IntegranteGrupoRepository(),
    env = require('../../config/env/env');




exports.obterGrupos = function (usuarioId, callback) {

    let sql = `
    SELECT G.Id, G.Nome, G.Descricao, G.Publico,
    (SELECT ADMIN FROM integrantegrupo WHERE GrupoId = G.ID AND UsuarioId = ${usuarioId} LIMIT 1) AS usuarioAdmin
    FROM grupo G
    INNER JOIN INTEGRANTEGRUPO IG ON G.ID = IG.GRUPOID
    WHERE IG.USUARIOID = ${usuarioId} AND GRUPOID <> ${env.unilesteId}`;

    GrupoRepository.query(sql, null, callback);

};

exports.obterIntegrantes = function (grupoId, callback) {

    let sql = `SELECT U.Id, U.Login, IG.Admin
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
    FROM noticia N
    WHERE N.GrupoId = ${grupoId}
    ORDER BY N.Data DESC`;

    GrupoRepository.query(sql, null, callback);

};

exports.obterSolicitacoesPendentes = function (grupoId, callback) {

    let sql = `
    SELECT u.Id, u.Login, u.UrlFoto
    FROM solicitacaogrupopendente SP
        INNER JOIN usuario U
        ON SP.UsuarioId = U.Id
    WHERE SP.GrupoId = ${grupoId}`;

    GrupoRepository.query(sql, null, callback);

}

exports.usuarioNoGrupo = function (grupoId, usuarioId, callback) {

    let sql = `
    SELECT 1 AS Integrante
    FROM integrantegrupo
    WHERE GrupoId = ${grupoId} AND UsuarioId = ${usuarioId}`;

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
    FROM grupo G
    WHERE
        G.Nome LIKE '%${textoPesquisa}%'
        OR G.Descricao LIKE '%${textoPesquisa}%'
        AND G.Id <> ${env.unilesteId}`;

    GrupoRepository.query(sql, null, callback);

}

exports.removerUsuario = function (grupoId, usuarioId, callback) {

    // let grupoId = req.grupo.Id;
    // let usuarioId = req.requestUser.Id;

    /**
     * Verifica se o usuário existe no grupo
     * Existe no grupo && somente ele é admin => Informa que deve haver pelo menos um administrador no grupo
     * Existe no grupo && existe mais de um admin => Remove o usuário do grupo
     * Existe no grupo && não é admin => remove o usuário do grupo 
     */

    integranteGrupoRepo.findOne({ where: { GrupoId: grupoId, UsuarioId: usuarioId } }, (err, integrante) => {
        if (err) callback(err);

        if (!integrante)
            callback(new Error('Integrante não encontrado'));
        else {
            if (integrante.Admin) {

                this.obterIntegrantes(grupoId, (err, integrantes) => {
                    if (err) return next(err);

                    let adminCount = integrantes.where((i) => { return i.Admin == true; }).length;

                    if (adminCount == 1) { // Não pode remover o único usuário admin do grupo
                        // return res.json({
                        //     sucesso: false,
                        //     mensagem: 'Não é possível sair do grupo, só existe 1 usuário administrador no grupo.'
                        // });
                        callback(new Error('Não é possível remover este usuário do grupo, só existe 1 usuário administrador no grupo.'), false);
                    }
                    else { // há mais de 1 usuário admin no grupo

                        integranteGrupoRepo.delete({ where: { GrupoId: grupoId, UsuarioId: usuarioId } }, (err) => {
                            if (err) callback(err, false);

                            // return res.json({
                            //     sucesso: true,
                            //     mensagem: 'Usuário removido do grupo'
                            // });
                            callback(null, true);

                        });

                    }

                });

            }
            else {
                integranteGrupoRepo.delete({ where: { GrupoId: grupoId, UsuarioId: usuarioId } }, (err) => {
                    if (err) callback(err, false);

                    // return res.json({
                    //     sucesso: true,
                    //     mensagem: 'Usuário removido do grupo'
                    // });
                    callback(null, true);

                });
            }
        }




    })

}

exports.obterUsuariosAdministradores = function (grupoId, callback) {

    let sql = `select 
                    u.Id,
                    u.Login
                from 
                    integrantegrupo ig
                    inner join usuario u on ig.UsuarioId = u.id
                where 
                    ig.GrupoId = ${grupoId}
                    and ig.Admin = true`;

    GrupoRepository.query(sql, null, callback);

};