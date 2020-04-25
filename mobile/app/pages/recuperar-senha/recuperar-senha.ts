import { Component } from '@angular/core';
import { NavController, Page, Alert, Loading } from 'ionic-angular';

// import { SignUpPage } from '../sign-up/sign-up';
// import { TabsPage } from '../tabs/tabs';

// import { TokenProvider } from '../../providers/token-provider/token-provider';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { ToastNotification } from '../../providers';
// import { SnCore } from '../../providers';

@Page({
  templateUrl: 'build/pages/recuperar-senha/recuperar-senha.html',
  providers: [AuthProvider, ToastNotification]
})
export class RecuperarSenhaPage {

  email: string;

  constructor(private auth: AuthProvider, private notification: ToastNotification) {

  }

  enviarEnderecoEmail() {
    if (this.email) {
      this.auth.enviarLinkEmail(this.email)
        .then(result => {
          this.notification.show('Link enviado para seu email.');
        }, err => {
          this.notification.show(err.mensagem);
        });
    }
  }

  


}
