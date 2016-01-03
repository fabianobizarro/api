var mongoose = require('mongoose'),
	config = require('./config'),
    modelService = require('../app/models').ModelService;
	
exports.initialize = function(){ 
	
    try 
    {
        mongoose.connect(config.databaseUri);
        modelService.registerModels(mongoose);
    } 
    catch (error)
    {
        console.log('erro de conexão');
        throw (error);
    }	
}


