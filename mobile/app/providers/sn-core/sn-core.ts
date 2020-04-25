import { Injectable } from '@angular/core';
import { IUsuario } from '../../pages/base/IUsuario';
import { TokenProvider } from '../';
import { Storage, LocalStorage } from 'ionic-angular';

@Injectable()
export class SnCore {

  private _store: Storage;

  private _host: string;
  private _protocol: string;
  private _port: number;
  private _userToken: string;
  private _userInfoKey: string;
  private _basePath: string;

  constructor() {
    this._store = new Storage(LocalStorage);
  }

  private static _usuario: IUsuario;

  get Usuario() {
    return SnCore._usuario;
  }

  setUsuarioLogado(u: IUsuario): Promise<any> {
    return new Promise((resolve, reject) => {

      SnCore._usuario = u;
      this._store.set(this.userInfo, JSON.stringify(u))
        .then(r => {
          resolve()
        }, reject);
    });
  }

  carregarInfoUsuario(): Promise<any> {
    return new Promise((resolve, reject) => {

      this._store.get(this.userInfo)
        .then(value => {
          SnCore._usuario = JSON.parse(value);
          resolve();
        }, reject);

    });
  }

  config(options: any) {
    if (options['host'])
      this._host = options['host'];

    if (options['protocol'])
      this._protocol = options['protocol'];

    if (options['port'])
      this._port = options['port'];

    if (options['basePath'])
      this._basePath = options['basePath'];

    if (options['userInfoKey'])
      this._userInfoKey = options['userInfoKey'];

    if (options['token'])
      this._userToken = options['token'];
  }

  public get apiUrl(): string {
    return `${this._protocol}://${this._host}:${this._port}${this._basePath}`;
  }

  public get baseUrl(): string {
    return `${this._protocol}://${this._host}:${this._port}`;
  }

  public get host(): string {
    return this._host;
  }

  public get protocol(): string {
    return this._protocol;
  }

  public get port(): number {
    return this._port;
  }

  public get token(): string {
    return this._userToken;
  }

  public get userInfo(): string {
    return this._userInfoKey;
  }


  public get basePath(): string {
    return this._basePath;
  }


}

