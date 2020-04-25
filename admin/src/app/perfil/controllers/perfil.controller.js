(function (angular) {

    var perfilController = function ($scope, Authentication, Usuario, notification) {

        const TAB_HISTORICO = 2;

        var self = this;
        this.usuario = null;
        Authentication.getUser(function(u){
            self.usuario = u;
        });

        self.historicoAtividades = null;
        self.atividadesCarregadas = false;

        $scope.selecionarTab = function (num) {
            $scope.tab = num;

            if (num == TAB_HISTORICO && self.atividadesCarregadas == false) {
                self.obterHistoricoAtividades();
            }

        };

        this.alterarSenha = function (formValid, senhaAtual, novaSenha) {
            if (formValid) {

                Usuario.alterarSenha(self.usuario.Id, senhaAtual, novaSenha)
                    .then(function (result) {
                        notification.success('Sucesso', 'Sua senha foi alterada com sucesso!');
                        $scope.senhaAtual = null;
                        $scope.novaSenha = null;
                        $scope.confirmacao = null;
                        $scope.form.$setUntouched();
                    }, function (err) {
                        
                        if (err.data.mensagem)
                            notification.error('Erro', err.data.mensagem);
                        else
                            notification.error('Erro', 'Não foi possível alterar a senha. Tente novamente');
                    });
            }
        };

        this.obterHistoricoAtividades = function () {
            Usuario.obterHistoricoAtividades(self.usuario.Id)
                .then(function (result) {
                    self.historicoAtividades = result.data;
                    self.atividadesCarregadas = true;
                }, function (err) {
                    notification.error('Erro', 'Não foi possível carregar o histórico de atividades do usuário');
                });
        }

    };

    perfilController.$inject = ['$scope', 'Authentication', 'Usuario', 'notification'];

    angular.module('sharenews').controller('perfilCtrl', perfilController);

})(window.angular);