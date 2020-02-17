import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassificationService } from 'src/app/services/classification.service';
import { ItemClassification } from 'src/app/class/item-classification';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { ModalPage } from './modal/modal.page';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonPage } from 'src/app/class/common-page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.page.html',
  styleUrls: ['./recap.page.scss'],
})
export class RecapPage extends CommonPage implements OnInit {
  private itemClassification: ItemClassification;
  recap: any = {};
  constructor( public translate: TranslateService,
    public router: Router,
    private alertController: AlertController,
    public toastController: ToastController,
    public profileService: ProfileService,
    private modalController:ModalController,
    public route: ActivatedRoute,
    private dataService:DataServerService,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    private classificationService: ClassificationService,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
   }

  ngOnInit() {
    this.itemClassification = this.classificationService.itemClassification;
    this.translate.get('classification_new').subscribe(async (res: string) => {
      this.recap["new"] = res;
      this.recap["old"] = this.translate.instant("classification_old");
      this.recap["broken"] = this.translate.instant("classification_broken");
      this.recap["fixed"] = this.translate.instant("classification_fixed");
      this.recap["on"] = this.translate.instant("classification_on");
      this.recap["off"] = this.translate.instant("classification_off");
    })
  }
  async confirm() {
    //add id and send item
    this.itemClassification.setPlayerId(this.profileService.getPlayerData()["objectId"]);
    const token = await this.auth.getValidToken();
    this.dataService.itemDelivery(this.itemClassification, token.accessToken).then(res => {
      //go to result
      // this.showAlertDone();
      this.router.navigate(['item-classified', JSON.stringify(res)]);
    }, err => {
      //if it is already inserted change id
      this.showAlertError();

    });
  }
  showAlertError() {
    this.translate.get('insert_error_title').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('insert_error_message');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: ['OK']
      });

      await alert.present();
    })
  }
  showAlertDone() {
    this.translate.get('insert_done_title').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('insert_done_message');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Inserisci nuovo oggetto',
            cssClass: 'secondary',
            handler: () => {
              this.router.navigate(['home']);
            }
          }, {
            text: 'Termina inserimento',
            handler: () => {
              this.router.navigate(['result']);

            }
          }
        ]
      });

      await alert.present();
    })
  }

  getId() {
    if (this.itemClassification)
      return this.itemClassification.getItemId()
    return ""
  }

  getAge() {
    if (this.itemClassification.getAge() == 0)
      return this.recap["new"];
    return this.recap["old"];
  }

  getBroken() {
    if (this.itemClassification.getBroken() == true)
      return this.recap["broken"];
    return this.recap["fixed"];
  }

  getType() {
    if (this.itemClassification)
      return this.itemClassification.getItemValue()
    return ""
  }

  getSwitching() {
    if (this.itemClassification.getSwitchingOn() == true)
      return this.recap["on"];
    return this.recap["off"];
  }

  change() {
    this.itemClassification.reset();
    this.router.navigate(['classification-type']);
  }
  
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
  }

  getFooter() {
    return (this.getClassName()) +' - '+(this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }
  getClassName() {
    return this.profileService.getPlayerName();

  }
}
