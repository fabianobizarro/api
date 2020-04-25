import { Injectable } from '@angular/core';
import { SnCore } from '../sn-core/sn-core';
import { Storage, LocalStorage } from 'ionic-angular';


@Injectable()
export class TokenProvider {

  private _store: any;

  constructor(private snCore: SnCore) {
    this._store = new Storage(LocalStorage);
  }

  getValue(key): Promise<string> {
    return this._store.get(key);
  }

  setValue(key, value): Promise<any> {
    return this._store.set(key, value);
  }

  getToken(): Promise<string> {
    return this._store.get(this.snCore.token)
  }

  getTokenSync(): string {
    return this._store.get(this.snCore.token)
      .then(token => { return token })
      .catch(err => { return null })
  }

  setToken(value): Promise<any> {
    return this._store.set(this.snCore.token, value);
  }

  deleteToken(): Promise<any> {
    return this._store.remove(this.snCore.token);
  }

  deleteUserInfo(): Promise<any> {
    return this._store.remove(this.snCore.userInfo);
  }
}

