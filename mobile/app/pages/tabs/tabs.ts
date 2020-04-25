import {Component} from '@angular/core'

import { 
  HomePage,
  UnilestePage,
  PerfilPage,
  GruposPage,
  PesquisaPage
} from '../';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;
  private tab5Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = UnilestePage;
    this.tab3Root = PesquisaPage;
    this.tab4Root = GruposPage;
    this.tab5Root = PerfilPage;
  }

}
