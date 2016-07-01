var model = (function () {

    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;

    var NoticiaSchema = new Schema({

        grupoId: {
            type: Schema.Types.ObjectId,
        },
        titulo: {
            unique: true,
            type: String,
            required: 'O título da notícia é obrigatório',
            trim: true,
            maxlength: [100, 'O campo `{PATH}` deve ter o tamanho máximo de ({MAXLENGTH}) caracteres.']
        },
        resumo: {
            type: String,
            trim: true,
            maxlength: [200, 'O campo `{PATH}` deve ter o tamanho máximo de ({MAXLENGTH}) caracteres.']
        },
        tags: [String],
        conteudo: {
            type: String,
            required: 'O conteúdo da notícia é obrigatório',
            trim: true,
            maxlength: [5000, 'O campo `{PATH}` deve ter o tamanho máximo de ({MAXLENGTH}) caracteres.']
        },
        data: {
            type: Date,
            required: 'A data da notícia é obrigatória',
            default: Date.now
        },
        categoriaNoticia: {
            type: String,
            required: 'A categoria de notícia é obrigatória'
        },
        imagemPrincipal: {
            type: Schema.Types.ObjectId
        },
        arquivos: [
            {
                tipo: {
                    type: String,
                    required: 'O tipo de arquivo é obrigatório'
                },
                nomeArquivo: {
                    type: String,
                    required: 'O nome do arquivo é obrigatório'
                }
            }
        ],
        curtidas:[String],
        // curtidas: [
        //     {
        //         dataCurtida: {
        //             type: Date
        //         },
        //         idUsuario: {
        //             type: Schema.Types.ObjectId
        //         }
        //     }
        // ],
        comentarios: [
            {
                usuario: String,
                comentario: {
                    type: String,
                    maxlength: [140, 'O campo `{PATH}` deve ter o tamanho máximo de ({MAXLENGTH}) caracteres.']
                }, 
                data: {
                    type: Date,
                    default: Date.now
                }
            }
        ]

    });

    return {
        schemaName: 'Noticia',
        schema: NoticiaSchema
    };
})();

module.exports = model;