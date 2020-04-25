import { Component } from '@angular/core';
import { NavController, Page, Alert, Loading } from 'ionic-angular';

import { SignUpPage } from '../sign-up/sign-up';
import { TabsPage } from '../tabs/tabs';
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';

import { TokenProvider } from '../../providers/token-provider/token-provider';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { SnCore } from '../../providers';

@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {


  constructor(private nav: NavController,
    private tokenProvider: TokenProvider,
    private auth: AuthProvider,
    private snCore: SnCore)
  { }

  private invalidLoginAlert(message = null) {
    return Alert.create({
      title: "Login",
      subTitle: message || 'Não foi possível realizar o login',
      buttons: ["OK"]
    });
  }

  private getLoading() {
    return Loading.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });
  }

  login(username, password) {

    let loading = this.getLoading();

    this.nav.present(loading);
    this.auth.login(username, password)
      .then((result) => {

        loading.dismiss();

        if (result.token) {
          this.tokenProvider.setToken(result.token)
            .then(() => {

              this.carregarInfoUsuario().then(() => {
                this.nav.setRoot(TabsPage);
              });


            });
        }
        else {
          alert('Não foi possível obter a chave de autenticação.');
        }

      },
      (err) => {
        loading.dismiss();
        this.nav.present(this.invalidLoginAlert(err.mensagem));
      })
      .catch(err => {
        loading.dismiss();
        this.nav.present(this.invalidLoginAlert('Ocorreu um erro maluco.'));
      });
  }

  carregarInfoUsuario(): Promise<any> {
    return new Promise((resolve, reject) => {
      let that = this;

      this.auth.userInfo()
        .then(user => {
          this.snCore.setUsuarioLogado(user)
            .then(resolve);
        }, err => {
          resolve();
        });
    });


  }


  gotoSignup() {
    this.nav.push(SignUpPage);
  }

  gotoPasswd(){
    this.nav.push(RecuperarSenhaPage);
  }

}
