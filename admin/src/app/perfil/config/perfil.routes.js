(function (angular) {

    function config($routeProvider) {

        $routeProvider
            .when('/perfil', {
                templateUrl: 'app/perfil/views/perfil.main.html'
            });
    }

    config.$inject = ['$routeProvider'];

    angular.module('sharenews')
        .config(config);

})(window.angular);