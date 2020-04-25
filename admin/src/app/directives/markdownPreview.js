(function (angular, marked) {

    var markdownPreview = function () {

        //Initialize marked with options
        // marked.setOptions({
        //     renderer: new marked.Renderer(),
        //     gfm: true,
        //     tables: true,
        //     breaks: false,
        //     pedantic: false,
        //     sanitize: false,
        //     smartLists: true,
        //     smartypants: false
        // });

        var link = function (scope, element, attrs, ngModel) {
            scope.$watch('content', function (value) {
                if (!value)
                    scope.result = '';
                else
                    scope.result = marked(value);
            });
        };

        return {
            restrict: 'AE',
            scope: {
                content: '=content'
            },
            link: link,
            template: '<ng-bind-html ng-bind-html="result"></ng-bind-html>'
        };
        
    };


    angular.module('sharenews').directive('markdownPreview', markdownPreview);

})(window.angular, marked);