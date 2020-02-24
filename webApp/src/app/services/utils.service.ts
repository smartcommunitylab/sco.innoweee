import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
const ERROR_ITEM_CONFIRMED = 'EC11:item already confirmed';
const ERROR_PLAYERID_WRONG = 'EC12:playerId not corresponding';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {


  constructor(
    private alertController: AlertController,
    private router: Router,
    private translate: TranslateService
  ) { }
  handleError(error: any): Promise<any> {

    return new Promise<string>(async (resolve, reject) => {
      console.error('An error occurred', error);

      if (error.status == 401) {
        // display toast and redirect to logout.
        // var errorObj = JSON.parse(error._body)
        // var errorMsg = 'Per favore accedi di nuovo.';
        // if (errorObj.errorMsg) {
        //   errorMsg = errorObj.errorMsg;
        // }
      } else if (error.status == 403) {
        this.translate.get('alert_user_not_register_title').subscribe(async (res: string) => {
          var subtitle = this.translate.instant('alert_user_not_register_subtitle');
          var message = this.translate.instant('alert_user_not_register_message');
          var button = this.translate.instant('button_restart');
          const alert = await this.alertController.create({
            header: res,
            subHeader: subtitle,
            message: message,
            backdropDismiss: false,
            buttons: [{
              text: button,
              handler: () => {
                this.router.navigate(['']);
              }
            }]
          });
          return await alert.present();
        })
      } else if (error.error && error.error.errorMsg == ERROR_ITEM_CONFIRMED) {
        this.translate.get('alert_item_confirmed_title').subscribe(async (res: string) => {
          var subtitle = this.translate.instant('alert_item_confirmed_subtitle');
          var message = this.translate.instant('alert_item_confirmed_message');
          var buttoncancel = this.translate.instant('cancel_popup');
          var buttoninsert = this.translate.instant('button_insert');
          const alert = await this.alertController.create({
            header: res,
            subHeader: subtitle,
            message: message,
            backdropDismiss: false,
            buttons: [{
              text: buttoncancel
            }, {
              text: buttoninsert,
              handler: () => {
                this.router.navigate(['start']);
              }
            }]
          });
          return await alert.present();
        })
      } else if (error.error && error.error.errorMsg == ERROR_PLAYERID_WRONG) {
        this.translate.get('alert_different_class_title').subscribe(async (res: string) => {
          var message = this.translate.instant('alert_different_class_message');
          var buttoncancel = this.translate.instant('cancel_popup');
          const alert = await this.alertController.create({
            header: res,
            message: message,
            backdropDismiss: false,
            buttons: [{
              text: buttoncancel
            }]
          });
          return await alert.present();
        })
      }
      else {
        //loading was wrong, reload app
        this.translate.get('error_server_title').subscribe(async (res: string) => {
          var message = this.translate.instant('error_server_message');
          var buttonok = this.translate.instant('ok_popup');
          const alert = await this.alertController.create({
            header: res,
            message: message,
            backdropDismiss: false,
            buttons: [{
              text: buttonok,
              handler: () => {
                window.location.reload();
              }
            }]
          });
          return await alert.present();
        })
      }
    });

  }
}
