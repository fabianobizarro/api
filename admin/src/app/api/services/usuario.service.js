(function (angular) {

    var usuarioService = function (apihttp) {

        this.pesquisarUsuarios = function (pesquisa) {

            var url = '/usuario/pesquisa/' + encodeURI(pesquisa);
            return apihttp.get(url);
        };

        this.alterarUsuario = function (usuario) {
            var url = '/usuario/' + usuario._id + '/tAdmin';
            return apihttp.post(url, usuario);
        };

        this.alterarSenha = function (idUsuario, senhaAtual, novaSenha) {
            var url = '/usuario/' + idUsuario + '/senha';
            return apihttp.put(url, { senhaAtual: senhaAtual, novaSenha: novaSenha });
        };

        this.obterHistoricoAtividades = function(idUsuario) {
            var url = '/usuario/' + idUsuario + '/historico';
            return apihttp.get(url);
        };


        this.alternarAdmin = function(idUsuario){
            var url = '/usuario/' + idUsuario + '/tAdmin';
            return apihttp.post(url);  
        }
        
    };

    usuarioService.$inject = ['apihttp'];

    angular.module('api.sharenews')
        .service('Usuario', usuarioService);

})(window.angular);