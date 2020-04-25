import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl} from '@angular/common';
import { UsuarioProvider, ToastNotification } from '../../providers';

@Component({
  templateUrl: 'build/pages/usuario-alterar-senha/usuario-alterar-senha.html',
  directives: [FORM_DIRECTIVES],
  providers: [UsuarioProvider, ToastNotification]
})
export class UsuarioAlterarSenhaPage implements OnInit {

  private usuarioId: number;

  private form: ControlGroup;
  private senhaAtual: AbstractControl;
  private novaSenha: AbstractControl;
  private confirmacaoSenha: AbstractControl;

  private confirmacaoInvalida: boolean = true;
  private submitted: boolean = false;


  constructor(private nav: NavController,
    private fb: FormBuilder,
    private usuarioProvider: UsuarioProvider,
    navParams: NavParams,
    private notification: ToastNotification) 
  {
    this.usuarioId = navParams.get('usuarioId');
  }

  ngOnInit() {
    this.form = this.fb.group({
      'senhaAtual': [
        '',
        Validators.compose([Validators.required, Validators.pattern('.*[A-Z]{1,}.*')])
      ],
      'novaSenha': [
        '',
        Validators.compose([Validators.required, Validators.pattern('.*[A-Z]{1,}.*')])
      ],
      'confirmacaoSenha': [
        '',
        Validators.required
      ]
    });

    this.senhaAtual = this.form.controls['senhaAtual'];
    this.novaSenha = this.form.controls['novaSenha'];
    this.confirmacaoSenha = this.form.controls['confirmacaoSenha'];

  }

  confirmacaoSenhaValida() {
    return this.confirmacaoSenha.value == this.novaSenha.value;
  }

  vaidateConfirmacaoSenha() {
    this.confirmacaoInvalida = !this.confirmacaoSenhaValida();
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      console.log('Submit');

      this.usuarioProvider.alterarSenha(this.usuarioId, this.senhaAtual.value, this.novaSenha.value)
        .then(result => {
          this.notification.show('Senha alterada com sucesso.');
          this.nav.pop();
        }, err => {
          if (err.mensagem)
            this.notification.show(err.mensagem);
          else
            this.notification.show('Não foi possível alterar a senha');
        });
    }
  }

  showErrorMessages() {
    return (!this.form.valid || this.confirmacaoInvalida);
  }



}
