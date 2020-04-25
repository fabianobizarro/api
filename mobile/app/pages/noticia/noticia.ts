import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Toast } from 'ionic-angular';
import { NoticiaComentariosPage } from '../';
import { NoticiaProvider } from '../../providers';
import * as marked from 'marked';


@Component({
  templateUrl: 'build/pages/noticia/noticia.html',
  providers: [NoticiaProvider]
})
export class NoticiaPage implements OnInit {

  private noticia: any;
  private usuarioAdmin: boolean;

  constructor(private nav: NavController, navParams: NavParams, private noticiaService: NoticiaProvider) {
    this.noticia = navParams.get('noticia');
    this.usuarioAdmin = <boolean>navParams.get('usuarioAdmin');
  }

  ngOnInit(){
    this.noticiaService.obterNoticia(this.noticia.Id);
  }

  swipeBack(e) {
    if (e.direction == 4)
      this.nav.pop();
  }

  exibirComentarios(noticiaId: number) {
    this.nav.push(NoticiaComentariosPage, {
      NoticiaId: noticiaId,
      usuarioAdmin: this.usuarioAdmin
    });
  }

  markdown(content) {
    return marked(content);
  }

  curtirNoticia(noticia) {

    let curtidaOriginal = noticia.Curtiu;
    let contagemOriginal = noticia.Curtidas;

    if (noticia.Curtiu) {
      noticia.Curtidas--;
      noticia.Curtiu = false;
    }
    else {
      noticia.Curtidas++;
      noticia.Curtiu = true;
    }

    this.noticiaService.curtirNoticia(noticia.Id)
      .then(result => { })
      .catch(err => {
        this.nav.present(this.toastErroCurtida());
        noticia.Curtiu = curtidaOriginal;
        noticia.Curtidas = contagemOriginal;
      });
  }

  toastErroCurtida() {
    return Toast.create({
      message: 'Ocorreu um erro ao realizar a operação. Tente novamente.',
      duration: 2000
    })
  }


}
