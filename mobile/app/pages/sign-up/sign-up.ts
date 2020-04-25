import { Component, OnInit } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control } from '@angular/common';
import { NavController, Alert } from 'ionic-angular';
import { IUsuario } from '../base/IUsuario';
import { AuthProvider, TokenProvider, SnCore } from '../../providers/';

import { TabsPage } from '../';

@Component({
  templateUrl: 'build/pages/sign-up/sign-up.html',
  directives: [FORM_DIRECTIVES],
})
export class SignUpPage implements OnInit {

  signupForm: ControlGroup;
  nome: AbstractControl;
  login: AbstractControl;
  senha: AbstractControl;
  email: AbstractControl;
  telefone: AbstractControl;

  constructor(private nav: NavController,
    private auth: AuthProvider,
    private fb: FormBuilder,
    private token: TokenProvider,
    private snCore: SnCore) 
  {

  }

  ngOnInit() {
    this.signupForm = new ControlGroup({
      nome: new Control('', Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Zà-ú ']*$")])),
      login: new Control('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_-]{3,15}$')])),
      senha: new Control('', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern('.*[A-Z]{1,}.*')])),
      email: new Control('', Validators.compose([Validators.required, Validators.pattern("^.+\@.+\..+$")])),
      telefone: new Control('', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern("[0-9]+")]))
    })

    this.nome = this.signupForm.controls['nome'];
    this.login = this.signupForm.controls['login'];
    this.senha = this.signupForm.controls['senha'];
    this.email = this.signupForm.controls['email'];
    this.telefone = this.signupForm.controls['telefone'];
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.auth.criarUsuario(this.signupForm.value)
        .then(result => {

          if (result.sucesso) {
            this.onsubmitOk(result.token);
          }

        }, err => {
          this.nav.present(this.getSignUpErrorAlert(err.mensagem, err.erro));
        })
        .catch(err => {
          this.nav.present(this.getSignUpErrorAlert(err.mensagem, err.erro));
        });
    }
  }

  onsubmitOk(token) {
    let that = this;
    this.token.setToken(token)
      .then(result => {

        that.auth.userInfo()
          .then((info)=>{
            this.snCore.setUsuarioLogado(info);
            that.nav.setRoot(TabsPage);
          });
      });
  }

  getSignUpErrorAlert(message: string, errors: Array<any>) {

    errors = errors || [];

    let subtitle = errors.map(item => {
      return `<li>${item.Message}</li>`;
    }).join('');

    return Alert.create({
      title: message,
      subTitle: subtitle,
      buttons: ["OK"]
    });

  }

}
