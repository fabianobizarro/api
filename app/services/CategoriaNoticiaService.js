'use strict';
var BaseService = require('./BaseService');

class CategoriaNoticiaService extends BaseService {
    
    constructor(CategoriaNoticiaRepository) {
        super(CategoriaNoticiaRepository)
    }    
}

module.exports = CategoriaNoticiaService;