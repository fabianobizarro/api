(function (angular) {


    var _getInfo = function (callback) {

        var request = new XMLHttpRequest();
        request.open('GET', 'api', true);

        request.onerror = function (err) {
            callback(new Error('Não foi possível obter as informações do servidor'));
        };

        request.onloadend = function () {
            var data = JSON.parse(request.response);
            callback(null, data);
        }

        request.send();
    }

    var config = function ($routeProvider, snCoreProvider) {

        $routeProvider
            .when('/', {
                templateUrl: "app/template/views/main.html",
            });

        _getInfo(function (err, data) {

            if (err)
                throw (new Error('Não foi possível obter as informações do servidor'));

            snCoreProvider.config({
                host: data.hostname,
                port: data.port,
                protocol: data.protocol,
                userInfoKey: 'snUserInfo',
                token: 'snt',
                fileServer: data.fileServer
            });

        });

    };

    config.$inject = ['$routeProvider', 'snCoreProvider'];

    angular
        .module('sharenews')
        .config(config);

})(window.angular);