(function (angular) {

    var MainCtrl = function ($scope, Page, Authentication) {

        $scope.$watch(function () {
            return Page.section.title;
        }, function (v) {
            $scope.title = v;
        });

        Authentication.getUser(function (u) {
            $scope.usuario = u.Nome;
            $scope.urlFoto = u.UrlFoto;
        });


        $scope.title = Page.section.title;
        $scope.subtitle = 'subtitle';

    };

    MainCtrl.$inject = ['$scope', 'Page', 'Authentication'];

    angular
        .module('sharenews')
        .controller('MainCtrl', MainCtrl)

})(window.angular);