(function (angular) {

    function config($routeProvider) {

        $routeProvider
            .when('/blacklist', {
                templateUrl: 'app/blacklist/views/blacklist.main.html'
            });
    }

    config.$inject = ['$routeProvider'];

    angular.module('sharenews')
        .config(config);

})(window.angular);