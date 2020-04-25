(function (angular) {

    var controller = function (apihttp, notification, $scope, $routeParams) {

        var self = this;
        this.loadingReport = false;
        this.tituloRelatorio;
        this.reportResult = null;
        this.chartType = 'bar';
        this.chart;
        this.tagsResult = null;

        this.chartTypes = [
            { val: 'bar', text: 'Barra' },
            { val: 'pie', text: 'Pizza' },
            { val: 'donut', text: 'Rosca' }
        ];

        this.dadosAnaliticos = function (dataInicio, dataTermino) {

            var idNoticia = $routeParams.idNoticia;

            self.chart = null;
            self.reportResult = null;
            self.loadingReport = true;

            dataInicio = dataFormatada(dataInicio);
            dataTermino = dataFormatada(dataTermino);

            var dti = dataInicio;
            var dtt = dataTermino;

            var url = '/noticia/' + idNoticia + '/analitico';

            if (dataInicio && dataTermino)
                url += '?dataInicio=' + dataInicio + '&dataFim=' + dataTermino;

            apihttp.get(url)
                .then(function (result) {
                    
                    self.reportResult = result.data;
                    var dados = result.data.dados;
                    if (true) {

                        self.tituloRelatorio = self.reportResult.titulo;
                        self.subTituloRelatorio = self.reportResult.periodo;

                        var colums = [
                            ['x'],
                            ['Quantidade de acessos'],
                            ['Quantidade de usuários']
                        ];

                        for (var data in dados) {
                            var d = dados[data];

                            colums[0].push(data);
                            colums[1].push(d.quantidadeAcessos);
                            colums[2].push(d.quantidadeUsuarios);
                        }

                        self.chart = window.c3.generate({
                            bindto: '#chart',
                            data: {
                                x: 'x',
                                columns: colums,
                                type: 'spline'
                            },
                            axis: {
                                x: {
                                    type: 'timeseries',
                                    tick: {
                                        format: '%d/%m/%Y'
                                    }
                                }
                            },
                            bar: {
                                width: {
                                    ratio: 0.2
                                }
                            }
                        });
                    }

                }, function (err) {
                    var msg = err.data.mensagem || "Ocorreu um erro ao processar a requisição. Tente novamente.";
                    if (err.status == 500)
                        notification.error('Erro', msg);
                    else
                        notification.warning('Erro', msg);
                }).finally(function () {
                    self.loadingReport = false;
                });
        };

        this.relatorioTags = function (dataInicio, dataFim) {
            dataInicio = dataFormatada(dataInicio);
            dataFim = dataFormatada(dataFim);

            var url = '/report/tags/' + dataInicio + '/' + dataFim;

            var that = this;
            apihttp.get(url)
                .then(function (result) {
                    that.tagsResult = result.data;
                }, function (err) {
                    notification.error('Não foi possível carregar o relatório');
                });
        };

        var dataFormatada = function (data) {
            //transform dd/MM/yyyy in yyyy-MM-dd

            if (data) {

                data = data.split('/');
                data = data[2] + '-' + data[1] + '-' + data[0];

                return data;
            }
            else
                return undefined;
        }

        this.exibirModalPesquisaUsuario = function () {
            $("#mpesquisaUsuario").modal();
        };

        this.ocultarModal = function () {
            $("#mpesquisaUsuario").modal('hide');
        }

        this.selecionarUsuario = function (usuario) {
            $scope.usuarioSelecionado = usuario;
        }

        this.historicoUsuario = function (idUsuario, dataInicio, dataTermino) {

            if (idUsuario && dataInicio && dataTermino) {
                dataInicio = dataFormatada(dataInicio);
                dataTermino = dataFormatada(dataTermino);

                var url = '/usuario/' + idUsuario + '/historico?dataInicio=' + dataInicio + '&dataFim=' + dataTermino;

                var that = this;
                apihttp.get(url)
                    .then(function (result) {
                        $scope.historico = result.data;
                    }, function (err) {
                        notification.error('Erro', err.mensagem || 'Não foi posível completar a requisição');
                    });
            }
        }

        this.limparPesquisaHistorico = function () {
            $scope.historico = undefined;
            $scope.usuarioSelecionado = undefined;
        }

    };

    controller.$inject = ['apihttp', 'notification', '$scope', '$routeParams'];

    angular.module('sharenews')
        .controller('relatorioController', controller);

})(window.angular);
