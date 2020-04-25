(function (angular) {

    function authService($cookies, userService, snCore) {

        var _key = snCore.auth.token;
        var _userKey = snCore.auth.userInfoKey;
        var _userInfo;

        var usuarioAutenticado = function () {
            return $cookies.get(_key) !== null;
        };

        var obterUsuario = function (callback) {
            if (usuarioAutenticado()) {

                var cookieUser = $cookies.get(_userKey);
                if (cookieUser) {

                    var user = JSON.parse(cookieUser);
                    callback(user);
                }
                else {
                    userService.getUserInfo()
                        .then(function (result) {
                            $cookies.put(_userKey, JSON.stringify(result.data));
                            return result.data;
                        }, function (err) {
                            return null;
                        });
                }

            }
            return null;
        };

        var obterUsuarioAsync = function (callback) {
            if (usuarioAutenticado()) {
                
                var cookieUser = $cookies.get(_userKey);
                if (cookieUser) {

                    var user = JSON.parse(cookieUser);
                    callback(user);
                }
                else {
                    userService.getUserInfo()
                        .then(function (result) {
                            $cookies.put(_userKey, JSON.stringify(result.data));
                            callback(result.data);
                        }, function (err) {
                            callback(null);
                        });
                }

            }
            return null;
        };

        var obterChave = function () {
            if (usuarioAutenticado())
                return $cookies.get(_key);
            else
                return null;
        };

        return {
            isAuthenticated: usuarioAutenticado,
            key: obterChave,
            getUser: obterUsuario,
            getUserAsync: obterUsuarioAsync
        };
    };

    authService.$inject = ['$cookies', 'userService', 'snCore'];

    angular.module('api.sharenews')
        .factory('Authentication', authService);

})(window.angular);