import { Component, OnInit } from '@angular/core';
import { NavController, Alert } from 'ionic-angular';
import { NovaNoticiaPage, UsuarioPage } from '../';
import { SnCore, UsuarioProvider, ToastNotification } from '../../providers';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [UsuarioProvider, ToastNotification]
})
export class HomePage implements OnInit {

  nomeUsuario: string;
  feed: Array<any>;

  constructor(private navController: NavController, private snCore: SnCore,
    private usuarioProvider: UsuarioProvider, private notification: ToastNotification) {
    this.nomeUsuario = this.snCore.Usuario.Login;
  }

  ngOnInit() {
    this.usuarioProvider.feedUsuario(this.snCore.Usuario.Id)
      .then(result => {
        this.feed = <any>result;
      }, err => {
        this.notification.show('Não foi possível carregar seu feed de notícias. Tente novamente');
      })
      .catch(err => this.notification.show('Ocorreu um erro inesperado. Tente novamente'));
  }

  exibirUsuario(usuario: string){
    
  }

}
