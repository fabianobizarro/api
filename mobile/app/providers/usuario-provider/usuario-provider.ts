import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiHttp } from '../';
import { BaseProvider } from '../BaseProvider';


@Injectable()
export class UsuarioProvider extends BaseProvider {

  constructor(private http: ApiHttp) {
    super();
  }

  pesquisarUsuarios(pesquisa: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`/usuario/pesquisa/${encodeURI(pesquisa)}`)
        .then((result) => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        })
    })
  }

  alterarSenha(usuarioId: number, senhaAtual: string, novaSenha: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = { senhaAtual, novaSenha };
      this.http.put(`/usuario/${usuarioId}/senha`, data)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        }, err => {
          this.formatError(reject);
        })
        .catch(err => this.formatError(reject));

    });
  }

  alterarDados(usuario): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.put(`/usuario/${usuario.Id}`, usuario)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        }, err => this.formatError(reject))
        .catch(err => this.formatError(reject));

    });
  }

  historicoAtividades(idUsuario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`/usuario/${idUsuario}/historico`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        }, err => this.formatError(reject))
        .catch(ex => this.formatError(ex));
    });
  }

  feedUsuario(usuarioId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`/usuario/${usuarioId}/feed`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        }, err => this.formatError(reject))
        .catch(ex => this.formatError(reject));
    });
  }

}

