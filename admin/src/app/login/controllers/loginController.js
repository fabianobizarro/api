(function (angular) {
    var module = angular.module("sharenews-login", []);

    module
        .controller('loginCtrl', ['$http', '$scope', function ($http, $scope) {

            //Status
            this.login = 1;
            this.register = 0;
            this.forgot = 0;

            this.username;
            this.password;
            this.email = '';

            this.apiUrl;
            this.resposta;
            this.erro;

            this.sendLogin = function () {

                var dados = {
                    login: this.username,
                    senha: this.password
                };

                $http.post('/login', dados)
                    .then(function (data) {
                    },
                    function (err) {
                    })
            }

            this.showLogin = function () {
                this.login = 1;
                this.forgot = 0;
            }

            this.showForgotPass = function () {
                this.login = 0;
                this.forgot = 1;
            }

            this.recuperarSenha = function () {
                var that = this;
                $scope.resposta = null;
                $scope.erro = null;

                if (this.email != '') {

                    $http.post(this.apiUrl + '/auth/resetPasswdLink', {
                        Email: this.email
                    })
                        .then(function (result) {
                            that.email = '';
                            $scope.resposta = result.data.mensagem;
                        }, function (err) {
                            $scope.erro = err.data.mensagem;
                        });
                }
            }

            this.setUrl = function (url) {
                this.apiUrl = url;
            }

            this.setToken = function (token) {
                this.token = token;
            }

            this.trocarSenha = function (form) {
                $scope.erro = '';
                $scope.senhaok = false;

                var that = this;

                if (form.$valid) {
                    var data = {
                        Token: this.token,
                        Senha: this.novaSenha
                    };

                    
                    $http.post(this.apiUrl + '/auth/resetPasswd', data)
                        .then(function (result) {
                            that.novaSenha = null;
                            $scope.senhaok = true;
                            form.$setUntouched();
                        }, function (err) {
                            $scope.erro = err.data.mensagem;
                        });
                }
            }


        }])

})(window.angular)