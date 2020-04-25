import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Modal, Alert, Events } from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, Validators, AbstractControl, ControlGroup } from '@angular/common';
import { ModalVisualizarNoticiaPage } from '../';

import { NoticiaProvider, ToastNotification } from '../../providers';

@Component({
  templateUrl: 'build/pages/noticia-alterar/noticia-alterar.html',
  providers: [NoticiaProvider, ToastNotification]
})
export class NoticiaAlterarPage implements OnInit {

  private grupoId: number;
  private noticia;
  private form: ControlGroup;

  private Titulo: AbstractControl;
  private Resumo: AbstractControl;
  private Conteudo: AbstractControl;
  private UrlImagem: AbstractControl;
  private Tags: Array<any> = [];
  private inputTag: string;

  constructor(private nav: NavController,
    navParams: NavParams,
    private formBuilder: FormBuilder,
    private noticiaProvider: NoticiaProvider,
    private notification: ToastNotification,
    private events: Events) {
    this.noticia = navParams.get('noticia');
    this.grupoId = navParams.get('grupoId');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'Titulo': [this.noticia.Titulo, Validators.required],
      'Resumo': [this.noticia.Resumo],
      'Conteudo': [this.noticia.Conteudo, Validators.required],
      'UrlImagem': [this.noticia.UrlImagem]
    });

    this.Tags = this.noticia.Tags;

    this.Titulo = this.form.controls['Titulo'];
    this.Resumo = this.form.controls['Resumo'];
    this.Conteudo = this.form.controls['Conteudo'];
    this.UrlImagem = this.form.controls['UrlImagem'];
  }

  keypress(event) {
    // console.log(typeof event);
    // console.log(event.keyCode);

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

  alterarNoticia() {

    let noticia = {
      Id: this.noticia.Id,
      Titulo: this.form.value.Titulo,
      Resumo: this.form.value.Resumo,
      Tags: this.Tags,
      Conteudo: this.form.value.Conteudo,
      UrlImagem: this.form.value.UrlImagem,
      GrupoId: this.grupoId
    };

    this.noticiaProvider.alterarNoticia(noticia)
      .then(result => {
        console.log(result);
        this.events.publish('Noticia:Alterada', this.noticia);
        this.nav.pop();
      }, err => {
        console.log(err);
        if (err.erro)
          this.notification.show(err.erro);
        else
          this.notification.show('Ocorreu um erro. Não foi possível excluir a notícia');
      });
  }

  removerTag(tag) {
    let i = this.Tags.indexOf(tag);
    this.Tags.splice(i, 1);
  }
  
  excluirNoticia() {

    this.confirmarExclusao((confirmado) => {

      if (confirmado) {

        this.noticiaProvider.excluirNoticia(this.noticia.Id)
          .then(result => {
            this.events.publish('Noticia:Excluida', this.noticia);
            this.nav.pop();
          }, err => {
            if (err.erro)
              this.notification.show(err.erro);
            else
              this.notification.show('Ocorreu um erro. Não foi possível excluir a notícia');
          });
      }

    })

  }

  private confirmarExclusao(cb) {
    let alert = Alert.create({
      title: 'Excluir notícia',
      message: 'Deseja excluir esta notícia?',
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

