
var CategoriaNoticiaController = require('../controllers/CategoriaNoticiaController');

module.exports = function(app) {
    
    var controller = CategoriaNoticiaController;
    
    
    app.get('/categoriaNoticia', new controller().listarCategoriaNoticias);
    app.post('/categoriaNoticia', new controller().adicionarCategoria);
    app.put('/categoriaNoticia', new controller().atualizarCategoria);
    app.delete('/categoriaNoticia', new controller().excluirCategoria);
    
}