import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiHttp } from '../';
import { BaseProvider } from '../BaseProvider';


@Injectable()
export class ComentarioProvider extends BaseProvider {

  constructor(private http: ApiHttp) {
    super();
  }

  obterComentarios(noticiaId: number): Promise<Response> {
    return new Promise((resolve, reject) => {

      this.http.get(`/noticia/${noticiaId}/comentarios`)
        .then(res => {
          res.map(res => res.json())
            .subscribe(resolve, reject);
        }).catch(reject);

    });
  }

  enviarComentario(noticiaId: number, comentario: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.post(`/noticia/${noticiaId}/comentarios`, { comentario: comentario })
        .then(res => {
          res.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        }).catch(reject);

    });
  }

  removerComentario(idNoticia: number, idComentario: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.delete(`/noticia/${idNoticia}/comentarios/${idComentario}`)
        .then(result => {

          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));

        }, err => this.formatError(reject))
        .catch(ex => this.formatError(reject));

    });
  }

}

