import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { SnCore } from '../sn-core/sn-core';
import { TokenProvider } from '../token-provider/token-provider';

@Injectable()
export class ApiHttp {

  private requestOptions: RequestOptionsArgs;

  constructor(private http: Http, private snCore: SnCore, private token: TokenProvider) {
  }

  private getRequestOptionsArgsBase(token: string): RequestOptionsArgs {
    return {
      method: '',
      withCredentials: true,
      headers: new Headers({
        'Access-Control-Allow-Credentials': 'true',
        'snt': token
      })
    };
  }

  private setRequestOptions() {

    let that = this;
    return new Promise(resolve => {


      this.token.getToken()
        .then(token => {
          that.requestOptions = that.getRequestOptionsArgsBase(token);

          resolve();
        })
    });
  }

  get(url: string): Promise<Observable<Response>> {
    let that = this;

    return new Promise((resolve, reject) => {
      this.setRequestOptions()
        .then(() => {

          url = this.snCore.apiUrl + url;
          resolve(this.http.request(url, that.requestOptions))
        });
    });
  }

  post(url: string, data: Object = {}): Promise<Observable<Response>> {
    let that = this;

    return new Promise((resolve, reject) => {
      this.setRequestOptions()
        .then(() => {

          this.requestOptions.method = 'POST';
          this.requestOptions.body = data;
          url = this.snCore.apiUrl + url;
          resolve(this.http.request(url, that.requestOptions))
        });
    });
  }

  put(url: string, data: Object = {}): Promise<Observable<Response>> {
    let that = this;

    return new Promise((resolve, reject) => {
      this.setRequestOptions()
        .then(() => {

          this.requestOptions.method = 'PUT';
          this.requestOptions.body = data;
          url = this.snCore.apiUrl + url;
          resolve(this.http.request(url, that.requestOptions))
        });
    });
  }

  delete(url: string, data: Object = {}): Promise<Observable<Response>> {
    let that = this;

    return new Promise((resolve, reject) => {
      this.setRequestOptions()
        .then(() => {

          this.requestOptions.method = 'DELETE';
          this.requestOptions.body = data;
          url = this.snCore.apiUrl + url;
          resolve(this.http.request(url, that.requestOptions))
        });
    });
  }




}


