'use strict';
exports.registerModels = function(mongoose){
    	
    try {
        
        
        var schemas = [
            require('./CategoriaNoticia'),
        ];
        
        schemas.forEach(model => {
            mongoose.model(model.schemaName, model.schema)
        });
        
    } catch (err) {
        throw (err)
    }
}