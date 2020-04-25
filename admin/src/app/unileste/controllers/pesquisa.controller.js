(function (angular) {

    var pesquisaController = function (Noticia, notification) {

        var self = this;
        this.loadingcn = false;
        this.loading = false;
        this.categoriasNoticia = null;
        this.resultadosPesquisa = null;

        var formatDate_US = function (dataBR) {
            if (dataBR) {
                var vet = dataBR.split('/');
                return vet.reverse().join('-');
            }
            else
                return undefined;

        };

        this.pesquisarNoticias = function (campoPesquisa, dataInicio, dataTermino) {

            var dtInitio = formatDate_US(dataInicio);
            var dtTermino = formatDate_US(dataTermino);

            if (campoPesquisa) {
                this.loading = true;
                this.resultadosPesquisa = null;
                Noticia.pesquisarNoticias(campoPesquisa, dtInitio, dtTermino)
                    .then(function (result) {
                        self.resultadosPesquisa = result.data;
                    }, function (err) {

                        if (err.data.mensagem)
                            notification.error('Erro', err.data.mensagem);
                        else
                            notification.error('Erro', 'Não foi possível carregar os resultados.');

                    }).finally(function () {
                        self.loading = false;
                    });

            }

        };
    };

    pesquisaController.$inject = ['Noticia', 'notification'];

    angular.module('sharenews')
        .controller('pesquisaController', pesquisaController);

})(window.angular);

