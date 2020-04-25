(function (angular) {

    function page() {
        var section = {
            title: 'ShareNews',
            subTitle: 'Sub Título'
        }
        return {
            section: section
        }
    }

    angular.module('api.sharenews')
        .factory('Page', [page]);

})(window.angular);