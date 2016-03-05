var model = (function(){

    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;
        
    var NoticiaSchema = new Schema({
     
        grupoId: {
            type: Schema.Types.ObjectId,
        },
        titulo: {
            type: String,
            required: 'O título da notícia é obrigatório',
            trim: true,
        },
        resumo: {
            type: String,
            trim: true
        },
        conteudo: {
            type: String,
            required: 'O conteúdo da notícia é obrigatório',
            trim: true
        },
        data: {
            type: Date,
            required: 'A data da notícia é obrigatória',
            default: Date.now
        },
        categoriaNoticia:{
            type: Schema.Types.ObjectId,
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
        curtidas: [
            {
                dataCurtida: {
                    type: Date
                },
                idUsuario: {
                    type: Schema.Types.ObjectId
                }
            }    
        ]
        
    });
    
    return {
        schemaName: 'Noticia',
        schema: NoticiaSchema
    }
})()

module.exports = model;

