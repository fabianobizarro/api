var config = require('./config'),
    MongoClient = require('mongodb').MongoClient;
    //modelService = require('../app/models').ModelService;
	
exports.initialize = function(callback){ 
	
    MongoClient.connect(config.databaseUri, callback);
    // try 
    // {
    //     mongoose.connect(config.databaseUri);
    //     modelService.registerModels(mongoose);
    // } 
    // catch (error)
    // {
    //     console.log('erro de conexão');
    //     throw (error);
    // }	
}


