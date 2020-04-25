(function (angular) {

    function relatorioTags() {

        return {
            restrict: 'AE',
            scope: {
                result: '=',
            },
            templateUrl: '/app/directives/views/relatorioTags.html'
        };
    }

    angular.module('sharenews')
        .directive('relatorioTags', relatorioTags);


})(window.angular);
