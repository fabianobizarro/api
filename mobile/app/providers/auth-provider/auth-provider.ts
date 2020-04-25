import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { TokenProvider } from '../token-provider/token-provider';
import { ApiHttp } from '../api-http/api-http';
import { SnCore } from '../sn-core/sn-core';

@Injectable()
export class AuthProvider {

  Usuario: any;

  constructor(private http: Http,
    private apiHttp: ApiHttp,
    private token: TokenProvider,
    private snCore: SnCore) {
  }

  login(username, password): Promise<any> {

    let url = this.snCore.apiUrl.replace(this.snCore.basePath, '') + '/auth/signIn';

    let data = {
      login: username,
      senha: password
    };

    return new Promise((resolve, reject) => {

      this.http.post(url, data)
        .map(res => res.json())
        .subscribe(data => resolve(data), err => reject(err.json()));
    });
  }

  userInfo(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.apiHttp.get('/usuario/info')
        .then(result => {

          result
            .map(res => res.json())
            .subscribe(resolve, reject);
        })
        .catch(err => reject(err));
    });

  }

  criarUsuario(usuario): any {
    return new Promise((resolve, reject) => {

      let url = this.snCore.baseUrl + '/auth/signUp';

      this.http.post(url, usuario)
        .subscribe(this.formatResult(resolve), this.formatResult(reject));


    });
  }

  formatResult(cb) {
    return function (res) {
      try {
        cb(JSON.parse(res._body));
      } catch (error) {
        cb(JSON.parse(res));
      }
    }
  }

  enviarLinkEmail(email: string): Promise<any> {
    let url = this.snCore.baseUrl + '/auth/resetPasswdLink';
    return new Promise((resolve, reject) => {
      
      this.http.post(url, { Email: email })
        .map(res => {
          return res.json();
        })
        .subscribe(data => {
          resolve(data);
        }, this.formatResult(reject));

    });
  }

}

