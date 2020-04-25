(function (angular) {

    var blacklistController = function ($scope, Blacklist, notification) {
        var self = this;
        $scope.blacklist = [];


        var carregarBlacklist = function () {

            //Faz a requisição do banco e carrega a blacklist na tela.
            Blacklist.obterBlacklist()
                .then(function (result) {
                    $scope.blacklist = result.data;
                }, function (err) {

                    notification.error('Erro', 'Não foi possível carregar a lista de palavras');
                });

        };

        $scope.adicionarPalavra = function (palavra) {
            if (palavra != '' && palavra != null) {

                Blacklist.adicionarPalavra(palavra.trim())
                    .then(function (result) {
                        $scope.blacklist.push(palavra.trim());
                        $scope.palavra = '';
                    }, function (err) {
                        notification.error('Erro', 'Esta palavra já foi adicionada');
                    });
            }

        };

        $scope.removerPalavra = function (palavra) {

            Blacklist.removerPalavra(palavra)
                .then(function (result) {
                    var i = $scope.blacklist.indexOf(palavra);
                    $scope.blacklist.splice(i, 1);
                }, function (err) {
                    notification.error('Erro', 'Não foi possível remover esta palavra');
                });

        };

        $scope.init = function () {

            carregarBlacklist();
        }




    };

    blacklistController.$inject = ['$scope', 'Blacklist', 'notification'];

    angular.module('sharenews').controller('blacklistController', blacklistController);

})(window.angular);