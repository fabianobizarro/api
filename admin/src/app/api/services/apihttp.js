(function (angular) {

    function apihttp($http, snCore, $cookies) {

        var token = snCore.auth.token;
        // TO DO : Adicionar no cabeçalho da requisição o token para validação
        var req = {
            method: '',
            url: '',
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'snt': $cookies.get(token),
            },
            withCredentials: true,
            data: null
        };

        this.get = function (url, data) {
            req.url = snCore.url() + url;
            req.data = data;
            req.method = "GET";
            return $http(req);
        }

        this.post = function (url, data) {
            req.url = snCore.url() + url;
            req.data = data;
            req.method = 'POST';
            return $http(req);
        }

        this.put = function (url, data) {
            req.url = snCore.url() + url;
            req.data = data;
            req.method = 'PUT';
            return $http(req);
        }

        this.delete = function (url, data) {
            req.url = snCore.url() + url;
            req.data = data;
            req.method = 'DELETE';
            return $http(req);
        }

    }

    angular.module('api.sharenews')
        .service('apihttp', ['$http', 'snCore','$cookies', apihttp]);

})(window.angular);