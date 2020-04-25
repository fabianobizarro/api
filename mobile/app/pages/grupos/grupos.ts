import { Component, OnInit } from '@angular/core';
import { NavController, Toast, Events } from 'ionic-angular';

import { GrupoPage, NovoGrupoPage } from '../';
import { GrupoProvider, ToastNotification } from '../../providers/';

@Component({
  templateUrl: 'build/pages/grupos/grupos.html',
  providers: [GrupoProvider, ToastNotification]
})
export class GruposPage implements OnInit {

  grupos: Array<any> = [];
  grupos_copy: Array<any> = [];


  showSearchBar: boolean = false;

  constructor(private nav: NavController, private grupoProvider: GrupoProvider,
    private events: Events, private notification: ToastNotification) {

  }

  ngOnInit() {
    this.obterGrupos();
    this.subscribeEvents();
  }

  subscribeEvents() {
    let that = this;
    this.events.subscribe('grupo:criado', function () {
      that.obterGrupos();
    });

    this.events.subscribe('Grupo:Excluido', function () {
      that.obterGrupos();
    });
  }

  obterGrupos(cb = null) {
    this.grupoProvider.obterGrupos()
      .then(result => {
        this.grupos = this.grupos_copy = <any>(result);
        if (cb) cb();
      },
      err => {
        this.notification.show("Não foi possível carregar os grupos. Tente novamente");
        if (cb) cb(err);
      });
  }

  criarGrupo() {
    this.nav.push(NovoGrupoPage);
  }

  refresh(e) {
    this.obterGrupos(() => {
      e.complete();
    })
  }

  exibirGrupo(grupo) {
    this.nav.push(GrupoPage, {
      grupo: grupo,
      onGrupoRemoved: this.grupoRemovido
    });
  }

  grupoRemovido(grupo) {
    // this.obterGrupos(null);
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }

  filterGroups(event) {

    this.grupos = this.grupos_copy;

    let filter = event.target.value;

    if (filter && filter.trim() != '') {
      this.grupos = this.grupos.filter(grupo => {
        return (grupo.Nome.toLowerCase().indexOf(filter.toLowerCase()) > -1);
      });
    }


  }

}
