import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ActionSheet, Toast, Events } from 'ionic-angular';
import { GrupoProvider, NoticiaProvider, ToastNotification } from '../../providers';
import {
  NovaNoticiaPage,
  ConfigGrupoPage,
  NoticiaPage,
  NoticiaComentariosPage,
  GrupoSolicitacoesPage,
  NoticiaAlterarPage
} from '../';


@Component({
  templateUrl: 'build/pages/grupo/grupo.html',
  providers: [GrupoProvider, NoticiaProvider, ToastNotification]
})
export class GrupoPage implements OnInit {

  noticias: any = [];
  grupo = null;
  onGrupoRemoved: any = null;

  constructor(private nav: NavController, navParams: NavParams, private grupoProvider: GrupoProvider,
    private noticiaProvider: NoticiaProvider, public events: Events, private notification: ToastNotification) {
    this.grupo = navParams.get('grupo');
    this.onGrupoRemoved = navParams.get('onGrupoRemoved');
  }

  subscribeEvents() {
    let that = this;
    this.events.subscribe('grupo:noticiaCriada', function () {
      that.obterNoticiasGrupo();
    });

    this.events.subscribe('Noticia:Excluida', () => {
      this.obterNoticiasGrupo();
      this.notification.show('Notícia excluída do grupo');
    });

    this.events.subscribe('Noticia:Alterada', () => {
      this.obterNoticiasGrupo();
      this.notification.show('Notícia alterada');
    });

    this.events.subscribe('grupo:alterado', (grupo) => {
      that.grupo.Nome = grupo[0].Nome;
      that.grupo.Descricao = grupo[0].Descricao
    });
  }

  private obterNoticiasGrupo(cb?) {

    this.grupoProvider.obterNoticias(this.grupo.Id)
      .then(result => {
        this.noticias = result;
        if (cb) cb();
      }, err => {
        console.log(err);
        if (cb) cb(err);
      })
      .catch(err => {
        console.log(err);
        if (cb) cb(err);
      });
  }

  ngOnInit() {
    this.subscribeEvents();
    this.obterNoticiasGrupo();
  }

  refresh(e) {

    this.obterNoticiasGrupo(() => {
      e.complete();
    });
  }

  swipeBack(e) {
    if (e.direction === 4)
      this.nav.pop();
  }

  exibirOpcoes() {
    let action = this.getActionSheet();

    this.nav.present(action);
  }

  getActionSheet() {
    let botoes;

    if (this.grupo.usuarioAdmin) {
      botoes = [
        {
          text: 'Criar notícia',
          handler: () => {
            this.nav.push(NovaNoticiaPage, {
              grupoId: this.grupo.Id
            });
          }
        },
        {
          text: 'Configurações',
          handler: () => {
            this.nav.push(ConfigGrupoPage, {
              grupo: this.grupo
            });
          }
        },
        {
          text: 'Solicitações pendentes',
          handler: () => {
            this.exibirSolicitacoes();
          }
        },
        {
          text: 'Sair do Grupo',
          handler: () => {
            this.exitGrupo();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ];
    }
    else {
      botoes = [
        {
          text: 'Configurações',
          handler: () => {
            this.nav.push(ConfigGrupoPage, {
              grupo: this.grupo
            });
          }
        },
        {
          text: 'Sair do Grupo',
          handler: () => {
            this.exitGrupo();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ];
    }

    return ActionSheet.create({
      title: 'Opções',
      buttons: botoes
    });

  }

  exibirSolicitacoes() {
    this.nav.push(GrupoSolicitacoesPage, { grupoId: this.grupo.Id });
  }

  exitGrupo() {
    this.grupoProvider.exitGrupo(this.grupo.Id)
      .then(result => {
        if (result.sucesso) {
          this.nav.popToRoot();
        }
        else
          this.showToastNotification(result.mensagem);
      }, err => {
        this.showToastNotification(`${err.mensagem} \n ${err.erro}`);
      });
  }

  curtirNoticia(noticia) {

    let curtidaOriginal = noticia.Curtiu;
    let contagemOriginal = noticia.Curtidas;

    if (noticia.Curtiu) {
      noticia.Curtidas--;
      noticia.Curtiu = false;
    }
    else {
      noticia.Curtidas++;
      noticia.Curtiu = true;
    }

    this.noticiaProvider.curtirNoticia(noticia.Id)
      .then(result => { })
      .catch(err => {
        this.nav.present(this.toastErroCurtida());
        noticia.Curtiu = curtidaOriginal;
        noticia.Curtidas = contagemOriginal;
      });

  }

  exibirComentarios(noticiaId) {
    this.nav.push(NoticiaComentariosPage, {
      NoticiaId: noticiaId,
      usuarioAdmin: this.grupo.usuarioAdmin
    });
  }

  visualizarNoticia(noticia) {
    this.nav.push(NoticiaPage, {
      noticia: noticia,
      usuarioAdmin: this.grupo.usuarioAdmin
    });
  }

  toastErroCurtida() {
    return Toast.create({
      message: 'Ocorreu um erro ao realizar a operação. Tente novamente.',
      duration: 2000,
      dismissOnPageChange: true,
      showCloseButton: true
    })
  }

  showToastNotification(message) {
    let noti = this.getToastNotification(message);
    this.nav.present(noti);
  }

  getToastNotification(message) {
    return Toast.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'X',
    });
  }

  alterarNoticia(noticia) {
    this.nav.push(NoticiaAlterarPage, {
      noticia: noticia,
      grupoId: this.grupo.Id
    });
  }

  cadastrarNoticia() {
    this.nav.push(NovaNoticiaPage, {
      grupoId: this.grupo.Id
    });
  }

}
