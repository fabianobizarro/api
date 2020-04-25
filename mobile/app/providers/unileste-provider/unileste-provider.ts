import { Injectable } from '@angular/core';
import { ApiHttp } from '../api-http/api-http';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from '../BaseProvider';

@Injectable()
export class UnilesteProvider extends BaseProvider {
  noticias: any;

  constructor(private http: ApiHttp) {
    super();
    this.noticias = null;
  }

  obterNoticiasDeHoje(): Promise<Response> {

    return new Promise((resolve, reject) => {

      this.http.get('/unileste/hoje')
        .then(noticias => {

          noticias.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
            
        });

    });
  }

  obterNoticias(pagina: number = 1): Promise<Response> {
    return new Promise((resolve, reject) => {

      this.http.get(`/unileste/${pagina}`)
        .then(noticias => {

          noticias.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        });

    });
  }
}