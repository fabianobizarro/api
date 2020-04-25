(function (angular) {

    angular.module('sharenews')

        .config(['$routeProvider', function ($routeProvider) {


            $routeProvider

                .when('/config', {
                    templateUrl: 'app/configAdmin/views/config.main.html'
                })
                .when('/config/admins', {
                    templateUrl: 'app/configAdmin/views/config.admins.html'
                })
                .when('/config/social', {
                    templateUrl: 'app/configAdmin/views/config.social.html'
                });

        }]);

})(window.angular);