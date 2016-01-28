'use strict';
var BaseService = (function(){

    class BaseService {
        constructor(baseRepository) {
            this._repository = baseRepository;
        }
        
        getAll(callback) { 
            this._repository.getAll(callback);
        }
    }
    
    return BaseService;
})()

module.exports = BaseService;