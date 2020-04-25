(function (angular) {

    var noticiaService = function (BaseService) {
        var service = new BaseService();
        service.endpoint = '/noticia';

        this.adicionarComentario = function (idNoticia, comentario) {
            var url = '/noticia/' + idNoticia + '/comentarios/';
            return service.$apihttp.post(url, { Comentario: comentario });
        }

        this.removerComentario = function (idNoticia, idComentario) {
            var url = '/noticia/' + idNoticia + '/comentarios/' + idComentario;
            return service.$apihttp.delete(url);
        }

        this.pesquisarNoticias = function (pesquisa, dataInicio, dataTermino) {

            var url = '/noticia/pesquisa?q=' + pesquisa;

            if (dataInicio)
                url += '&dataInicio=' + dataInicio;

            if (dataTermino)
                url += '&dataTermino=' + dataTermino;

            return service.$apihttp.get(url);
        }

        this.curtirNoticia = function (idNoticia) {
            var url = '/noticia/' + idNoticia + '/curtir';
            return service.$apihttp.post(url);
        }

        this.obterNoticia = function (idNoticia) {
            var url = '/noticia/' + idNoticia;
            return service.$apihttp.get(url);
        };

        this.obterComentarios = function (idNoticia) {
            var url = '/noticia/' + idNoticia + '/comentarios';
            return service.$apihttp.get(url);
        };

        this.obterCurtidas = function (idNoticia) {
            var url = '/noticia/' + idNoticia + '/curtidas';
            return service.$apihttp.get(url);
        }

    }

    noticiaService.$inject = ['BaseService'];

    angular.module('api.sharenews').service('Noticia', noticiaService);

})(window.angular);
