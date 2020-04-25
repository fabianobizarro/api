import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Alert, Events } from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl} from '@angular/common';
import { GrupoProvider, ToastNotification } from '../../providers/';

@Component({
  templateUrl: 'build/pages/grupo-alterar/grupo-alterar.html',
  providers: [GrupoProvider, ToastNotification],
  directives: [FORM_DIRECTIVES]
})
export class GrupoAlterarPage implements OnInit {

  grupo: any;
  form: ControlGroup;
  nome: AbstractControl;
  descricao: AbstractControl;
  submitted: boolean = false;

  constructor(private nav: NavController,
    navParams: NavParams,
    private grupoProvider: GrupoProvider,
    private fb: FormBuilder,
    private events: Events,
    private notification: ToastNotification) {
    this.grupo = navParams.get('grupo');
    console.log(this.grupo);

  }

  ngOnInit() {
    this.form = this.fb.group({
      'nome': [this.grupo.Nome, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'descricao': [this.grupo.Descricao, Validators.compose([Validators.required, Validators.maxLength(70)])]
    });

    this.nome = this.form.controls['nome'];
    this.descricao = this.form.controls['descricao'];
  }

  showErrorMessages(): boolean {
    return !this.form.valid && this.submitted;
  }

  onSubmit() {
    if (this.grupo.usuarioAdmin) {


      this.submitted = true;
      if (this.form.valid) {

        var data = {
          Id: this.grupo.Id,
          Nome: this.nome.value,
          Descricao: this.descricao.value,
        };
        this.grupoProvider.alterarGrupo(data)
          .then(result => {
            this.nav.present(this.alertSuccess());
            this.nav.pop();
            this.events.publish('grupo:alterado', data);
          }, err => {
            if (err.erro)
              this.notification.show(err.erro);
            else
              this.notification.show('Não foi possível realizar a operação');
          });
      }
    }
  }





  private alertSuccess() {
    return Alert.create({
      title: 'Sucesso',
      message: 'Dados alterados com sucesso!',
      buttons: ['Ok']
    });
  }

}
