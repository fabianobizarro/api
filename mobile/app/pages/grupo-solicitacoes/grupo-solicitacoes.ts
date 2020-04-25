import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Toast } from 'ionic-angular';
import { GrupoProvider } from '../../providers';

@Component({
  templateUrl: 'build/pages/grupo-solicitacoes/grupo-solicitacoes.html',
  providers: [GrupoProvider]
})
export class GrupoSolicitacoesPage implements OnInit {

  private grupoId: number;
  private solicitacoes: Array<any>;

  constructor(private nav: NavController, params: NavParams, private grupoProvider: GrupoProvider) {
    this.grupoId = params.get('grupoId');
  }

  ngOnInit() {
    this.grupoProvider.obterSolicitacoes(this.grupoId)
      .then(result => {
        this.solicitacoes = result;
      }, err => {
        console.log(err);
      });
  }

  aceitarSolicitacao(solicitacao) {
    let usuarioId = <number>solicitacao.Id;
    this.grupoProvider.aceitarSolicitacao(this.grupoId, usuarioId)
      .then(result => {
        if (result.sucesso) {
          this.showNotification('Usuário adicionado ao grupo');
          let i = this.solicitacoes.indexOf(solicitacao);
          this.solicitacoes.splice(i, 1);
        }
      }, err => {
        console.log(err);
        this.showNotification('Erro');
      }).catch(err => {
        console.log(err);
        this.showNotification('Erro');
      });
  }

  rejeitarSolicitacao(solicitacao) {
    let usuarioId = <number>solicitacao.Id;
    this.grupoProvider.rejeitarSolicitacao(this.grupoId, usuarioId)
      .then(result => {
        if (result.sucesso) {
          this.showNotification('Solicitação rejeitada');
          let i = this.solicitacoes.indexOf(solicitacao);
          this.solicitacoes.splice(i, 1);
        }
      }, err => {
        console.log(err);
        this.showNotification('Erro');
      }).catch(err => {
        console.log(err);
        this.showNotification('Erro');
      });
  }

  showNotification(message: string) {
    let notification = this.getNotification(message);
    this.nav.present(notification);
  }

  getNotification(message: string): Toast {
    return Toast.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Fechar'
    });
  }



}
