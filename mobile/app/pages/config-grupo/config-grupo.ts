import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Popover, Modal, Events, Alert } from 'ionic-angular';

import { OpcoesIntegranteGrupoPage, GrupoAlterarPage } from '../';
import { GrupoProvider, ToastNotification } from '../../providers';

@Component({
  templateUrl: 'build/pages/config-grupo/config-grupo.html',
  providers: [GrupoProvider, ToastNotification]
})
export class ConfigGrupoPage implements OnInit {

  grupoPublico: boolean;
  grupo: any;
  integrantes: any = [];
  popover: Popover;
  toggleDisabled = false;

  constructor(private nav: NavController, navParams: NavParams,
    private grupoProvider: GrupoProvider,
    private events: Events,
    private notification: ToastNotification) {
    this.grupo = navParams.get('grupo');
    this.grupoPublico = <boolean>this.grupo.Publico;
    this.toggleDisabled = !this.grupo.usuarioAdmin;
  }

  ngOnInit() {
    this.notification.setNavController(this.nav);
    this.obterIntegrantes();
    this.subscribeEvents();
  }

  private obterIntegrantes() {

    this.grupoProvider.obterIntegrantes(this.grupo.Id)
      .then(integrantes => {
        this.integrantes = integrantes;
      }, err => {
        console.log(err);
      });

  }

  subscribeEvents() {
    let that = this;
    this.events.subscribe('integranteGrupo:Removed', (user) => {

      that.onRemovedUser(user);

    });

    this.events.subscribe('integranteGrupo:ToggleAdmin', (user) => {
      that.toggleAdmin(user);
    });
  }

  pressed(e, integrante) {
    if (this.grupo.usuarioAdmin) {
      let modal = this.getModal(integrante, this.grupo);
      this.nav.present(modal);
    }
  }

  getModal(usuario, grupo): Modal {
    return Modal.create(OpcoesIntegranteGrupoPage, {
      usuario: usuario,
      grupo: grupo
    });
  }


  onRemovedUser(user) {
    this.obterIntegrantes();
    this.notification.show('Usuário removido do grupo');
  }

  toggleAdmin(user) {
    this.obterIntegrantes();
  }

  switchGrupoPublico(e) {
    let that = this;

    let visibOriginal = this.grupo.Publico;

    this.grupoProvider.alterarVisibilidade(this.grupo.Id)
      .then(result => {

        if (result.Publico != null && result.Publico != undefined) {
          that.grupo.Publico = result.Publico;
          that.grupoPublico = result.Publico;
        }
        else {
          that.grupo.Publico = !visibOriginal;
          that.grupoPublico = that.grupo.Publico;
        }

        this.notification.show(result.mensagem);

      }, err => {

        if (err.erro)
          this.notification.show(err.erro)
        else
          this.notification.show('Não foi possível realizar a operação.');

        that.grupoPublico = visibOriginal;
        that.grupo.Publico = visibOriginal;
      });

  }

  alterarInfoGrupo() {
    this.nav.push(GrupoAlterarPage, {
      grupo: this.grupo
    });
  }

  excluirGrupo() {

    this.confirmarExclusao((confirmado) => {

      if (confirmado) {

        this.grupoProvider.excluirGrupo(this.grupo.Id)
          .then(result => {
            this.notification.show('Grupo excluído');
            this.events.publish('Grupo:Excluido', this.grupo);
            this.nav.popToRoot();
          }, err => {
            if (err.erro)
              this.notification.show(err.erro);
            else
              this.notification.show('Ocorreu um erro. Não foi possível excluir a notícia');
          });
      }

    });
  }

  private confirmarExclusao(cb) {
    let alert = Alert.create({
      title: 'Excluir grupo',
      message: 'Deseja excluir este grupo?',
      buttons: [
        {
          text: 'Sim',
          handler: () => cb(true)
        },
        {
          text: 'Não',
          handler: () => cb(false)
        }
      ]
    });
    this.nav.present(alert);

  }
}
