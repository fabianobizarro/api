import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Toast, ToastOptions } from 'ionic-angular';
import { GrupoProvider } from '../../providers';

@Component({
  templateUrl: 'build/pages/grupo-info/grupo-info.html',
  providers: [GrupoProvider]
})
export class GrupoInfoPage {

  private grupo: any = {};
  loading: boolean = false;


  constructor(private nav: NavController, navParams: NavParams,
    private viewController: ViewController, private grupoProvider: GrupoProvider) {
    this.grupo = navParams.get('grupo');
  }

  dismiss() {
    this.viewController.dismiss();
  }

  sairDoGrupo() {
    let that = this;
    this.loading = true;

    this.grupoProvider.exitGrupo(this.grupo.Id)
      .then(result => {

        that.loading = false;

        if (result.sucesso == true) {
          that.grupo.Integrante = false;
          this.showToastNotification(result.mensagem);
        } else {
          this.showToastNotification(result.mensagem);
        }

      }, err => {
        this.showToastNotification(err.mensagem);

      });
  }

  entrarNoGrupo() {
    let that = this;
    this.loading = true;

    this.grupoProvider.joinGrupo(this.grupo.Id)
      .then(result => {

        that.loading = false;

        if (result.sucesso == true && result.pendente == false) {
          that.grupo.Integrante = true;
          this.showToastNotification(result.mensagem);
        } else {
          this.showToastNotification(result.mensagem);
        }
      }, err => {
        that.loading = false;
        this.showToastNotification(err.mensagem);
      });

  }

  private toastNotification(message) {
    return Toast.create({
      message: message,
      duration: 2000,
      showCloseButton: true,
      closeButtonText: 'X',
      position: 'middle'
    });
  }

  private showToastNotification(message) {
    let notification = this.toastNotification(message);
    this.nav.present(notification);
  }

}
