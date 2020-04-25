
var homeController = require('../controllers/homeController');
var loginCotroller = require('../controllers/loginController');

module.exports = function (app) {
    
    app.get('/login', loginCotroller.index);
    app.post('/login', loginCotroller.signIn);
    app.get('/logout', loginCotroller.logout);
    app.get('/senha', loginCotroller.trocarSenha);
    app.get('/', homeController.index);
    app.get('/api', homeController.apiInfo);
    
}