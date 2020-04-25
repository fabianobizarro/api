import { Injectable } from '@angular/core';
import { Toast, ToastOptions, NavController } from 'ionic-angular';

@Injectable()
export class ToastNotification {

  private nav: NavController;

  constructor(navController?: NavController) {
    if (navController != null)
      this.nav = navController;
  }

  setNavController(nav: NavController) {
    this.nav = nav;
  }

  show(message: string, options?: ToastOptions): Toast {

    let toast = this.getToast(message, options);

    this.nav.present(toast);

    return toast;

  }

  private getToast(message: string, options?: ToastOptions): Toast {
    if (options)
      return Toast.create(options);
    else
      return Toast.create({
        message: message,
        showCloseButton: true,
        closeButtonText: 'Fechar',
        dismissOnPageChange: false
      });
  }

}

