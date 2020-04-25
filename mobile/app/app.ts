import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {TabsPage, LoginPage, NovaNoticiaPage} from './pages/';

import { SnCore, AuthProvider, ApiHttp, TokenProvider } from './providers/';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [SnCore, AuthProvider, ApiHttp, TokenProvider]
})
export class SharenewsApp {

  private rootPage: any;

  constructor(private platform: Platform, private snCore: SnCore, private tokenProvider: TokenProvider, private authProvider: AuthProvider) {

    snCore.config({
      port: 3000,
      host: 'localhost',
      protocol: 'http',
      basePath: '/api',
      token: 'snt',
      userInfoKey: 'userInfo'
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      this.bootstrap();

    });

  }

  bootstrap() {

    this.tokenProvider.getToken()
      .then(token => {

        if (token) {
          this.rootPage = TabsPage;
          this.snCore.carregarInfoUsuario();
        }
        else
          this.rootPage = LoginPage;

      });
  }
}

ionicBootstrap(SharenewsApp)