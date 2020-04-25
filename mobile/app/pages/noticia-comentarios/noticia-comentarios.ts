import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Loading, Toast, Alert } from 'ionic-angular';
import { ComentarioProvider, SnCore, ToastNotification } from '../../providers';
import { IUsuario } from '../base/IUsuario';


@Component({
  templateUrl: 'build/pages/noticia-comentarios/noticia-comentarios.html',
  providers: [ComentarioProvider, ToastNotification]
})
export class NoticiaComentariosPage implements OnInit {

  private noticiaId: number;
  private comentario: string;
  private comentarios: Array<any> = [];
  private enviandoComentario: boolean = false;
  private usuarioLogado: IUsuario;
  private usuarioAdmin: boolean;

  constructor(private nav: NavController,
    navParams: NavParams,
    private comentarioProvider:
      ComentarioProvider, private snCore: SnCore, private notification: ToastNotification) {
    this.noticiaId = navParams.get("NoticiaId");
    this.usuarioLogado = this.snCore.Usuario;
    this.usuarioAdmin = <boolean>navParams.get('usuarioAdmin');
    
  }

  getLoadingPanel() {
    return Loading.create({
      content: 'Carregando ...',
      dismissOnPageChange: true
    });
  }

  getToastError() {
    return Toast.create({
      message: 'Não foi possível enviar o comentário',
      duration: 2000
    });
  }

  ngOnInit() {

    this.notification.setNavController(this.nav);
    let loading = this.getLoadingPanel();
    this.nav.present(loading);
    this.comentarioProvider.obterComentarios(this.noticiaId)
      .then(result => {
        loading.dismiss();
        this.comentarios = <any>result;
      })
      .catch(err => {
        loading.dismiss();
        this.notification.show('Não foi possível obter os comentários');
      });

  }

  swipeBack(e) {
    if (e.direction === 4)
      this.nav.pop();
  }

  enviarComentario(comentario: string) {

    if (comentario !== undefined)
      if (comentario.trim() != null && comentario.trim() != '') {

        this.enviandoComentario = true;
        this.comentarioProvider.enviarComentario(this.noticiaId, comentario)
          .then(result => {
            this.enviandoComentario = false;

            if (result.sucesso == true) {
              this.comentarios.push({
                Data: result.comentario.Data,
                Conteudo: result.comentario.Conteudo,
                Usuario: this.snCore.Usuario.Login,
                Id: result.comentario.Id,
                UrlFoto: this.usuarioLogado.UrlFoto
              });
            }
            this.comentario = '';
          }, (err) => {
            this.enviandoComentario = false;
            this.notification.show(err.mensagem);
          })
          .catch(err => {
            this.enviandoComentario = false;
            this.nav.present(this.getToastError());
          });
      }

  }

  podeRemoverComentario(comentario) {
    return comentario.Usuario == this.usuarioLogado.Login ||  this.usuarioAdmin;
  }

  removerComentario(comentario) {
    let that = this;
    this.confirmacaoExclusao(confirmado => {
      if (confirmado) {

        that.comentarioProvider.removerComentario(this.noticiaId, comentario.Id)
          .then(result => {
            that._removerComentario(comentario);
          }, err => {
            if (err.erro)
              that.notification.show(err.erro);
            else
              that.notification.show('Não foi possível remover este comentário');
          });
      }
    });

  }

  private confirmacaoExclusao(cb) {
    let confirm = Alert.create({
      title: 'Remover comentário',
      message: 'Você deseja mesmo remover este comentário?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            cb(false);
          }
        },
        {
          text: 'Sim',
          handler: () => {
            cb(true);
          }
        }
      ]
    });
    this.nav.present(confirm);

  }

  private _removerComentario(comentario) {
    let index = this.comentarios.indexOf(comentario);
    this.comentarios.splice(index, 1);
  }

}
