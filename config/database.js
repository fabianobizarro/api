var config = require('./config'),
    mongoose = require('mongoose'),
    modelService = require('../app/models').ModelService;
	
exports.initialize = function(callback){
     
    try 
    {
        mongoose.connect(config.databaseUri);
        modelService.registerModels(mongoose);
        callback(null);
    } 
    catch (error)
    {
        console.log('Ocorrue um erro na conexão com o banco de dados.');
        callback (error);
    }	
}


