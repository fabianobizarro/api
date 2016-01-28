'use strict';

var CategoriaNoticiaController = (function(){
    
    var CategoriaNoticiaService = require('../services').CategoriaNoticia;

    class CategoriaNoticiaController {
        
        constructor(){ 
            this._service = new CategoriaNoticiaService();
        }
        
        listarCategoriaNoticias(req, res) {
            
            this._service.getAll((err, docs) => {
                
                if (err)
                    res.json(err);
                else
                    res.json(docs);    
                
            });
        }
    }
    return CategoriaNoticiaController;
})()


module.exports = CategoriaNoticiaController;

