(function (angular) {

    function unilesteController(notification, Unileste, Noticia, $location,
        Page, $routeParams, Authentication, $scope, fileUploadService) {

        var uni = this;
        uni.novaNoticia = {};
        uni.novaNoticia.Tags = ['unileste'];
        uni.loadingcn = false;
        uni.categoriasNoticia = null;
        uni.sendingMsg = false;
        uni.noticias = null;
        uni.loading = false;
        uni.alterandoNoticia = false;
        uni.excluindoNoticia = false;
        uni.loadingComments = false;

        uni.noticia = null;

        Authentication.getUser(function (u) {
            uni.$user = u;
        });


        uni.file = null;
        uni.fileName = '';

        uni.cadastrarNoticia = function (formValid, noticia) {

            if (formValid) {
                if (noticia.Tags) {
                    noticia.Tags = noticia.Tags.map(function (val) {
                        return val.text;
                    });
                }

                Unileste.cadastrarNoticia(noticia)
                    .then(function (result) {
                        notification.success('Sucesso!', 'Notícia cadastrada com sucesso!');
                        $location.path('/unileste');

                    }, function (err) {
                        notification.error('Ocorreu um erro', err.data.mensagem);
                    });
            }

        };

        uni.curtirNoticia = function (idNoticia) {

            Noticia.curtirNoticia(idNoticia)
                .then(function (result) {
                    if (result.data.curtir == true) {
                        uni.noticia.Curtidas.push(uni.$user.Login);
                    }
                    else {
                        var i = uni.noticia.Curtidas.indexOf(uni.$user.Login);
                        if (i != -1)
                            uni.noticia.Curtidas.splice(i, 1);
                    }

                },
                function (err) {
                    notification.error('Erro', 'Ocorreu um erro ao realizar a operação.');
                });

        };

        uni.carregarNoticiasDoDia = function () {
            uni.loading = true;
            Unileste.obterNoticiasUnileste()
                .then(function (result) {
                    uni.loading = false;
                    uni.noticias = result.data;
                }, function (err) {
                    uni.loading = false;
                    notification.error('Erro', err.data.mensagem);
                });
        };

        uni.carregarNoticia = function () {
            uni.loading = true;
            Noticia.obterNoticia($routeParams.idNoticia)
                .then(function (result) {
                    uni.loading = false;
                    uni.noticia = result.data;
                    uni.noticia.Curtidas = [];
                    uni.noticia.Comentarios = [];
                    uni.obterComentarios(uni.noticia.Id);
                    uni.obterCurtidas(uni.noticia.Id);
                }, function (err) {
                    uni.loading = false;
                    if (err.data.mensagem)
                        notification.error('Erro', err.data.mensagem);
                    else
                        notification.error('Erro', 'Não foi possível realizar a operação. Tentes novamente mais tarde');
                });
        };

        uni.enviarComentario = function (comment) {
            if (comment) {
                uni.sendingMsg = true;
                Noticia.adicionarComentario(uni.noticia.Id, comment)
                    .then(function (result) {
                        uni.sendingMsg = false;
                        if (result.data) {

                            Authentication.getUser(function (u) {

                                var c = {
                                    Data: result.data.comentario.Data,
                                    Conteudo: result.data.comentario.Conteudo,
                                    Usuario: u.Login
                                };

                                uni.noticia.Comentarios.push(c);

                            });
                        }
                    }, function (err) {
                        uni.sendingMsg = false;
                        notification.error('Erro :/ ', 'Não foi possível enviar seu comentário. Tente novamente.');
                    });
            }
        };

        uni.removerComentario = function (comment) {
            console.log(comment);
            Noticia.removerComentario(uni.noticia.Id, comment.Id)
                .then(function (result) {
                    if (result.data) {
                        notification.success('Sucesso!', result.data.mensagem);
                    }
                    var commentIndex = uni.noticia.Comentarios.indexOf(comment);
                    uni.noticia.Comentarios.splice(commentIndex, 1);

                }, function (err) {
                    notification.error('Erro :/', 'Não foi possível remover este comentário');
                });
        };

        uni._loadAlterarNoticia = function () {
            uni.carregarNoticia();
        };

        uni.alterarNoticia = function (formValid, noticia) {

            if (formValid) {
                uni.alterandoNoticia = true;
                if (noticia.Tags) {
                    noticia.Tags = noticia.Tags.map(function (val) {
                        return val.text;
                    });
                }

                Unileste.alterarNoticia(noticia)
                    .then(function (result) {

                        if (result.data)
                            notification.success('Alteração de notícia', result.data.mensagem);
                        else
                            notification.success('Alteração de notícia', 'Operação realizada com sucesso.');

                        $location.path('/unileste');

                    }, function (err) {
                        notification.error('Erro', 'Não foi possível alterar a notícia');
                    }).finally(function () {
                        uni.alterandoNoticia = false;
                    });
            }

        };

        uni.excluirNoticia = function (noticia) {

            notification.show({
                title: "Tem certeza que deseja excluir este notícia?",
                text: "Esta ação não poderá ser desfeita!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Sim",
                cancelButtonText: 'Cancelar',
                closeOnConfirm: false
            }, function () {
                uni.excluindoNoticia = true;
                Unileste.excluirNoticia(noticia)
                    .then(function (result) {
                        notification.info('Notícia', 'Notícia excluída com sucesso.');
                        $location.path('/unileste');
                    }, function (err) {
                        notification.error('Erro', 'Não foi possível excluir a notícia');
                    }).finally(function () {
                        uni.excluindoNoticia = false;
                    });
            });

        };

        uni.obterComentarios = function (idNoticia) {
            if (idNoticia) {
                uni.loadingComments = true;
                Noticia.obterComentarios(idNoticia)
                    .then(function (result) {
                        uni.noticia.Comentarios = result.data;
                    }, function (err) {
                        notification.error('Erro', 'Não foi possível carregar os comentários');
                    }).finally(function () {
                        uni.loadingComments = false;
                    });
            }
        };

        uni.obterCurtidas = function (idNoticia) {
            if (idNoticia) {
                Noticia.obterCurtidas(idNoticia)
                    .then(function (result) {
                        uni.noticia.Curtidas = result.data;
                    }, function (err) {
                        notification.error('Erro', 'Não foi possível carregar as curtidas');
                    });
            }
        };

        uni.visualizarImagem = function () {

            if (uni.file) {
                notification.show({
                    html: true,
                    title: 'Visualizar imagem',
                    text: '<img width="100%" src="' + uni.file + '"/>'
                });
            }

        }

        uni.salvarImagem = function () {

            if (uni.file) {
                var blob = fileUploadService.dataUriToBlob(uni.file);
                var file = new File([blob], uni.fileName);

                fileUploadService.enviarArquivo(file, function (err, result) {

                    if (err) {
                        notification.error("Erro", "Não foi possível salvar este imagem");
                    }
                    else {
                        if (uni.noticia)
                            uni.noticia.UrlImagem = result.data.url;

                        if (uni.novaNoticia)
                            uni.novaNoticia.UrlImagem = result.data.url;
                    }
                });
            }

        }

    }

    unilesteController.$inject = ['notification', 'Unileste', 'Noticia',
        '$location', 'Page', '$routeParams', 'Authentication', '$scope', 'fileUploadService'];

    angular.module('sharenews')
        .controller('unilesteController', unilesteController);


})(window.angular);
