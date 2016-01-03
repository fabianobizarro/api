
'use strict';

class BaseSerivce {
	constructor(baseRepository) {
		this._repository = baseRepository;
	}
	
	getAll(callback) { 
		this._repository.getAll(callback);
	}
}

module.exports = BaseSerivce;