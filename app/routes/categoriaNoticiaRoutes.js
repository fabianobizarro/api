
module.exports = function(app) {
    
    var controller = require('../controllers/CategoriaNoticiaController');
    
    app.route('/categoriaNoticia')
        .get(controller.listarCategoriaNoticias)
        .post(controller.adicionarCategoria);

    app.route('/categoriaNoticia/:id')
        .get(controller.obterCategoriaNoticia)
        .put(controller.atualizarCategoria)
        .delete(controller.excluirCategoria);
        
    app.param('id', controller.categoriaNoticiaPorId);
}