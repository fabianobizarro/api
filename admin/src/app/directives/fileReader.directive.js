(function (angular) {

    function fileReader() {

        return {
            scope: {
                filereader: '=',
                filename: '='
            },
            link: function (scope, element, attributes) {
                element.bind('change', function (event) {


                    var file = this.files[0];
                    if (file)
                        scope.filename = file.name;

                    var reader = new FileReader();

                    reader.onload = function (load) {
                        scope.$apply(function () {
                            scope.filereader = load.target.result;
                        });
                    };
                    reader.readAsDataURL(event.target.files[0]);
                });
            }
        };
    }

    angular.module('sharenews')
        .directive('filereader', fileReader);


})(window.angular);
