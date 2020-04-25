(function (angular) {
    'use strict';

    var blacklistService = function (BaseService) {
        var service = new BaseService();


        this.adicionarPalavra = function (palavra) {
            var url = '/blacklist';
            var data = { palavra: palavra };
            return service.$apihttp.post(url, data);
        };

        this.obterBlacklist = function () {
            var url = '/blacklist';
            return service.$apihttp.get(url);
        };

        this.removerPalavra = function (palavra) {
            var url = '/blacklist/' + encodeURIComponent(palavra);
            return service.$apihttp.delete(url);
        };

    }

    blacklistService.$inject = ['BaseService'];

    angular.module('api.sharenews').service('Blacklist', blacklistService);

})(window.angular);

