'use strict';
exports.registerModels = function(mongoose){
    	
    try {
        
        var schemas = [
            require('./CategoriaNoticia'),
            require('./Usuario')
        ];
        
        schemas.forEach(model => {
            mongoose.model(model.schemaName, model.schema)
        });
        
    } catch (err) {
        throw (err)
    }
}