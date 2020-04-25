import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events  } from 'ionic-angular';

import { GrupoProvider, ToastNotification } from '../../providers';

@Component({
  templateUrl: 'build/pages/opcoes-integrante-grupo/opcoes-integrante-grupo.html',
  providers: [GrupoProvider, ToastNotification]
})
export class OpcoesIntegranteGrupoPage {

  private usuario: any;
  private grupo: any;

  constructor(private nav: NavController, navParams: NavParams,
    private viewCtrl: ViewController,
    private events: Events,
    private grupoProvider: GrupoProvider,
    private notification: ToastNotification) {
    this.usuario = navParams.get('usuario');
    this.grupo = navParams.get('grupo');
  }

  public deleteUserDelegate;
  public toggleAdminDelegate;

  private deleteUser() {
    //Remover o usuario do grupo

    this.grupoProvider.removerUsuario(this.grupo.Id, this.usuario.Id)
      .then(res => {
        //console.log(res);
        this.dismiss();
        this.events.publish('integranteGrupo:Removed', this.usuario);
      }, err => {
        if (err.erro)
          this.notification.show(err.erro);
        else
          this.notification.show('Não foi possível remover este usuário.');
      });

  }

  private toggleAdmin() {
    this.grupoProvider.toggleAdmin(this.grupo.Id, this.usuario.Id)
      .then(result => {
        this.dismiss();
        this.events.publish('integranteGrupo:ToggleAdmin', this.usuario);
      }, err => {
        console.log(err);
        if (err.erro)
          this.notification.show(err.erro);
        else
          this.notification.show('Não foi possível realizar a operação');
      })


  }

  dismiss() {
    this.nav.pop();
    this.viewCtrl.dismiss();
  }


}
