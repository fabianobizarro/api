import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Modal, Events } from 'ionic-angular';
import { ModalVisualizarNoticiaPage } from '../';
import { FormBuilder, Validators, ControlGroup, AbstractControl } from '@angular/common';

import { NoticiaProvider, ToastNotification } from '../../providers';

@Component({
  templateUrl: 'build/pages/nova-noticia/nova-noticia.html',
  providers: [NoticiaProvider, ToastNotification]
})
export class NovaNoticiaPage implements OnInit {

  private grupoId: number;

  form: ControlGroup;
  Titulo: AbstractControl;
  Resumo: AbstractControl;
  inputTag: string;
  Tags: Array<string> = [];
  Conteudo: AbstractControl;
  UrlImagem: AbstractControl;


  constructor(private nav: NavController,
    navParams: NavParams,
    formBuilder: FormBuilder,
    private noticiaProvider: NoticiaProvider,
    public events: Events,
    private notification: ToastNotification) {
    this.grupoId = navParams.get('grupoId');

    this.form = formBuilder.group({
      'Titulo': ['', Validators.required],
      'Resumo': [''],
      'Conteudo': ['', Validators.required],
      'UrlImagem': ['']
    });

    this.Titulo = this.form.controls['Titulo'];
    this.Resumo = this.form.controls['Resumo'];
    this.Conteudo = this.form.controls['Conteudo'];
    this.UrlImagem = this.form.controls['UrlImagem'];

  }

  ngOnInit() {
    this.notification.setNavController(this.nav);
  }

  subscribeEvents() {

  }

  keypress(event) {
    if (event.keyCode === 32) {
      this.Tags.push(this.inputTag.trim());
      this.inputTag = '';
    }
  }

  modal() {
    return Modal.create(ModalVisualizarNoticiaPage, {
      noticia: {
        Titulo: this.form.value.Titulo || '',
        Resumo: this.form.value.Resumo || '',
        Tags: this.Tags || [],
        Conteudo: this.form.value.Conteudo || '',
        UrlImagem: this.form.value.UrlImagem || ''
      }
    });
  }

  visualizarNoticia() {
    let modal = this.modal();

    this.nav.present(modal);
  }

  removerTag(tag) {
    let i = this.Tags.indexOf(tag);
    this.Tags.splice(i, 1);
  }

  submit() {
    if (this.form.valid) {

      let noticia = {
        Titulo: this.form.value.Titulo,
        Resumo: this.form.value.Resumo,
        Tags: this.Tags,
        Conteudo: this.form.value.Conteudo,
        UrlImagem: this.form.value.UrlImagem,
        GrupoId: this.grupoId
      };

      this.noticiaProvider.cadastrarNoticia(this.grupoId, noticia)
        .then(res => {
          if (res.sucesso) {
            this.events.publish('grupo:noticiaCriada');
            this.notification.show('Notícia cadastrada com sucesso.')
            this.nav.pop();
          }

        }, err => {
          this.notification.show('Não foi possível cadastrar a notícia');
          console.log(err);
        });
    }

  }

}
