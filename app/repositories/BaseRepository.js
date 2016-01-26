'use strict';

module.exports = function(databse){
	console.log('base repository: ' + typeof(databse));
    
    class BaseRepository {
        
        constructor(collectionName)
        {
            this.collectionName = collectionName;
            this.collection = databse.collection(collectionName);
        }
        
        getAll(callback) 
        {
            return this.collection.find({}).toArray(callback);
        }
        
        find(condition, callback) {
            return this.model.find(condition, callback);
        }
    }
    
    
    return BaseRepository;
        
} 


