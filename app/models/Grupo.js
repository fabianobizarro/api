var model = (function(){
    
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
        
        
    var GrupoSchema = new Schema({

        nome: {
            type: String,
            required: 'O nome do grupo é obrigatório',
            unique: true,
            index: true
        },
        descricao: {
            type: String,
        },
        administradores: [Schema.Types.ObjectId],
        integrantes: [Schema.Types.ObjectId],
        grupoPublico: {
            type: Boolean,
            default: false
        }
    });
        
   return {
       schemaName: 'grupos',
       schema: GrupoSchema
   }
    
})()

module.exports = model;