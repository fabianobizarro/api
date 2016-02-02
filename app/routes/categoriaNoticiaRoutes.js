
var CategoriaNoticiaController = require('../controllers/CategoriaNoticiaController');

module.exports = function(app) {
    
    var controller = CategoriaNoticiaController;
    
    
    app.get('/categoriaNoticia', controller.listarCategoriaNoticias);
    app.post('/categoriaNoticia', controller.adicionarCategoria);
    app.put('/categoriaNoticia', controller.atualizarCategoria);
    app.delete('/categoriaNoticia', controller.excluirCategoria);
    
}