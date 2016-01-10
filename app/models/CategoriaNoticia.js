var model = (function(){
	
	var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
		
	var CategoriaNoticiaSchema = new Schema({
		nome:{
			type: String,
			required: 'O nome é obrigatório',
			trim: true,
		},
		descricao:{
			type: String,
			trim: true 
		},
		createdOn: {
			type: Date,
			default: Date.now
		},
		createdBy:{
			type:String,
		}
	});
	
	return {
		schemaName: 'CategoriaNoticia',
		schema: CategoriaNoticiaSchema
	}
	
})()

//mongoose.model('CategoriaNoticia', CategoriaNoticiaSchema);
module.exports = { 
	schemaName: model.schemaName, 
	schema: model.schema 
}