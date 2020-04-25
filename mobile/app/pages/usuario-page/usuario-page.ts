import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UsuarioProvider, ToastNotification } from '../../providers';

@Component({
  templateUrl: 'build/pages/usuario-page/usuario-page.html',
  providers:[UsuarioProvider, ToastNotification]
})
export class UsuarioPage implements OnInit {

  usuario: any;
  historicoAtividades: Array<any> = [];

  constructor(private nav: NavController, navParams: NavParams,
    private usuarioProvider: UsuarioProvider, private notification: ToastNotification) {
    this.usuario = navParams.get('usuario');
  }

  ngOnInit() { 
    this.usuarioProvider.historicoAtividades(this.usuario.Id)
      .then(historico => {
        this.historicoAtividades = <any>historico;
        console.log(historico);
      }, err => {
        this.notification.show('Não foi possível carregar o histórico de atividades deste usuário');
      });
  }

}
