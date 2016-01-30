'use strict';

var CategoriaNoticiaController = (function(){
    
    var CategoriaNoticiaService = require('../services').CategoriaNoticia;

    class CategoriaNoticiaController {
        
        constructor(){ 
            this._service = new CategoriaNoticiaService();
        }
        
        listarCategoriaNoticias(req, res) {
            console.log();
            console.log(this._service);
            console.log();
            this._service.getAll((err, docs) => {
                
                if (err)
                    res.json(err);
                else
                    res.json(docs);    
                
            });
        }
        
        adicionarCategoria(req, res) {
            res.json({'post': 'Categori Noticia'});
        }
        
        atualizarCategoria(req, res){
            res.json({'put': 'categoria noticia'});
        }
        
        excluirCategoria(req, res){
            res.json({delete:'categoria noticia'});
        }
    }
    return CategoriaNoticiaController;
})()


module.exports = CategoriaNoticiaController;

