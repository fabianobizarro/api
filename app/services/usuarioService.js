'use strict';
var UsuarioRepository = require('../repositories/UsuarioRepository');



exports.historicoUsuario = function(usuarioId, callback){

    let id = parseInt(usuarioId);

    if (id == null)
        callback(new Error('Valor do Id do usuário é inválido'));


    let sql = `/* CURTIDAS */
                SELECT
                    C.createdAt as data,
                    U.Login as usuario,
                    concat('curtiu a notícia: ', N.Titulo) as atividade,
                    'curtida' as tipo
                FROM
                    CURTIDA C
                    INNER JOIN NOTICIA N ON N.ID = C.NOTICIAID
                    INNER JOIN USUARIO U ON U.ID = C.USUARIOID
                WHERE
                    C.UsuarioId = ${id}
                    
                UNION ALL

                /* Comentários */
                SELECT
                    C.createdAt as data,
                    U.Login as usuario,
                    concat('fez um comentário na notícia: ', N.Titulo) as atividade,
                    'comentario' as tipo
                FROM
                    comentario C
                    INNER JOIN noticia N ON N.Id = C.NoticiaId
                    INNER JOIN usuario U ON U.Id = C.UsuarioId
                WHERE 
                    C.UsuarioId = ${id}
                    
                UNION ALL

                /* Notícias criadas */
                SELECT
                    N.createdAt AS data,
                    U.Login as usuario, 
                    concat('criou a notícia: ', N.Titulo) as atividade,
                    'noticia' as tipo
                FROM
                    noticia N
                    INNER JOIN usuario U ON N.UsuarioId = U.Id
                WHERE
                    N.UsuarioId = ${id}

                UNION ALL

                /* Grupos criados */
                SELECT
                    G.createdAt AS data,
                    U.Login as usuario, 
                    concat('criou o grupo: ', G.Nome) as atividade,
                    'grupo' as tipo
                FROM
                    grupo G, usuario U 
                WHERE
                    G.createdBy = U.Login
                    AND U.Id = ${id}

                UNION ALL

                /* Usuario criado */
                SELECT
                    createdAt as data,
                    Login as usuario,
                    concat('entrou na aplicação!') as atividade,
                    'usuario' as tipo
                FROM usuario 
                WHERE ID = ${id}

                ORDER BY Data DESC`;


    UsuarioRepository.query(sql, null, callback);
}

exports.feedUsuario = function(usuarioId, unilesteId, callback){

    let sql = `
                -- Notícias criadas
                select 
                    n.data,
                    n.createdBy as usuario,
                    concat('criou uma notícia no grupo ', g.Nome) as descricao,
                    'noticia' as tipo
                from
                    noticia n
                    inner join grupo g on g.Id = n.GrupoId 
                    left join integrantegrupo ig on ig.GrupoId = g.Id
                where
                    ig.UsuarioId = ${usuarioId} and ig.GrupoId <> ${unilesteId}
                    
                    
                UNION ALL
                -- notícias alteradas
                select
                    n.data,
                    n.createdBy as usuario,
                    concat('alterou uma notícia no grupo ', g.Nome) as descricao,
                    'noticia' as tipo
                from
                    noticia n
                    inner join grupo g on g.Id = n.GrupoId 
                    left join integrantegrupo ig on ig.GrupoId = g.Id
                where
                    ig.UsuarioId = ${usuarioId} and ig.GrupoId <> ${unilesteId}
                    and n.updatedAt > n.createdAt

                UNION ALL
                -- comentários
                select 
                    c.Data as data,
                    c.createdBy as usuario,
                    concat('enviou um comentário na notícia: ', n.Titulo) as descricao,
                    'comentario' as tipo
                from
                    comentario c
                    inner join noticia n on c.NoticiaId = n.Id and n.GrupoId <> ${unilesteId}
                    inner join grupo g on n.GrupoId = g.Id 
                    inner join integrantegrupo ig on ig.GrupoId = g.Id 
                where 
                    ig.UsuarioId = ${usuarioId}

                UNION ALL

                select 
                    c.Data as data,
                    c.createdBy as usuario,
                    concat('curtiu a notícia: ', n.Titulo) as descricao,
                    'curtida' as tipo
                from
                    curtida c
                    inner join noticia n on c.NoticiaId = n.Id and n.GrupoId <> ${unilesteId}
                    inner join grupo g on n.GrupoId = g.Id 
                    inner join integrantegrupo ig on ig.GrupoId = g.Id 
                where 
                    ig.UsuarioId = ${usuarioId}
                    
                    
                order by data desc`;

    UsuarioRepository.query(sql, null, callback);

}