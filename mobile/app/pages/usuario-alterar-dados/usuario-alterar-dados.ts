import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl } from '@angular/common';
import { UsuarioProvider, ToastNotification, SnCore } from '../../providers';

@Component({
  templateUrl: 'build/pages/usuario-alterar-dados/usuario-alterar-dados.html',
  directives: [FORM_DIRECTIVES],
  providers: [UsuarioProvider, ToastNotification]
})
export class UsuarioAlterarDadosPage implements OnInit {

  private usuario: any;

  private form: ControlGroup;
  private nome: AbstractControl;
  private telefone: AbstractControl;
  private urlFoto: AbstractControl;

  constructor(private nav: NavController,
    private fb: FormBuilder,
    private usuarioProvider: UsuarioProvider,
    navParams: NavParams,
    private notification: ToastNotification,
    private events: Events,
    private snCore: SnCore) {

    this.usuario = navParams.get('usuario');

  }


  ngOnInit() {

    this.form = this.fb.group({
      'nome': [
        this.usuario.Nome,
        Validators.compose([Validators.required, Validators.pattern("^[a-zA-Zà-ú ']*$"), Validators.maxLength(100)])
      ],
      'telefone': [
        this.usuario.Telefone,
        Validators.compose([Validators.required, Validators.pattern("([0-9]| )*"), Validators.minLength(10), Validators.maxLength(15)])
      ],
      'urlFoto':[
        this.usuario.UrlFoto,
        Validators.compose([Validators.pattern("^((http[s]?|ftp):\\/)?\\/?([^:\\/\\s]+)((\\/\\w+)*\\/)([\\w\\-\\.]+[^#?\\s]+)(.*)?(#[\\w\\-]+)?$")])
      ]
    });

    this.nome = this.form.controls['nome'];
    this.telefone = this.form.controls['telefone'];
    this.urlFoto = this.form.controls['urlFoto'];

  }

  submit() {
    if (this.form.valid) {

      let dadosUsuario = this.snCore.Usuario;

      dadosUsuario.Nome = this.nome.value;
      dadosUsuario.Telefone = this.telefone.value;
      dadosUsuario.UrlFoto = this.urlFoto.value;

      this.usuarioProvider.alterarDados(dadosUsuario)
        .then(result => {

          this.snCore.setUsuarioLogado(dadosUsuario)
            .then(() => {
              this.nav.pop();
              this.notification.show('Dados do usuário alterados com sucesso');
              this.events.publish('usuario:Alterado', dadosUsuario);
            });
        }, err => {
          
          if (err.erro)
            this.notification.show(err.erro);
          else
            this.notification.show('Não foi possível realizar esta alteração');
        });
    }
  }



}

