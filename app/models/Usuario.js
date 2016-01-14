var model = (function(){
   
   var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
        
        
    var NoticiaSchema = new Schema({
        
        nome: {
            type: String,
            required: 'O nome do notícia é obrigatório'
        },
        login: {
            type: String,
            required: '',
            unique: true,
            index: true
        },
        senha: {
            required: 'A senha do usuário é obrigatória',
            type: String
        }
        
    });
    
    return {
        schemaName: 'usuarios',
        schema: NoticiaSchema
    }
})()

module.exports = model;