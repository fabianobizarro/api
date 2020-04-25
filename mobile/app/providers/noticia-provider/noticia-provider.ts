import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiHttp } from '../';
import { BaseProvider } from '../BaseProvider';


@Injectable()
export class NoticiaProvider extends BaseProvider {

  constructor(private http: ApiHttp) {
    super();
  }

  cadastrarNoticia(grupoId: number, noticia: any): Promise<any> {

    return new Promise((resolve, reject) => {

      this.http.post(`/grupo/${grupoId}/noticia`, noticia)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        });

    });

  }

  curtirNoticia(noticiaId): any {

    return new Promise((resolve, reject) => {
      this.http.post(`/noticia/${noticiaId}/curtir`)
        .then(result => {

          result.map(res => res.json())
            .subscribe(data => resolve(data), err => reject(err));
        })
        .catch(reject);
    });
  }

  pesquisarNoticias(pesquisa): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.http.get(`/noticia/pesquisa?q=${pesquisa}`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject))
        })
        .catch(reject);
    });
  }

  alterarNoticia(noticia): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.put(`/noticia/${noticia.Id}`, noticia)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject))
        }, err => this.formatError(reject));

    });
  }

  excluirNoticia(noticiaId: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.delete(`/noticia/${noticiaId}`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject))
        }, err => this.formatError(reject));


    });
  }

  obterNoticia(noticiaId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('/noticia/' + noticiaId)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject))
        })
        .catch(reject);
    });
  }

}

