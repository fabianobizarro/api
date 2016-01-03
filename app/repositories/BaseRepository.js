'use strict';
let BaseRepository = (function(){
	
	//var mongoose = require('mongoose');
	
	// class BaseRepository {
	// 	constructor(entityName){
	// 		this.entityName = entityName;
	// 		this.model = mongoose.model(entityName);
	// 	}
	// 	
	// 	getAll(callback) {
	// 		return this.model.find(callback);
	// 	}
	// 	
	// 	find(condition, callback) {
	// 		return this.model.find(condition, callback);
	// 	}
	// }
    
    
    class BaseRepository {
		constructor(model){
			this.model = model;
		}
		
		getAll(callback) {
			return this.model.find(callback);
		}
		
		find(condition, callback) {
			return this.model.find(condition, callback);
		}
	}
    
	
	return BaseRepository;
		
})();
module.exports = BaseRepository;