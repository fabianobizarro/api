(function (angular) {

    var userService = function (apiHttp) {
        this.getUserInfo = function (callback) {
            return apiHttp.get('/usuario/info');
        };
    };


    userService.$inject = ['apihttp'];

    angular.module('api.sharenews').service('userService', userService);

})(window.angular);