(function (angular) {

    var unilesteService = function (BaseService) {

        var service = new BaseService();
        service.endpoint = '/unileste';

        this.cadastrarNoticia = function (model) {
            return service.add(model);
        }

        this.obterNoticiasUnileste = function () {
            var url = '/unileste/hoje';
            return service.$apihttp.get(url);
        }


        this.alterarNoticia = function (noticia) {
            var url = '/noticia/' + noticia.Id;
            return service.$apihttp.put(url, noticia);
        };

        this.excluirNoticia = function (noticia) {
            var url = '/noticia/' + noticia.Id;
            return service.$apihttp.delete(url);
        }

        this.obterNoticias = function(page){
            var url;
            if (page)
                url = '/unileste/' + page;
            else
                url = '/unileste';
            
            return service.$apihttp.get(url);
        };

    }

    unilesteService.$inject = ['BaseService'];

    angular.module('api.sharenews')
        .service('Unileste', unilesteService);

})(window.angular);