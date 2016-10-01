'use strict';
var UsuarioRepository = require('../repositories/UsuarioRepository');



exports.historicoUsuario = function(usuarioId, callback){

    let id = parseInt(usuarioId);

    if (id == null)
        callback(new Error('Valor do Id do usuário é inválido'));

    console.log('id do usuario ' + id);

    let sql = `/* CURTIDAS */
                SELECT
                    C.createdAt as Data,
                    U.Login as Usuario,
                    concat('curtiu a notícia: ', N.Titulo) as Atividade
                FROM
                    CURTIDA C
                    INNER JOIN NOTICIA N ON N.ID = C.NOTICIAID
                    INNER JOIN USUARIO U ON U.ID = C.USUARIOID
                WHERE
                    C.UsuarioId = ${id}
                    
                UNION ALL

                /* Comentários */
                SELECT
                    C.createdAt as Data,
                    U.Login as Usuario,
                    concat('fez um comentário na notícia: ', N.Titulo) as Atividade
                FROM
                    comentario C
                    INNER JOIN noticia N ON N.Id = C.NoticiaId
                    INNER JOIN usuario U ON U.Id = C.UsuarioId
                WHERE 
                    C.UsuarioId = ${id}
                    
                UNION ALL

                /* Notícias criadas */
                SELECT
                    N.createdAt AS Data,
                    U.Login, 
                    concat('criou a notícia: ', N.Titulo) as Atividade
                FROM
                    noticia N
                    INNER JOIN usuario U ON N.UsuarioId = U.Id
                WHERE
                    N.UsuarioId = ${id}

                UNION ALL

                /* Grupos criados */
                SELECT
                    G.createdAt AS Data,
                    U.Login, 
                    concat('criou o grupo: ', G.Nome) as Atividade
                FROM
                    grupo G, usuario U 
                WHERE
                    G.createdBy = U.Login
                    AND U.Id = ${id}

                UNION ALL

                /* Usuario criado */
                SELECT
                    createdAt as Data,
                    Login,
                    concat('entrou na aplicação!') as Atividade
                FROM usuario 
                WHERE ID = ${id}

                ORDER BY Data DESC`;


    UsuarioRepository.query(sql, null, callback);
}