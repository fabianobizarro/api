import { Component, OnInit } from '@angular/core';
import { NavController, Alert, Events } from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl} from '@angular/common';
import { GrupoProvider } from '../../providers/';

@Component({
  templateUrl: 'build/pages/novo-grupo/novo-grupo.html',
  providers: [GrupoProvider],
  directives: [FORM_DIRECTIVES]
})
export class NovoGrupoPage implements OnInit {

  form: ControlGroup;
  nome: AbstractControl;
  descricao: AbstractControl;
  publico: AbstractControl;
  submitted = false;
  sending = false;

  constructor(private nav: NavController,
    private grupoProvider: GrupoProvider,
    private fb: FormBuilder,
    private events: Events) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'nome': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'descricao': ['', Validators.compose([Validators.required, Validators.maxLength(70)])],
      'publico': [true]
    });

    this.nome = this.form.controls['nome'];
    this.descricao = this.form.controls['descricao'];
    this.publico = this.form.controls['publico'];
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {

      var data = {
        Nome: this.nome.value,
        Descricao: this.descricao.value,
        Publico: this.publico.value
      };
      this.grupoProvider.adicionarGrupo(data)
        .then(result => {
          this.nav.present(this.alertSuccess());
          this.nav.pop();
          this.events.publish('grupo:criado');
        }, err => {
          console.log(err);
        });
    }
  }

  showErrorMessages(): boolean {
    return !this.form.valid && this.submitted;
  }


  private alertSuccess() {
    return Alert.create({
      title: 'Sucesso',
      message: 'Grupo criado com sucesso!',
      buttons: ['Ok']
    });
  }

}
