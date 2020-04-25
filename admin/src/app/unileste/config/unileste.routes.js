(function(angular){

    function config($routeProvider) {

        var _viewsFolder = 'app/unileste/views/';
        $routeProvider
        .when('/unileste', {
            templateUrl: _viewsFolder + 'unileste.main.html'
        })
        .when('/unileste/cadastrarNoticia', {
            templateUrl: _viewsFolder + 'unileste.novaNoticia.html'
        })
        .when('/unileste/noticia/:idNoticia', {
            templateUrl: _viewsFolder + 'unileste.noticia.html'
        })
        .when('/unileste/noticia/:idNoticia/alterar',{
            templateUrl: _viewsFolder + 'unileste.alterarNoticia.html'
        })
        .when('/unileste/noticia/:idNoticia/analitico', {
            templateUrl: _viewsFolder + 'noticia.analitico.html'
        })
        .when('/unileste/pesquisa', {
            templateUrl: _viewsFolder + 'unileste.pesquisa.html'
        });
    }

    config.$inject = ['$routeProvider'];

    angular.module('sharenews')
        .config(config);

})(window.angular);
