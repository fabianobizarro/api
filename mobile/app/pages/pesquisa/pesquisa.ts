import { Component } from '@angular/core';
import { NavController, Toast, Modal } from 'ionic-angular';
import { NoticiaProvider, GrupoProvider, UsuarioProvider } from '../../providers';
import { NoticiaPage, GrupoInfoPage, UsuarioPage } from '../';

@Component({
  templateUrl: 'build/pages/pesquisa/pesquisa.html',
  providers: [GrupoProvider, NoticiaProvider, UsuarioProvider]
})
export class PesquisaPage {

  tipoPesquisa: TipoPesquisa = TipoPesquisa.Noticia;
  pesquisando: boolean = false;

  labelPesquisa: string = 'Notícias';
  textoPesquisa: string;
  listaGrupos: Array<any> = [];
  listaNoticias: Array<any> = [];
  listaUsuarios: Array<any> = [];

  constructor(private nav: NavController,
    private grupoProvider: GrupoProvider,
    private noticiaProvider: NoticiaProvider,
    private usuarioProvider: UsuarioProvider) { }

  exibirNoticia(noticia) {
    this.nav.push(NoticiaPage, {
      noticia: noticia
    });
  }

  exibirUsuario(usuario) {
    this.nav.push(UsuarioPage, {
      usuario: usuario
    });
  }

  exibirListaNoticias() {
    return this.tipoPesquisa == TipoPesquisa.Noticia && this.listaNoticias.length > 0;
  }

  exibirListaGrupos() {
    return this.tipoPesquisa == TipoPesquisa.Grupo && this.listaGrupos.length > 0;
  }

  exibirListaUsuarios() {
    return this.tipoPesquisa == TipoPesquisa.Usuario && this.listaUsuarios.length > 0;
  }



  pesquisar(event) {

    let texto = this.textoPesquisa || '';

    if (texto.trim() != '' && texto.trim().length > 2) {

      if (this.tipoPesquisa == TipoPesquisa.Noticia)
        this.pesquisarNoticias(texto);
      else if (this.tipoPesquisa == TipoPesquisa.Grupo)
        this.pesquisarGrupos(texto);
      else if (this.tipoPesquisa == TipoPesquisa.Usuario)
        this.pesquisarUsuario(texto);

    }

  }

  segmentChanged(e) {

    if (e.value == TipoPesquisa.Noticia) {

      this.labelPesquisa = 'Notícias';
      if (this.listaNoticias.length == 0)
        this.pesquisar(null);

    }
    else if (e.value == TipoPesquisa.Grupo) {

      this.labelPesquisa = 'Grupos';
      if (this.listaGrupos.length == 0)
        this.pesquisar(null);

    }
    else if (e.value == TipoPesquisa.Usuario) {

      this.labelPesquisa = 'Usuários';
      if (this.listaUsuarios.length == 0)
        this.pesquisarUsuario(null);
    }

  }

  pesquisarNoticias(pesquisa) {
    this.pesquisando = true;

    this.noticiaProvider.pesquisarNoticias(pesquisa)
      .then(noticias => {
        this.listaNoticias = <any>(noticias);
        this.pesquisando = false;
      }, err => {

        let notify = this.notificationError(`${err.mensagem} \n ${err.erro}`);
        this.nav.present(notify);
        this.pesquisando = false;
      })
      .catch(err => {
        let notify = this.notificationError(`${err.mensagem} \n ${err.erro}`);
        this.nav.present(notify);
        this.pesquisando = false;
      })


  }

  pesquisarGrupos(pesquisa) {
    this.pesquisando = true;

    this.grupoProvider.pesquisarGrupos(pesquisa)
      .then(grupos => {
        this.listaGrupos = <any>grupos;
        this.pesquisando = false;
      }, err => {
        let notify = this.notificationError(`${err.mensagem} \n ${err.erro}`);
        this.nav.present(notify);
        this.pesquisando = false;
      })
      .catch(err => {
        let notify = this.notificationError(`${err.mensagem} \n ${err.erro}`);
        this.nav.present(notify);
        this.pesquisando = false;
      });


  }

  pesquisarUsuario(pesquisa) {
    this.pesquisando = true;

    this.usuarioProvider.pesquisarUsuarios(pesquisa)
      .then(result => {
        this.listaUsuarios = <any>result;
        this.pesquisando = false;
      }, err => {
        let notify = this.notificationError(`${err.mensagem} \n ${err.erro}`);
        this.nav.present(notify);
        this.pesquisando = false;
      })
      .catch(err => {
        let notify = this.notificationError(`${err.mensagem} \n ${err.erro}`);
        this.nav.present(notify);
        this.pesquisando = false;
      });
  }

  cancelarPesquisa(e) {
    e.target.value = '';
  }

  notificationError(message) {
    return Toast.create({
      message: message,
      duration: 3000,
      closeButtonText: 'Fechar',
      dismissOnPageChange: true,
      showCloseButton: true
    });
  }

  exibirGrupo(grupo) {
    let modal = Modal.create(GrupoInfoPage, { grupo: grupo });
    this.nav.present(modal);
  }

}

class TipoPesquisa {
  static Noticia: string = 'noticia';
  static Grupo: string = 'grupo';
  static Usuario: string = 'usuario';
}