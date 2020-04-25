(function (angular) {

    var pageTitle = function (Page) {

        return {
            retrict: 'A',
            scope: {
                title: '=',
            },
            link: function (scope, elem, attrs) {
                Page.section.title = scope.title;
            }
        };
    };

    pageTitle.$inject = ['Page'];

    angular.module('sharenews')
        .directive('pageTitle', pageTitle);
})(window.angular);
