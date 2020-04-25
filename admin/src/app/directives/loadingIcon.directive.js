(function (angular) {

    function loadingIcon() {

        var _template = '<section data-ng-show="show" id="loading-icon"> \
                                <div class="sk-spinner sk-spinner-double-bounce blue"> \
                                    <div class="sk-double-bounce1" style="background-color:#0e9aef"></div> \
                                    <div class="sk-double-bounce2" style="background-color:#0e9aef"></div> \
                                </div> \
                                <p style="text-align:center;margin-top:10px"> \
                                    {{message}} \
                                </p> \
                            </section>';
        return {
            restrict: 'AE',
            scope: {
                show: '=show',
                message: '=message'
            },
            template: _template
        };
    }

    angular.module('sharenews')
        .directive('loadingIcon', loadingIcon);


})(window.angular);
