import { Injectable } from '@angular/core';
import { ApiHttp } from '../';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from '../BaseProvider';

@Injectable()
export class GrupoProvider extends BaseProvider {

  constructor(private http: ApiHttp) {
    super();

  }

  adicionarGrupo(grupo): Promise<Response> {
    return new Promise((resolve, reject) => {

      this.http.post('/grupo', grupo)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, err => {

              try {
                let r = JSON.parse(err._body);
                reject(r);
              }
              catch (e) {
                reject(err);
              }

            });
        })
        .catch(reject);

    });
  }

  alterarGrupo(grupo): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.put(`/grupo/${grupo.Id}`, grupo)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        }, err => reject);

    });
  }

  excluirGrupo(grupoId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete('/grupo/' + grupoId)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        }, err => reject(err));
    });
  }
  obterGrupos(): Promise<Response> {
    return new Promise((resolve, reject) => {

      this.http.get('/grupo')
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, reject);
        })

    });
  }

  obterNoticias(grupoId: number): Promise<Response> {
    return new Promise((res, rej) => {

      this.http.get(`/grupo/${grupoId}/noticia`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(res, this.formatError(rej));
        });

    });
  }

  obterIntegrantes(grupoId: number): Promise<Response> {
    return new Promise((resolve, reject) => {

      this.http.get(`/grupo/${grupoId}/integrantes`)
        .then(res => {
          res.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        })
    });
  }

  pesquisarGrupos(pesquisa): Promise<Response> {
    return new Promise((resolve, reject) => {

      this.http.get(`/grupo/pesquisa?q=${pesquisa}`)
        .then(results => {
          results.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        })
        .catch(reject);

    });
  }

  joinGrupo(grupoId): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.post(`/grupo/${grupoId}/join`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        })
        .catch(reject);
    });
  }

  exitGrupo(grupoId): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.post(`/grupo/${grupoId}/exit`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        })
        .catch(reject);

    });
  }

  obterSolicitacoes(grupoId: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.get(`/grupo/${grupoId}/solicitacoes`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        }, reject)
        .catch(reject);

    });
  }

  aceitarSolicitacao(grupoId: number, usuarioId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`/grupo/${grupoId}/solicitacoes/${usuarioId}`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject))
        }, reject).catch(reject);
    });
  }

  rejeitarSolicitacao(grupoId: number, usuarioId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(`/grupo/${grupoId}/solicitacoes/${usuarioId}`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject))
        }, reject).catch(reject);
    });
  }

  removerUsuario(grupoId: number, usuarioId: number): Promise<any> {

    return new Promise((resolve, reject) => {

      this.http.delete(`/grupo/${grupoId}/integrantes/${usuarioId}`)
        .then(res => {
          res.map(r => r.json())
            .subscribe(resolve, this.formatError(reject));
        }, err => this.formatError(reject))
        .catch(err => this.formatError(reject));



    });

  }

  toggleAdmin(grupoId: number, usuarioId: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.post(`/grupo/${grupoId}/integrantes/${usuarioId}/admin`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject))
        }, err => {
          this.formatError(reject);
        })
        .catch(err => this.formatError(reject));

    });
  }

  alterarVisibilidade(grupoId: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.post(`/grupo/${grupoId}/publico`)
        .then(result => {
          result.map(res => res.json())
            .subscribe(resolve, this.formatError(reject));
        })
        .catch(err => this.formatError(reject));

    });
  }

}

