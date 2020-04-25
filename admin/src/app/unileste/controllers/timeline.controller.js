(function (angular) {

    var timeLineController = function ($scope, Unileste, notification) {


        var PAGE = 1;
        $scope.noticias = [];


        $scope.carregarNoticias = function () {

            Unileste.obterNoticias(PAGE)
                .then(function (result) {
                    var n = result.data;
                    if (n.length > 0) {
                        PAGE++;
                        for (var i in n) {
                            $scope.noticias.push(n[i]);
                        }
                    }

                }, function (err) {
                    notification.error("Erro", 'Não foi possível carregar as notícias');
                });


        };

    };

    timeLineController.$inject = ['$scope', 'Unileste', 'notification'];


    angular.module("sharenews")
        .controller('timelineController', timeLineController);

})(angular);