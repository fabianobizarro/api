import { OnInit } from '@angular/core';
import { NavController, Page, Toast } from 'ionic-angular';
import { Response } from '@angular/http';

import { HomePage, PesquisaPage, TabsPage, NoticiaPage, NoticiaComentariosPage } from '../';

import { UnilesteProvider, NoticiaProvider } from '../../providers';

class TipoNoticia {
  static Hoje: string = 'hoje';
  static Antigas: string = 'antigas';
}

@Page({
  templateUrl: 'build/pages/unileste/unileste.html',
  providers: [UnilesteProvider, NoticiaProvider]
})
export class UnilestePage implements OnInit {

  tipoNoticia: string = TipoNoticia.Hoje;

  noticiasHoje: Array<any> = [];
  noticiasAntigas: Array<any> = [];

  carregandoNoticias: boolean = false;
  refreshing: boolean = false;

  pagina: number = 1;

  constructor(private nav: NavController,
    private unileste: UnilesteProvider,
    private noticia: NoticiaProvider) { }

  listarNoticiasHojeUnileste(callback = null): void {
    this.unileste.obterNoticiasDeHoje()
      .then(result => {

        this.noticiasHoje = <any>result;
        let count = (<any>(result)).length;

        if (callback) callback();
      }, err => this.nav.present(this.toastNotificationError()))
      .catch(err => {
        this.nav.present(this.toastNotificationError());
        callback();
      });
  }

  listarTodasNoticiasUnileste(pagina: number, callback): void {
    this.unileste.obterNoticias(pagina)
      .then(result => {

        for (let i in result) {
          let noticia = result[i];
          this.noticiasAntigas.push(noticia);
        }
        //this.noticiasAntigas = <any>result;

        let count = (<any>(result)).length;
        if (count > 0)
          this.pagina++;

        if (callback) callback();
      }, err => this.nav.present(this.toastNotificationError()))
      .catch(err => {
        this.nav.present(this.toastNotificationError());
        callback();
      });
  }

  ngOnInit(): void {
    if (this.tipoNoticia == TipoNoticia.Hoje) {
      this.carregandoNoticias = true;
      this.listarNoticiasHojeUnileste(() => this.carregandoNoticias = false);
    } else if (this.tipoNoticia == TipoNoticia.Antigas) {
      this.carregandoNoticias = true;
      this.listarTodasNoticiasUnileste(this.pagina, () => this.carregandoNoticias = false);
    }

  }

  doRefresh(e): void {

    if (this.tipoNoticia == TipoNoticia.Hoje) {

      this.refreshing = true;
      this.listarNoticiasHojeUnileste(() => {
        this.refreshing = false;
        e.complete();
      });
    }
    else
      e.complete();

  }

  segmentChange(e): void {


    if (e.value == TipoNoticia.Hoje) {

      if (this.noticiasHoje.length == 0) {      }

    } else if (e.value == TipoNoticia.Antigas) {

      if (this.noticiasAntigas.length == 0) {
        this.pagina = 1;
        this.listarTodasNoticiasUnileste(this.pagina, null);
      }

    }

  }

  listarMaisNoticias():void {
    this.listarTodasNoticiasUnileste(this.pagina, null);
  }

  visualizarNoticia(noticia): void {
    this.nav.push(NoticiaPage, { noticia: noticia });
  }

  curtirNoticia(noticia): void {

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

    this.noticia.curtirNoticia(noticia.Id)
      .then(result => { })
      .catch(err => {
        this.nav.present(this.toastErroCurtida());
        noticia.Curtiu = curtidaOriginal;
        noticia.Curtidas = contagemOriginal;
      });


  }

  toastNotificationError(): Toast {
    return Toast.create({
      message: 'Não foi possível conectar com o servidor',
      cssClass: 'danger',
      duration: 3000
    })
  }

  toastErroCurtida(): Toast {
    return Toast.create({
      message: 'Ocorreu um erro ao realizar a operação. Tente novamente.',
      duration: 2000
    })
  }

  exibirComentarios(noticiaId): void {
    this.nav.push(NoticiaComentariosPage, {
      NoticiaId: noticiaId
    });
  }

  exibirNoticiasHoje(): boolean {
    return this.tipoNoticia == TipoNoticia.Hoje;
  }

  exibirNoticiasAntigas(): boolean {
    return this.tipoNoticia == TipoNoticia.Antigas;
  }
}
