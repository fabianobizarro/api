(function (angular) {

    var configController = function (Usuario, notification) {

        var self = this;
        this.loadingSearch = false;
        this.resultadoPesquisa = [];

        this.pesquisarUsuarios = function (nome) {

            if (nome.length >= 3) {

                this.loadingSearch = true;
                Usuario.pesquisarUsuarios(nome)
                    .then(function (result) {

                        self.resultadoPesquisa = result.data;

                    }, function (err) {

                        if (err.data) {
                            notification.error('Erro', err.data.erro + '\n ' + err.data.mensagem);
                        }
                        notification.error('Erro', 'Não foi possível realizar a pesquisa');

                    }).finally(function () {
                        self.loadingSearch = false;
                    });

            }
        };

        this.toogleAdmin = function (usuario) {

            usuario.Admin = !usuario.Admin;

            Usuario.alternarAdmin(usuario.Id)
                .then(function (result) {
                }, function (err) {
                    notification.warning('Atenção', err.data.mensagem);
                    usuario.Admin = !usuario.Admin;
                });
        };
    };

    configController.$inject = ['Usuario', 'notification'];

    angular.module("sharenews")
        .controller('configAdminCtrl', configController);

})(window.angular);