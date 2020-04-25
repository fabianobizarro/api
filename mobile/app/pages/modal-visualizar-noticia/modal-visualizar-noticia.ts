import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import * as marked from 'marked';

@Component({
  templateUrl: 'build/pages/modal-visualizar-noticia/modal-visualizar-noticia.html',
})
export class ModalVisualizarNoticiaPage {

  noticia: any = {};
  constructor(private nav: NavController,navParams: NavParams, private view: ViewController) {
    this.noticia = navParams.get('noticia');
  }

  dismiss(){
    this.view.dismiss();
  }

  markdown(content) {
    return marked(content);
  }

}
