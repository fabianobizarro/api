(function (angular) {

    var config = function ($routeProvider) {

        $routeProvider
            .when('/relatorios', {
                templateUrl: 'app/relatorios/views/relatorios.main.html'
            });
    };

    config.$inject = ['$routeProvider'];

    angular.module('sharenews').config(config);

})(window.angular);