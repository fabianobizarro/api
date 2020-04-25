import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider, TokenProvider, SnCore, UsuarioProvider, ToastNotification } from '../../providers/';
import { LoginPage, UsuarioAlterarSenhaPage, UsuarioAlterarDadosPage } from '../';
import { IUsuario } from '../base/IUsuario';

@Component({
  templateUrl: 'build/pages/perfil/perfil.html',
  providers: [UsuarioProvider, ToastNotification]
})
export class PerfilPage implements OnInit {

  private acao = 'perfil';
  private usuario: IUsuario;
  private historicoAtividades: Array<any> = [];

  constructor(private nav: NavController, private auth: AuthProvider, private token: TokenProvider,
    snCore: SnCore, private usuarioProvider: UsuarioProvider, private notification: ToastNotification) {

    this.usuario = snCore.Usuario;
  }

  ngOnInit() {

  }

  logout() {
    let that = this;
    this.token.deleteToken()
      .then(() => {

        that.token.deleteUserInfo()
          .then(() => {
            location.reload();
          });
      });
  }

  private removeToken() {
    this.token.deleteToken()
      .then(this.removeUserInfo);

  }

  private removeUserInfo() {

  }

  alterarSenha() {
    this.nav.push(UsuarioAlterarSenhaPage, {
      usuarioId: this.usuario.Id
    });
  }

  alterarDados() {
    this.nav.push(UsuarioAlterarDadosPage, {
      usuario: this.usuario
    });
  }

  segmentChanged(event) {
    let that = this;

    if (event.value == 'atividades') {

      if (this.historicoAtividades.length == 0) {

        this.usuarioProvider.historicoAtividades(this.usuario.Id)
          .then(historico => {
            that.historicoAtividades = <any>historico;
          }, err => {
            this.notification.show("Não foi possível carregar o histórico de atividade do usuário");
          });
      }

    }
  }

  doRefresh(refresher) {
    this.usuarioProvider.historicoAtividades(this.usuario.Id)
      .then(historico => {
        this.historicoAtividades = <any>historico;
        refresher.complete();
      }, err => {
        this.notification.show("Não foi possível atualizar o histórico de atividade do usuário");
        refresher.complete();
      });
  }
}
